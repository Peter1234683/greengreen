import React, { useState } from "react";
import {
  Star,
  ShieldCheck,
  AlertTriangle,
  Award,
  CheckCircle2,
  Filter,
  MessageSquare,
  ThumbsUp,
  UserCheck,
  Calendar,
  Building2,
  HardHat,
  PhoneCall,
  Clock,
  Sparkles,
  Send,
  HelpCircle,
  ChevronRight,
  Info,
} from "lucide-react";
import { ContractorBid, ContractorReview, ContractorTrustProfile } from "../types";
import {
  INITIAL_CONTRACTOR_REVIEWS,
  DEFAULT_CONTRACTOR_TRUST_PROFILES,
  analyzeReviewAnomalies,
  detectReviewOutlier,
} from "../data/trustSafeguardData";

interface ContractorReputationReviewsProps {
  bid: ContractorBid;
}

export const ContractorReputationReviews: React.FC<ContractorReputationReviewsProps> = ({
  bid,
}) => {
  // Reviews state
  const [reviews, setReviews] = useState<ContractorReview[]>(INITIAL_CONTRACTOR_REVIEWS);

  // Review Filter state
  const [activeFilter, setActiveFilter] = useState<"ALL" | "VERIFIED" | "OUTLIER">("ALL");

  // New Review Form state
  const [ratingOverall, setRatingOverall] = useState<number>(5);
  const [ratingQuality, setRatingQuality] = useState<number>(5);
  const [ratingSchedule, setRatingSchedule] = useState<number>(5);
  const [ratingKindness, setRatingKindness] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [householdName, setHouseholdName] = useState<string>("본인 세대 (마포구 연남동 101호)");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // Profile modal or tab state
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Contractor Profile
  const trustProfile: ContractorTrustProfile =
    DEFAULT_CONTRACTOR_TRUST_PROFILES[bid.contractorName] || {
      contractorName: bid.contractorName,
      representativeName: "김정호",
      businessNumber: "105-86-49201",
      licenseNumber: "서울 마포 제2018-01-094호",
      licenseName: "금속구조물·창호·온돌공사업 (전문건설업)",
      establishedYear: 2012,
      reputationScore: 4.88,
      totalReviews: 142,
      accidentFreeProjects: 342,
      warrantyFulfillmentRate: 100,
      insuranceCoverage: "DB손해보험 영업배상책임보험 5억원 가입",
      completedClusters: 28,
      officeLocation: "서울특별시 마포구 월드컵북로 120, 3층",
      highlights: [
        "국토교통부 그린리모델링 우수사업자 3년 연속 선정",
        "창호 시공 12년 무사고 연속 342건 달성",
        "SGI서울보증 하자이행보증증권 100% 의무 발행",
      ],
    };

  // Run anomaly detection metrics on current reviews
  const anomalyStats = analyzeReviewAnomalies(reviews);

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === "VERIFIED") return r.isVerified && !r.isOutlier;
    if (activeFilter === "OUTLIER") return r.isOutlier;
    return true;
  });

  // Handle Form Submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setIsSubmitting(true);

    const checkOutlier = detectReviewOutlier(
      {
        ratingOverall,
        ratingQuality,
        ratingSchedule,
        ratingKindness,
        comment: reviewComment,
        isVerified: true,
      },
      reviews
    );

    const newReview: ContractorReview = {
      id: `rev-${Date.now()}`,
      householdName: householdName || "참여 세대",
      clusterTitle: "연남동 다가구 5세대 로이창호 공동구매",
      ratingOverall,
      ratingQuality,
      ratingSchedule,
      ratingKindness,
      comment: reviewComment,
      createdAt: new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      isVerified: true,
      isOutlier: checkOutlier.isOutlier,
      outlierReason: checkOutlier.reason,
      workType: "26mm 로이 시스템 이중창",
    };

    setTimeout(() => {
      setReviews([newReview, ...reviews]);
      setReviewComment("");
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    }, 400);
  };

  return (
    <div className="space-y-7">
      {/* 1. CONTRACTOR TRUST PROFILE HEADER CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-950 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                낙찰 시공사 공식 평판 인증
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {trustProfile.licenseName}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-white flex items-center space-x-2">
                <span>{trustProfile.contractorName}</span>
                <span className="text-xs font-normal text-slate-400">
                  (대표: {trustProfile.representativeName})
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                면허등록: {trustProfile.licenseNumber} · 사업자등록: {trustProfile.businessNumber}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {trustProfile.highlights.map((h, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-emerald-300 border border-slate-700/80 font-medium flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{h}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Key Metrics: Cumulative Reputation & Accident-Free Projects */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            {/* Metric 1: Cumulative Reputation */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/80 text-center min-w-[130px] shadow-xs">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                누적 평판 점수
              </span>
              <div className="flex items-center justify-center space-x-1 my-1">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-2xl font-black text-white">
                  {trustProfile.reputationScore}
                </span>
                <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">
                총 {trustProfile.totalReviews}세대 평가
              </span>
            </div>

            {/* Metric 2: Accident-Free Count */}
            <div className="bg-slate-850 p-4 rounded-xl border border-emerald-500/40 text-center min-w-[130px] shadow-xs">
              <span className="text-[10px] text-emerald-400 block font-bold uppercase tracking-wider">
                무사고 시공 건수
              </span>
              <div className="flex items-center justify-center space-x-1 my-1">
                <HardHat className="w-5 h-5 text-emerald-400" />
                <span className="text-2xl font-black text-emerald-300">
                  {trustProfile.accidentFreeProjects}건
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-medium">
                12년 무재해 연속
              </span>
            </div>

            {/* Action: Profile Detail Modal */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-full sm:w-auto px-4 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-600 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>업체 상세 프로필</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. REPUTATION REVIEW SECTION: WRITE & CROSS-VERIFY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 col): Review Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>참여 세대 시공 평가 남기기</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              에스크로 완료 후 실제 시공 품질을 별점과 항목별로 솔직하게 기록합니다.
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Household Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                참여 세대 구분
              </label>
              <input
                type="text"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 bg-slate-50"
              />
            </div>

            {/* 1. Overall Rating */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                종합 만족도 별점 ({ratingOverall}점)
              </label>
              <div className="flex items-center space-x-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingOverall(star)}
                    className="p-1 rounded hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= ratingOverall
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Detailed Categories */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">
                항목별 세부 평가 (1~5점)
              </span>

              {/* Quality */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>1) 시공 품질 (기밀·단열·실리콘)</span>
                  <span className="font-bold text-emerald-700">{ratingQuality}점</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={ratingQuality}
                  onChange={(e) => setRatingQuality(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Schedule */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>2) 일정 준수 (약정 당일 완료)</span>
                  <span className="font-bold text-emerald-700">{ratingSchedule}점</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={ratingSchedule}
                  onChange={(e) => setRatingSchedule(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Kindness */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>3) 친절도 및 소통</span>
                  <span className="font-bold text-emerald-700">{ratingKindness}점</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={ratingKindness}
                  onChange={(e) => setRatingKindness(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Review Comment */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                상세 시공 후기 및 소감
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="시공 후 실내 단열감, 결로 차단 효과, 소음 차단 등에 대한 솔직한 후기를 남겨주세요."
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !reviewComment.trim()}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "검증 및 등록 중..." : "시공 평가 및 리뷰 등록"}</span>
            </button>

            {showSuccessToast && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center space-x-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>평가가 성공적으로 등록되었습니다!</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Column (2 cols): Reviews Feed & Outlier Detection */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          {/* Header & Outlier Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-slate-900">
                  클러스터 참여 세대 상호 리뷰 피드
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                  총 {reviews.length}건
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                동일 클러스터 평균 평점(<strong>{anomalyStats.clusterAverage}점</strong>) 대비 비정상적 극단치를 자동 플래그합니다.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveFilter("ALL")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === "ALL"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                전체 ({reviews.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("VERIFIED")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === "VERIFIED"
                    ? "bg-white text-emerald-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                검증 완료 ({reviews.filter((r) => r.isVerified && !r.isOutlier).length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("OUTLIER")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  activeFilter === "OUTLIER"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-rose-600 hover:bg-rose-50"
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>이상치 플래그 ({anomalyStats.outlierCount})</span>
              </button>
            </div>
          </div>

          {/* Anomaly Detection Logic Info Box */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>클러스터 교차 검증 이상치(Outlier) 자동 감지 알고리즘 작동 중</span>
            </div>
            <p className="text-[11px] text-amber-800 pl-5.5 leading-relaxed">
              같은 묶음 세대 평균 점수({anomalyStats.clusterAverage}점)와 통계적 표준편차 1.8점 이상 극단치 편차를 보이거나 악의적 허위 평가는 시스템이 자동 플래그하여 일반 세대의 왜곡 인식을 방지합니다.
            </p>
          </div>

          {/* Reviews List */}
          <div className="space-y-3.5">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                해당 필터에 속한 리뷰가 없습니다.
              </div>
            ) : (
              filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className={`p-4 rounded-xl border transition-all ${
                    rev.isOutlier
                      ? "bg-rose-50/60 border-rose-300 ring-1 ring-rose-400/30"
                      : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">
                        {rev.householdName}
                      </span>
                      {rev.isVerified ? (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center space-x-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>에스크로 시공 인증</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold">
                          미검증
                        </span>
                      )}

                      {/* OUTLIER FLAG BADGE */}
                      {rev.isOutlier && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-600 text-white font-black flex items-center space-x-1 animate-pulse">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>이상치 감지: 교차 검증 필요</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <span>{rev.workType}</span>
                      <span>{rev.createdAt}</span>
                    </div>
                  </div>

                  {/* Rating Stars & Sub Ratings */}
                  <div className="flex flex-wrap items-center gap-3 my-2 text-xs">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.ratingOverall
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                      <span className="font-bold text-slate-900 ml-1">
                        {rev.ratingOverall}.0
                      </span>
                    </div>

                    <div className="h-3 w-[1px] bg-slate-200" />

                    <div className="flex items-center space-x-2 text-[11px] text-slate-600">
                      <span>시공 품질: <strong className="text-slate-800">{rev.ratingQuality}점</strong></span>
                      <span>일정 준수: <strong className="text-slate-800">{rev.ratingSchedule}점</strong></span>
                      <span>친절도: <strong className="text-slate-800">{rev.ratingKindness}점</strong></span>
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-xs text-slate-700 leading-relaxed mt-2">
                    {rev.comment}
                  </p>

                  {/* Outlier Rationale Banner */}
                  {rev.isOutlier && rev.outlierReason && (
                    <div className="mt-2.5 p-2 rounded-lg bg-rose-100/80 border border-rose-300 text-[11px] text-rose-900 flex items-start space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>시스템 이상치 판정 사유:</strong> {rev.outlierReason}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. CONTRACTOR DETAILED PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">
                  {trustProfile.contractorName} 공식 시공사 프로필
                </h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-1 rounded"
              >
                닫기 ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 block">설립 연도</span>
                  <strong className="text-slate-900">{trustProfile.establishedYear}년 (14년 업력)</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">대표자 성명</span>
                  <strong className="text-slate-900">{trustProfile.representativeName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">전문건설업 면허</span>
                  <strong className="text-slate-900">{trustProfile.licenseNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">사업자등록번호</span>
                  <strong className="text-slate-900">{trustProfile.businessNumber}</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="font-bold text-emerald-900 block">
                  🛡️ 공식 신뢰 및 보증 지표
                </span>
                <div className="grid grid-cols-2 gap-2 text-emerald-950">
                  <div>
                    <span>무사고 시공 실적:</span>{" "}
                    <strong>{trustProfile.accidentFreeProjects}건 연속</strong>
                  </div>
                  <div>
                    <span>하자보수 이행률:</span>{" "}
                    <strong>{trustProfile.warrantyFulfillmentRate}%</strong>
                  </div>
                  <div className="col-span-2">
                    <span>영업배상 책임보험:</span>{" "}
                    <strong>{trustProfile.insuranceCoverage}</strong>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">소재지 주소</span>
                <p className="text-slate-800">{trustProfile.officeLocation}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
