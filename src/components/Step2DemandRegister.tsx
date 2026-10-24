import React, { useState } from "react";
import { BuildingLedgerData, DiagnosisResult, RecommendedWorkItem } from "../types";
import { CheckSquare, Square, Calendar, ArrowRight, ShieldCheck, ArrowLeft, Sparkles, Coins } from "lucide-react";

interface Step2DemandRegisterProps {
  building: BuildingLedgerData;
  diagnosis: DiagnosisResult;
  onPrev: () => void;
  onNext: (selectedWorkIds: string[], budget: number, schedule: string) => void;
  onOpenAdvisor?: () => void;
}

export const Step2DemandRegister: React.FC<Step2DemandRegisterProps> = ({
  building,
  diagnosis,
  onPrev,
  onNext,
  onOpenAdvisor,
}) => {
  // Pre-select priority works by default
  const [selectedIds, setSelectedIds] = useState<string[]>(
    diagnosis.recommendedWorks
      .filter((w) => w.priority.includes("필수") || w.category === "창호")
      .map((w) => w.id)
  );

  const [budgetCap, setBudgetCap] = useState<number>(1000); // 1000만원
  const [desiredSchedule, setDesiredSchedule] = useState<string>("2026년 4월 ~ 5월 (봄철 시공)");
  const [phone, setPhone] = useState<string>("010-3849-2819");

  const toggleWork = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      alert("최소 1개 이상의 희망 공사 항목을 선택해주세요.");
      return;
    }
    onNext(selectedIds, budgetCap, desiredSchedule);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit mb-2 border border-emerald-200">
          <span>Step 2. 희망 공사 및 조건 등록</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          이웃과 공동구매할 공사 항목을 선택하세요
        </h1>
        <p className="text-sm text-slate-500">
          자가진단 결과를 바탕으로 필요한 항목을 선택하고 예산 상한을 입력하면, 동일 지역(반경 1~2km) 내 유사한 공사를 희망하는 세대와 자동으로 묶어드립니다.
        </p>

        {/* Building brief */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-4 text-slate-700">
          <div className="flex flex-wrap gap-4">
            <span><strong>진단 대상:</strong> {building.address}</span>
            <span><strong>연식:</strong> {building.ageYears}년 경과</span>
            <span><strong>구조:</strong> {building.structure}</span>
          </div>

          {onOpenAdvisor && (
            <button
              type="button"
              onClick={onOpenAdvisor}
              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>숨은 지원금 확인하기</span>
            </button>
          )}
        </div>

        {/* Subsidy notification banner */}
        {onOpenAdvisor && (
          <div className="mt-3 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-emerald-900">
              <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>{building.address.split(" ")[1] || "해당 지역"} 지원금 혜택:</strong> 노후주택 단열 지원 조례(10% 추가 환급) 및 서울시 BRP(최대 6,000만 무이자 융자) 적격 대상입니다.
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenAdvisor}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 shrink-0 flex items-center space-x-1"
            >
              <span>상세 규정 AI 상담</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Work Selection */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">1. 공사 항목 선택 (복수 선택 가능)</h2>
            <span className="text-xs text-slate-500">
              {selectedIds.length}개 항목 선택됨
            </span>
          </div>

          <div className="space-y-3">
            {diagnosis.recommendedWorks.map((work: RecommendedWorkItem) => {
              const isSelected = selectedIds.includes(work.id);
              return (
                <div
                  key={work.id}
                  onClick={() => toggleWork(work.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                    isSelected
                      ? "bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500/20 shadow-xs"
                      : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-emerald-600 focus:outline-none"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 fill-emerald-600 text-white" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{work.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                          {work.category}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        {work.estimatedCostRange}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mb-1.5">{work.expectedBenefit}</p>
                    <div className="text-[11px] text-emerald-700 font-medium">
                      🎯 호환 자재 규격: {work.compatibilitySpecs}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget & Timeline Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">2. 예산 상한선 설정</h2>
            <p className="text-xs text-slate-500">
              희망하는 최대 공사 예산을 설정하세요. 역경매 시공사들이 이 상한선 이하로 입찰 경쟁합니다.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">희망 상한 예산</span>
                <span className="font-black text-xl text-emerald-600">
                  {budgetCap.toLocaleString()} 만원
                </span>
              </div>
              <input
                type="range"
                min={300}
                max={3000}
                step={50}
                value={budgetCap}
                onChange={(e) => setBudgetCap(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>300만원 (부분창호)</span>
                <span>1,500만원 (전면창호/단열)</span>
                <span>3,000만원 (종합)</span>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">3. 희망 시공 시기</h2>
            <p className="text-xs text-slate-500">
              인근 이웃들과 공사 일정을 조율하기 위한 선호 일정입니다.
            </p>

            <div className="space-y-2">
              {[
                "2026년 4월 ~ 5월 (봄철 시공 - 가장 인기)",
                "2026년 6월 ~ 7월 (초여름 장마 전)",
                "2026년 9월 ~ 10월 (가을철 동절기 대비)",
              ].map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center space-x-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    desiredSchedule === opt
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="schedule"
                    checked={desiredSchedule === opt}
                    onChange={() => setDesiredSchedule(opt)}
                    className="accent-emerald-600"
                  />
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info & Trust Assurance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">개인정보 안심 보장</h4>
              <p className="text-[11px] text-slate-500">
                수요 군집화 단계에서는 상세 주소와 연락처가 시공사에 공개되지 않으며, 익명화된 물량 데이터로만 입찰이 진행됩니다.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="text-xs px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 w-full sm:w-36 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onPrev}
            className="px-5 py-3 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>자가진단 결과로 돌아가기</span>
          </button>

          <button
            type="submit"
            className="px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md flex items-center space-x-2"
          >
            <span>수요 등록 및 이웃 군집화 확인하기</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </form>
    </div>
  );
};
