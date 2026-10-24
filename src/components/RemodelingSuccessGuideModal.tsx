import React, { useState, useEffect } from "react";
import {
  Sparkles,
  X,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Coins,
  TrendingDown,
  Layers,
  ArrowRight,
  Printer,
  Copy,
  RefreshCw,
  Flame,
  Clock,
  Award,
  Zap,
  Info,
  CalendarCheck,
  ExternalLink,
} from "lucide-react";
import { BuildingLedgerData, DiagnosisResult } from "../types";

export interface RemodelingSuccessGuideData {
  guideTitle: string;
  strategy: {
    type: string;
    title: string;
    focus: string;
  };
  buildingArchetype: {
    category: string;
    structuralCharacteristics: string;
    hiddenRiskNotice: string;
  };
  successPillars: Array<{
    pillar: string;
    action: string;
    whyCritical: string;
  }>;
  timelineChecklist: {
    preConstruction: Array<{
      step: string;
      task: string;
      proTip: string;
      importance: "필수" | "중요" | "권장";
    }>;
    duringConstruction: Array<{
      step: string;
      task: string;
      proTip: string;
      importance: "필수" | "중요" | "권장";
    }>;
    postConstruction: Array<{
      step: string;
      task: string;
      proTip: string;
      importance: "필수" | "중요" | "권장";
    }>;
  };
  costSavingHacks: Array<{
    title: string;
    detail: string;
    expectedSavings: string;
  }>;
  fatalPitfalls: Array<{
    pitfall: string;
    danger: string;
    prevention: string;
  }>;
  recommendedSubsidyCombo: {
    primary: string;
    secondary: string;
    localBonus: string;
    taxBenefit?: string;
    totalEstimatedBenefit: string;
  };
  specialistVerdict: string;
  isAiGenerated?: boolean;
}

interface RemodelingSuccessGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: BuildingLedgerData;
  diagnosis?: DiagnosisResult | null;
  onProceedToDemandRegister?: () => void;
}

export const RemodelingSuccessGuideModal: React.FC<RemodelingSuccessGuideModalProps> = ({
  isOpen,
  onClose,
  building,
  diagnosis,
  onProceedToDemandRegister,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "checklist" | "cost_hacks" | "pitfalls" | "subsidy"
  >("overview");
  const [strategyType, setStrategyType] = useState<
    "cost_saving" | "deep_retrofit" | "tenant_care"
  >("cost_saving");
  const [guideData, setGuideData] = useState<RemodelingSuccessGuideData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // Fetch or re-generate guide when modal opens or strategy changes
  const fetchGuide = async (strategy: "cost_saving" | "deep_retrofit" | "tenant_care") => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/remodeling-success-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          building,
          diagnosis,
          strategyType: strategy,
        }),
      });
      const result = await response.json();
      if (result.success && result.data) {
        setGuideData(result.data);
      }
    } catch (err) {
      console.error("Failed to load remodeling success guide:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGuide(strategyType);
    }
  }, [isOpen, building.address]);

  const handleStrategyChange = (newStrategy: "cost_saving" | "deep_retrofit" | "tenant_care") => {
    setStrategyType(newStrategy);
    fetchGuide(newStrategy);
  };

  const toggleTaskCheck = (taskId: string) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleCopySummary = () => {
    if (!guideData) return;
    const textToCopy = `[${guideData.guideTitle}]\n- 건물: ${building.address} (${building.purpose}, ${building.ageYears}년차)\n- 전략: ${guideData.strategy.title}\n- 총 혜택: ${guideData.recommendedSubsidyCombo.totalEstimatedBenefit}\n- AI 전문가 총평: ${guideData.specialistVerdict}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white px-6 py-5 sm:px-8 sm:py-6 border-b border-emerald-900/50 relative shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemini 3.8 Flash AI 건축물 맞춤 진단</span>
                </span>
                {guideData?.isAiGenerated && (
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/30 text-teal-200 text-[10px] font-semibold">
                    실시간 AI 생성
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {guideData?.guideTitle || `${building.purpose} 그린리모델링 성공 가이드`}
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
                <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{building.address}</span>
                </span>
                <span>•</span>
                <span>{building.purpose}</span>
                <span>•</span>
                <span>{building.structure}</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">준공 {building.ageYears}년차</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={handleCopySummary}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors relative"
                title="가이드 요약 복사"
              >
                <Copy className="w-4 h-4" />
                {copiedToast && (
                  <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                    복사 완료!
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors hidden sm:inline-flex"
                title="가이드 인쇄 / PDF 저장"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Strategy Selection Pills */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-1.5 text-xs text-slate-300">
              <span className="font-semibold text-white">시공 전략 선택:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  id: "cost_saving",
                  label: "가성비 최우선 실속형",
                  desc: "26mm 로이창호 + 무이자 융자",
                },
                {
                  id: "deep_retrofit",
                  label: "고단열 제로에너지형",
                  desc: "3중유리 + 외단열 + 환기장치",
                },
                {
                  id: "tenant_care",
                  label: "세입자 공존·임대수익형",
                  desc: "1일 당일시공 + 항균마감",
                },
              ].map((strat) => (
                <button
                  key={strat.id}
                  type="button"
                  onClick={() =>
                    handleStrategyChange(
                      strat.id as "cost_saving" | "deep_retrofit" | "tenant_care"
                    )
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    strategyType === strat.id
                      ? "bg-emerald-500 text-slate-950 shadow-md font-black ring-2 ring-emerald-300"
                      : "bg-white/10 hover:bg-white/20 text-slate-200"
                  }`}
                >
                  <span>{strat.label}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => fetchGuide(strategyType)}
                disabled={isLoading}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center space-x-1 transition-colors disabled:opacity-50"
                title="AI 재분석"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">재분석</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 sm:px-8 flex overflow-x-auto gap-2 py-2 shrink-0 scrollbar-none">
          {[
            { id: "overview", label: "1. 종합 성공 전략", icon: Award },
            { id: "checklist", label: "2. 공정별 골든 체크리스트", icon: CalendarCheck },
            { id: "cost_hacks", label: "3. 공사비 25% 절감 비법", icon: Coins },
            { id: "pitfalls", label: "4. 치명적 함정 3가지", icon: AlertTriangle },
            { id: "subsidy", label: "5. 지원금 최적 조합", icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-emerald-800 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center animate-bounce shadow-md">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  {building.purpose} 맞춤 성공 전략을 Gemini AI가 수립 중입니다...
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  준공 {building.ageYears}년차 건축물대장 데이터와 골조 단열 취약성, 관할 지자체 지원 조례를 정밀 교차 검증하고 있습니다.
                </p>
              </div>
            </div>
          ) : !guideData ? (
            <div className="py-16 text-center text-slate-500">
              가이드 데이터를 불러올 수 없습니다. 다시 시도해주세요.
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Archetype & Hidden Risk Alert */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-2.5">
                      <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                        <Building2 className="w-4.5 h-4.5 text-emerald-600" />
                        <span>건축물 유형별 구조 진단</span>
                      </div>
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-200/70 text-emerald-950 font-bold text-xs">
                        {guideData.buildingArchetype.category}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {guideData.buildingArchetype.structuralCharacteristics}
                      </p>
                    </div>

                    <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-5 space-y-2.5">
                      <div className="flex items-center space-x-2 text-rose-900 font-bold text-sm">
                        <AlertTriangle className="w-4.5 h-4.5 text-rose-600" />
                        <span>철거 시 발견되는 90% 숨은 리스크</span>
                      </div>
                      <p className="text-xs sm:text-sm text-rose-900 leading-relaxed font-medium">
                        {guideData.buildingArchetype.hiddenRiskNotice}
                      </p>
                      <div className="text-[11px] text-rose-700 bg-white/70 p-2.5 rounded-xl border border-rose-200">
                        💡 <strong>대응책:</strong> 계약서에 '철거 후 발견된 옹벽 상태에 따른 표준 우레탄폼 추가 충진 단가'를 사전 상한선(Cap)으로 명시해야 추가금 분쟁이 없습니다.
                      </div>
                    </div>
                  </div>

                  {/* 4 Success Pillars */}
                  <div className="space-y-3">
                    <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>실패 없는 리모델링을 위한 4대 성공 기둥</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {guideData.successPillars.map((pillar, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900">
                              {pillar.pillar}
                            </span>
                            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                              {idx + 1}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            {pillar.action}
                          </p>
                          <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-800 font-semibold flex items-start space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>핵심 이유: {pillar.whyCritical}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specialist Verdict */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 space-y-3 shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                      <Sparkles className="w-4 h-4" />
                      <span>수석 그린리모델링 건축 엔지니어 최종 제언</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                      "{guideData.specialistVerdict}"
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: GOLDEN CHECKLIST */}
              {activeTab === "checklist" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-blue-900">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>실전 감리 체크리스트 사용법:</strong> 실제 시공 과정에서 점검한 항목을 클릭하여 체크 표시할 수 있습니다. 각 공정별 필수 항목이 누락되지 않도록 시공사와 함께 확인하십시오.
                    </div>
                  </div>

                  {/* 1. 착공 전 */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
                        1
                      </span>
                      <h4 className="text-sm font-black text-slate-900">
                        착공 전 단계 (Pre-construction) · 사전 예방
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {guideData.timelineChecklist.preConstruction.map((item, idx) => {
                        const id = `pre-${idx}`;
                        const isDone = !!checkedTasks[id];
                        return (
                          <div
                            key={id}
                            onClick={() => toggleTaskCheck(id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                              isDone
                                ? "bg-emerald-50/60 border-emerald-300"
                                : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => toggleTaskCheck(id)}
                              className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`text-xs font-bold ${
                                    isDone ? "text-emerald-900 line-through" : "text-slate-900"
                                  }`}
                                >
                                  [{item.step}] {item.task}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                                    item.importance === "필수"
                                      ? "bg-rose-100 text-rose-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {item.importance}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600">
                                💡 <strong className="text-slate-800 font-semibold">ProTip:</strong>{" "}
                                {item.proTip}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. 공사 중 */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                        2
                      </span>
                      <h4 className="text-sm font-black text-slate-900">
                        공사 중 핵심 감리 (During Construction) · 품질 직결
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {guideData.timelineChecklist.duringConstruction.map((item, idx) => {
                        const id = `during-${idx}`;
                        const isDone = !!checkedTasks[id];
                        return (
                          <div
                            key={id}
                            onClick={() => toggleTaskCheck(id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                              isDone
                                ? "bg-emerald-50/60 border-emerald-300"
                                : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => toggleTaskCheck(id)}
                              className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`text-xs font-bold ${
                                    isDone ? "text-emerald-900 line-through" : "text-slate-900"
                                  }`}
                                >
                                  [{item.step}] {item.task}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                                    item.importance === "필수"
                                      ? "bg-rose-100 text-rose-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {item.importance}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600">
                                💡 <strong className="text-slate-800 font-semibold">ProTip:</strong>{" "}
                                {item.proTip}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. 준공 후 */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center">
                        3
                      </span>
                      <h4 className="text-sm font-black text-slate-900">
                        준공 후 검측 & 대금 정산 (Post-construction) · 권리 보호
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {guideData.timelineChecklist.postConstruction.map((item, idx) => {
                        const id = `post-${idx}`;
                        const isDone = !!checkedTasks[id];
                        return (
                          <div
                            key={id}
                            onClick={() => toggleTaskCheck(id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                              isDone
                                ? "bg-emerald-50/60 border-emerald-300"
                                : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => toggleTaskCheck(id)}
                              className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`text-xs font-bold ${
                                    isDone ? "text-emerald-900 line-through" : "text-slate-900"
                                  }`}
                                >
                                  [{item.step}] {item.task}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                                    item.importance === "필수"
                                      ? "bg-rose-100 text-rose-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {item.importance}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600">
                                💡 <strong className="text-slate-800 font-semibold">ProTip:</strong>{" "}
                                {item.proTip}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: COST SAVING HACKS */}
              {activeTab === "cost_hacks" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                        군집화 공동 시공 & 규격화
                      </span>
                      <h4 className="text-lg sm:text-xl font-black">
                        이 건축물이 이웃과 묶었을 때 총 절감액:{" "}
                        <span className="text-yellow-300 underline underline-offset-4">
                          최대 450만원+
                        </span>
                      </h4>
                      <p className="text-xs text-emerald-100">
                        자재 직송 대량 발주, 사다리차·비계 일괄 대여, 폐기물 처리비 분담으로 불필요한 마진을 제거합니다.
                      </p>
                    </div>
                    {onProceedToDemandRegister && (
                      <button
                        type="button"
                        onClick={onProceedToDemandRegister}
                        className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-black text-xs hover:bg-emerald-50 transition-colors shrink-0 shadow-sm flex items-center space-x-1.5 cursor-pointer"
                      >
                        <span>이웃과 묶음 등록하기</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {guideData.costSavingHacks.map((hack, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-sm font-bold text-slate-900">{hack.title}</h5>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs shrink-0">
                            {hack.expectedSavings}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{hack.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: FATAL PITFALLS */}
              {activeTab === "pitfalls" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center space-x-3 text-xs text-rose-900 font-medium">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>
                      노후 주택 리모델링 시 빈번하게 발생하는 인테리어 사기 및 부실 시공의 3대 전형입니다. 다음 항목을 반드시 숙지하여 피해를 예방하십시오.
                    </span>
                  </div>

                  <div className="space-y-4">
                    {guideData.fatalPitfalls.map((pitfall, idx) => (
                      <div
                        key={idx}
                        className="bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs"
                      >
                        <div className="flex items-center space-x-2 text-rose-600">
                          <AlertTriangle className="w-4.5 h-4.5" />
                          <h5 className="text-sm font-black text-slate-900">
                            함정 {idx + 1}: {pitfall.pitfall}
                          </h5>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-100 space-y-1">
                            <span className="font-bold text-rose-900 block">⚠️ 발생하는 위험</span>
                            <p className="text-slate-700 leading-relaxed">{pitfall.danger}</p>
                          </div>
                          <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 space-y-1">
                            <span className="font-bold text-emerald-900 block">
                              🛡️ 전문가 예방책
                            </span>
                            <p className="text-slate-700 leading-relaxed">{pitfall.prevention}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SUBSIDY PACKAGE */}
              {activeTab === "subsidy" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl p-6 space-y-2">
                    <div className="flex items-center space-x-2 text-teal-300 text-xs font-bold">
                      <Zap className="w-4 h-4 text-yellow-300" />
                      <span>{building.address} 관할 추천 복합 지원금 패키지</span>
                    </div>
                    <h4 className="text-xl font-black text-white">
                      총 예상 금융·보조금 가치:{" "}
                      <span className="text-emerald-400">
                        {guideData.recommendedSubsidyCombo.totalEstimatedBenefit}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-300">
                      정부 국토교통부 이자지원과 서울시/지자체 BRP 무이자 융자를 교차 활용하여 본인 부담금을 최소화합니다.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">
                          1차 핵심 지원
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          국토교통부
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">
                        {guideData.recommendedSubsidyCombo.primary}
                      </h5>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">
                          2차 금융 무이자
                        </span>
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          서울시 BRP
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">
                        {guideData.recommendedSubsidyCombo.secondary}
                      </h5>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">
                          3차 구청 특화 조례 환급
                        </span>
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          지자체 조례
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">
                        {guideData.recommendedSubsidyCombo.localBonus}
                      </h5>
                    </div>

                    {guideData.recommendedSubsidyCombo.taxBenefit && (
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500 uppercase">
                            세제 감면 혜택
                          </span>
                          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            지방세특례
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-900">
                          {guideData.recommendedSubsidyCombo.taxBenefit}
                        </h5>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 text-center">
                    ※ 실제 지원금 승인 여부 및 최종 감면액은 관할 구청 주택과 및 서울시 BRP 포털 신청 심사에 따릅니다.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 hidden sm:block">
            📌 이 가이드는 신청 건축물({building.purpose}, {building.ageYears}년차)의 전용
            분석서입니다.
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
            >
              닫기
            </button>
            {onProceedToDemandRegister && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToDemandRegister();
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>이웃 공동구매(Step 2) 신청하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
