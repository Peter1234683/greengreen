import React, { useState } from "react";
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { ContractorBid, BuildingLedgerData } from "../types";
import { BeforeAfterInspection } from "./BeforeAfterInspection";

interface Step5ContractEscrowProps {
  building: BuildingLedgerData;
  bid: ContractorBid;
  beforeImage?: string | null;
  onPrev: () => void;
  onRestart: () => void;
  onGoToStep6?: () => void;
}

export const Step5ContractEscrow: React.FC<Step5ContractEscrowProps> = ({
  building,
  bid,
  beforeImage,
  onPrev,
  onRestart,
  onGoToStep6,
}) => {
  const [isContractSigned, setIsContractSigned] = useState<boolean>(false);
  const [signatureName, setSignatureName] = useState<string>("홍길동");

  // Escrow amounts
  const totalAmount = bid.bidPrice * 10000; // 원 단위
  const step1Amount = Math.round(totalAmount * 0.3); // 30%
  const step2Amount = Math.round(totalAmount * 0.4); // 40%
  const step3Amount = Math.round(totalAmount * 0.25); // 25%
  const step4RetentionAmount = Math.round(totalAmount * 0.05); // 5% A/S 유보금

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit mb-2 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Step 5. 계약 · 에스크로 · 사후 책임 관리</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          공사 대금 떼일 걱정 없는 에스크로 & A/S 유보금 시스템
        </h1>
        <p className="text-sm text-slate-500">
          시공업체에 선금을 일괄 지급하지 않고 단계별 완료 검측 후 분할 지급하며, 공사 완료 후에도 전체 대금의 5%를 A/S 유보금으로 3개월간 보류하여 사후 하자를 끝까지 책임지도록 강제합니다.
        </p>
      </div>

      {/* 1. Standard Contract Template Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              국토교통부 표준 그린리모델링 계약서 요약
            </h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
            전자서명 표준 양식
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-1">총 도급 공사 금액</span>
            <span className="text-lg font-black text-slate-900">
              {totalAmount.toLocaleString()}원
            </span>
            <span className="text-slate-500 block mt-0.5 text-[11px]">(공동구매 18% 단가 인하 적용가)</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-1">지체상금율 (공사 지연 방지)</span>
            <span className="text-lg font-black text-rose-600">1일당 0.1%</span>
            <span className="text-slate-500 block mt-0.5 text-[11px]">
              약정일 경과 시 1일당 {(totalAmount * 0.001).toLocaleString()}원 공제
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-1">하자보수 책임 기간 및 보증</span>
            <span className="text-lg font-black text-emerald-700">
              {bid.warrantyPeriodYears}년 무상 보증
            </span>
            <span className="text-slate-500 block mt-0.5 text-[11px]">
              SGI서울보증 하자이행보증증권 100% 교부
            </span>
          </div>
        </div>

        {/* Clauses */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5 leading-relaxed">
          <p>
            <strong>제1조 (에스크로 예치):</strong> 건축주는 총 공사대금을 그린 캠프 안전 에스크로 계좌에 전액 예치하고, 시공사는 단계별 승인에 따라 대금을 분할 지급받는다.
          </p>
          <p>
            <strong>제2조 (A/S 유보금):</strong> 총 대금의 5%({step4RetentionAmount.toLocaleString()}원)는 준공 후 3개월간 에스크로에 동결 보류되며, 동절기/장마철 하자 미발생 확인 시 시공사로 최종 정산 지급된다.
          </p>
        </div>
      </div>

      {/* 2. Escrow Milestone Visualizer */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Lock className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">
            그린 캠프 에스크로 4단계 분할 지급 구조
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Milestone 1 */}
          <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-emerald-800">1단계: 착공금 (30%)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                  예치완료
                </span>
              </div>
              <div className="text-xl font-black text-slate-900 mb-1">
                {step1Amount.toLocaleString()}원
              </div>
              <p className="text-xs text-slate-600">
                정품 자재 현장 입고 및 기존 창호 철거 개시 확인 후 지급
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-200 text-[11px] text-emerald-700 font-medium">
              조건: 자재 바코드 및 실물 검수
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-700">2단계: 중도금 (40%)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                  공정 대기
                </span>
              </div>
              <div className="text-xl font-black text-slate-900 mb-1">
                {step2Amount.toLocaleString()}원
              </div>
              <p className="text-xs text-slate-600">
                창틀 고정 골조 시공 및 단열 우레탄폼 100% 충진 확인 후
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
              조건: 수평·수직 및 충진율 현장 검측
            </div>
          </div>

          {/* Milestone 3 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-700">3단계: 준공금 (25%)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                  검수 대기
                </span>
              </div>
              <div className="text-xl font-black text-slate-900 mb-1">
                {step3Amount.toLocaleString()}원
              </div>
              <p className="text-xs text-slate-600">
                실리콘 마감 완료 및 Gemini 비전 전/후 비교 검수 승인 후
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
              조건: AI 비전 리포트 + 소유주 승인
            </div>
          </div>

          {/* Milestone 4: Retention */}
          <div className="p-4 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-amber-900">4단계: A/S 유보금 (5%)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                  3개월 보류
                </span>
              </div>
              <div className="text-xl font-black text-amber-950 mb-1">
                {step4RetentionAmount.toLocaleString()}원
              </div>
              <p className="text-xs text-amber-800">
                준공 후 3개월간 에스크로 보관 (결로·누수 하자 발생 시 수리비 대체)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-200 text-[11px] text-amber-900 font-bold">
              안전장치: 하자 미발생 시 자동 송금
            </div>
          </div>
        </div>
      </div>

      {/* 3. Visual Before / After Side-by-Side Comparison & Gemini Finish Analysis */}
      <BeforeAfterInspection
        building={building}
        bid={bid}
        beforeImage={beforeImage}
      />

      {/* 4. Electronic Signature Modal / Action */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>표준 계약 체결 및 에스크로 보호 개시</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            시공사 <strong>{bid.contractorName}</strong>와 체결되는 전자계약서이며, 국토교통부 표준 약관과 에스크로 안심 결제가 동시 적용됩니다.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {!isContractSigned ? (
            <div className="flex items-center space-x-2 w-full">
              <input
                type="text"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="서명자 성명"
                className="px-3 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white outline-none w-28 focus:border-emerald-500"
              />
              <button
                onClick={() => setIsContractSigned(true)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shrink-0 shadow-sm"
              >
                전자서명 및 계약 완료
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>계약 체결 완료 (에스크로 계좌 생성)</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={onPrev}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>시공사 입찰 화면으로 돌아가기</span>
        </button>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white border border-slate-300 transition-colors"
          >
            처음(자가진단)으로
          </button>
          {onGoToStep6 && (
            <button
              onClick={onGoToStep6}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Step 6. 계약 및 신뢰 장치로 이동</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
