import React, { useState } from "react";
import {
  ShieldCheck,
  FileCheck2,
  Sparkles,
  Users,
  Award,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Star,
  HardHat,
  Clock,
  Layers,
  HelpCircle,
} from "lucide-react";
import { BuildingLedgerData, ContractorBid } from "../types";
import { ContractSummaryEscrow } from "./ContractSummaryEscrow";
import { AiCompletionInspection } from "./AiCompletionInspection";
import { ContractorReputationReviews } from "./ContractorReputationReviews";

interface Step6TrustContractProps {
  building: BuildingLedgerData;
  bid: ContractorBid;
  beforeImage?: string | null;
  onPrev: () => void;
  onNext?: () => void;
}

export const Step6TrustContract: React.FC<Step6TrustContractProps> = ({
  building,
  bid,
  beforeImage,
  onPrev,
  onNext,
}) => {
  // Navigation tabs within Step 6
  const [activeTab, setActiveTab] = useState<"ALL" | "ESCROW" | "INSPECTION" | "REPUTATION">("ALL");

  const totalAmount = bid.bidPrice * 10000;
  const retentionAmount = Math.round(totalAmount * 0.05);

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-16">
      {/* Top Breadcrumb & Title */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
              6
            </span>
            <span>Step 6. 계약 및 신뢰 장치</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-medium">
              표준계약 · 3단계 에스크로 · AI 준공 체크리스트 · 평판 검증
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>그린 캠프 신뢰 안전망 100% 가동</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              안전 계약 & 에스크로 및 AI 준공 승인
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              낙찰 업체와의 표준 도급 계약(지체상금·하자보수 5년), 3단계 에스크로 분할 지급, Gemini 비전 AI 체크리스트 준공 승인 및 이웃 세대 교차 검증으로 공사비 떼임과 날림 시공을 완벽 차단합니다.
            </p>
          </div>

          {/* Quick summary mini badge */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-left text-xs">
              <span className="text-slate-400 block font-medium">총 계약금액 (에스크로 예치)</span>
              <strong className="text-slate-900 font-black text-sm">
                {totalAmount.toLocaleString()}원
              </strong>
              <span className="text-[10px] text-amber-700 block font-bold">
                (A/S 유보금 {retentionAmount.toLocaleString()}원 3개월 보류)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
            activeTab === "ALL"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>전체 통합 뷰</span>
        </button>
        <button
          onClick={() => setActiveTab("ESCROW")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
            activeTab === "ESCROW"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>1. 표준 계약 및 3단계 에스크로</span>
        </button>
        <button
          onClick={() => setActiveTab("INSPECTION")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
            activeTab === "INSPECTION"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>2. AI 준공 체크리스트 & 교차 검증</span>
        </button>
        <button
          onClick={() => setActiveTab("REPUTATION")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
            activeTab === "REPUTATION"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>3. 시공사 평판 리뷰 & 이상치 검증</span>
        </button>
      </div>

      {/* Main Content Areas */}
      <div className="space-y-8">
        {/* Module 1: Standard Contract & Escrow */}
        {(activeTab === "ALL" || activeTab === "ESCROW") && (
          <section id="section-escrow" className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-black text-slate-800 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Section 1. 표준 계약 요약서 및 에스크로 3단계 분할 지급</span>
            </div>
            <ContractSummaryEscrow
              building={building}
              bid={bid}
            />
          </section>
        )}

        {/* Module 2: AI Completion Inspection & Checklist */}
        {(activeTab === "ALL" || activeTab === "INSPECTION") && (
          <section id="section-inspection" className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-black text-slate-800 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Section 2. AI 체크리스트 기반 준공 승인 및 이웃 세대 교차 검증</span>
            </div>
            <AiCompletionInspection
              building={building}
              bid={bid}
              beforeImage={beforeImage}
            />
          </section>
        )}

        {/* Module 3: Contractor Reputation & Outlier Reviews */}
        {(activeTab === "ALL" || activeTab === "REPUTATION") && (
          <section id="section-reputation" className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-black text-slate-800 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Section 3. 시공사 누적 평판·무사고 실적 & 세대간 리뷰 이상치 자동 검증</span>
            </div>
            <ContractorReputationReviews
              bid={bid}
            />
          </section>
        )}
      </div>

      {/* Bottom Sticky-friendly Navigation Actions */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrev}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전 단계 (Step 5. 시공사 역경매)</span>
        </button>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="hidden sm:block text-right text-[11px] text-slate-500">
            <span>그린리모델링 표준 프로세스 최종 완료</span>
          </div>
          {onNext ? (
            <button
              type="button"
              onClick={onNext}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <span>플랫폼 홈으로 돌아가기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onPrev}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>시공 및 에스크로 보호 완료</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step6TrustContract;
