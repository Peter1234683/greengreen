import React, { useState } from "react";
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  HelpCircle,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { BuildingLedgerData, ContractorBid } from "../types";

interface ContractSummaryEscrowProps {
  building: BuildingLedgerData;
  bid: ContractorBid;
  onOpenContractModal?: () => void;
  onApproveStage?: (stageNumber: number) => void;
}

export const ContractSummaryEscrow: React.FC<ContractSummaryEscrowProps> = ({
  building,
  bid,
  onOpenContractModal,
}) => {
  // Total calculated amounts
  const totalAmount = bid.bidPrice * 10000; // 원
  const discountSavedWon = (bid.standardPrice - bid.bidPrice) * 10000;

  // Escrow 3-Stage Split
  // 1단계: 착공금 30%
  // 2단계: 중도금 40%
  // 3단계: 준공금 30% (이 중 25% 즉시 지급, 5%는 A/S 유보금으로 90일 보류)
  const step1Deposit = Math.round(totalAmount * 0.3); // 30%
  const step2Interim = Math.round(totalAmount * 0.4); // 40%
  const step3FinalBase = Math.round(totalAmount * 0.3); // 30%
  const retentionPercent = 5; // 5% A/S 유보금
  const retentionAmount = Math.round(totalAmount * (retentionPercent / 100)); // 5%
  const step3DirectPayout = step3FinalBase - retentionAmount; // 25%

  // Delay penalty calculation (지체상금율: 1일당 0.1% = 1/1,000)
  const delayDailyPenalty = Math.round(totalAmount * 0.001);

  // Interactive escrow simulation states
  const [currentEscrowStage, setCurrentEscrowStage] = useState<number>(3); // 1: 착공, 2: 중도, 3: 준공 검측대기, 4: 준공완료(유보금보류)
  const [showFullContract, setShowFullContract] = useState<boolean>(false);
  const [delaySimulationDays, setDelaySimulationDays] = useState<number>(0);

  return (
    <div className="space-y-6">
      {/* 1. Contract Summary Cards */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-slate-900">
                  낙찰 시공사 도급 계약 요약서
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  국토교통부 표준 약관
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                역경매 1위 낙찰 업체 <strong>{bid.contractorName}</strong>와의 표준 계약 및 에스크로 보호 명세입니다.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowFullContract(!showFullContract)}
              className="text-xs font-bold text-slate-700 hover:text-emerald-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 bg-slate-50 hover:bg-emerald-50/50 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{showFullContract ? "계약서 닫기" : "표준 계약서 전문 보기"}</span>
              {showFullContract ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* 3 Key Terms Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Total Contract Amount */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>총 계약 금액 (세대 분담액)</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                  공동구매 {bid.discountRate}% 절감
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {totalAmount.toLocaleString()}원
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-through">
                개별 시공 정가: {(bid.standardPrice * 10000).toLocaleString()}원
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/80 text-[11px] text-emerald-700 font-bold flex items-center justify-between">
              <span>이웃 묶음 할인 절감액:</span>
              <span>- {discountSavedWon.toLocaleString()}원 절약</span>
            </div>
          </div>

          {/* Card 2: Delay Penalty Clause */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>지체상금 조항 (공기 지연 방지)</span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  제8조 명시
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-rose-600 tracking-tight">
                  1일당 0.1%
                </span>
                <span className="text-xs text-slate-600 font-semibold">
                  (1/1,000)
                </span>
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                약정 준공일 초과 시 <strong>1일당 {delayDailyPenalty.toLocaleString()}원</strong>씩 공사비에서 자동 공제
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">지연 일수 시뮬레이션:</span>
              <div className="flex items-center space-x-1">
                {[0, 3, 7].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDelaySimulationDays(days)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      delaySimulationDays === days
                        ? "bg-rose-600 text-white"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    {days === 0 ? "정상 준공" : `+${days}일`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Defect Warranty & Guarantee */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>하자보수 책임 기간 및 보증증권</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  제12조 명시
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-700 tracking-tight">
                {bid.warrantyPeriodYears}년 무상 보증
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                창호 프레임, 모헤어 기밀재, 누수 및 결로 전 항목 무상 수리
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>SGI 서울보증 하자이행보증증권 100% 교부</span>
            </div>
          </div>
        </div>

        {/* Dynamic Delay Simulation Alert */}
        {delaySimulationDays > 0 && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>지체상금 시뮬레이션:</strong> 공사 기간 {delaySimulationDays}일 초과 시, 총 대금에서{" "}
                <strong>{(delayDailyPenalty * delaySimulationDays).toLocaleString()}원</strong>이 차감 정산되어 건축주 에스크로 계좌로 즉시 환급됩니다.
              </span>
            </div>
            <button
              onClick={() => setDelaySimulationDays(0)}
              className="text-[11px] font-bold text-rose-700 underline underline-offset-2 shrink-0 ml-3"
            >
              초기화
            </button>
          </div>
        )}

        {/* Expandable Standard Contract Text */}
        {showFullContract && (
          <div className="p-5 rounded-xl bg-slate-900 text-slate-300 text-xs space-y-3 leading-relaxed border border-slate-800 animate-in fade-in">
            <div className="text-white font-bold text-sm border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>국토교통부 표준 그린리모델링 공사도급계약서 (약관 발췌)</span>
              <span className="text-[11px] text-slate-400 font-normal">문서번호: GC-2026-0428-MPO</span>
            </div>
            <p>
              <strong>제1조 (목적 및 당사자):</strong> 발주자(건축주 홍길동)와 수급인({bid.contractorName})은 마포구 연남동 공동구매 패키지 그린리모델링 공사에 관하여 신의성실의 원칙에 따라 본 계약을 체결한다.
            </p>
            <p>
              <strong>제2조 (에스크로 예치 및 조건부 지급):</strong> 총 도급금액({totalAmount.toLocaleString()}원)은 그린 캠프 안전 에스크로 전용계좌에 사전 예치하며, 수급인은 각 공정(착공 30% → 중도 40% → 준공 30%) 완료 검측 승인을 득한 경우에만 해당 차수의 공사대금을 수령한다.
            </p>
            <p>
              <strong>제3조 (자재 규격):</strong> 수급인은 계약서에 명시된 26mm 로이복층유리 1등급(KS L 2003 인증품) 및 초내후성 변성실리콘, 난연 단열폼을 정품 자재로 전량 시공하여야 한다.
            </p>
            <p>
              <strong>제4조 (지체상금):</strong> 수급인이 정당한 사유 없이 준공기한을 경과한 때에는 매 지체일수마다 총 계약금액의 1,000분의 1(0.1%)에 해당하는 지체상금을 납부하거나 잔여 공사대금에서 공제한다.
            </p>
            <p>
              <strong>제5조 (A/S 유보금 및 사후 관리):</strong> 준공 승인 시 총 대금의 5%({retentionAmount.toLocaleString()}원)는 A/S 유보금으로 준공 후 3개월간 에스크로에 동결 보류되며, 수급인의 하자보수 불이행 시 건축주는 본 유보금을 수리비용으로 우선 집행할 수 있다.
            </p>
          </div>
        )}
      </div>

      {/* 2. Escrow 3-Stage Progress Bar & Conditional Payout Safeguard */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-slate-900">
                  그린 캠프 에스크로 3단계 안전 분할 지급
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold border border-teal-300">
                  선금 떼임 0% 원천 차단
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                대금을 한 번에 시공사에 주지 않고, <strong>각 단계 완료 검측 승인 시에만 다음 대금이 지급</strong>됩니다.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-semibold">
              에스크로 총 예치금
            </span>
            <span className="text-lg font-black text-emerald-700">
              {totalAmount.toLocaleString()}원 안전 보관중
            </span>
          </div>
        </div>

        {/* 3-Step Milestone Interactive Progress Pipeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-7 left-[15%] right-[15%] h-1 bg-slate-200 -z-0">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{
                width:
                  currentEscrowStage === 1
                    ? "0%"
                    : currentEscrowStage === 2
                    ? "50%"
                    : "100%",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {/* Step 1: 착공 (30%) */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                currentEscrowStage >= 1
                  ? "bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    1단계: 착공금 (30%)
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                  ✓ 지급 완료
                </span>
              </div>

              <div className="text-2xl font-black text-slate-900 mb-1">
                {step1Deposit.toLocaleString()}원
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                정품 자재 현장 입고 사진 확인 및 기존 노후 알루미늄 샤시 철거 개시 확인 후 송금
              </p>

              <div className="pt-2.5 border-t border-emerald-200/80 text-[11px] text-emerald-800 font-semibold flex items-center justify-between">
                <span>지급 조건:</span>
                <span>자재 입고 바코드 검수 완료</span>
              </div>
            </div>

            {/* Step 2: 중도 (40%) */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                currentEscrowStage >= 2
                  ? "bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    2단계: 중도금 (40%)
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                  ✓ 검측 승인 완료
                </span>
              </div>

              <div className="text-2xl font-black text-slate-900 mb-1">
                {step2Interim.toLocaleString()}원
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                창틀 고정 골조 수평수직 점검 및 창틀 틈새 단열 우레탄폼 100% 밀실 충진 감리 승인
              </p>

              <div className="pt-2.5 border-t border-emerald-200/80 text-[11px] text-emerald-800 font-semibold flex items-center justify-between">
                <span>지급 조건:</span>
                <span>열교 방지 우레탄폼 감리 합격</span>
              </div>
            </div>

            {/* Step 3: 준공 (30%) */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                currentEscrowStage >= 3
                  ? "bg-gradient-to-br from-amber-50/70 to-emerald-50/50 border-amber-300 ring-2 ring-amber-500/20 shadow-xs"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    3단계: 준공금 (30%)
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold animate-pulse">
                  AI 감리 검측 대기
                </span>
              </div>

              <div className="text-2xl font-black text-slate-900 mb-1">
                {step3FinalBase.toLocaleString()}원
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                실리콘 코킹 마감 및 Gemini 비전 전·후 사진 비교 승인 시 25% 즉시 지급 + <strong>5%는 A/S 유보금 보류</strong>
              </p>

              <div className="pt-2.5 border-t border-amber-200/80 text-[11px] text-amber-900 font-semibold flex items-center justify-between">
                <span>지급 조건:</span>
                <span>AI 비전 리포트 + 소유주 승인</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. A/S Retention Fund Spotlight Banner (3~5% Retention for 1~3 Months) */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 border-2 border-amber-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                안심 사후보장 장치
              </span>
              <span className="text-sm font-bold text-amber-950">
                A/S 유보금 (대금의 {retentionPercent}%, 3개월 동결 보류)
              </span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              준공 승인 시 총 공사대금의 <strong>{retentionPercent}% ({retentionAmount.toLocaleString()}원)</strong>는 시공사로 바로 가지 않고 에스크로에 <strong>3개월(90일)간 안전 보류</strong>됩니다. 겨울철 혹한기 결로 발생이나 여름철 장마 누수 등 사후 하자가 발생하지 않음을 확인한 후 최종 송금됩니다.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-amber-800 font-medium pt-1">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>보류 기간: 준공 후 90일 (D-90 자동 카운트)</span>
              </span>
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>하자 미처리 시: 유보금으로 타 수리업체 긴급 대행</span>
              </span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-amber-300 text-center shrink-0 w-full md:w-auto shadow-xs">
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
              현재 보류 유보금
            </span>
            <span className="text-2xl font-black text-amber-900 block my-0.5">
              {retentionAmount.toLocaleString()}원
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold inline-block">
              에스크로 보호 계좌 락(Locked)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
