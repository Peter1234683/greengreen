import React, { useState, useRef } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Camera,
  Upload,
  Split,
  Columns,
  ShieldCheck,
  Award,
  Layers,
  Check,
  X,
  ChevronRight,
  Eye,
  Users,
  FileCheck2,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  BuildingLedgerData,
  ContractorBid,
  FinishInspectionResult,
  InspectionChecklistItem,
  ClusterHouseholdCompletion,
} from "../types";
import {
  PRESET_AFTER_IMAGES,
  PRESET_SAMPLE_IMAGES,
} from "../services/sampleImages";
import {
  CLUSTER_HOUSEHOLDS_COMPLETION,
  STANDARD_COMPLETION_CHECKLIST,
} from "../data/trustSafeguardData";

interface AiCompletionInspectionProps {
  building: BuildingLedgerData;
  bid: ContractorBid;
  beforeImage?: string | null;
  onApproveCompletion?: () => void;
}

export const AiCompletionInspection: React.FC<AiCompletionInspectionProps> = ({
  building,
  bid,
  beforeImage: initialBeforeImage,
  onApproveCompletion,
}) => {
  // Before photo state
  const [beforeImage, setBeforeImage] = useState<string>(
    initialBeforeImage || PRESET_SAMPLE_IMAGES[0].dataUrl
  );

  // After photo state
  const [afterImage, setAfterImage] = useState<string>(
    PRESET_AFTER_IMAGES[0].dataUrl
  );

  // View mode
  const [viewMode, setViewMode] = useState<"side-by-side" | "slider">("side-by-side");
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // File upload input refs
  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);

  // Gemini Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [inspectionResult, setInspectionResult] = useState<FinishInspectionResult | null>({
    overallScore: 98,
    verdict: "승인(우수)",
    passRate: 99.4,
    evaluationItems: [
      {
        category: "창호 기밀 및 단열성",
        score: 99,
        status: "우수",
        comment: "착공 전 노후 알루미늄 단판 창호가 전면 철거되고 26mm 로이복층유리 1등급 시스템 이중창이 틈새 없이 완벽 결합됨.",
      },
      {
        category: "실리콘 코킹 균일도 및 방수",
        score: 96,
        status: "우수",
        comment: "창틀 외벽 접합부 고단열 우레탄폼 충진 및 초내후성 변성실리콘 코킹 비드가 12~15mm 균일 두께로 도포되어 누수 위험 해소.",
      },
      {
        category: "정품 규격 자재 및 인증 마크",
        score: 100,
        status: "우수",
        comment: "에너지소비효율 1등급 인증 라벨 및 KS L 2003 복층유리 정품 인증 날인이 식별됨.",
      },
      {
        category: "결로·곰팡이 취약부 멸균/마감",
        score: 98,
        status: "우수",
        comment: "하부 결로 오염선 완전 제거 및 항균 단열 마감 완료로 동절기 표면 결로 위험 소멸.",
      },
    ],
    checklistItems: STANDARD_COMPLETION_CHECKLIST,
    detailedAnalysis:
      "착공 전 사진과 시공사 준공 사진을 정밀 분석한 결과, 계약서에 명시된 26mm 로이복층유리 정품 및 1등급 인증 라벨이 선명하게 확인되었습니다. 창틀과 골조 사이 난연 우레탄폼 밀실 충진 및 초내후성 변성실리콘 코킹 비드가 균일하여 누수나 결로 우려가 없습니다.",
    retentionAdvice:
      "공사 품질이 계약 시방서 기준을 우수하게 충족하므로 에스크로 준공금(25%) 지급 승인을 강력히 권고합니다. 전체 공사비의 5%(A/S 유보금)는 혹한기 사후 관리를 위해 3개월간 에스크로에 동결 보류됩니다.",
    keyDifferences: [
      "열관류율 취약 노후 알루미늄 단창 → 1등급 고기밀 26mm 로이 복층 시스템 이중창 교체",
      "하부 결로수 고임 및 틈새 외풍 누기 → 고단열 우레탄폼 100% 충진 및 기밀 테이핑 마감",
      "경화된 노후 코킹 탈락 부위 → 초내후성 변성실리콘 15mm 균일 방수 코킹 마감",
    ],
    inspectedAt: new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    isAiGenerated: true,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Approval state
  const [isCompletionApproved, setIsCompletionApproved] = useState<boolean>(false);

  // Cross verification selected neighbor household
  const [selectedNeighbor, setSelectedNeighbor] = useState<ClusterHouseholdCompletion | null>(null);

  // Handle slider drag
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 5), 95);
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleSliderMove(e.clientX);
    }
  };

  // Upload handlers
  const handleUploadBefore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setBeforeImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAfter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setAfterImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Gemini Finish Quality Analysis
  const handleRunFinishAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/inspect-finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beforeImage,
          afterImage,
          contractorBid: bid,
          buildingData: building,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setInspectionResult({
          ...json.data,
          checklistItems: json.data.checklistItems || STANDARD_COMPLETION_CHECKLIST,
        });
      } else {
        throw new Error(json.message || "마감 분석 결과를 불러오지 못했습니다.");
      }
    } catch (err: any) {
      console.error("Finish inspection error:", err);
      setErrorMsg(err.message || "Gemini 분석 중 일시적 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmApproval = () => {
    setIsCompletionApproved(true);
    if (onApproveCompletion) {
      onApproveCompletion();
    }
  };

  const checklistItems = inspectionResult?.checklistItems || STANDARD_COMPLETION_CHECKLIST;
  const passCount = checklistItems.filter((i) => i.verifiedStatus === "O").length;

  return (
    <div className="space-y-7">
      {/* Hidden File Inputs */}
      <input
        ref={beforeFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUploadBefore}
        className="hidden"
      />
      <input
        ref={afterFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUploadAfter}
        className="hidden"
      />

      {/* Main Inspection Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-slate-900">
                  AI 체크리스트 기반 준공 승인 감리
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  Gemini 비전 정밀 대조
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                착공 전 사진과 시공사 준공 사진을 공학적으로 대조하여 <strong>계약 자재(로이유리 24mm/26mm) 일치 여부와 마감 상태를 O/X 체크리스트</strong>로 자동 판정합니다.
              </p>
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
            <button
              onClick={() => setViewMode("side-by-side")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                viewMode === "side-by-side"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>나란히 비교</span>
            </button>
            <button
              onClick={() => setViewMode("slider")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                viewMode === "slider"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>슬라이더 분할</span>
            </button>
          </div>
        </div>

        {/* Preset Selector Bar for After-Repair Photos */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>시공사 제출 준공 완료 사진 선택 또는 직접 업로드:</span>
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => afterFileInputRef.current?.click()}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 hover:bg-emerald-50 transition-colors flex items-center space-x-1"
              >
                <Upload className="w-3 h-3" />
                <span>준공 사진 직접 등록</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_AFTER_IMAGES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setAfterImage(preset.dataUrl)}
                className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center space-x-2 ${
                  afterImage === preset.dataUrl
                    ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs text-emerald-950 font-bold"
                    : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border border-current">
                  {afterImage === preset.dataUrl && (
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  )}
                </div>
                <span className="line-clamp-1">{preset.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* VISUAL COMPARISON AREA */}
        {viewMode === "side-by-side" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* 1. BEFORE CARD */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md flex flex-col justify-between">
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[11px] font-bold border border-rose-500/40">
                    수리 전 (착공 전 현장)
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">
                    Step 1 진단 사진
                  </span>
                </div>
                <button
                  onClick={() => beforeFileInputRef.current?.click()}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  <Camera className="w-3 h-3" />
                  <span>사진 변경</span>
                </button>
              </div>

              <div className="relative h-64 sm:h-72 bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src={beforeImage}
                  alt="Before Repair"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-rose-400 text-[11px] font-bold px-2 py-1 rounded-md border border-rose-500/30">
                  ⚠️ 노후 알루미늄 단창 (열손실 심각)
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">
                  착공 전 현장 보존 사진
                </div>
              </div>

              <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>하자 상태: 결로수 고임 및 모헤어 삭음</span>
                <span className="text-rose-400 font-semibold">단열 취약선 식별</span>
              </div>
            </div>

            {/* 2. AFTER CARD */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-emerald-500/40 shadow-md flex flex-col justify-between">
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/40">
                    수리 후 (준공 완료)
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">
                    {bid.contractorName} 제출
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  LOT: LOT-2026-LX041
                </span>
              </div>

              <div className="relative h-64 sm:h-72 bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src={afterImage}
                  alt="After Repair"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-xs text-emerald-300 text-[11px] font-bold px-2 py-1 rounded-md border border-emerald-500/40 flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>26mm 로이 1등급 정품 인증</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-700/50">
                  준공 검측 대조용 사진
                </div>
              </div>

              <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-[11px] text-emerald-300 flex items-center justify-between">
                <span>시공 완료: 다실 구조 프레임 & 우레탄폼 밀실</span>
                <span className="text-emerald-400 font-semibold">KS 규격 정품 안착</span>
              </div>
            </div>
          </div>
        ) : (
          /* SLIDER VIEW */
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
              <span>👈 좌측: 착공 전 (노후 샤시)</span>
              <span className="text-slate-400 text-[11px]">가운데 핸들을 좌우로 드래그하세요</span>
              <span>우측: 준공 후 (26mm 로이) 👉</span>
            </div>

            <div
              ref={sliderContainerRef}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              onTouchMove={handleTouchMove}
              className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden cursor-ew-resize select-none border-2 border-slate-800 bg-slate-950 shadow-lg"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={afterImage}
                  alt="After Repair"
                  className="w-full h-full object-contain pointer-events-none"
                />
                <div className="absolute top-4 right-4 bg-emerald-900/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/50">
                  준공 후: 26mm 로이 1등급
                </div>
              </div>

              <div
                className="absolute inset-y-0 left-0 overflow-hidden bg-slate-950"
                style={{ width: `${sliderPosition}%` }}
              >
                <div
                  className="absolute inset-y-0 left-0 flex items-center justify-center"
                  style={{ width: sliderContainerRef.current?.clientWidth || 700 }}
                >
                  <img
                    src={beforeImage}
                    alt="Before Repair"
                    className="w-full h-full object-contain pointer-events-none"
                  />
                </div>
                <div className="absolute top-4 left-4 bg-rose-950/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full border border-rose-400/50">
                  착공 전: 노후 알루미늄
                </div>
              </div>

              <div
                className="absolute inset-y-0 w-1 bg-white shadow-2xl flex items-center justify-center z-20 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-9 h-9 -ml-4.5 rounded-full bg-white shadow-xl border-2 border-slate-900 flex items-center justify-center text-slate-800 font-black text-xs">
                  ↔
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button: Run Gemini Vision Analysis */}
        <div className="pt-2">
          {errorMsg && (
            <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            onClick={handleRunFinishAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 hover:from-emerald-700 hover:to-slate-800 shadow-md shadow-emerald-700/15 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                <span>Gemini 비전 자재 일치율 및 마감 품질 교차 분석 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Gemini AI 비전 준공 승인 검측 재실행</span>
              </>
            )}
          </button>
        </div>

        {/* -------------------------------------------------------------
            AI 준공 승인 권고 리포트 (Completion Approval Advisory Report)
            ------------------------------------------------------------- */}
        {inspectionResult && (
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 text-white border border-emerald-500/40 p-6 sm:p-7 shadow-xl space-y-6">
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
                    Gemini 비전 감리 판정 보고서
                  </span>
                  <span className="text-xs text-slate-400">
                    {inspectionResult.inspectedAt} 기준
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
                  <span>준공 승인 권고:</span>
                  <span className="text-emerald-400">
                    {inspectionResult.verdict === "승인(우수)"
                      ? "승인 권고 (준공금 지급 적격)"
                      : inspectionResult.verdict}
                  </span>
                </h3>
              </div>

              {/* Pass rate & Score */}
              <div className="flex items-center space-x-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    체크리스트 합격
                  </span>
                  <span className="text-xl font-black text-emerald-400">
                    {passCount}/{checklistItems.length} 항목
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-slate-700" />
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    종합 품질 점수
                  </span>
                  <span className="text-xl font-black text-white">
                    {inspectionResult.overallScore}점
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist items (O/X + Contract Spec + Comment) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>계약 자재 규격 및 시방서 항목별 O/X 검측 체크리스트</span>
                </h4>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  전 항목 O (합격) 시에만 준공금 지급 가능
                </span>
              </div>

              <div className="space-y-2.5">
                {checklistItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 hover:border-emerald-500/40 transition-colors space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                              item.verifiedStatus === "O"
                                ? "bg-emerald-500 text-slate-950"
                                : "bg-rose-500 text-white"
                            }`}
                          >
                            {item.verifiedStatus}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {item.category}
                          </span>
                          {item.isContractMaterialMatch && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                              계약 자재 일치
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 pl-7">
                          {item.contractSpec}
                        </div>
                      </div>

                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-bold shrink-0 ${
                          item.verifiedStatus === "O"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        }`}
                      >
                        {item.verifiedStatus === "O" ? "적합 (합격)" : "부적합 (보완)"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 pl-7 leading-relaxed">
                      💡 {item.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Engineer Advice & Escrow Release Direction */}
            <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2.5">
              <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>감리원 종합 의견 및 에스크로 대금 집행 권고</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {inspectionResult.detailedAnalysis}
              </p>
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed">
                <strong>자금 집행 지침:</strong> {inspectionResult.retentionAdvice}
              </div>
            </div>

            {/* Action Bar: Final Approval & Escrow Release */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                {!isCompletionApproved ? (
                  <span>
                    체크리스트 확인 완료 후 준공 승인을 누르면 에스크로 준공금(25%)이 지급됩니다.
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>준공 승인 완료: 준공금(25%) 지급 완료 및 5% A/S 유보금(3개월 보류) 에스크로 동결</span>
                  </span>
                )}
              </div>

              {!isCompletionApproved ? (
                <button
                  type="button"
                  onClick={handleConfirmApproval}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>준공 승인 확정 및 에스크로 지급 승인</span>
                </button>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>준공 승인 승인권자 서명 완료</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          그룹 참여 세대 준공 사진 교차 검증 (Cross-Verification Gallery)
          ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-200">
              <Users className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-900">
                  클러스터 참여 이웃 세대 준공 사진 교차 검증
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold border border-teal-300">
                  투명성 100% 보장
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                같은 공동구매 그룹으로 묶인 이웃 세대들의 준공 사진과 자재 LOT 번호를 나란히 비교하여 자재 바꿔치기나 날림 시공을 완벽 방지합니다.
              </p>
            </div>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            동일 클러스터 참여: <strong>총 4세대 실시간 공유</strong>
          </span>
        </div>

        {/* Households Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CLUSTER_HOUSEHOLDS_COMPLETION.map((hh) => (
            <div
              key={hh.id}
              onClick={() => setSelectedNeighbor(hh)}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/30 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 group-hover:text-emerald-700">
                    {hh.unitName}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      hh.status === "준공 승인 완료"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {hh.status}
                  </span>
                </div>

                {/* Thumbnail Preview */}
                <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
                  <img
                    src={hh.afterThumb}
                    alt={hh.unitName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-[9px] text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                    {hh.lotNumber}
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 bg-emerald-950/80 text-[10px] text-emerald-400 font-black px-1.5 py-0.5 rounded border border-emerald-600/40">
                    {hh.inspectionScore}점
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 line-clamp-1 font-medium">
                  {hh.workSummary}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>{hh.completionDate} 준공</span>
                <span className="text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center space-x-0.5">
                  <span>자세히 보기</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Selected Neighbor Cross-Verification Popup */}
        {selectedNeighbor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-base font-bold text-slate-900">
                    {selectedNeighbor.unitName} 준공 검측 상세 내역
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedNeighbor(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    착공 전 사진
                  </span>
                  <div className="h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                    <img
                      src={selectedNeighbor.beforeThumb}
                      alt="Before"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-700 block">
                    준공 후 완료 사진
                  </span>
                  <div className="h-44 rounded-xl overflow-hidden bg-slate-900 border border-emerald-300">
                    <img
                      src={selectedNeighbor.afterThumb}
                      alt="After"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">주소:</span>
                  <span className="font-bold text-slate-800">{selectedNeighbor.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">공사 내용:</span>
                  <span className="font-bold text-slate-800">{selectedNeighbor.workSummary}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">자재 LOT 번호 (동일 자재 검증):</span>
                  <span className="font-black text-emerald-700">{selectedNeighbor.lotNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">AI 감리 점수:</span>
                  <span className="font-bold text-slate-900">{selectedNeighbor.inspectionScore}점 ({selectedNeighbor.status})</span>
                </div>
                <div className="pt-2 border-t border-slate-200 text-slate-600">
                  <strong>감리 코멘트:</strong> {selectedNeighbor.notes}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setSelectedNeighbor(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
