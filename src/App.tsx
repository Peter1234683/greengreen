import React, { useState } from "react";
import { Header } from "./components/common/Header";
import { BottomNav, CustomerTab, ContractorTab } from "./components/common/BottomNav";
import { SplashOnboarding } from "./components/onboarding/SplashOnboarding";
import { CustomerHome } from "./components/customer/CustomerHome";
import { CustomerMyPage } from "./components/customer/CustomerMyPage";
import { ContractorHome } from "./components/contractor/ContractorHome";
import { AdminDashboard } from "./components/admin/AdminDashboard";

// 완성형 진단 및 클러스터 모듈
import { Step1Diagnosis } from "./components/Step1Diagnosis";
import { Step2DemandRegister } from "./components/Step2DemandRegister";
import { Step3Clustering } from "./components/Step3Clustering";
import { Step4Auction } from "./components/Step4Auction";
import { Step6TrustContract } from "./components/Step6TrustContract";
import { NeighborCommunityBoard } from "./components/NeighborCommunityBoard";
import { SubsidyAdvisorModal } from "./components/SubsidyAdvisorModal";

import { useGreenTopia } from "./services/greentopiaStore";
import { BuildingLedgerData, DiagnosisResult, ContractorBid, OptimizedCluster, MatchingEngineResult } from "./types";
import { PRESET_BUILDINGS } from "./services/buildingLedgerService";
import { PRESET_SAMPLE_IMAGES } from "./services/sampleImages";
import { DEFAULT_INITIAL_DIAGNOSIS } from "./services/defaultDiagnosis";
import { ArrowRight, ChevronRight, Sparkles, Building2, ShieldCheck, TrendingDown, Users } from "lucide-react";

export default function App() {
  const {
    currentUser,
    activeRole,
    showOnboarding,
    buildings,
    contractors,
    myBuilding,
    myContractorProfile,
    switchRole,
    setShowOnboarding,
    registerCustomer,
    registerContractor,
    updateContractorPqStatus,
    resetToSeed,
  } = useGreenTopia();

  // 탭 상태
  const [customerTab, setCustomerTab] = useState<CustomerTab>("home");
  const [contractorTab, setContractorTab] = useState<ContractorTab>("bids_search");

  // 보조 모달 상태
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);

  // 단계별 진단 및 공사 데이터
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [buildingData, setBuildingData] = useState<BuildingLedgerData>(PRESET_BUILDINGS[0].data);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(DEFAULT_INITIAL_DIAGNOSIS);
  const [uploadedImage, setUploadedImage] = useState<string | null>(PRESET_SAMPLE_IMAGES[0].dataUrl);

  const [selectedWorkIds, setSelectedWorkIds] = useState<string[]>(["창호"]);
  const [budgetCap, setBudgetCap] = useState<number>(1200);
  const [desiredSchedule, setDesiredSchedule] = useState<string>("2026년 4월 ~ 5월");

  const [selectedCluster, setSelectedCluster] = useState<OptimizedCluster | null>(null);
  const [matchingResult, setMatchingResult] = useState<MatchingEngineResult | null>(null);

  const [selectedBid, setSelectedBid] = useState<ContractorBid>({
    id: "bid-1",
    contractorName: "(주)대구에너지윈도우",
    establishedYear: 2018,
    completedProjects: 148,
    rating: 4.86,
    bidPrice: 820,
    standardPrice: 1000,
    discountRate: 18,
    warrantyPeriodYears: 3,
    specHighlights: [
      "국토교통부 그린리모델링 우수사업자 등록",
      "LX하우시스 슈퍼세이브7 로이 26mm 아르곤 정품 사용",
      "자체 하자보수 보증증권(SGI서울보증) 100% 발행",
    ],
  });

  const handleStep1Complete = (
    building: BuildingLedgerData,
    diagnosis: DiagnosisResult,
    image: string | null
  ) => {
    setBuildingData(building);
    setDiagnosisResult(diagnosis);
    setUploadedImage(image);
    setCurrentStep(2);
  };

  const handleStep2Complete = (
    works: string[],
    budget: number,
    schedule: string
  ) => {
    setSelectedWorkIds(works);
    setBudgetCap(budget);
    setDesiredSchedule(schedule);
    setCurrentStep(3);
  };

  const handleStep3Complete = (
    cluster: OptimizedCluster,
    result: MatchingEngineResult
  ) => {
    setSelectedCluster(cluster);
    setMatchingResult(result);
    setCurrentStep(4);
  };

  const handleStep4Complete = (bid: ContractorBid) => {
    setSelectedBid(bid);
    setCurrentStep(6);
  };

  // Section Header Info
  const getSectionHeader = () => {
    if (isCommunityOpen) {
      return {
        tag: "NEIGHBOR COMMUNITY // CHAT",
        title: "이웃 소통 게시판 & 공동공사 제안",
        desc: "인근 건물주들과 함께 공사 수요를 논의하고 일정 조율을 요청하세요.",
      };
    }
    if (activeRole === "admin") {
      return {
        tag: "ADMINISTRATION // PQ GOVERNANCE",
        title: "운영자 관리 콘솔 및 시공업체 PQ 심사",
        desc: "국토부 등록 서류 검증, 입찰 방식 승인 및 대구 100동 파일럿 현황 관리",
      };
    }
    if (activeRole === "contractor") {
      return {
        tag: "CONTRACTOR OPS // BIDDING ENGINE",
        title: "그린리모델링 시공업체 입찰 및 공사 관리",
        desc: "대구 권역 AI 클러스터링 묶음 공고 탐색 및 경쟁 입찰 참여",
      };
    }
    // Customer
    switch (customerTab) {
      case "diagnosis":
        return {
          tag: "STEP 01 // AI DIAGNOSIS",
          title: "건축물대장 자동 연동 및 에너지 성능 진단",
          desc: "공공데이터 건축물대장 기반 3분 무료 진단 및 개별 맞춤 솔루션 도출",
        };
      case "cluster":
        return {
          tag: "STEP 02~04 // CLUSTERING & AUCTION",
          title: "AI 이웃 수요 클러스터링 및 역경매 입찰",
          desc: "인근 300m 이웃과 묶어 최대 22% 공사비 절감 및 투명한 시공사 비교",
        };
      case "my_project":
        return {
          tag: "STEP 06 // ESCROW & CONTRACT",
          title: "스마트 안심 계약 및 공정별 에스크로",
          desc: "SGI 하자보증이행증권 100% 의무 발급 및 AI 시공 완료 검측",
        };
      case "my_page":
        return {
          tag: "ACCOUNT // MY BUILDING",
          title: "마이페이지 및 등록 건물 관리",
          desc: "내 건축물 대장 정보 확인 및 정부/지자체 그린리모델링 이자지원 연동",
        };
      default:
        return {
          tag: "GREENTOPIA // OVERVIEW",
          title: "내 집 상태 및 공동 그린리모델링 현황",
          desc: "혼자 고치면 비싸고, 모아 고치면 싸다. AI 기반 대구 노후건축물 공동공사 플랫폼",
        };
    }
  };

  const headerInfo = getSectionHeader();

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcf8] text-[#1a1c1e] font-inter">
      {/* 1. Header (Variation 3 Editorial Header) */}
      <Header
        activeRole={activeRole}
        onSwitchRole={(role) => {
          setIsCommunityOpen(false);
          switchRole(role);
        }}
        onOpenOnboarding={() => setShowOnboarding(true)}
        onResetSeed={() => {
          resetToSeed();
          alert("대구 100동 노후 주택 및 15개 시공업체 시드 데이터가 초기화되었습니다.");
        }}
        userName={currentUser?.name}
        totalBuildingsCount={buildings.length}
        totalContractorsCount={contractors.length}
      />

      {/* 2. Top Hero & Dashboard Preview Section (Variation 3 Composition) */}
      <section className="border-b border-[rgba(26,28,30,0.08)] bg-gradient-to-b from-[#fdfcf8] to-[#f7f5ee]/40 py-10 sm:py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: Hero Editorial Typography */}
          <div className="hero-text">
            <h2>
              Build together.
              <span>Save together.</span>
            </h2>
            <p className="description mb-6">
              대구 노후 단독·다가구 주택 소유자를 위한 AI 민간 그린리모델링 공동공사 플랫폼.
              혼자 고치면 비싸지만, 반경 300m 이웃과 묶으면 자재 대량 구매 및 동선 효율화로 최대 22% 비용을 절감합니다.
            </p>

            <div className="flex flex-wrap gap-3">
              {activeRole === "customer" && (
                <>
                  <button
                    onClick={() => {
                      setIsCommunityOpen(false);
                      setCustomerTab("diagnosis");
                    }}
                    className="btn-green"
                  >
                    <span>무료 3분 진단 시작</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsCommunityOpen(false);
                      setCustomerTab("cluster");
                    }}
                    className="btn-outline-dark"
                  >
                    <span>공동공사 클러스터 확인</span>
                  </button>
                </>
              )}
              {activeRole === "contractor" && (
                <button
                  onClick={() => setContractorTab("bids_search")}
                  className="btn-green"
                >
                  <span>묶음 수주 공고 입찰하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {activeRole === "admin" && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-geist">
                  <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                  <span>대구 파일럿 관제 및 PQ 거버넌스 활성화</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Dashboard Preview Card */}
          <div className="dashboard-preview">
            <div className="audit-info">
              <h3>Operator Audit Interface</h3>
              <p>대구 100동 노후주택 공동수주 파이프라인 가동 중</p>
            </div>

            <div className="metric-list">
              <div className="metric-item">
                <span className="label">Buildings Registered</span>
                <span className="value">{buildings.length} EA</span>
              </div>
              <div className="metric-item">
                <span className="label">Verified Contractors</span>
                <span className="value">{contractors.length} FIRMS</span>
              </div>
              <div className="metric-item">
                <span className="label">Cluster Cost Benefit</span>
                <span className="value text-[#059669]">최대 22%</span>
              </div>
              <div className="metric-item">
                <span className="label">Escrow Assurance</span>
                <span className="value text-[#1a1c1e]">SGI 100%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sub-Nav Shortcuts (Role-Specific) */}
      <div className="border-b border-[rgba(26,28,30,0.08)] bg-[#fdfcf8]/80 sticky top-[73px] z-30 px-6 lg:px-12 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 py-3 overflow-x-auto">
          {activeRole === "customer" ? (
            <div className="flex items-center gap-2 sm:gap-6 text-xs font-geist font-medium">
              <button
                onClick={() => {
                  setIsCommunityOpen(false);
                  setCustomerTab("home");
                }}
                className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  customerTab === "home" && !isCommunityOpen
                    ? "bg-[#1a1c1e] text-white"
                    : "text-[rgba(26,28,30,0.6)] hover:text-[#1a1c1e]"
                }`}
              >
                대시보드 홈
              </button>
              <button
                onClick={() => {
                  setIsCommunityOpen(false);
                  setCustomerTab("diagnosis");
                }}
                className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  customerTab === "diagnosis"
                    ? "bg-[#1a1c1e] text-white"
                    : "text-[rgba(26,28,30,0.6)] hover:text-[#1a1c1e]"
                }`}
              >
                01. AI 진단
              </button>
              <button
                onClick={() => {
                  setIsCommunityOpen(false);
                  setCustomerTab("cluster");
                }}
                className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  customerTab === "cluster"
                    ? "bg-[#1a1c1e] text-white"
                    : "text-[rgba(26,28,30,0.6)] hover:text-[#1a1c1e]"
                }`}
              >
                02. 클러스터 & 역경매
              </button>
              <button
                onClick={() => {
                  setIsCommunityOpen(false);
                  setCustomerTab("my_project");
                }}
                className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  customerTab === "my_project"
                    ? "bg-[#1a1c1e] text-white"
                    : "text-[rgba(26,28,30,0.6)] hover:text-[#1a1c1e]"
                }`}
              >
                03. 스마트계약 & 에스크로
              </button>
              <button
                onClick={() => setIsCommunityOpen(true)}
                className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  isCommunityOpen
                    ? "bg-[#1a1c1e] text-white"
                    : "text-[rgba(26,28,30,0.6)] hover:text-[#1a1c1e]"
                }`}
              >
                04. 이웃 소통 게시판
              </button>
              <button
                onClick={() => {
                  setIsCommunityOpen(false);
                  setCustomerTab("my_page");
                }}
                className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  customerTab === "my_page"
                    ? "bg-[#1a1c1e] text-white"
                    : "text-[rgba(26,28,30,0.6)] hover:text-[#1a1c1e]"
                }`}
              >
                05. 마이페이지
              </button>
            </div>
          ) : activeRole === "contractor" ? (
            <div className="flex items-center gap-2 sm:gap-6 text-xs font-geist font-medium">
              <button
                onClick={() => setContractorTab("bids_search")}
                className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  contractorTab === "bids_search"
                    ? "bg-[#1a1c1e] text-white"
                    : "text-[rgba(26,28,30,0.6)] hover:text-[#1a1c1e]"
                }`}
              >
                01. 묶음 수주 공고
              </button>
              <button
                onClick={() => setContractorTab("bids_manage")}
                className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  contractorTab === "bids_manage"
                    ? "bg-[#1a1c1e] text-white"
                    : "text-[rgba(26,28,30,0.6)] hover:text-[#1a1c1e]"
                }`}
              >
                02. 제출 입찰 관리
              </button>
              <button
                onClick={() => setContractorTab("reputation")}
                className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  contractorTab === "reputation"
                    ? "bg-[#1a1c1e] text-white"
                    : "text-[rgba(26,28,30,0.6)] hover:text-[#1a1c1e]"
                }`}
              >
                03. 그린파트너 등급·평판
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-xs font-geist text-[rgba(26,28,30,0.7)]">
              <span>운영 상태: <strong className="text-[#059669]">ONLINE (PROD)</strong></span>
              <span>•</span>
              <span>대구 100동 노후 주택 관제</span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2 text-xs font-geist text-[rgba(26,28,30,0.5)]">
            <span>District: DAEGU METROPOLITAN</span>
          </div>
        </div>
      </div>

      {/* 4. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10 pb-28 lg:pb-16 min-w-0">
        {/* Editorial Section Header */}
        <div className="mb-8 border-l-2 border-[#059669] pl-4">
          <span className="font-geist text-xs text-[#059669] uppercase tracking-wider block mb-1">
            {headerInfo.tag}
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#1a1c1e]">
            {headerInfo.title}
          </h2>
          <p className="text-xs text-[rgba(26,28,30,0.6)] mt-1 max-w-3xl">
            {headerInfo.desc}
          </p>
        </div>

        {/* View Router */}
        {isCommunityOpen ? (
          <NeighborCommunityBoard
            onClose={() => setIsCommunityOpen(false)}
            onNavigateToDemandRegister={() => {
              setIsCommunityOpen(false);
              setCustomerTab("cluster");
            }}
          />
        ) : activeRole === "admin" ? (
          <AdminDashboard
            contractors={contractors}
            buildings={buildings}
            onUpdatePqStatus={updateContractorPqStatus}
          />
        ) : activeRole === "contractor" ? (
          <ContractorHome
            contractorProfile={myContractorProfile}
            buildings={buildings}
            onOpenAdminPanel={() => switchRole("admin")}
          />
        ) : (
          <div>
            {customerTab === "home" && (
              <CustomerHome
                myBuilding={myBuilding}
                totalBuildingsCount={buildings.length}
                onNavigateTab={(tab) => {
                  setCustomerTab(tab);
                  if (tab === "cluster") setCurrentStep(2);
                }}
              />
            )}

            {customerTab === "diagnosis" && (
              <Step1Diagnosis
                onComplete={handleStep1Complete}
                onOpenAdvisor={() => setIsAdvisorOpen(true)}
                onOpenCommunity={() => setIsCommunityOpen(true)}
                initialBuilding={buildingData}
                initialDiagnosis={diagnosisResult}
                initialImage={uploadedImage}
              />
            )}

            {customerTab === "cluster" && (
              <div>
                {currentStep <= 2 && (
                  <Step2DemandRegister
                    building={buildingData}
                    diagnosis={diagnosisResult || DEFAULT_INITIAL_DIAGNOSIS}
                    onNext={handleStep2Complete}
                    onPrev={() => setCustomerTab("home")}
                  />
                )}

                {currentStep === 3 && (
                  <Step3Clustering
                    building={buildingData}
                    selectedWorks={selectedWorkIds}
                    budgetCap={budgetCap}
                    desiredSchedule={desiredSchedule}
                    onNext={handleStep3Complete}
                    onPrev={() => setCurrentStep(2)}
                  />
                )}

                {currentStep === 4 && selectedCluster && (
                  <Step4Auction
                    building={buildingData}
                    cluster={selectedCluster}
                    matchingResult={matchingResult}
                    onNext={handleStep4Complete}
                    onPrev={() => setCurrentStep(3)}
                  />
                )}
              </div>
            )}

            {customerTab === "my_project" && (
              <div>
                <Step6TrustContract
                  building={buildingData}
                  bid={selectedBid}
                  beforeImage={uploadedImage}
                  onPrev={() => {
                    setCurrentStep(1);
                    setCustomerTab("home");
                  }}
                />
              </div>
            )}

            {customerTab === "my_page" && (
              <CustomerMyPage
                currentUser={currentUser}
                building={myBuilding}
                onOpenCommunity={() => setIsCommunityOpen(true)}
                onOpenAdvisor={() => setIsAdvisorOpen(true)}
                onOpenOnboarding={() => setShowOnboarding(true)}
              />
            )}
          </div>
        )}
      </main>

      {/* 5. Mobile Thumb-Zone Bottom Navigation */}
      <BottomNav
        role={activeRole}
        currentCustomerTab={customerTab}
        currentContractorTab={contractorTab}
        onSelectCustomerTab={(t) => {
          setIsCommunityOpen(false);
          setCustomerTab(t);
        }}
        onSelectContractorTab={(t) => {
          setContractorTab(t);
        }}
      />

      {/* 6. Onboarding Modal (Variation 3 Editorial Slate Card) */}
      {showOnboarding && (
        <SplashOnboarding
          onCompleteCustomer={(data) => {
            registerCustomer(data);
            setCustomerTab("home");
          }}
          onCompleteContractor={(data) => {
            registerContractor(data);
            setContractorTab("bids_search");
          }}
          onQuickDemoCustomer={() => {
            switchRole("customer");
            setShowOnboarding(false);
          }}
          onQuickDemoContractor={() => {
            switchRole("contractor");
            setShowOnboarding(false);
          }}
          onCancel={() => setShowOnboarding(false)}
        />
      )}

      {/* 7. Subsidy Advisor Modal */}
      {isAdvisorOpen && (
        <SubsidyAdvisorModal
          isOpen={isAdvisorOpen}
          onClose={() => setIsAdvisorOpen(false)}
          buildingData={buildingData}
        />
      )}

      {/* 8. Variation 3 Editorial Footer */}
      <footer className="variation3-footer">
        <div>System: 그린토피아 운영팀장 로그인됨 (대구 관제)</div>
        <div className="hidden sm:block">© 2026 GreenTopia AI Corp. Daegu District Operations</div>
        <div>PQ Auditor v1.0.4 • 100 Buildings Seed Active</div>
      </footer>
    </div>
  );
}
