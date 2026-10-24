import React, { useState } from "react";
import { UserRole, ConstructionDomain, BuildingUsageType, BuildingStructure } from "../../types/greentopia";
import { DEMAND_QUESTIONS } from "../../data/daeguSeedData";
import { buildingRegistryAdapter, BuildingRegistryInfo } from "../../services/adapters";
import {
  Home,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  FileCheck,
  Shield,
  Layers,
  ArrowLeft,
  Search,
} from "lucide-react";

interface SplashOnboardingProps {
  onCompleteCustomer: (data: any) => void;
  onCompleteContractor: (data: any) => void;
  onQuickDemoCustomer: () => void;
  onQuickDemoContractor: () => void;
  onCancel: () => void;
}

type OnboardingStep = "splash" | "role_select" | "form_customer" | "form_contractor" | "contractor_pending_notice";

export const SplashOnboarding: React.FC<SplashOnboardingProps> = ({
  onCompleteCustomer,
  onCompleteContractor,
  onQuickDemoCustomer,
  onQuickDemoContractor,
  onCancel,
}) => {
  const [step, setStep] = useState<OnboardingStep>("splash");

  // 고객 폼 상태
  const [customerName, setCustomerName] = useState("홍길동");
  const [customerPhone, setCustomerPhone] = useState("010-9876-5432");
  const [customerEmail, setCustomerEmail] = useState("owner.daegu@greentopia.kr");
  const [customerAddress, setCustomerAddress] = useState("대구광역시 남구 대명로 45길 12");
  const [selectedDemands, setSelectedDemands] = useState<string[]>([
    "창호가 오래되고 외풍이 심해요",
    "겨울철에 보일러를 틀어도 방안이 썰렁해요",
  ]);
  const [preferredTiming, setPreferredTiming] = useState("즉시 (1~2개월 내)");
  const [addressSearchResults, setAddressSearchResults] = useState<BuildingRegistryInfo[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);

  // 사업자 폼 상태
  const [companyName, setCompanyName] = useState("(주)대구에코윈하우징");
  const [repName, setRepName] = useState("김영수");
  const [businessNumber, setBusinessNumber] = useState("502-86-55441");
  const [contractorPhone, setContractorPhone] = useState("053-761-4455");
  const [contractorEmail, setContractorEmail] = useState("ecowin@daegu-gr.com");
  const [specialties, setSpecialties] = useState<ConstructionDomain[]>(["window", "outer_wall"]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["대구 전지역", "남구", "수성구"]);
  const [isGrCertified, setIsGrCertified] = useState(true);
  const [grCertNumber, setGrCertNumber] = useState("국토부-GR-2024-0899");
  const [licenseType, setLicenseType] = useState("금속창호·지붕건축물조립공사업");
  const [licenseNumber, setLicenseNumber] = useState("대구-2021-02-0033");
  const [warrantyGuaranteed, setWarrantyGuaranteed] = useState(true);
  const [representativeProject, setRepresentativeProject] = useState("대구 남구 대명동 노후 다가구 시스템창호 10세대 시공");

  // 주소 검색 핸들러
  const handleSearchAddress = async (keyword: string) => {
    setIsSearchingAddress(true);
    try {
      const results = await buildingRegistryAdapter.searchAddress(keyword);
      setAddressSearchResults(results);
    } catch {
      // ignore
    } finally {
      setIsSearchingAddress(false);
    }
  };

  const handleSelectDemand = (phrase: string) => {
    if (selectedDemands.includes(phrase)) {
      setSelectedDemands(selectedDemands.filter((d) => d !== phrase));
    } else {
      setSelectedDemands([...selectedDemands, phrase]);
    }
  };

  const handleToggleSpecialty = (domain: ConstructionDomain) => {
    if (specialties.includes(domain)) {
      if (specialties.length > 1) {
        setSpecialties(specialties.filter((s) => s !== domain));
      }
    } else {
      setSpecialties([...specialties, domain]);
    }
  };

  // 고객 제출
  const handleSubmitCustomer = () => {
    onCompleteCustomer({
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      building: {
        address: customerAddress,
        roadAddress: customerAddress,
        sigungu: "대구광역시 남구",
        dong: "대명동",
        latitude: 35.8450,
        longitude: 128.5830,
        usageType: "단독주택" as BuildingUsageType,
        structure: "조적조 (벽돌/연와)" as BuildingStructure,
        approvalYear: 1991,
        ageYears: 35,
        grossAreaSqm: 118,
        floorsAbove: 2,
        households: 2,
        energyGrade: "7등급 (취약)",
        monthlyGasBillAvgWon: 185000,
        monthlyElectricityBillAvgWon: 62000,
        selectedDemands,
        relatedDomains: ["window", "outer_wall"],
        preferredTiming,
        estimatedBudgetWon: 14000000,
        wantsCoConstruction: true,
      },
    });
  };

  // 사업자 제출
  const handleSubmitContractor = () => {
    onCompleteContractor({
      companyName,
      representativeName: repName,
      businessNumber,
      contactPhone: contractorPhone,
      email: contractorEmail,
      specialties,
      activityRegions: selectedRegions,
      isGrCertified,
      grCertificationNumber: isGrCertified ? grCertNumber : undefined,
      licenseType,
      licenseNumber,
      warrantyGuaranteed,
      representativeProject,
      averageSquareMeterPriceWon: {
        window: 295000,
        outer_wall: 98000,
        inner_wall: 68000,
        boiler: 1100000,
        roof: 90000,
        ventilation: 1650000,
      },
    });
    setStep("contractor_pending_notice");
  };

  return (
    <div className="modal-overlay">
      {/* ================= STEP 1: SPLASH (VARIATION 3 ONBOARDING CARD) ================= */}
      {step === "splash" && (
        <div className="onboarding-card relative max-w-lg w-full shadow-2xl">
          <button
            onClick={onCancel}
            className="absolute top-5 right-5 text-xs font-geist text-white/50 hover:text-white p-1"
            title="닫기"
          >
            ✕ CLOSE
          </button>
          
          <span className="font-geist text-[10px] uppercase tracking-[0.2em] text-[#059669] font-semibold block mb-2">
            GREENTOPIA AI PLATFORM
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold font-inter text-white tracking-tight leading-tight">
            Build together.<br />
            <span className="text-[#059669]">Save together.</span>
          </h3>
          <p className="mt-2 text-xs text-white/70 leading-relaxed font-inter">
            노후 주택의 창호·단열·보일러 교체 수요를 AI가 인근 이웃과 묶어 최대 22% 비용 절감과 안심 시공을 제공합니다.
          </p>

          <div className="feature-dots">
            <div className="dot">
              <span>인근 300m 이웃 건물과 묶음 공사로 자재비 및 인건비 최대 22% 절감</span>
            </div>
            <div className="dot">
              <span>국토부 등록 및 전문 면허 PQ 심사를 통과한 검증된 그린파트너 시공사</span>
            </div>
            <div className="dot">
              <span>SGI서울보증 하자보수이행증권 100% 발급 및 공정별 에스크로 안심 정산</span>
            </div>
          </div>

          <div className="actions flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setStep("form_customer")}
              className="btn-green flex-1 justify-center py-3 text-xs"
            >
              건물주로 시작하기 →
            </button>
            <button
              type="button"
              onClick={() => setStep("form_contractor")}
              className="btn-outline flex-1 justify-center py-3 text-xs"
            >
              시공업체로 참여하기
            </button>
          </div>

          {/* Quick Demo Shortcuts */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-geist">
            <span className="text-white/40">DEMO QUICK SWITCH:</span>
            <button
              type="button"
              onClick={onQuickDemoCustomer}
              className="text-white hover:text-[#059669] font-medium"
            >
              [건물주 체험]
            </button>
            <button
              type="button"
              onClick={onQuickDemoContractor}
              className="text-white hover:text-[#059669] font-medium"
            >
              [시공업체 체험]
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-white/40 hover:text-white"
            >
              [둘러보기]
            </button>
          </div>
        </div>
      )}

      {/* Other Steps inside container */}
      {step !== "splash" && (
        <div className="w-full max-w-2xl bg-[#ffffff] text-[#1a1c1e] border border-[rgba(26,28,30,0.12)] shadow-2xl rounded-3xl overflow-hidden my-8 max-h-[90vh] overflow-y-auto">

        {/* ================= STEP 2: ROLE SELECT ================= */}
        {step === "role_select" && (
          <div className="p-8 sm:p-10">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setStep("splash")}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>이전</span>
              </button>
              <span className="text-xs font-semibold text-slate-400">1 / 2 단계</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
              어떤 목적으로 그린토피아를 이용하시나요?
            </h2>
            <p className="text-xs text-slate-500 mb-8">
              선택하신 회원 유형에 따라 최적화된 서비스 화면을 제공합니다.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* Card 1: Customer */}
              <button
                onClick={() => setStep("form_customer")}
                className="group p-6 rounded-2xl border-2 border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 text-left transition-all relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-900 mb-1">
                  내 집을 고치고 싶어요
                </h3>
                <span className="text-xs font-medium text-emerald-700 block mb-2">
                  일반 고객 (건물주/소유자)
                </span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  노후 단독·다가구·다세대 주택 소유자. 3분 무료 진단 후 이웃과 묶어 공동공사에 참여합니다.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <span>고객으로 시작</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Card 2: Contractor */}
              <button
                onClick={() => setStep("form_contractor")}
                className="group p-6 rounded-2xl border-2 border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 text-left transition-all relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-900 mb-1">
                  공사를 수주하고 싶어요
                </h3>
                <span className="text-xs font-medium text-slate-700 block mb-2">
                  사업자 (그린리모델링 시공업체)
                </span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  창호, 단열, 보일러 전문 시공업체. 대구 권역 묶음 공고를 확인하고 경쟁 입찰에 참여합니다.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-700">
                  <span>시공사로 등록</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3-A: CUSTOMER FORM ================= */}
        {step === "form_customer" && (
          <div className="p-8 sm:p-10 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setStep("role_select")}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>이전</span>
              </button>
              <span className="text-xs font-semibold text-slate-400">2 / 2 단계</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
              건물주 기본 정보 및 내 집 등록
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              3분 만에 우리 집 상태와 같이 고칠 때 예상 절감액을 확인합니다.
            </p>

            <div className="space-y-5">
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    이름
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    연락처
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  이메일 (아이디)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  placeholder="name@example.com"
                />
              </div>

              {/* 건물 주소 검색 (건축물대장 어댑터 연동) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <span>내 건물 주소 (대구 지역)</span>
                  </label>
                  <span className="text-[11px] text-slate-500">건축물대장 자동 연계</span>
                </div>

                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-600"
                    placeholder="예: 남구 대명동, 서구 비산동, 수성구 만촌동"
                  />
                  <button
                    type="button"
                    onClick={() => handleSearchAddress(customerAddress)}
                    disabled={isSearchingAddress}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1 shrink-0"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>대장 검색</span>
                  </button>
                </div>

                {addressSearchResults.length > 0 && (
                  <div className="mt-2 bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 max-h-36 overflow-y-auto">
                    {addressSearchResults.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCustomerAddress(item.roadAddress);
                          setAddressSearchResults([]);
                        }}
                        className="w-full text-left p-2.5 hover:bg-emerald-50/60 transition text-xs"
                      >
                        <span className="font-semibold text-slate-900 block">{item.roadAddress}</span>
                        <span className="text-slate-500 text-[11px]">
                          {item.usageType} · {item.approvalYear}년 승인({item.ageYears}년 경과) · {item.structure}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 생활 언어 공사 수요 태그 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  현재 우리 집에서 겪고 있는 불편은 무엇인가요? (복수 선택)
                </label>
                <div className="space-y-2">
                  {DEMAND_QUESTIONS.map((q) => {
                    const isSelected = selectedDemands.includes(q.userPhrase);
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => handleSelectDemand(q.userPhrase)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/40 text-slate-900"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? "bg-emerald-600 text-white" : "border border-slate-300"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-semibold block">{q.userPhrase}</span>
                          <span className="text-[11px] text-emerald-700">{q.benefit}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 희망 공사 시기 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  희망 공사 시기
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["즉시 (1~2개월 내)", "봄 (3~5월)", "가을 (9~11월)", "미정"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPreferredTiming(t)}
                      className={`py-2 text-xs font-medium rounded-xl border transition ${
                        preferredTiming === t
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmitCustomer}
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.99] transition mt-6"
              >
                가입 완료 및 내 집 3분 진단 보기
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3-B: CONTRACTOR FORM ================= */}
        {step === "form_contractor" && (
          <div className="p-8 sm:p-10 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setStep("role_select")}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>이전</span>
              </button>
              <span className="text-xs font-semibold text-slate-400">2 / 2 단계 (사업자 등록)</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
              시공업체 정보 및 전문 자격 등록
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              국토부 그린리모델링(GR) 사업자 및 전문건설업 면허 서류 검증(PQ 1차) 후 입찰이 활성화됩니다.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    상호 (업체명)
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                    placeholder="(주)그린건설"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    대표자 성명
                  </label>
                  <input
                    type="text"
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                    placeholder="홍길동"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    사업자등록번호
                  </label>
                  <input
                    type="text"
                    value={businessNumber}
                    onChange={(e) => setBusinessNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                    placeholder="000-00-00000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    대표 연락처
                  </label>
                  <input
                    type="text"
                    value={contractorPhone}
                    onChange={(e) => setContractorPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                    placeholder="053-000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  이메일 (공식 계정)
                </label>
                <input
                  type="email"
                  value={contractorEmail}
                  onChange={(e) => setContractorEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  placeholder="contact@company.co.kr"
                />
              </div>

              {/* 시공 가능 공종 다중 선택 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  시공 가능 전문 공종 (다중 선택)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "window", label: "고단열 창호" },
                    { id: "outer_wall", label: "외벽 단열" },
                    { id: "inner_wall", label: "내단열·바닥" },
                    { id: "boiler", label: "고효율 보일러" },
                    { id: "roof", label: "지붕·쿨루프" },
                    { id: "ventilation", label: "열회수 환기장치" },
                  ].map((item) => {
                    const active = specialties.includes(item.id as ConstructionDomain);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleToggleSpecialty(item.id as ConstructionDomain)}
                        className={`py-2 px-3 text-xs font-medium rounded-xl border transition ${
                          active
                            ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 면허 및 GR 등록 정보 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-700" />
                    <span>국토교통부 그린리모델링(GR) 사업자 등록</span>
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGrCertified}
                      onChange={(e) => setIsGrCertified(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-medium text-slate-700">등록 완료</span>
                  </label>
                </div>

                {isGrCertified && (
                  <div>
                    <input
                      type="text"
                      value={grCertNumber}
                      onChange={(e) => setGrCertNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      placeholder="국토부 GR 등록번호 (예: 국토부-GR-2024-0000)"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      건설업 등록 면허 종류
                    </label>
                    <input
                      type="text"
                      value={licenseType}
                      onChange={(e) => setLicenseType(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      placeholder="예: 금속창호·지붕공사업"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      면허 번호
                    </label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      placeholder="대구-2021-00-0000"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-700 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-700" />
                    <span>공사 완료 후 하자보증이행증권 발급 가능</span>
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={warrantyGuaranteed}
                      onChange={(e) => setWarrantyGuaranteed(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-medium text-slate-700">가능</span>
                  </label>
                </div>
              </div>

              {/* 대표 시공 실적 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  대표 시공 실적 1건
                </label>
                <input
                  type="text"
                  value={representativeProject}
                  onChange={(e) => setRepresentativeProject(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  placeholder="예: 대구 남구 대명동 노후 다가구 시스템창호 10세대 일괄시공"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmitContractor}
                className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md active:scale-[0.99] transition mt-6"
              >
                시공업체 등록 신청하기
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: CONTRACTOR PENDING NOTICE ================= */}
        {step === "contractor_pending_notice" && (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-6 shadow-xs">
              <FileCheck className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">
              PQ 1차 서류 확인 진행중
            </span>

            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
              시공업체 가입 신청이 완료되었습니다!
            </h2>

            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
              현재 <strong className="text-slate-900">"심사 대기"</strong> 상태입니다.
              운영팀에서 제출하신 건설업 등록 면허 및 국토부 GR 사업자 확인증을 검증한 뒤 입찰 참여 권한이 부여됩니다.
              (상단 관리자 탭에서 즉시 승인 테스트가 가능합니다.)
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 mb-8 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">신청 상호</span>
                <span className="font-semibold text-slate-900">{companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">사업자등록번호</span>
                <span className="font-semibold text-slate-900">{businessNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">심사 단계</span>
                <span className="font-semibold text-amber-700">관리자 1차 PQ 적격 심사 대기</span>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="w-full max-w-md mx-auto h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition"
            >
              시공업체 대시보드로 이동
            </button>
          </div>
        )}
        </div>
      )}
    </div>
  );
};
