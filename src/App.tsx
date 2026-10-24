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
import { ArrowRight, ChevronRight, ShieldCheck, Sparkles, Building2, Layers } from "lucide-react";

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
        tag: "NEIGHBOR COMMUNITY",
        title: "이웃 소통 게시판 & 공동공사 제안",
        desc: "인근 건물주들과 함께 공사 수요를 논의하고 일정 조율을 요청하세요.",
      };
    }
    if (activeRole === "admin") {
      return {
        tag: "PQ GOVERNANCE // AUDIT",
        title: "운영자 관리 콘솔 및 시공업체 PQ 심사",
        desc: "국토부 등록 서류 검증, 입찰 방식 승인 및 대구 100동 파일럿 현황 관리",
      };
    }
    if (activeRole === "contractor") {
      return {
        tag: "CONTRACTOR OPS // BIDDING",
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
          tag: "OVERVIEW // DASHBOARD",
          title: "내 집 상태 및 공동 그린리모델링 현황",
          desc: "혼자 고치면 비싸고, 모아 고치면 싸다. AI 기반 대구 노후건축물 공동공사 플랫폼",
        };
    }
  };

  const headerInfo = getSectionHeader();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#111113] font-inter">
      {/* 1. Header (Variation 4 Header) */}
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

      {/* 2. Main Layout (Variation 4: 280px Aside + Hero & Content Grid) */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-[calc(100vh-73px)]">
        {/* Left Aside (Variation 4 Specification) */}
        <aside className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[rgba(17,17,19,0.08)] flex flex-col gap-5 bg-[#F8F7F4]">
          {/* Card 1: Active Projects */}
          <div className="card">
            <div className="meta-label">[01] ACTIVE PROJECTS</div>
            <div className="stat">{buildings.length}</div>
            <div className="text-xs text-[#111113]/70 mt-1 leading-snug">
              대구권 그린리모델링 공동수주 파이프라인
            </div>
          </div>

          {/* Card 2: Cost Benefit (Forest Green Accent) */}
          <div className="card-accent">
            <div className="meta-label text-white/70">COST BENEFIT</div>
            <div className="stat">-22%</div>
            <div className="text-xs text-white/80 mt-1 leading-snug">
              평균 공동 발주 시 자재/공수 비용 절감율
            </div>
          </div>

          {/* Navigation Shortcuts for Current Role */}
          <div className="pt-2 flex flex-col gap-1.5">
            <div className="meta-label mb-1">NAVIGATION</div>
            {activeRole === "customer" ? (
              <div className="flex flex-col gap-1 text-xs font-jetbrains">
                <button
                  onClick={() => {
                    setIsCommunityOpen(false);
                    setCustomerTab("home");
                  }}
                  className={`text-left px-3 py-2 rounded-xl transition-all ${
                    customerTab === "home" && !isCommunityOpen
                      ? "bg-[#111113] text-white font-medium"
                      : "text-[#111113]/60 hover:text-[#111113] hover:bg-black/5"
                  }`}
                >
                  [01] 대시보드 홈
                </button>
                <button
                  onClick={() => {
                    setIsCommunityOpen(false);
                    setCustomerTab("diagnosis");
                  }}
                  className={`text-left px-3 py-2 rounded-xl transition-all ${
                    customerTab === "diagnosis"
                      ? "bg-[#111113] text-white font-medium"
                      : "text-[#111113]/60 hover:text-[#111113] hover:bg-black/5"
                  }`}
                >
                  [02] AI 에너지 진단
                </button>
                <button
                  onClick={() => {
                    setIsCommunityOpen(false);
                    setCustomerTab("cluster");
                  }}
                  className={`text-left px-3 py-2 rounded-xl transition-all ${
                    customerTab === "cluster"
                      ? "bg-[#111113] text-white font-medium"
                      : "text-[#111113]/60 hover:text-[#111113] hover:bg-black/5"
                  }`}
                >
                  [03] 공동공사 클러스터
                </button>
                <button
                  onClick={() => {
                    setIsCommunityOpen(false);
                    setCustomerTab("my_project");
                  }}
                  className={`text-left px-3 py-2 rounded-xl transition-all ${
                    customerTab === "my_project"
                      ? "bg-[#111113] text-white font-medium"
                      : "text-[#111113]/60 hover:text-[#111113] hover:bg-black/5"
                  }`}
                >
                  [04] 스마트계약 & 에스크로
                </button>
                <button
                  onClick={() => setIsCommunityOpen(true)}
                  className={`text-left px-3 py-2 rounded-xl transition-all ${
                    isCommunityOpen
                      ? "bg-[#111113] text-white font-medium"
                      : "text-[#111113]/60 hover:text-[#111113] hover:bg-black/5"
                  }`}
                >
                  [05] 이웃 소통 게시판
                </button>
                <button
                  onClick={() => {
                    setIsCommunityOpen(false);
                    setCustomerTab("my_page");
                  }}
                  className={`text-left px-3 py-2 rounded-xl transition-all ${
                    customerTab === "my_page"
                      ? "bg-[#111113] text-white font-medium"
                      : "text-[#111113]/60 hover:text-[#111113] hover:bg-black/5"
                  }`}
                >
                  [06] 마이페이지
                </button>
              </div>
            ) : activeRole === "contractor" ? (
              <div className="flex flex-col gap-1 text-xs font-jetbrains">
                <button
                  onClick={() => setContractorTab("bids_search")}
                  className={`text-left px-3 py-2 rounded-xl transition-all ${
                    contractorTab === "bids_search"
                      ? "bg-[#111113] text-white font-medium"
                      : "text-[#111113]/60 hover:text-[#111113] hover:bg-black/5"
                  }`}
                >
                  [01] 묶음 수주 공고
                </button>
                <button
                  onClick={() => setContractorTab("bids_manage")}
                  className={`text-left px-3 py-2 rounded-xl transition-all ${
                    contractorTab === "bids_manage"
                      ? "bg-[#111113] text-white font-medium"
                      : "text-[#111113]/60 hover:text-[#111113] hover:bg-black/5"
                  }`}
                >
                  [02] 제출 입찰 관리
                </button>
                <button
                  onClick={() => setContractorTab("reputation")}
                  className={`text-left px-3 py-2 rounded-xl transition-all ${
                    contractorTab === "reputation"
                      ? "bg-[#111113] text-white font-medium"
                      : "text-[#111113]/60 hover:text-[#111113] hover:bg-black/5"
                  }`}
                >
                  [03] 그린파트너 등급·평판
                </button>
              </div>
            ) : (
              <div className="text-xs font-jetbrains text-[#111113]/70 space-y-2 p-3 bg-white rounded-xl border border-[rgba(17,17,19,0.08)]">
                <div>PQ 심사 대기: <span className="font-bold text-[#2E5C4E]">{contractors.filter(c => c.pqStatus === "pending").length}건</span></div>
                <div>운영 상태: <span className="font-bold text-emerald-700">ONLINE (PROD)</span></div>
                <div>검증 시공사: <span className="font-bold">{contractors.length}개사</span></div>
              </div>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-[rgba(17,17,19,0.08)] text-[10px] font-jetbrains text-[#111113]/40">
            DISTRICT: DAEGU METROPOLITAN<br />
            ESCROW: SGI 100% ASSURANCE
          </div>
        </aside>

        {/* Right Section: Hero + Workflows */}
        <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-12 overflow-y-auto">
          {/* Hero Section (Variation 4 Hero) */}
          <section className="p-8 sm:p-14 border-b border-[rgba(17,17,19,0.08)] flex flex-col justify-center bg-gradient-to-b from-[#F8F7F4] to-white/40">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.06em] leading-[0.9] mb-4 text-[#111113]">
              Build together.<br />
              <span className="text-[#2E5C4E]">Save together.</span>
            </h2>
            <p className="max-w-[560px] text-base sm:text-lg leading-relaxed text-[#111113]/70 mb-8 font-inter">
              AI가 이웃 건물의 그린리모델링 공사 수요를 묶어주는 민간 공동공사 플랫폼입니다. 혼자 하면 비싸지만, 같이 고치면 효율적입니다.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {activeRole === "customer" && (
                <>
                  <button
                    onClick={() => {
                      setIsCommunityOpen(false);
                      setCustomerTab("diagnosis");
                    }}
                    className="btn-cta"
                  >
                    <span>무료 3분 진단 시작</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                  <button
                    onClick={() => {
                      setIsCommunityOpen(false);
                      setCustomerTab("cluster");
                    }}
                    className="btn-cta-outline"
                  >
                    <span>공동공사 클러스터 확인</span>
                  </button>
                </>
              )}
              {activeRole === "contractor" && (
                <button
                  onClick={() => setContractorTab("bids_search")}
                  className="btn-cta-accent"
                >
                  <span>묶음 수주 공고 입찰하기</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              )}
              {activeRole === "admin" && (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2E5C4E]/10 text-[#2E5C4E] rounded-full text-xs font-jetbrains font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#2E5C4E]"></span>
                  <span>운영자 모드: 대구 100동 노후주택 및 시공사 PQ 거버넌스</span>
                </div>
              )}
            </div>
          </section>

          {/* Section Breadcrumbs / Header Info */}
          <div className="px-8 sm:px-14 pt-8">
            <div className="border-l-2 border-[#2E5C4E] pl-4 mb-6">
              <span className="meta-label text-[#2E5C4E] block mb-0.5">
                {headerInfo.tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111113]">
                {headerInfo.title}
              </h3>
              <p className="text-xs text-[#111113]/60 mt-1 max-w-2xl">
                {headerInfo.desc}
              </p>
            </div>

            {/* Child Components Router */}
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
          </div>
        </div>
      </main>

      {/* 3. Mobile Thumb-Zone Bottom Navigation */}
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

      {/* 4. Onboarding Modal (Variation 4 Clean Aesthetic) */}
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

      {/* 5. Subsidy Advisor Modal */}
      {isAdvisorOpen && (
        <SubsidyAdvisorModal
          isOpen={isAdvisorOpen}
          onClose={() => setIsAdvisorOpen(false)}
          buildingData={buildingData}
        />
      )}

      {/* 6. Variation 4 Quiet Footer */}
      <footer className="py-4 px-6 sm:px-12 border-t border-[rgba(17,17,19,0.08)] bg-[#F8F7F4] flex flex-col sm:flex-row items-center justify-between gap-2 font-jetbrains text-xs text-[#111113]/50">
        <div>GreenTopia AI Corp. Daegu District Operations</div>
        <div>[01] ACTIVE PROJECTS 101 • COST BENEFIT -22%</div>
      </footer>
    </div>
  );
}
