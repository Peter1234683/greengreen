import React, { useState } from "react";
import {
  Gavel,
  Star,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Users,
  ShieldCheck,
  Building,
  TrendingDown,
  Vote,
  Sparkles,
  Share2,
  FileText,
  Clock,
  Check,
  Flame,
  AlertCircle,
} from "lucide-react";
import {
  BuildingLedgerData,
  ContractorBid,
  MatchingEngineResult,
  OptimizedCluster,
} from "../types";
import { DemandKakaoMap } from "./DemandKakaoMap";
import { InviteNeighborsModal } from "./InviteNeighborsModal";
import { GreenPartnerReputationCard } from "./GreenPartnerReputationCard";
import { CONTRACTOR_REPUTATION_DATABASE } from "../data/contractorReputationData";

interface Step4AuctionProps {
  building: BuildingLedgerData;
  cluster: OptimizedCluster | null;
  matchingResult: MatchingEngineResult | null;
  onPrev: () => void;
  onNext: (selectedBid: ContractorBid) => void;
}

interface BidWithVotes extends ContractorBid {
  votes: number;
  voters: string[];
  isLowestPrice?: boolean;
  isHighestRating?: boolean;
  isRecommended?: boolean;
}

export const Step4Auction: React.FC<Step4AuctionProps> = ({
  building,
  cluster,
  matchingResult,
  onPrev,
  onNext,
}) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<
    "recommended" | "lowestPrice" | "highestRating" | "warranty"
  >("recommended");

  const householdCount = cluster?.householdCount || 5;
  const standardPrice = cluster?.costBreakdown.standardBaselinePricePerHousehold || 1000;

  // Initial Mock Contractor Bids with Resident Votes
  const [bidsData, setBidsData] = useState<BidWithVotes[]>([
    {
      id: "bid-1",
      contractorName: "(주)에코하임 그린건설",
      establishedYear: 2014,
      completedProjects: 412,
      rating: 4.9,
      bidPrice: 820,
      standardPrice: standardPrice,
      discountRate: 18,
      warrantyPeriodYears: 5,
      specHighlights: [
        "국토교통부 그린리모델링 우수사업자 연속 3년 선정",
        "LX하우시스 슈퍼세이브7 로이 26mm 아르곤 정품 사용",
        "자체 하자보수 보증증권(SGI서울보증) 100% 발행",
      ],
      votes: 2,
      voters: ["김*수 (성미산로)", "이*진 (동교로)"],
      isRecommended: true,
      isHighestRating: true,
    },
    {
      id: "bid-2",
      contractorName: "한빛 에너지시스템",
      establishedYear: 2017,
      completedProjects: 285,
      rating: 4.7,
      bidPrice: 790,
      standardPrice: standardPrice,
      discountRate: 21,
      warrantyPeriodYears: 3,
      specHighlights: [
        "최저가 경쟁력 (세대당 790만원 단독 입찰)",
        "KCC 글라스 프라임 로이 이중창 정품 시공",
        "공동 시공팀 직접 투입으로 1일 철거·당일 시공 완료",
      ],
      votes: 1,
      voters: ["박*호 (월드컵북로)"],
      isLowestPrice: true,
    },
    {
      id: "bid-3",
      contractorName: "(주)그린텍 엔지니어링",
      establishedYear: 2012,
      completedProjects: 530,
      rating: 4.8,
      bidPrice: 840,
      standardPrice: standardPrice,
      discountRate: 16,
      warrantyPeriodYears: 4,
      specHighlights: [
        "KCC / 현대L&C 공식 인증 시공 파트너",
        "열화상 카메라 준공 전/후 정밀 기밀도 측정 리포트 제공",
        "정부 민간이자지원사업 행정 서류 원스톱 대행",
      ],
      votes: 1,
      voters: ["정*원 (연남로)"],
    },
    {
      id: "bid-4",
      contractorName: "공간패시브건축",
      establishedYear: 2016,
      completedProjects: 198,
      rating: 4.9,
      bidPrice: 860,
      standardPrice: standardPrice,
      discountRate: 14,
      warrantyPeriodYears: 5,
      specHighlights: [
        "독일 패시브하우스 기밀 테이프 및 3중 기밀 시공 원칙",
        "외벽 열교 방지 단열재 일체형 마감 전문",
        "5년 무상 A/S 및 연 1회 방문 무상 점검 서비스",
      ],
      votes: 0,
      voters: [],
      isHighestRating: true,
    },
  ]);

  // User's active vote
  const [userVotedBidId, setUserVotedBidId] = useState<string>("bid-1");
  const [selectedBidId, setSelectedBidId] = useState<string>("bid-1");

  // Handle resident voting
  const handleVote = (bidId: string) => {
    setUserVotedBidId(bidId);
    setSelectedBidId(bidId);

    setBidsData((prev) =>
      prev.map((b) => {
        const wasVotedByUser = b.voters.includes("나 (내 주택)");
        const isNowVoted = b.id === bidId;

        let newVoters = b.voters.filter((v) => v !== "나 (내 주택)");
        if (isNowVoted) {
          newVoters.push("나 (내 주택)");
        }

        return {
          ...b,
          votes: newVoters.length,
          voters: newVoters,
        };
      })
    );
  };

  // Sort bids based on selected filter
  const sortedBids = [...bidsData].sort((a, b) => {
    if (filterMode === "lowestPrice") return a.bidPrice - b.bidPrice;
    if (filterMode === "highestRating") return b.rating - a.rating;
    if (filterMode === "warranty") return b.warrantyPeriodYears - a.warrantyPeriodYears;
    // recommended: votes desc, rating desc
    return b.votes - a.votes || b.rating - a.rating;
  });

  const selectedBid = bidsData.find((b) => b.id === selectedBidId) || bidsData[0];
  const totalVotesCast = bidsData.reduce((acc, cur) => acc + cur.votes, 0);
  const leadingBid = [...bidsData].sort((a, b) => b.votes - a.votes)[0];
  const isMajorityAchieved = leadingBid.votes >= Math.ceil(householdCount / 2);

  const totalProcurementAmount = selectedBid.bidPrice * householdCount;
  const standardTotalAmount = standardPrice * householdCount;
  const totalSavings = standardTotalAmount - totalProcurementAmount;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner with Gamification Milestone */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <Gavel className="w-3.5 h-3.5 text-amber-600" />
            <span>Step 4. 우리 동네 수요 지도 & 패키지 역경매</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>5세대 골드 패키지 달성 (최저가 발주권 획득)</span>
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          우리 동네 5세대가 모여 시공사 역경매가 성사되었습니다
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
          카카오 지도 기반으로 시공간이 일치하는 이웃 수요 5세대가 자동 연결되었습니다.
          발행된 통합 패키지 공고에 4개 공인 시공사가 실시간 입찰하였으며,
          <strong> 주민 공동 투표로 최종 낙찰 업체를 확정</strong>할 수 있습니다.
        </p>

        {/* Gamification Progress Bar */}
        <div className="mt-5 p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300">
                동네 공동구매 티어: LEVEL 2 (골드 패키지)
              </div>
              <div className="text-sm font-black">
                현재 5세대 확정 · 3세대 추가 참여 시 전 세대 15% 추가 인하 확정!
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="px-4 py-2.5 bg-yellow-300 hover:bg-yellow-200 text-slate-950 font-black rounded-xl text-xs transition-colors flex items-center space-x-1.5 shadow-md"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>이웃 초대하고 추가 할인받기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Demand Kakao Map Component (Interactive Neighborhood Visualizer) */}
      <DemandKakaoMap
        cluster={cluster}
        userAddress={building.address}
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
      />

      {/* 2. Automatically Generated Package Notice Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-700">시스템 자동 생성 공고</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  #GC-2026-MAPO-0418
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900">
                {cluster?.name || "마포구 연남·성산 1등급 창호 교체 5세대 공동구매 통합 발주 공고"}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-bold border border-emerald-200">
              최소 성사 물량 달성 (5/3세대) ✓
            </span>
            <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full font-bold border border-amber-200">
              입찰 마감 · 주민 투표 중
            </span>
          </div>
        </div>

        {/* Tender Specification Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-400 block font-medium">공사항목 및 자재 규격</span>
            <span className="text-xs font-bold text-slate-900 block mt-1">
              {cluster?.materialSpec || "26mm 로이복층 PVC 이중창 (1등급)"}
            </span>
            <span className="text-[10px] text-emerald-600 block mt-0.5 font-semibold">
              아르곤 가스 주입 단열 간봉
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-400 block font-medium">참여 세대 및 물량</span>
            <span className="text-xs font-bold text-slate-900 block mt-1">
              총 {householdCount}세대 (창호 38세트)
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              총 연면적 980㎡ 동시 발주
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-400 block font-medium">희망 시공 시기</span>
            <span className="text-xs font-bold text-slate-900 block mt-1">
              2026년 4월 ~ 5월
            </span>
            <span className="text-[10px] text-emerald-600 block mt-0.5 font-semibold">
              공동 사다리차 연속 배차
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-400 block font-medium">시방 기준 & 보증 요건</span>
            <span className="text-xs font-bold text-slate-900 block mt-1">
              국토교통부 표준 시방서
            </span>
            <span className="text-[10px] text-emerald-600 block mt-0.5 font-semibold">
              SGI 하자보증증권 100% 필수
            </span>
          </div>
        </div>

        {/* Resident Voting Status Banner */}
        <div className="mt-5 p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs">
            <Vote className="w-4 h-4 text-emerald-700" />
            <span className="font-bold text-emerald-950">
              공동구매 주민 실시간 투표 현황:
            </span>
            <span className="font-mono text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
              총 5세대 중 {totalVotesCast}세대 투표 완료
            </span>
          </div>

          <div className="text-xs text-emerald-800">
            {isMajorityAchieved ? (
              <span className="font-black text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  과반수({leadingBid.votes}표) 달성으로 <strong>{leadingBid.contractorName}</strong> 낙찰 유력!
                </span>
              </span>
            ) : (
              <span>내 1표를 행사하여 최종 낙찰 업체를 확정해주세요.</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Contractor Bids & Voting Section */}
      <div className="space-y-4">
        {/* Controls and Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
              <span>시공업체 역경매 입찰 비교 및 주민 투표</span>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                4개사 응찰
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              최저가 또는 품질·보증 기준을 비교하고, 마음에 드는 업체에 <strong>"투표하기"</strong>를 눌러주세요.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => setFilterMode("recommended")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterMode === "recommended"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              추천순 (종합 1위)
            </button>
            <button
              onClick={() => setFilterMode("lowestPrice")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterMode === "lowestPrice"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              최저가순
            </button>
            <button
              onClick={() => setFilterMode("highestRating")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterMode === "highestRating"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              최고 평점순
            </button>
            <button
              onClick={() => setFilterMode("warranty")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterMode === "warranty"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              최장 하자보증순
            </button>
          </div>
        </div>

        {/* Bids Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedBids.map((bid) => {
            const isSelected = selectedBidId === bid.id;
            const isUserVoted = userVotedBidId === bid.id;
            const bidTotal = bid.bidPrice * householdCount;
            const votePercent = Math.round((bid.votes / householdCount) * 100);
            const repProfile = CONTRACTOR_REPUTATION_DATABASE[bid.id];

            return (
              <div
                key={bid.id}
                onClick={() => setSelectedBidId(bid.id)}
                className={`step-4-auction-bid-card rounded-3xl border p-6 sm:p-7 transition-all cursor-pointer flex flex-col justify-between relative ${
                  isSelected
                    ? "bg-emerald-50/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div>
                  {/* Visually Prominent Green Partner Badge */}
                  {repProfile && (
                    <div className="mb-3.5 flex items-center justify-between">
                      {repProfile.partnerTier === "MASTER" ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-slate-950 font-black text-xs shadow-sm border border-emerald-300/80 ring-2 ring-emerald-400/25">
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-700 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-900"></span>
                          </span>
                          <Sparkles className="w-3.5 h-3.5 text-emerald-950 fill-emerald-800 shrink-0" />
                          <span>그린파트너 최우수 마스터</span>
                          <span className="text-[10px] bg-slate-950/10 px-1.5 py-0.5 rounded font-bold">
                            공식인증
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-amber-950 font-black text-xs shadow-sm border border-amber-300/80 ring-2 ring-amber-400/25">
                          <Award className="w-3.5 h-3.5 text-amber-900 fill-amber-700 shrink-0" />
                          <span>그린파트너 골드</span>
                          <span className="text-[10px] bg-amber-950/10 px-1.5 py-0.5 rounded font-bold">
                            공식인증
                          </span>
                        </div>
                      )}

                      <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/80">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{bid.rating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({repProfile.totalReviewedHouseholds}세대)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Contractor Name & Extra Tags */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-black text-base sm:text-lg text-slate-900">
                        {bid.contractorName}
                      </span>
                      {bid.isRecommended && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                          종합 1위 (품질·보증)
                        </span>
                      )}
                      {bid.isLowestPrice && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-200">
                          최저가 단독 입찰
                        </span>
                      )}
                    </div>
                    {!repProfile && (
                      <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{bid.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Green Partner Metrics & Complaint Rate */}
                  {repProfile && (
                    <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200">
                        불만 접수율 <strong className="text-slate-900">{repProfile.complaintRatePercent}%</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        A/S 하자율 0% (안심 보증)
                      </span>
                    </div>
                  )}

                  {/* Price Box */}
                  <div className="flex items-baseline space-x-2 mb-1">
                    <span className="text-3xl font-black text-slate-900">
                      {bid.bidPrice.toLocaleString()}만원
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {bid.standardPrice.toLocaleString()}만원
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      -{bid.discountRate}% 인하
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-4">
                    {householdCount}세대 총 도급 금액:{" "}
                    <strong className="text-slate-800 font-semibold">{bidTotal.toLocaleString()}만원</strong>
                    {" "}(개별 시공 대비 세대당{" "}
                    <strong className="text-emerald-700">
                      {(bid.standardPrice - bid.bidPrice).toLocaleString()}만원 절감
                    </strong>
                    )
                  </div>

                  {/* Contractor Experience & Warranty */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl mb-4 border border-slate-200/80">
                    <div>
                      <span className="text-slate-400 block text-[11px]">업력 / 시공 실적</span>
                      <span className="font-semibold text-slate-700">
                        {2026 - bid.establishedYear}년차 · {bid.completedProjects}건 시공
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">A/S 무상 보증</span>
                      <span className="font-bold text-emerald-700">{bid.warrantyPeriodYears}년 보증</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 mb-5">
                    {bid.specHighlights.map((h, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Resident Voting Bar inside Card */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                        <Vote className="w-3.5 h-3.5 text-emerald-600" />
                        <span>주민 득표 현황</span>
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {bid.votes} / {householdCount}표 ({votePercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          bid.votes >= 3 ? "bg-emerald-600" : "bg-teal-500"
                        }`}
                        style={{ width: `${votePercent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {bid.voters.length > 0
                        ? `투표 참여: ${bid.voters.join(", ")}`
                        : "아직 투표한 세대가 없습니다."}
                    </div>
                  </div>
                </div>

                {/* Vote Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(bid.id);
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                      isUserVoted
                        ? "bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-300"
                        : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                    }`}
                  >
                    <Vote className="w-3.5 h-3.5" />
                    <span>{isUserVoted ? "내 투표 완료 ✓" : "이 업체에 투표하기"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBidId(bid.id);
                    }}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isSelected
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected ? "평판 확인 중" : "평판 상세"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3.5. Green Partner Badge & Review-Based Detailed Reputation Component */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                낙찰 시공사 공식 검증
              </span>
              <h3 className="text-lg font-black text-slate-900">
                낙찰 업체의 '그린파트너' 등급 및 리뷰 기반 정밀 평판 리포트
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              국토교통부 표준 그린파트너 등급과 실제 에스크로 시공 세대의 6대 항목별 별점, 7대 불만 태그 비율(%)을 상세 분석합니다.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            현재 확인 중인 시공사: <strong className="text-slate-900 font-bold">{selectedBid.contractorName}</strong>
          </div>
        </div>

        <GreenPartnerReputationCard
          bidId={selectedBid.id}
          contractorName={selectedBid.contractorName}
          isWinningBid={isMajorityAchieved || selectedBid.id === leadingBid.id}
        />
      </div>

      {/* 4. Selected Contractor / Award Finalization Box */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 rounded-full flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {isMajorityAchieved
                  ? `주민 과반수(${leadingBid.votes}표) 찬성으로 낙찰 확정!`
                  : "선정된 우선협상 시공사"}
              </span>
            </span>
            <span className="text-xs text-slate-400">
              5세대 통합 도급 규모: <strong>{totalProcurementAmount.toLocaleString()}만원</strong>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            {selectedBid.contractorName}{" "}
            <span className="text-emerald-400 font-bold text-lg">
              (세대당 {selectedBid.bidPrice}만원 · {selectedBid.warrantyPeriodYears}년 무상 A/S)
            </span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            국토교통부 표준 그린리모델링 도급계약서가 즉시 자동 생성되며,
            <strong> 4단계 안전 에스크로(착공 30% · 창호 입고 40% · 준공 25% · A/S 유보금 5%)</strong> 체계로
            공사대금이 안전하게 보호됩니다.
          </p>
        </div>

        <button
          onClick={() => onNext(selectedBid)}
          className="w-full lg:w-auto px-7 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center space-x-2 shrink-0 group"
        >
          <span>Step 5. 계약서 검토 및 에스크로 체결</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Prev Navigation */}
      <div className="flex justify-start">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Step 3. AI 매칭 엔진으로 돌아가기</span>
        </button>
      </div>

      {/* 5. Invite Neighbors Viral Modal */}
      <InviteNeighborsModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        cluster={cluster}
        currentHouseholds={householdCount}
        neededForNextDiscount={3}
        nextDiscountPercent={15}
        nextDiscountAmountWon={38}
      />
    </div>
  );
};
