import React, { useState, useRef } from "react";
import {
  Building2,
  Upload,
  Camera,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingDown,
  Layers,
  ThermometerSnowflake,
  FileText,
  Search,
  RefreshCw,
  Info,
  Flame,
  Eye,
  MapPin,
  Check,
  MessageSquareText,
  Award,
  BookOpen,
} from "lucide-react";
import { BuildingLedgerData, DiagnosisResult } from "../types";
import { fetchBuildingLedger, PRESET_BUILDINGS } from "../services/buildingLedgerService";
import { PRESET_SAMPLE_IMAGES, SampleImageItem } from "../services/sampleImages";
import { DEFAULT_INITIAL_DIAGNOSIS } from "../services/defaultDiagnosis";
import { RemodelingSuccessGuideModal } from "./RemodelingSuccessGuideModal";

interface Step1DiagnosisProps {
  onComplete: (building: BuildingLedgerData, diagnosis: DiagnosisResult, image: string | null) => void;
  onOpenAdvisor?: () => void;
  onOpenCommunity?: () => void;
  initialBuilding?: BuildingLedgerData | null;
  initialDiagnosis?: DiagnosisResult | null;
  initialImage?: string | null;
}

const DEFECT_HOTSPOTS = [
  {
    id: "hotspot-1",
    label: "창틀 하단 결로선",
    temp: "7.8℃",
    status: "결로·침기 심각",
    top: "62%",
    left: "34%",
    desc: "알루미늄 프레임 열교로 이슬점(12℃) 이하 냉각되어 결로수 고임 및 곰팡이 유발",
  },
  {
    id: "hotspot-2",
    label: "모헤어 마모 틈새",
    temp: "9.1℃",
    status: "외풍(침기) 유입",
    top: "32%",
    left: "72%",
    desc: "모헤어 마모로 풍속 0.45m/s 찬바람 직접 침투, 기밀성 5등급 이하 취약",
  },
  {
    id: "hotspot-3",
    label: "벽체 코너 열교선",
    temp: "10.4℃",
    status: "단열재 결손",
    top: "20%",
    left: "18%",
    desc: "외기 접촉 구조체 단열재 불연속으로 표면온도 저하 및 벽지 오염",
  },
];

export const Step1Diagnosis: React.FC<Step1DiagnosisProps> = ({
  onComplete,
  onOpenAdvisor,
  onOpenCommunity,
  initialBuilding,
  initialDiagnosis,
  initialImage,
}) => {
  // Address & Ledger State
  const [addressInput, setAddressInput] = useState<string>(
    initialBuilding?.address || PRESET_BUILDINGS[0].data.address
  );
  const [isSearchingLedger, setIsSearchingLedger] = useState<boolean>(false);
  const [buildingData, setBuildingData] = useState<BuildingLedgerData | null>(
    initialBuilding || PRESET_BUILDINGS[0].data
  );

  // Photo / Vision State
  const [selectedImage, setSelectedImage] = useState<string | null>(
    initialImage || PRESET_SAMPLE_IMAGES[0].dataUrl
  );
  const [imageMime, setImageMime] = useState<string>("image/svg+xml");
  const [userNotes, setUserNotes] = useState<string>(
    "겨울철 거실 창틀 주변에 물방울 맺힘이 심하고, 베란다 쪽에서 찬바람이 강하게 들어옵니다."
  );

  // Vision UI Feature States
  const [isThermalMode, setIsThermalMode] = useState<boolean>(false);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>("hotspot-1");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Diagnosis State - Defaults to DEFAULT_INITIAL_DIAGNOSIS so results are immediately visible
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(
    initialDiagnosis !== undefined ? initialDiagnosis : DEFAULT_INITIAL_DIAGNOSIS
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Handle address lookup
  const handleAddressSearch = async (targetAddress?: string) => {
    const query = targetAddress || addressInput;
    if (!query.trim()) return;

    setIsSearchingLedger(true);
    setErrorMsg(null);
    try {
      const data = await fetchBuildingLedger(query);
      setBuildingData(data);
      setAddressInput(data.address);
    } catch (e: any) {
      setErrorMsg("건축물대장 조회 중 오류가 발생했습니다.");
    } finally {
      setIsSearchingLedger(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMime(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setImageMime(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Select Sample Image
  const handleSelectSample = (sample: SampleImageItem) => {
    setSelectedImage(sample.dataUrl);
    setImageMime("image/svg+xml");
    setUserNotes(`${sample.defectDesc} (샘플 사진 기반 분석)`);
  };

  // Run Gemini Multimodal Diagnosis
  const handleRunDiagnosis = async () => {
    if (!buildingData) {
      setErrorMsg("먼저 건축물대장 정보를 조회해주세요.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: buildingData.address,
          buildingData,
          imageBase64: selectedImage,
          mimeType: imageMime,
          userNotes,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setDiagnosisResult(json.data);
      } else {
        throw new Error(json.message || "진단 결과 처리 실패");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`AI 진단 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 1. AI 멀티모달 자가진단</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-3">
            공공데이터와 AI 비전으로 확인하는 <br className="hidden sm:inline" />
            <span className="text-emerald-400">우리 집 그린리모델링 필요성</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            국토교통부 건축물대장 데이터로 준공 연식과 구조적 단열 취약성을 진단하고, 창문·벽면 사진을 Gemini 비전 AI가 분석하여 결로·우풍 원인과 맞춤 공사 항목을 도출합니다.
          </p>
        </div>
      </div>

      {/* Community Spotlight Mini Banner */}
      {onOpenCommunity && (
        <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-emerald-950">이웃 리모델링 커뮤니티</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-200/70 text-emerald-900 font-bold">
                  실제 후기 68건+
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                "연남동 30년차 다가구, 4세대 묶어서 창호 420만원 절감한 팁", "마포구 BRP 무이자 융자 100% 승인 요령" 등 이웃들의 생생한 후기를 확인해보세요.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenCommunity}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <span>이웃 꿀팁 보러가기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: Left (Input & Data), Right (Image & Analysis Action) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Building Ledger (5 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">1. 건축물대장 조회</h2>
              </div>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                국토교통부 Open API 연동
              </span>
            </div>

            {/* Address Search Input */}
            <div className="space-y-3 mb-5">
              <label className="block text-xs font-semibold text-slate-600">
                건물 주소 (지번 또는 도로명)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddressSearch()}
                    placeholder="예: 서울시 마포구 성미산로 142 또는 연남동 239-1"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-slate-50/50"
                  />
                </div>
                <button
                  onClick={() => handleAddressSearch()}
                  disabled={isSearchingLedger}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors flex items-center space-x-1.5 shadow-xs shrink-0"
                >
                  {isSearchingLedger ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>조회</span>
                  )}
                </button>
              </div>

              {/* Quick Presets */}
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-1.5">
                  빠른 테스트를 위한 대표 노후 건축물 선택:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_BUILDINGS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setBuildingData(p.data);
                        setAddressInput(p.data.address);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all text-left ${
                        buildingData?.address === p.data.address
                          ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {p.label.split(" ")[0]} {p.label.split(" ")[1]} ({p.badge})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ledger Results Card */}
            {buildingData && (
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="text-xs font-semibold text-slate-500">건축물대장 표제부 자동 연계 결과</div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                    준공 {buildingData.ageYears}년차 노후 건물
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">사용승인일 (연식)</span>
                    <span className="font-semibold text-slate-800">
                      {buildingData.approvalDate} ({buildingData.ageYears}년 경과)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">주요 구조</span>
                    <span className="font-semibold text-slate-800">{buildingData.structure}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">연면적 / 규모</span>
                    <span className="font-semibold text-slate-800">{buildingData.grossArea}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">건물 주용도</span>
                    <span className="font-semibold text-slate-800">{buildingData.purpose}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs space-y-2">
                  <div className="flex items-start space-x-1.5 text-slate-600">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">준공 당시 단열 규격:</span>{" "}
                      {buildingData.insulationStandardAtBuild}
                      <p className="text-amber-800 font-medium mt-0.5">
                        ⚠️ {buildingData.currentCodeGap}
                      </p>
                    </div>
                  </div>

                  {/* Visual Insulation Standard Comparison Gauge */}
                  <div className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                      <span>단열재 두께 기준 비교</span>
                      <span className="text-rose-600 font-bold">현행 대비 37% 수준 (63% 부족)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 flex overflow-hidden border border-slate-200">
                      <div
                        className="bg-amber-500 h-full rounded-l-full text-[9px] text-white flex items-center justify-center font-bold"
                        style={{ width: "37%" }}
                      >
                        50mm
                      </div>
                      <div
                        className="bg-slate-200 h-full text-[9px] text-slate-500 flex items-center justify-center font-medium"
                        style={{ width: "63%" }}
                      >
                        현행 135mm+
                      </div>
                    </div>
                  </div>

                  {/* Quick Link to Remodeling Success Guide */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsGuideModalOpen(true)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-300/80 text-emerald-950 font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-xs group"
                    >
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{buildingData.purpose} 맞춤 리모델링 성공 가이드</span>
                      </div>
                      <span className="text-[10px] bg-emerald-700 group-hover:bg-emerald-800 text-white px-2 py-0.5 rounded-full font-bold transition-colors">
                        가이드 보기 →
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Photo Upload & Gemini Vision (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <Camera className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">2. 현장 사진 AI 비전 진단</h2>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    Gemini 멀티모달
                  </span>
                </div>
              </div>

              {/* Sample Photo Quick Select */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  샘플 취약부 사진 선택 (또는 직접 촬영/업로드)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_SAMPLE_IMAGES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`p-2 rounded-xl border text-left transition-all flex flex-col items-center ${
                        selectedImage === sample.dataUrl
                          ? "bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <img
                        src={sample.dataUrl}
                        alt={sample.title}
                        className="w-full h-12 object-cover rounded-lg mb-1 border border-slate-300/50"
                      />
                      <span className="text-[11px] font-bold text-slate-800 line-clamp-1 text-center">
                        {sample.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hidden file & camera inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Interactive Photo Stage with Thermal Overlay & Hotspots */}
              <div className="relative rounded-xl border border-slate-300 overflow-hidden bg-slate-950 mb-3 group">
                {selectedImage ? (
                  <div className="relative">
                    {/* The Base Photo */}
                    <div className="relative max-h-52 overflow-hidden flex items-center justify-center bg-slate-900">
                      <img
                        src={selectedImage}
                        alt="Inspection Target"
                        className={`w-full max-h-52 object-contain transition-all duration-300 ${
                          isThermalMode
                            ? "invert hue-rotate-180 contrast-150 saturate-200"
                            : ""
                        }`}
                      />

                      {/* Thermal gradient overlay when thermal mode is ON */}
                      {isThermalMode && (
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-purple-900/40 to-amber-700/30 mix-blend-color-dodge pointer-events-none" />
                      )}

                      {/* Hotspot Pins on Photo */}
                      {DEFECT_HOTSPOTS.map((pin) => (
                        <button
                          key={pin.id}
                          onClick={() => setActiveHotspotId(pin.id)}
                          style={{ top: pin.top, left: pin.left }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all shadow-lg ${
                            activeHotspotId === pin.id
                              ? "bg-rose-600 text-white ring-4 ring-rose-400/50 scale-110"
                              : "bg-slate-900/80 text-amber-300 border border-amber-400/60 hover:scale-105"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                          <span>{pin.temp}</span>
                        </button>
                      ))}
                    </div>

                    {/* Mode Switch & Upload Toolbar */}
                    <div className="p-2.5 bg-slate-900/95 text-white flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
                      {/* Thermal toggle */}
                      <div className="flex items-center space-x-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                        <button
                          onClick={() => setIsThermalMode(false)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center space-x-1 transition-all ${
                            !isThermalMode ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>일반 사진</span>
                        </button>
                        <button
                          onClick={() => setIsThermalMode(true)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center space-x-1 transition-all ${
                            isThermalMode ? "bg-amber-500 text-slate-950 font-bold shadow-xs" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Flame className="w-3 h-3" />
                          <span>열화상 IR 모드</span>
                        </button>
                      </div>

                      {/* Upload & Camera Buttons */}
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => cameraInputRef.current?.click()}
                          className="px-2 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-medium flex items-center space-x-1 transition-colors"
                        >
                          <Camera className="w-3 h-3" />
                          <span>촬영</span>
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[11px] font-medium flex items-center space-x-1 transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                          <span>사진 변경</span>
                        </button>
                      </div>
                    </div>

                    {/* Active Hotspot Inspector Details */}
                    {activeHotspotId && (
                      <div className="p-3 bg-amber-50/90 border-t border-amber-200 text-xs">
                        {(() => {
                          const active = DEFECT_HOTSPOTS.find((h) => h.id === activeHotspotId);
                          if (!active) return null;
                          return (
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center space-x-2 mb-0.5">
                                  <span className="font-bold text-slate-900">📍 {active.label}</span>
                                  <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                                    {active.temp} ({active.status})
                                  </span>
                                </div>
                                <p className="text-slate-600 text-[11px]">{active.desc}</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="py-8 px-4 text-center cursor-pointer hover:bg-slate-900 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-200">
                      창호, 결로, 곰팡이 사진을 클릭하여 업로드
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">스마트폰 촬영 또는 JPG, PNG 지원</p>
                  </div>
                )}
              </div>

              {/* User Notes */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  소유주 체감 불편 사항 (선택)
                </label>
                <input
                  type="text"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="예: 겨울에 창문 틈으로 찬바람이 심하고 결로가 맺힙니다."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50/50"
                />
              </div>
            </div>

            {/* Run Button */}
            <div>
              {errorMsg && (
                <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                onClick={handleRunDiagnosis}
                disabled={isAnalyzing}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini AI 멀티모달 정밀 분석 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Gemini AI 비전 진단 실행하기</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTS SECTION: Shown when diagnosisResult is ready */}
      {diagnosisResult && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>진단 완료 리포트</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                그린리모델링 종합 진단 결과 및 추천 공사
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsGuideModalOpen(true)}
                className="text-xs font-bold text-emerald-950 bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 border border-emerald-300 flex items-center space-x-1.5 px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                title="건축물 맞춤형 AI 리모델링 성공 가이드 열기"
              >
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                <span>전문가 가이드</span>
                <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded-full font-bold">
                  Expert Guide
                </span>
              </button>
              {onOpenAdvisor && (
                <button
                  onClick={onOpenAdvisor}
                  className="text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 flex items-center space-x-1.5 px-3.5 py-2 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>숨은 지원금 확인하기</span>
                </button>
              )}
              <button
                onClick={handleRunDiagnosis}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1 px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>재진단</span>
              </button>
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Aging Score Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  종합 건축물 노후도 점수
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    diagnosisResult.agingScore >= 80
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : diagnosisResult.agingScore >= 65
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {diagnosisResult.riskLevel}
                </span>
              </div>
              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-900">
                  {diagnosisResult.agingScore}
                </span>
                <span className="text-slate-400 font-bold">/ 100점</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    diagnosisResult.agingScore >= 80
                      ? "bg-rose-500"
                      : diagnosisResult.agingScore >= 65
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${diagnosisResult.agingScore}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                1990년대 이전 기준 준공으로 열손실 및 결로 위험도가 매우 높은 상태입니다.
              </p>
            </div>

            {/* 2. Expected Energy Loss Reduction */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  예상 에너지 절감률
                </span>
                <TrendingDown className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-emerald-600">
                  -{diagnosisResult.energyLossReductionEst}%
                </span>
                <span className="text-xs font-semibold text-slate-500">연간 난방비 절감</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                창호 및 단열 개선 시 연간 약{" "}
                <strong className="text-slate-900 font-bold">75~120만원</strong> 상당의 냉난방 에너지 비용이 절감될 것으로 추정됩니다.
              </p>
            </div>

            {/* 3. Insulation Grade Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  단열 기밀 성능 등급
                </span>
                <ThermometerSnowflake className="w-4 h-4 text-sky-600" />
              </div>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {diagnosisResult.insulationGrade}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                유리 열관류율 및 모헤어 기밀 성능이 취약하여 겨울철 실내 열손실의 40% 이상이 창호를 통해 발생합니다.
              </p>
            </div>
          </div>

          {/* AI Vision Detected Defects Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Gemini 비전 AI 분석 취약 부위 세부 코멘트
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {diagnosisResult.defects.map((defect, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-slate-900">{defect.part}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          defect.severity === "high"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {defect.severity === "high" ? "취약 (긴급)" : "주의"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {defect.finding}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-emerald-800 block mb-0.5">
                      💡 권장 조치 공법
                    </span>
                    <p className="text-xs text-slate-700 font-medium">{defect.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Works Cards */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    추천 그린리모델링 공사 항목 리스트
                  </h3>
                  <p className="text-xs text-slate-500">
                    단독 시공 대비 이웃 공동구매 시공 시 15~20% 단가 인하가 가능한 규격입니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagnosisResult.recommendedWorks.map((work) => (
                <div
                  key={work.id}
                  className="rounded-xl border border-slate-200 p-5 bg-gradient-to-br from-white to-slate-50/50 hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                        {work.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                          work.priority.includes("필수")
                            ? "bg-rose-100 text-rose-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {work.priority}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mb-1.5">{work.title}</h4>
                    <p className="text-xs text-slate-600 mb-3">{work.expectedBenefit}</p>

                    <div className="bg-slate-100/70 rounded-lg p-3 space-y-1.5 text-xs mb-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">예상 단독 시공비:</span>
                        <span className="font-bold text-slate-900">{work.estimatedCostRange}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>호환 자재 규격:</span>
                        <span>{work.compatibilitySpecs}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-1.5 text-xs text-emerald-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{work.subsidyNote}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expert Verdict & Community Synergy */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 sm:p-7 shadow-lg space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  국토교통부 표준 에너지 평가사 종합 소견 (Gemini AI)
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {diagnosisResult.expertVerdict}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-start space-x-3 text-xs text-emerald-300">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">이웃 군집화 시너지:</strong>{" "}
                {diagnosisResult.clusterSuitability}
              </div>
            </div>
          </div>

          {/* CTA: Proceed to Step 2 Demand Registration */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Next Step · 비용 절감의 핵심
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                진단된 항목으로 이웃 공동구매(수요 등록) 시작하기
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                동일 반경(1~2km) 이웃 3~5세대만 함께 모여도 공동 시공으로 단가가 15% 이상 인하됩니다.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              {onOpenAdvisor && (
                <button
                  type="button"
                  onClick={onOpenAdvisor}
                  className="px-5 py-3.5 bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-emerald-400 font-bold rounded-xl text-sm transition-all shadow-sm flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>숨은 지원금 확인하기</span>
                </button>
              )}
              <button
                onClick={() => {
                  if (buildingData) {
                    onComplete(buildingData, diagnosisResult, selectedImage);
                  }
                }}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center space-x-2 group"
              >
                <span>Step 2. 수요 등록하기</span>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Remodeling Success Guide Modal */}
      {buildingData && (
        <RemodelingSuccessGuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
          building={buildingData}
          diagnosis={diagnosisResult}
          onProceedToDemandRegister={() => {
            setIsGuideModalOpen(false);
            if (buildingData && diagnosisResult) {
              onComplete(buildingData, diagnosisResult, selectedImage);
            }
          }}
        />
      )}
    </div>
  );
};
