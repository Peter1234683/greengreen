import React, { useState } from "react";
import {
  ShieldCheck,
  Star,
  Award,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Building,
  Wrench,
  FileCheck,
  Percent,
  Check,
  ShieldAlert,
} from "lucide-react";
import {
  CONTRACTOR_REPUTATION_DATABASE,
  ContractorReputationProfile,
  GreenPartnerTier,
} from "../data/contractorReputationData";

interface GreenPartnerReputationCardProps {
  bidId: string;
  contractorName: string;
  isWinningBid?: boolean;
  onOpenContractModal?: () => void;
}

export const GreenPartnerReputationCard: React.FC<GreenPartnerReputationCardProps> = ({
  bidId,
  contractorName,
  isWinningBid = true,
}) => {
  const [activeTab, setActiveTab] = useState<"summary" | "complaints" | "reviews">("summary");
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedTagIndex, setSelectedTagIndex] = useState<number | null>(null);

  // Retrieve contractor reputation data from database or use fallback
  const reputation: ContractorReputationProfile =
    CONTRACTOR_REPUTATION_DATABASE[bidId] ||
    CONTRACTOR_REPUTATION_DATABASE["bid-1"] || {
      bidId,
      contractorName,
      partnerTier: "MASTER",
      partnerTierTitle: "최우수 마스터 그린파트너",
      tierDescription: "공인 그린리모델링 사업자 · 누적 실적 및 에스크로 평판 검증 완료",
      certificationNumber: "국토부·그린토피아 GR-M2024-0012",
      overallRating: 4.9,
      totalReviewedHouseholds: 284,
      repeatRecommendationRate: 98.6,
      categoryRatings: [],
      totalComplaintsCount: 3,
      complaintRatePercent: 1.1,
      complaintResolvedRate: 100,
      averageResolutionHours: 12,
      complaintTags: [],
      postConstructionDefectRate: 0.0,
      warrantyInsuranceIssuanceRate: 100,
      recentReviews: [],
    };

  // Render Green Partner Tier Badge
  const renderTierBadge = (tier: GreenPartnerTier) => {
    switch (tier) {
      case "MASTER":
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs border border-emerald-400/40">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs font-black tracking-wide">
              최우수 마스터 그린파트너
            </span>
            <span className="text-[10px] bg-emerald-800/80 px-1.5 py-0.2 rounded-md font-bold text-emerald-200">
              TOP 1%
            </span>
          </div>
        );
      case "GOLD":
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-xs border border-amber-300/40">
            <Award className="w-3.5 h-3.5 text-yellow-200" />
            <span className="text-xs font-black tracking-wide">
              골드 그린파트너
            </span>
            <span className="text-[10px] bg-amber-800/80 px-1.5 py-0.2 rounded-md font-bold text-amber-200">
              우수 시공사
            </span>
          </div>
        );
      case "SILVER":
      default:
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-700 text-white border border-slate-500">
            <Award className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-xs font-bold">공인 그린파트너</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-500/40 shadow-sm overflow-hidden transition-all">
      {/* 1. Card Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 text-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {renderTierBadge(reputation.partnerTier)}
              {isWinningBid && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>주민 투표 과반수 낙찰 시공사</span>
                </span>
              )}
              <span className="text-[11px] text-slate-300 font-mono">
                {reputation.certificationNumber}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
                <span>{reputation.contractorName}</span>
                <span className="text-xs text-emerald-400 font-semibold">
                  공식 신뢰 평판 인증서
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {reputation.tierDescription}
              </p>
            </div>
          </div>

          {/* Toggle Expand / Collapse */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-slate-400">평판 종합 등급</div>
              <div className="text-base font-black text-emerald-400">AAA+ (안심 시공)</div>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors flex items-center space-x-1 text-xs font-semibold cursor-pointer"
              aria-label={isExpanded ? "평판 접기" : "평판 상세 펼치기"}
            >
              <span>{isExpanded ? "요약 접기" : "평판 상세보기"}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. Key Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
          {/* Metric 1: Overall Rating */}
          <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block font-medium">
              실시공 평균 별점
            </span>
            <div className="flex items-center space-x-1.5 mt-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xl font-black text-white">
                {reputation.overallRating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
              총 {reputation.totalReviewedHouseholds}세대 실검증 평가
            </span>
          </div>

          {/* Metric 2: Complaint Tag Rate (KEY REQUEST) */}
          <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block font-medium">
              누적 불만 접수율
            </span>
            <div className="flex items-center space-x-1.5 mt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xl font-black text-emerald-300">
                {reputation.complaintRatePercent}%
              </span>
              <span className="text-[11px] text-slate-300">({reputation.totalComplaintsCount}건)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
              98.9% 무결점 완공 (조치율 100%)
            </span>
          </div>

          {/* Metric 3: Repeat Recommendation */}
          <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block font-medium">
              이웃 재추천 의향
            </span>
            <div className="flex items-center space-x-1.5 mt-1">
              <ThumbsUp className="w-4 h-4 text-teal-400" />
              <span className="text-xl font-black text-white">
                {reputation.repeatRecommendationRate}%
              </span>
            </div>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              "지인에게 추천하겠다" 응답
            </span>
          </div>

          {/* Metric 4: Post-construction Defect Rate */}
          <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block font-medium">
              시공 1년차 하자율
            </span>
            <div className="flex items-center space-x-1.5 mt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xl font-black text-white">
                {reputation.postConstructionDefectRate}%
              </span>
              <span className="text-[11px] text-emerald-400 font-bold">클린</span>
            </div>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              SGI 하자보증증권 100% 발행
            </span>
          </div>
        </div>
      </div>

      {/* 3. Detailed Body (Collapsible) */}
      {isExpanded && (
        <div className="p-5 sm:p-7 space-y-6">
          {/* Navigation Segmented Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl max-w-md">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
                activeTab === "summary"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              항목별 별점 세부평가
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("complaints")}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1 ${
                activeTab === "complaints"
                  ? "bg-white text-rose-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>불만 태그 비율 분석</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 font-extrabold">
                {reputation.complaintRatePercent}%
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
                activeTab === "reviews"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              실검증 세대 리뷰 ({reputation.recentReviews.length})
            </button>
          </div>

          {/* TAB 1: DETAILED CATEGORY RATINGS */}
          {activeTab === "summary" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-black text-slate-900 flex items-center space-x-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>6대 시공 품질 및 서비스 항목별 실측 평점</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    실제 에스크로 정산이 완료된 세대만 작성 가능한 공인 블라인드 평가 점수입니다.
                  </p>
                </div>
                <div className="text-xs text-slate-600 font-semibold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
                  종합 평점: <strong className="text-emerald-700 font-black">{reputation.overallRating} / 5.0</strong>
                </div>
              </div>

              {/* Progress Bar Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {reputation.categoryRatings.map((cat, idx) => {
                  const percent = Math.round((cat.score / 5.0) * 100);
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{cat.category}</span>
                        <div className="flex items-center space-x-1 font-mono">
                          <span className="font-black text-slate-900">{cat.score.toFixed(1)}</span>
                          <span className="text-slate-400 text-[10px]">/ 5.0</span>
                        </div>
                      </div>

                      {/* Bar */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{cat.weightLabel}</span>
                        <span className="text-emerald-700 font-semibold">상위 1% 수준</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quality Safeguard Notice */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5 leading-relaxed">
                  <div className="font-black">국토교통부 표준 그린리모델링 품질 검증 기준 충족</div>
                  <p className="text-[11px] text-emerald-800">
                    창호 26mm 로이유리 아르곤 주입 정품 바코드 전수 검사, 우레탄폼 밀실 충진, 초내후성 변성실리콘 마감 규격을 100% 준수하는 업체입니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPLAINT TAG PERCENTAGE (CORE HIGHLIGHT) */}
          {activeTab === "complaints" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-black text-slate-900 flex items-center space-x-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>불만 태그별 실시간 발생 비율 & 사후 해결 지표</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    건축주들이 가장 불안해하는 7대 시공 불만 항목의 누적 발생 건수와 비율을 투명하게 공개합니다.
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    불만 해결율 100%
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200">
                    평균 조치 {reputation.averageResolutionHours}시간 이내
                  </span>
                </div>
              </div>

              {/* 7 Complaint Tags Table / Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {reputation.complaintTags.map((tag, idx) => {
                  const isZero = tag.count === 0;
                  const isSelected = selectedTagIndex === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedTagIndex(isSelected ? null : idx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isZero
                          ? "bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300"
                          : "bg-amber-50/40 border-amber-200 hover:border-amber-300"
                      } ${isSelected ? "ring-2 ring-emerald-500" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black text-slate-900">
                          {tag.tag}
                        </span>
                        {isZero ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center space-x-0.5">
                            <Check className="w-2.5 h-2.5" />
                            <span>0건 (청정)</span>
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                            {tag.count}건 ({tag.ratePercent}%)
                          </span>
                        )}
                      </div>

                      {/* Percentage Bar */}
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden my-1.5">
                        <div
                          className={`h-full rounded-full ${
                            isZero ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${Math.max(tag.ratePercent * 15, isZero ? 0 : 8)}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-slate-600 leading-snug">
                        {tag.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Zero-Tolerance Pledge Box */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-black text-emerald-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>그린토피아 3대 안심 불만 보장제 (에스크로 연동)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    소비자 보호 규정 준수
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300 text-[11px] pt-1 border-t border-slate-800">
                  <div>
                    <strong className="text-white block">1) 추가비용 원천 차단</strong>
                    사전 확정 견적 외 현장 추가금 요구 시 공사 중단 및 시공사 제재
                  </div>
                  <div>
                    <strong className="text-white block">2) 일정 지연 배상금</strong>
                    약정 공기 초과 시 지체상금(일 1/1000) 잔금 자동 공제
                  </div>
                  <div>
                    <strong className="text-white block">3) 마감 불량 24시간 재시공</strong>
                    코킹·창호 불량 접수 시 24시간 이내 현장 전담기사 출동
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RECENT VERIFIED REVIEWS */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900 flex items-center space-x-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>실제 시공 완료 세대 검증 후기</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    공사 대금 에스크로 정산 및 준공 사진 검측을 마친 실제 이웃의 솔직한 평가입니다.
                  </p>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  최근 3건 표시
                </span>
              </div>

              <div className="space-y-3">
                {reputation.recentReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{rev.author}</span>
                        <span className="text-[11px] text-slate-500">{rev.buildingType}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center space-x-0.5">
                          <Check className="w-2.5 h-2.5" />
                          <span>에스크로 완료 인증</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="flex items-center space-x-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{rev.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-slate-400 text-[11px]">·</span>
                        <span className="text-slate-500 text-[11px]">{rev.period}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      "{rev.comment}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-600 font-medium">
                        시공 공종: <strong className="text-slate-900">{rev.workSummary}</strong>
                      </span>

                      {/* Follow-up Defect Check */}
                      {rev.followUpCheck && (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{rev.followUpCheck}</span>
                        </span>
                      )}
                    </div>

                    {/* Complaint resolution notice if any */}
                    {rev.complaintReported && rev.resolutionNote && (
                      <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>[{rev.complaintTag}]</strong> {rev.resolutionNote}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
