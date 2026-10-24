import React from "react";
import { ContractorProfile, BuildingRecord } from "../../types/greentopia";
import {
  Wrench,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Building,
  TrendingUp,
  MapPin,
  Star,
  Layers,
  ArrowRight,
} from "lucide-react";

interface ContractorHomeProps {
  contractorProfile: ContractorProfile | null;
  buildings: BuildingRecord[];
  onOpenAdminPanel: () => void;
}

export const ContractorHome: React.FC<ContractorHomeProps> = ({
  contractorProfile,
  buildings,
  onOpenAdminPanel,
}) => {
  const profile: ContractorProfile = contractorProfile || {
    id: "CONT-DG-001",
    userId: "USER-CONT-001",
    companyName: "(주)대구에너지윈도우",
    representativeName: "김창호",
    businessNumber: "502-81-49201",
    contactPhone: "053-745-8821",
    email: "energywin@daegu-gr.co.kr",
    specialties: ["window", "outer_wall"],
    activityRegions: ["대구 전지역", "수성구", "동구", "중구"],
    isGrCertified: true,
    grCertificationNumber: "국토부-GR-2023-0491",
    licenseType: "금속구조물·창호·온실공사업",
    licenseNumber: "대구-2018-02-0041",
    warrantyGuaranteed: true,
    pqStatus: "approved",
    completedProjectsCount: 148,
    grExperienceYears: 9,
    reputationScore: 4.86,
    reviewsCount: 38,
    representativeProject: "대구 수성구 만촌동 노후 다가구 로이 복층 시스템창호 14세대 일괄시공",
    averageSquareMeterPriceWon: {
      window: 290000,
      outer_wall: 110000,
      inner_wall: 75000,
      boiler: 1200000,
      roof: 95000,
      ventilation: 1800000,
    },
  };

  const isApproved = profile.pqStatus === "approved";
  const isPending = profile.pqStatus === "pending";

  // 대구 수요 통계 요약
  const windowCount = buildings.filter((b) => b.relatedDomains.includes("window")).length;
  const wallCount = buildings.filter((b) => b.relatedDomains.includes("outer_wall")).length;
  const boilerCount = buildings.filter((b) => b.relatedDomains.includes("boiler")).length;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* 1. PQ Status Banner */}
      {isPending ? (
        <div className="rounded-3xl bg-amber-50 border-2 border-amber-300 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-amber-950">
                  PQ 1차 서류 확인 심사 대기 중
                </span>
                <span className="text-[10px] font-semibold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                  심사 대기
                </span>
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed max-w-xl">
                국토교통부 GR 사업자 등록 및 건설업 면허 1차 적격 확인이 진행 중입니다.
                관리자 승인 완료 후 즉시 정규 입찰 참여 및 견적 제출이 가능합니다.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAdminPanel}
            className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold whitespace-nowrap transition"
          >
            관리자 탭에서 승인 테스트
          </button>
        </div>
      ) : (
        <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-950">
                  PQ 1차 적격 심사 승인 완료
                </span>
                <span className="text-[10px] font-semibold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                  입찰 자격 보유
                </span>
              </div>
              <p className="text-xs text-emerald-800">
                국토부 인증 그린리모델링 사업자로서 대구 권역 모든 공동공사 클러스터 입찰에 참여할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Contractor Profile Overview */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              {profile.companyName.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">{profile.companyName}</h1>
                <span className="text-xs text-slate-500">대표 {profile.representativeName}</span>
              </div>
              <p className="text-xs text-slate-500">
                사업자등록번호: {profile.businessNumber} · 연락처: {profile.contactPhone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 text-xs font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{profile.reputationScore ? profile.reputationScore.toFixed(2) : "평가 준비중"}</span>
            </div>
            <span className="text-xs text-slate-500">
              리뷰 {profile.reviewsCount || 0}건
            </span>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block mb-0.5">건설업 면허</span>
            <span className="text-xs font-bold text-slate-900 block truncate">
              {profile.licenseType}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
              {profile.licenseNumber}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block mb-0.5">국토부 GR 등록</span>
            <span className="text-xs font-bold text-emerald-700 block">
              {profile.isGrCertified ? "정식 등록 사업자" : "미등록"}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {profile.grCertificationNumber || "확인 대기"}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block mb-0.5">누적 완공 실적</span>
            <span className="text-base font-bold text-slate-900 tabular-nums">
              {profile.completedProjectsCount}건
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">그린리모델링 {profile.grExperienceYears || 1}년차</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block mb-0.5">하자보증증권</span>
            <span className="text-xs font-bold text-slate-900 block">
              {profile.warrantyGuaranteed ? "발급 보증 (3년)" : "확약 필요"}
            </span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">소비자 신뢰 우수</span>
          </div>
        </div>

        {/* Representative project */}
        <div className="p-3 rounded-2xl bg-slate-50 text-xs text-slate-700">
          <span className="font-semibold text-slate-900 mr-1.5">[대표 시공 실적]</span>
          <span>{profile.representativeProject}</span>
        </div>
      </section>

      {/* 3. Daegu Retrofit Market Pipeline */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              대구 권역 공동공사 수주 기회 탐색
            </h2>
            <p className="text-xs text-slate-500">
              총 {buildings.length}동 노후 주택의 실시간 접수 수요 풀
            </p>
          </div>
          <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-lg">
            모집중 클러스터
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-medium text-slate-500 block mb-1">고단열 창호 공종 수요</span>
            <div className="text-2xl font-extrabold text-emerald-800 tabular-nums mb-1">
              {windowCount}동
            </div>
            <span className="text-[11px] text-slate-500">대명동·비산동·만촌동 집중</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-medium text-slate-500 block mb-1">외벽단열 보강 수요</span>
            <div className="text-2xl font-extrabold text-slate-800 tabular-nums mb-1">
              {wallCount}동
            </div>
            <span className="text-[11px] text-slate-500">30년 이상 조적조 위주</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-medium text-slate-500 block mb-1">친환경 보일러 수요</span>
            <div className="text-2xl font-extrabold text-slate-800 tabular-nums mb-1">
              {boilerCount}동
            </div>
            <span className="text-[11px] text-slate-500">침산동·신암동 연립주택군</span>
          </div>
        </div>

        {/* Co-bidding Cluster Teaser Cards */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-900">
                  Cluster #12 · 대구 남구 대명동 창호 공동교체
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  7동 묶음
                </span>
              </div>
              <p className="text-xs text-slate-500">
                반경 850m 이내 노후 벽돌단독 7동 · 평균 적합도 89점 · 예상 발주규모 약 1.1억원
              </p>
            </div>
            <button
              disabled={!isApproved}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isApproved
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isApproved ? "입찰 참여하기" : "심사 승인 후 참여 가능"}
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-900">
                  Cluster #15 · 대구 서구 비산동 외단열+창호 복합공사
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  5동 묶음
                </span>
              </div>
              <p className="text-xs text-slate-500">
                반경 600m 이내 1988~1994년식 단독 5동 · 예상 발주규모 약 9,500만원
              </p>
            </div>
            <button
              disabled={!isApproved}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isApproved
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isApproved ? "입찰 참여하기" : "심사 승인 후 참여 가능"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
