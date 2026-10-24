import React, { useState } from "react";
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Navigation,
  Compass,
  Users,
  TrendingDown,
  Share2,
  Sparkles,
  Info,
  CheckCircle2,
  Clock,
  Building,
} from "lucide-react";
import { DecomposedDemandItem, OptimizedCluster } from "../types";

interface MapPinItem {
  id: string;
  name: string;
  roadName: string;
  detail: string;
  status: "matched" | "waitlist" | "user";
  x: number; // percentage on map (0~100)
  y: number; // percentage on map (0~100)
  workType: string;
  schedule: string;
}

interface DemandKakaoMapProps {
  cluster: OptimizedCluster | null;
  userAddress: string;
  onOpenInviteModal: () => void;
}

export const DemandKakaoMap: React.FC<DemandKakaoMapProps> = ({
  cluster,
  userAddress,
  onOpenInviteModal,
}) => {
  const [mapMode, setMapMode] = useState<"standard" | "satellite" | "heatmap">("standard");
  const [zoomLevel, setZoomLevel] = useState<number>(3); // 1 to 5
  const [selectedPinId, setSelectedPinId] = useState<string>("pin-user");

  // Realistic neighborhood pins around Mapo Yeonnam-dong / Seongsan-dong
  const pins: MapPinItem[] = [
    {
      id: "pin-user",
      name: "나 (내 주택)",
      roadName: "연남동 383",
      detail: userAddress || "서울시 마포구 연남동 383-12 (3층)",
      status: "user",
      x: 50,
      y: 48,
      workType: "1등급 로이 복층창호",
      schedule: "2026년 4월 ~ 5월",
    },
    {
      id: "pin-1",
      name: "김*수 님",
      roadName: "성미산로 128",
      detail: "마포구 성미산로 128 (다가구 3층)",
      status: "matched",
      x: 38,
      y: 35,
      workType: "1등급 로이 복층창호",
      schedule: "2026년 4월",
    },
    {
      id: "pin-2",
      name: "이*진 님",
      roadName: "동교로27길 45",
      detail: "마포구 동교로27길 45 (다세대 4세대)",
      status: "matched",
      x: 62,
      y: 39,
      workType: "1등급 로이 복층창호",
      schedule: "2026년 4월",
    },
    {
      id: "pin-3",
      name: "박*호 님",
      roadName: "월드컵북로 88",
      detail: "마포구 월드컵북로 88 (단독주택 2층)",
      status: "matched",
      x: 42,
      y: 65,
      workType: "1등급 로이 복층창호",
      schedule: "2026년 5월",
    },
    {
      id: "pin-4",
      name: "정*원 님",
      roadName: "연남로 61",
      detail: "마포구 연남로 61 (상가주택 3층)",
      status: "matched",
      x: 56,
      y: 60,
      workType: "1등급 로이 복층창호",
      schedule: "2026년 5월",
    },
    // Waitlist pool items (semi-transparent, waiting for more neighbors)
    {
      id: "pin-wait-1",
      name: "최*우 님 (대기)",
      roadName: "망원로 72",
      detail: "마포구 망원로 72 (조적조 다가구) - 이웃 2세대 추가 시 그룹 성사",
      status: "waitlist",
      x: 22,
      y: 75,
      workType: "1등급 로이 복층창호",
      schedule: "2026년 5월",
    },
    {
      id: "pin-wait-2",
      name: "강*희 님 (대기)",
      roadName: "서교동 440",
      detail: "마포구 서교동 440-18 (단독주택) - 이웃 2세대 추가 시 그룹 성사",
      status: "waitlist",
      x: 76,
      y: 70,
      workType: "1등급 로이 복층창호",
      schedule: "2026년 6월",
    },
  ];

  const matchedCount = pins.filter((p) => p.status === "matched" || p.status === "user").length;
  const waitlistCount = pins.filter((p) => p.status === "waitlist").length;
  const totalLocalDemand = matchedCount + waitlistCount;

  // Selected Pin details
  const activePin = pins.find((p) => p.id === selectedPinId) || pins[0];

  // Dynamic Gamification Banner Calculation
  // "현재 우리 동네 창호 교체 대기 7세대. 3세대 추가 모집 시 단가 15% 인하 확정"
  const targetHouseholdsForNextTier = 8;
  const remainingForNextTier = Math.max(1, targetHouseholdsForNextTier - matchedCount);
  const nextTierDiscount = 15; // 15% 추가 인하
  const nextTierPerHouseholdSavings = 38; // 세대당 38만원 추가 절감

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
      {/* Top Map Toolbar - Korean Map UI Style (Kakao / Naver look) */}
      <div className="px-5 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs font-black">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-bold">LIVE 지도</span>
            <span className="text-slate-300">|</span>
            <span className="text-white">마포구 연남·성산·망원 그린리모델링 수요 맵</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
            반경 1.5km 생활권
          </span>
        </div>

        {/* Map Control Buttons */}
        <div className="flex items-center space-x-2">
          {/* Map Layer Mode Toggles */}
          <div className="bg-slate-800 p-1 rounded-xl flex items-center space-x-1 text-xs">
            <button
              onClick={() => setMapMode("standard")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mapMode === "standard"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              일반지도
            </button>
            <button
              onClick={() => setMapMode("heatmap")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mapMode === "heatmap"
                  ? "bg-emerald-500 text-slate-950 font-black shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              히트맵(밀도)
            </button>
            <button
              onClick={() => setMapMode("satellite")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mapMode === "satellite"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              위성지도
            </button>
          </div>

          {/* Zoom In / Out */}
          <div className="flex items-center bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
            <button
              onClick={() => setZoomLevel((z) => Math.min(5, z + 1))}
              className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="확대"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3.5 bg-slate-700" />
            <button
              onClick={() => setZoomLevel((z) => Math.max(1, z - 1))}
              className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="축소"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Gamification Announcement Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center space-x-2.5 text-xs sm:text-sm">
          <div className="w-7 h-7 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </div>
          <div>
            <div className="font-black flex items-center space-x-2">
              <span>현재 우리 동네 창호 교체 대기 {totalLocalDemand}세대</span>
              <span className="bg-yellow-300 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-sm uppercase tracking-wide">
                HOT
              </span>
            </div>
            <div className="text-[11px] sm:text-xs text-emerald-100 font-medium">
              단 <strong>{remainingForNextTier}세대 추가 모집 시</strong> 사다리차·물류비 공동 분담으로{" "}
              <strong className="text-yellow-200 underline decoration-yellow-400">
                단가 {nextTierDiscount}% 추가 인하 확정!
              </strong>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenInviteModal}
          className="self-stretch sm:self-auto px-4 py-2 bg-yellow-300 hover:bg-yellow-200 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-1.5 shrink-0"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-900" />
          <span>이웃 초대하기 (바이럴 링크)</span>
        </button>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative w-full h-[460px] sm:h-[500px] bg-slate-100 overflow-hidden select-none">
        {/* Background Map Graphic (Vector styled canvas approximating Kakao Map Seoul Mapo) */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            mapMode === "satellite" ? "bg-slate-900" : "bg-[#f4f3ed]"
          }`}
        >
          {/* Simulated Satellite or Standard Roads Layer */}
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Heatmap radial gradient for Matched Cluster */}
              <radialGradient id="clusterHeatmap" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.55" />
                <stop offset="60%" stopColor="#059669" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>

              {/* Waitlist secondary gradient */}
              <radialGradient id="waitlistHeatmap" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>

              {/* Grid pattern for urban blocks */}
              <pattern id="cityBlocks" width="60" height="60" patternUnits="userSpaceOnUse">
                <rect width="56" height="56" fill={mapMode === "satellite" ? "#1e293b" : "#ebe8df"} rx="4" />
              </pattern>
            </defs>

            {/* City blocks layer */}
            <rect width="100%" height="100%" fill="url(#cityBlocks)" opacity={mapMode === "satellite" ? "0.6" : "0.85"} />

            {/* Han River outline / Gyeongui Line Green Park */}
            <path
              d="M-50,280 C200,260 400,230 650,210 C850,190 1100,160 1300,140"
              fill="none"
              stroke="#86efac"
              strokeWidth="24"
              opacity="0.35"
            />
            {/* Main Roads */}
            <path
              d="M0,150 L1200,420"
              fill="none"
              stroke={mapMode === "satellite" ? "#334155" : "#ffffff"}
              strokeWidth="16"
            />
            <path
              d="M0,150 L1200,420"
              fill="none"
              stroke={mapMode === "satellite" ? "#64748b" : "#fcd34d"}
              strokeWidth="3"
              strokeDasharray="8 6"
            />
            <path
              d="M480,0 L520,600"
              fill="none"
              stroke={mapMode === "satellite" ? "#334155" : "#ffffff"}
              strokeWidth="14"
            />
            <path
              d="M100,450 L1100,150"
              fill="none"
              stroke={mapMode === "satellite" ? "#334155" : "#ffffff"}
              strokeWidth="12"
            />

            {/* Seongmisan Mountain Nature Area */}
            <circle cx="280" cy="140" r="70" fill="#bbf7d0" opacity="0.4" />
            <text x="260" y="145" fontSize="11" fill="#15803d" fontWeight="bold">
              성미산(공원)
            </text>

            {/* Gyeongui Line Forest Trail Label */}
            <text x="560" y="215" fontSize="10" fill="#16a34a" fontWeight="bold">
              경의선숲길 (연트럴파크)
            </text>

            {/* Neighborhood Labels */}
            <text x="440" y="190" fontSize="14" fill="#64748b" fontWeight="800" opacity="0.7">
              연 남 동
            </text>
            <text x="240" y="290" fontSize="14" fill="#64748b" fontWeight="800" opacity="0.7">
              성 산 동
            </text>
            <text x="140" y="440" fontSize="13" fill="#64748b" fontWeight="800" opacity="0.6">
              망 원 동
            </text>
            <text x="680" y="380" fontSize="13" fill="#64748b" fontWeight="800" opacity="0.6">
              서 교 동
            </text>
            <text x="820" y="310" fontSize="12" fill="#ef4444" fontWeight="bold" opacity="0.7">
              ● 2호선 홍대입구역
            </text>

            {/* CLUSTER HEATMAP OVERLAYS */}
            {/* 1. Matched Cluster Heatmap Circle (Centered near Yeonnam / Seongsan) */}
            <g>
              <circle cx="50%" cy="50%" r="180" fill="url(#clusterHeatmap)" />
              {/* Outer Pulsing Contour */}
              <circle
                cx="50%"
                cy="50%"
                r="175"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.8"
              >
                <animate
                  attributeName="r"
                  values="165;185;165"
                  dur="4s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;0.9;0.5"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>

            {/* 2. Waitlist Pool Heatmap Circle (망원·서교 구역 - 반투명 점선) */}
            <g opacity="0.55">
              <circle cx="30%" cy="75%" r="110" fill="url(#waitlistHeatmap)" />
              <circle
                cx="30%"
                cy="75%"
                r="105"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </g>
          </svg>
        </div>

        {/* Heatmap Legend Badge (Overlay) */}
        <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-slate-200 shadow-md text-xs max-w-xs space-y-1.5">
          <div className="font-bold text-slate-800 flex items-center justify-between">
            <span>수요 분포 현황</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
              총 {totalLocalDemand}세대 밀집
            </span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200 shrink-0" />
              <span>
                <strong>성사 클러스터 ({matchedCount}세대)</strong>: 공고 발주 완료
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-400 opacity-50 border border-dashed border-amber-600 shrink-0" />
              <span className="text-slate-500">
                <strong>대기 풀 ({waitlistCount}세대)</strong>: 이웃 모집 진행 중
              </span>
            </div>
          </div>
        </div>

        {/* PINS ON CANVAS */}
        {pins.map((pin) => {
          const isSelected = selectedPinId === pin.id;
          const isUser = pin.status === "user";
          const isWaitlist = pin.status === "waitlist";

          return (
            <div
              key={pin.id}
              onClick={() => setSelectedPinId(pin.id)}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-full cursor-pointer z-20 transition-transform duration-200 group ${
                isSelected ? "scale-125 z-30" : "hover:scale-110"
              }`}
            >
              {/* Outer pulsing ring for user */}
              {isUser && (
                <span className="absolute -inset-2 rounded-full bg-emerald-400/50 animate-ping pointer-events-none" />
              )}

              {/* Pin Marker Graphic */}
              <div
                className={`relative flex flex-col items-center ${
                  isWaitlist ? "opacity-50 hover:opacity-100 transition-opacity" : ""
                }`}
              >
                {/* Marker Bubble */}
                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-black shadow-lg flex items-center space-x-1 border transition-all ${
                    isUser
                      ? "bg-emerald-600 text-white border-emerald-300 ring-2 ring-emerald-400/40"
                      : isWaitlist
                      ? "bg-amber-100 text-amber-900 border-amber-400 border-dashed"
                      : "bg-teal-700 text-white border-teal-300"
                  }`}
                >
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="whitespace-nowrap">{pin.name}</span>
                </div>

                {/* Marker pointer tip */}
                <div
                  className={`w-2 h-2 rotate-45 -mt-1 border-r border-b ${
                    isUser
                      ? "bg-emerald-600 border-emerald-300"
                      : isWaitlist
                      ? "bg-amber-100 border-amber-400"
                      : "bg-teal-700 border-teal-300"
                  }`}
                />

                {/* Road label pill under pin */}
                <span className="text-[9px] bg-slate-900/80 text-white font-medium px-1.5 py-0.2 rounded mt-0.5 shadow-xs whitespace-nowrap">
                  {pin.roadName}
                </span>
              </div>
            </div>
          );
        })}

        {/* Bottom Floating Interactive Card (Dynamic Calculation on Click) */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activePin.status === "user"
                      ? "bg-emerald-100 text-emerald-800"
                      : activePin.status === "waitlist"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-teal-100 text-teal-800"
                  }`}
                >
                  {activePin.status === "user"
                    ? "내 주택 (성사 완료)"
                    : activePin.status === "waitlist"
                    ? "대기 풀 상태 (추가 모집 중)"
                    : "성사 클러스터 멤버"}
                </span>
                <span className="font-bold text-slate-900 text-sm">{activePin.name}</span>
                <span className="text-xs text-slate-500 font-mono">({activePin.roadName})</span>
              </div>

              <div className="text-xs text-slate-700 font-medium">
                {activePin.status === "waitlist" ? (
                  <span className="text-amber-800">
                    현재 이 구역은 대기 상태입니다. <strong>인접 이웃 2세대만 추가 모집</strong>되면 연남·성산 패키지와 탐욕적 병합되어 <strong>단가 18% 인하 혜택</strong>을 받으실 수 있습니다!
                  </span>
                ) : (
                  <span>
                    현재 우리 동네 창호 교체 <strong>대기 {totalLocalDemand}세대</strong> ({matchedCount}세대 성사 완료).{" "}
                    <strong className="text-emerald-700">
                      단 {remainingForNextTier}세대 추가 모집 시 단가 {nextTierDiscount}% 인하 확정!
                    </strong>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
              <button
                onClick={onOpenInviteModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>이웃 초대하기</span>
              </button>
            </div>
          </div>
        </div>

        {/* Map Scale Bar (Authentic Korean Map Interface look) */}
        <div className="absolute bottom-20 sm:bottom-4 right-4 z-10 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-slate-600 font-mono border border-slate-300/80 flex items-center space-x-1.5 pointer-events-none">
          <div className="w-10 h-1 bg-slate-700 border-x border-slate-900" />
          <span>200m</span>
        </div>
      </div>
    </div>
  );
};
