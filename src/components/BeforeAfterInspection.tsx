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
  ChevronRight,
} from "lucide-react";
import { BuildingLedgerData, ContractorBid, FinishInspectionResult } from "../types";
import { PRESET_AFTER_IMAGES, PRESET_SAMPLE_IMAGES } from "../services/sampleImages";

interface BeforeAfterInspectionProps {
  building: BuildingLedgerData;
  bid: ContractorBid;
  beforeImage?: string | null;
}

export const BeforeAfterInspection: React.FC<BeforeAfterInspectionProps> = ({
  building,
  bid,
  beforeImage: initialBeforeImage,
}) => {
  // Before photo state
  const [beforeImage, setBeforeImage] = useState<string>(
    initialBeforeImage || PRESET_SAMPLE_IMAGES[0].dataUrl
  );

  // After photo state (defaults to 1st preset after image)
  const [afterImage, setAfterImage] = useState<string>(
    PRESET_AFTER_IMAGES[0].dataUrl
  );

  // View mode: 'side-by-side' | 'slider'
  const [viewMode, setViewMode] = useState<"side-by-side" | "slider">("side-by-side");
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // File upload input refs
  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);

  // Gemini Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [inspectionResult, setInspectionResult] = useState<FinishInspectionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        setInspectionResult(json.data);
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

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>AI 시공 감리 및 마감 품질 교차 검측</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            수리 전 · 수리 후 사진 대조 및 Gemini 마감 품질 분석
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            공사 착공 전 취약 부위와 시공사가 제출한 준공 완료 사진을 나란히 대조하여 기밀성, 코킹 마감 균일도, KS 정품 인증 자재 반영 여부를 공학적으로 검측합니다.
          </p>
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
            <span>슬라이더 분할 비교</span>
          </button>
        </div>
      </div>

      {/* Preset Selector Bar for After-Repair Photos */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>준공 완료(수리 후) 샘플 선택 또는 현장 사진 등록:</span>
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => afterFileInputRef.current?.click()}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 hover:bg-emerald-50 transition-colors flex items-center space-x-1"
            >
              <Upload className="w-3 h-3" />
              <span>수리 후 사진 직접 업로드</span>
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
                {afterImage === preset.dataUrl && <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />}
              </div>
              <span className="line-clamp-1">{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* VISUAL COMPARISON AREA */}
      {viewMode === "side-by-side" ? (
        /* SIDE-BY-SIDE DUAL VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. BEFORE CARD */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md flex flex-col justify-between">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[11px] font-bold border border-rose-500/40">
                  수리 전 (착공 전 현장)
                </span>
                <span className="text-xs text-slate-300 font-semibold">노후 알루미늄 샤시 & 결로</span>
              </div>
              <button
                onClick={() => beforeFileInputRef.current?.click()}
                className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
              >
                <Camera className="w-3 h-3" />
                <span>사진 변경</span>
              </button>
            </div>

            {/* Photo Container */}
            <div className="relative h-64 sm:h-72 bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={beforeImage}
                alt="Before Repair"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-rose-400 text-[11px] font-bold px-2 py-1 rounded-md border border-rose-500/30">
                ⚠️ 열교 · 단열 미달 (50mm 규격)
              </div>
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">
                1994년 준공 원형 상태
              </div>
            </div>

            {/* Before Defect Diagnostics Checklist */}
            <div className="p-4 bg-slate-900/90 border-t border-slate-800 text-xs space-y-2">
              <div className="text-slate-300 font-bold text-[11px]">확인된 착공 전 하자 사항:</div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div className="flex items-center space-x-1.5 text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>알루미늄 단판 창호 열손실 심각</span>
                </div>
                <div className="flex items-center space-x-1.5 text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>모헤어 삭음으로 틈새 외풍 침기</span>
                </div>
                <div className="flex items-center space-x-1.5 text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>하부 결로수 고임 및 곰팡이 얼룩</span>
                </div>
                <div className="flex items-center space-x-1.5 text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>창틀 외부 코킹 경화로 빗물 침투</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. AFTER CARD */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-emerald-500/40 shadow-md flex flex-col justify-between">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/40">
                  수리 후 (시공사 준공 제출)
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  1등급 시스템 이중창 시공 완료
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  {bid.contractorName} 제출
                </span>
              </div>
            </div>

            {/* Photo Container */}
            <div className="relative h-64 sm:h-72 bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={afterImage}
                alt="After Repair"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-xs text-emerald-300 text-[11px] font-bold px-2 py-1 rounded-md border border-emerald-500/40 flex items-center space-x-1">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>26mm 로이복층 1등급 인증</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-700/50">
                준공 검측 대조용
              </div>
            </div>

            {/* After Verification Checklist */}
            <div className="p-4 bg-slate-900/90 border-t border-slate-800 text-xs space-y-2">
              <div className="text-emerald-400 font-bold text-[11px]">준공 사진 육안 검측 포인트:</div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>백색 PVC 다실 구조 프레임 안착</span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>초내후성 변성실리콘 코킹 균일 도포</span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>창틀 접합부 고단열 우레탄폼 밀실 충진</span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>하부 결로 오염선 완전 제거</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* INTERACTIVE SLIDER VIEW */
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
            <span>👈 좌측: 수리 전 (착공 전)</span>
            <span className="text-slate-400 text-[11px]">가운데 핸들을 좌우로 드래그하세요</span>
            <span>우측: 수리 후 (준공 완료) 👉</span>
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
            {/* Background Layer: AFTER IMAGE */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={afterImage}
                alt="After Repair"
                className="w-full h-full object-contain pointer-events-none"
              />
              <div className="absolute top-4 right-4 bg-emerald-900/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/50">
                수리 후: 26mm 로이 1등급
              </div>
            </div>

            {/* Foreground Clipped Layer: BEFORE IMAGE */}
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
                수리 전: 노후 알루미늄
              </div>
            </div>

            {/* Divider Line & Handle */}
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

      {/* ACTION BUTTON: RUN GEMINI FINISH INSPECTION */}
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
          className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 hover:from-emerald-700 hover:to-slate-800 shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-300" />
              <div className="text-left">
                <div>Gemini 비전 AI 마감 품질 정밀 분석 실행 중...</div>
                <div className="text-[11px] text-emerald-200 font-normal">
                  창호 기밀성 · 실리콘 코킹 균일도 · KS 인증 마크 대조 중
                </div>
              </div>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-emerald-300" />
              <span>Gemini AI 마감 품질 정밀 분석 실행</span>
            </>
          )}
        </button>
      </div>

      {/* GEMINI INSPECTION REPORT MODAL / RESULTS CARD */}
      {inspectionResult && (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 text-white border border-emerald-500/40 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
                  Gemini 비전 감리 판정
                </span>
                <span className="text-xs text-slate-400">
                  {inspectionResult.inspectedAt} 기준
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
                <span>준공 마감 품질 검수:</span>
                <span className="text-emerald-400">{inspectionResult.verdict}</span>
              </h3>
            </div>

            {/* Score pill */}
            <div className="flex items-center space-x-4 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">
                  종합 마감 점수
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {inspectionResult.overallScore}점
                </span>
              </div>
              <div className="h-10 w-[1px] bg-slate-700" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">
                  시방서 합격률
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {inspectionResult.passRate}%
                </span>
              </div>
            </div>
          </div>

          {/* 4 Detail Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {inspectionResult.evaluationItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-emerald-400">{item.score}점</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        item.status === "우수"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Micro Progress Bar */}
                <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">{item.comment}</p>
              </div>
            ))}
          </div>

          {/* Key Differences (Before vs After) */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
            <div className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>수리 전 대비 핵심 품질 개선 사항 (Gemini 정밀 대조 결과)</span>
            </div>
            <div className="space-y-1.5">
              {inspectionResult.keyDifferences.map((diff, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{diff}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Audit & Escrow Release Advice */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                감리 수석 엔지니어 종합 평가
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {inspectionResult.detailedAnalysis}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-700/80 flex items-start space-x-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-slate-300">
                <strong className="text-emerald-400">에스크로 자금 집행 권고:</strong>{" "}
                {inspectionResult.retentionAdvice}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
