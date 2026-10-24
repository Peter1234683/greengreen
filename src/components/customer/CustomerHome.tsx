import React from "react";
import { BuildingRecord } from "../../types/greentopia";
import {
  Building2,
  TrendingDown,
  Users,
  Flame,
  Zap,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Layers,
  MapPin,
} from "lucide-react";

interface CustomerHomeProps {
  myBuilding: BuildingRecord | null;
  totalBuildingsCount: number;
  onNavigateTab: (tab: "diagnosis" | "cluster" | "my_project") => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  myBuilding,
  totalBuildingsCount,
  onNavigateTab,
}) => {
  const building = myBuilding || {
    address: "대구광역시 남구 대명로 45길 12",
    dong: "대명동",
    approvalYear: 1991,
    ageYears: 35,
    usageType: "단독주택",
    structure: "조적조 (벽돌/연와)",
    grossAreaSqm: 118,
    energyGrade: "7등급 (취약)",
    monthlyGasBillAvgWon: 185000,
    monthlyElectricityBillAvgWon: 62000,
    selectedDemands: ["창호가 오래되고 외풍이 심해요", "겨울철에 보일러를 틀어도 방안이 썰렁해요"],
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* 1. Value Proposition Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="text-[11px] font-semibold tracking-wider text-emerald-300 uppercase block mb-1">
            혼자 고치면 비싸고, 모아 고치면 싸다
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-2 text-balance">
            우리 집 그린리모델링,
            <br />
            이웃과 함께 묶어 최대 35% 절감하세요.
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-6">
            현재 대구 권역에서 <strong>{totalBuildingsCount}동의 노후 주택</strong>이 등록되어 공사 수요를 모으고 있습니다.
            AI가 유사 공종과 가까운 거리의 이웃을 찾아 견적 경쟁을 유도합니다.
          </p>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab("diagnosis")}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 text-xs font-bold hover:bg-emerald-50 transition shadow-sm flex items-center gap-1.5"
            >
              <span>3분 무료 내 집 진단</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab("cluster")}
              className="px-4 py-2.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white text-xs font-semibold backdrop-blur-xs transition flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>주변 공동공사 참여 현황</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. My Building Status Card */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{building.address}</h2>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  등록 완료
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {building.usageType} · {building.structure} · {building.approvalYear}년 사용승인({building.ageYears}년 경과)
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("diagnosis")}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>상세 진단 수정</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Building Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block mb-0.5">건물 연식/노후도</span>
            <span className="text-base font-bold text-slate-900 tabular-nums">
              {building.ageYears}년 경과
            </span>
            <span className="text-[10px] text-amber-700 block mt-0.5">그린리모델링 지원 대상</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block mb-0.5">에너지 효율 추정</span>
            <span className="text-base font-bold text-amber-700">
              {building.energyGrade || "7등급 (취약)"}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">신축 대비 열손실 48% 과다</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-slate-500 text-[11px] mb-0.5">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>월평균 가스비</span>
            </div>
            <span className="text-base font-bold text-slate-900 tabular-nums">
              {(building.monthlyGasBillAvgWon || 185000).toLocaleString()}원
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">겨울철 난방 취약</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-slate-500 text-[11px] mb-0.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>월평균 전기비</span>
            </div>
            <span className="text-base font-bold text-slate-900 tabular-nums">
              {(building.monthlyElectricityBillAvgWon || 62000).toLocaleString()}원
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">여름철 냉방비 포함</span>
          </div>
        </div>

        {/* User Selected Demand Badges */}
        <div>
          <span className="text-xs font-semibold text-slate-700 block mb-2">
            현재 등록된 공사 개선 희망 사항:
          </span>
          <div className="flex flex-wrap gap-2">
            {(building.selectedDemands || []).map((dem, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{dem}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. "혼자 할 때 vs 같이 할 때" Savings Comparison Teaser */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              공동공사 예상 절감 시뮬레이션
            </h2>
            <p className="text-xs text-slate-500">
              대구 {building.dong || "대명동"} 인근 유사 공종 묶음 발주 기준
            </p>
          </div>
          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
            가정 기반 예상치 (실제는 입찰 확정)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Individual */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              개별 단독 발주 시
            </span>
            <div className="text-2xl font-extrabold text-slate-700 tabular-nums mb-2">
              약 1,850만 ~ 2,100만원
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <li>• 자재 개별 운송 및 장비(사다리차) 독자 임차</li>
              <li>• 시공업체 이동 경비 및 실측 공수 분산</li>
              <li>• 할인 혜택 없음</li>
            </ul>
          </div>

          {/* Co-construction */}
          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 relative">
            <span className="absolute top-4 right-4 text-xs font-bold text-white bg-emerald-600 px-2.5 py-0.5 rounded-md">
              평균 -24% 절감
            </span>
            <span className="text-xs font-semibold text-emerald-800 block mb-1">
              이웃 3~5동 공동발주 시
            </span>
            <div className="text-2xl font-extrabold text-emerald-900 tabular-nums mb-2">
              약 1,400만 ~ 1,590만원
            </div>
            <ul className="text-xs text-emerald-800 space-y-1.5 leading-relaxed">
              <li>• 동일 규격 고단열 창호 공장 일괄 주문 (자재 15% DC)</li>
              <li>• 시공팀 당일 연속 시공으로 인건비 및 장비대 30% 절감</li>
              <li>• 국토부 그린리모델링 이자지원(최대 4%p) 복합 적용</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              계약은 각 건물별로 시공사와 개별 체결되므로 대금 위험이 없습니다.
            </span>
          </div>
          <button
            onClick={() => onNavigateTab("cluster")}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition whitespace-nowrap"
          >
            주변 클러스터 참여하기
          </button>
        </div>
      </section>

      {/* 4. External Energy Simulator (GR-AI) Link Section */}
      <section className="bg-slate-50 rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-slate-900">
              GR-AI 정밀 에너지 시뮬레이션
            </h3>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              국토교통부 연계
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
            공식 GR-AI 플랫폼(https://grai.ibed.cloud)에서 외벽 열관류율, 창호 사양, 냉난방 COP를
            세밀하게 조절하여 건물 단위 온실가스 감축량을 정밀 계산해 볼 수 있습니다.
          </p>
        </div>

        <a
          href="https://grai.ibed.cloud"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-semibold hover:bg-slate-100 transition flex items-center gap-1.5 shrink-0"
        >
          <span>GR-AI 플랫폼 열기</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </section>
    </div>
  );
};
