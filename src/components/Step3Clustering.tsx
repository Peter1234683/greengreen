import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  MapPin,
  Zap,
  ArrowRight,
  ArrowLeft,
  Sliders,
  ShieldCheck,
  Filter,
  Layers,
  TrendingDown,
  Clock,
  Building,
  Info,
  CheckCircle2,
  AlertTriangle,
  GitMerge,
  PieChart,
  RefreshCw,
} from "lucide-react";
import {
  BuildingLedgerData,
  ClusteringParameters,
  DecomposedDemandItem,
  MatchingEngineResult,
  OptimizedCluster,
} from "../types";
import {
  calculateHaversineDistanceKm,
  executeMatchingEngine,
} from "../services/matchingEngineService";

interface Step3ClusteringProps {
  building: BuildingLedgerData;
  selectedWorks?: string[];
  budgetCap?: number;
  desiredSchedule?: string;
  onPrev: () => void;
  onNext: (selectedCluster: OptimizedCluster, matchingResult: MatchingEngineResult) => void;
}

export const Step3Clustering: React.FC<Step3ClusteringProps> = ({
  building,
  selectedWorks = ["창호"],
  budgetCap = 1000,
  desiredSchedule = "2026년 4월 ~ 5월",
  onPrev,
  onNext,
}) => {
  // Active Pipeline Tab: 1=Decomposition/Filtering, 2=HDBSCAN Map, 3=Greedy Cost Optimization
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(2);

  // Clustering Engine Parameters
  const [params, setParams] = useState<ClusteringParameters>({
    w1_distance: 0.45,
    w2_time: 0.25,
    w3_material: 0.15,
    w4_structure: 0.15,
    minClusterSize: 3,
    searchRadiusKm: 1.5,
    timeWindowMonths: 2,
    enableGreedyMerge: true,
  });

  // Selected compatibility group filter
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0);

  // Run the matching engine
  const matchingResult: MatchingEngineResult = useMemo(() => {
    return executeMatchingEngine(
      building,
      selectedWorks,
      budgetCap,
      desiredSchedule,
      params
    );
  }, [building, selectedWorks, budgetCap, desiredSchedule, params]);

  // Selected cluster (default to user-included cluster or first cluster)
  const [selectedClusterId, setSelectedClusterId] = useState<string>("");

  useEffect(() => {
    if (matchingResult.selectedCluster) {
      setSelectedClusterId(matchingResult.selectedCluster.clusterId);
    } else if (matchingResult.clusters.length > 0) {
      setSelectedClusterId(matchingResult.clusters[0].clusterId);
    }
  }, [matchingResult]);

  const activeCluster =
    matchingResult.clusters.find((c) => c.clusterId === selectedClusterId) ||
    matchingResult.selectedCluster ||
    matchingResult.clusters[0] ||
    null;

  const activeGroup =
    matchingResult.compatibilityGroups[selectedGroupIndex] ||
    matchingResult.compatibilityGroups[0] ||
    null;

  // Handler for advancing to Step 4
  const handleProceedToStep4 = () => {
    if (activeCluster) {
      onNext(activeCluster, matchingResult);
    } else if (matchingResult.clusters[0]) {
      onNext(matchingResult.clusters[0], matchingResult);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            <Zap className="w-3.5 h-3.5 text-teal-600" />
            <span>Step 3. AI 수요 매칭 엔진 (Matching Engine)</span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              총 접수 {matchingResult.totalInputDemands}세대 중{" "}
              <strong className="text-emerald-700">
                {matchingResult.summary.matchedHouseholds}세대
              </strong>{" "}
              매칭 성공 ·{" "}
              <strong className="text-amber-700">
                {matchingResult.summary.waitlistHouseholds}세대
              </strong>{" "}
              대기 풀 분리
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          3단계 지능형 매칭: 분해 · HDBSCAN 군집화 · 비용 최적화
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
          단순 거리 매칭이 아닌, <strong>1) 공사·자재·구조 하드 필터링</strong>으로 부실 매칭을 원천 차단하고,{" "}
          <strong>2) HDBSCAN 시공간 밀도 알고리즘</strong>으로 반경 1~2km·시공월 1~2개월 내 유효 수요를 군집화하며,{" "}
          <strong>3) 그리디 비용 최적화 모델</strong>로 최적의 규모와 최대 절감률을 산출합니다.
        </p>

        {/* 3-Step Interactive Pipeline Switcher */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-200">
          <button
            onClick={() => setActiveTab(1)}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeTab === 1
                ? "bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="flex items-center space-x-1.5 text-slate-900">
                <Filter className="w-3.5 h-3.5 text-teal-600" />
                <span>1) 수요 분해 & 하드 필터링</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-100 text-teal-800 font-semibold">
                규칙 기반
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              공사항목 단위 분해 및 자재·구조 엄격 일치 호환 그룹 분리
            </p>
          </button>

          <button
            onClick={() => setActiveTab(2)}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeTab === 2
                ? "bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="flex items-center space-x-1.5 text-slate-900">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>2) HDBSCAN 시공간 군집화</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-semibold">
                밀도 기반 AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              거리·시공월 결합 밀도 군집화 & 조건 불일치 세대 대기 풀 분리
            </p>
          </button>

          <button
            onClick={() => setActiveTab(3)}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeTab === 3
                ? "bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="flex items-center space-x-1.5 text-slate-900">
                <TrendingDown className="w-3.5 h-3.5 text-blue-600" />
                <span>3) 그리디 비용 최적화</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-semibold">
                단가 할인 곡선
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              자재 할인·고정비 1/N 분담 및 인접 클러스터 탐욕적 병합
            </p>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DEMAND DECOMPOSITION & STRICT HARD FILTERING                        */}
      {/* ========================================================================= */}
      {activeTab === 1 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-teal-600" />
                <h2 className="text-base font-bold text-slate-900">
                  수요 분해 (Decomposition) 및 호환성 그룹 분류
                </h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                규칙 기반 (Rule-based, Non-AI)
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              접수된 수요를 공사항목(창호, 외단열 등) 단위로 원자적(Atomic) 분해한 뒤,{" "}
              <strong>(1) 공사항목 일치</strong>, <strong>(2) 자재 규격 호환</strong>,{" "}
              <strong>(3) 건물 구조 호환</strong> 3대 조건을 엄격히 평가하여 호환 그룹으로 분리합니다.
              규격이 다른 알루미늄 단창이나 벽돌조 건물은 처음부터 다른 그룹으로 분리되어 군집화에 섞이지 않습니다.
            </p>

            {/* Compatibility Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {matchingResult.compatibilityGroups.map((group, idx) => {
                const isSelected = idx === selectedGroupIndex;
                const isUserGroup = group.demands.some((d) => d.isUser);

                return (
                  <div
                    key={group.groupId}
                    onClick={() => setSelectedGroupIndex(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-teal-50/70 border-teal-500 ring-1 ring-teal-500/20 shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900">
                            {group.name}
                          </span>
                          {isUserGroup && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              내 주택 포함
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">
                          총 {group.demands.length}세대 호환 수요
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          group.demands.length >= params.minClusterSize
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {group.demands.length >= params.minClusterSize
                          ? "군집 형성 가능"
                          : `인원 미달 (${group.demands.length}/${params.minClusterSize})`}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="font-semibold text-slate-500">자재 규격:</span>
                        <span className="font-mono text-[11px] text-teal-800 truncate max-w-[220px]">
                          {group.specDescription}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="font-semibold text-slate-500">건물 구조:</span>
                        <span className="font-mono text-[11px] text-slate-800 truncate max-w-[220px]">
                          {group.structureDescription}
                        </span>
                      </div>
                    </div>

                    {/* Member Avatars */}
                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">참여 세대 목록:</span>
                      <span className="text-slate-700 font-medium">
                        {group.demands.map((d) => d.ownerName.split(" ")[0]).join(", ")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hard Filtering Verification Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>하드 필터링 사전 검증 결과 보고</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              - <strong>자재 규격 필터링:</strong> 서교동 16mm 알루미늄 단창 수요(1건)는 내 주택의 26mm 로이 PVC 이중창과 공정 호환이 불가능하여 <strong>그룹 B(알루미늄 전용)</strong>로 완전 격리되었습니다.
              <br />
              - <strong>구조 공법 필터링:</strong> 망원동 적벽돌 조적조 수요(1건)는 창틀 앵커링 방식 차이 및 인방 보강 필수 요건으로 인해 <strong>그룹 C(조적조 전용)</strong>로 격리되어, 철근콘크리트(RC) 시공팀의 표준화 공정에 혼선을 주지 않습니다.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HDBSCAN SPATIO-TEMPORAL CLUSTERING & WAITLIST                       */}
      {/* ========================================================================= */}
      {activeTab === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* MAP & PARAMETER VISUALIZATION (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">
                  HDBSCAN 시공간 군집 지도 (마포구 연남·성산)
                </h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                반경 {params.searchRadiusKm}km · {activeCluster?.householdCount || 0}세대 군집
              </span>
            </div>

            {/* Interactive Radar/Map Canvas */}
            <div className="relative w-full h-88 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {/* Map Road Grid overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(#38bdf8 1px, transparent 1px), linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)",
                  backgroundSize: "36px 36px, 72px 72px, 72px 72px",
                }}
              />

              {/* Geographic Radius Indicator Ring */}
              <div
                className="absolute rounded-full border-2 border-emerald-400/40 bg-emerald-500/10 pointer-events-none flex items-center justify-center transition-all duration-300"
                style={{
                  width: `${Math.min(320, params.searchRadiusKm * 150)}px`,
                  height: `${Math.min(320, params.searchRadiusKm * 150)}px`,
                }}
              >
                <span className="absolute bottom-2 text-[9px] text-emerald-300 font-bold bg-slate-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  HDBSCAN 탐색 반경 ({params.searchRadiusKm}km)
                </span>
              </div>

              {/* Center User Property Pin */}
              <div className="relative z-20 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-400/40 font-bold animate-bounce text-xs">
                  나
                </div>
                <div className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 border border-slate-700 shadow-md">
                  내 주택 (성미산로)
                </div>
              </div>

              {/* Cluster Member Pins */}
              {activeCluster?.members
                .filter((m) => !m.isUser)
                .map((member, i) => {
                  // Coordinate positions on mock canvas relative to center
                  const positions = [
                    { top: "20%", left: "28%" },
                    { bottom: "24%", right: "26%" },
                    { top: "26%", right: "22%" },
                    { bottom: "26%", left: "22%" },
                    { top: "45%", right: "16%" },
                  ];
                  const pos = positions[i % positions.length];

                  return (
                    <div
                      key={member.id}
                      className="absolute z-10 flex flex-col items-center transition-all"
                      style={pos}
                    >
                      <div className="w-7 h-7 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center shadow-md ring-2 ring-teal-300/40">
                        {i + 2}
                      </div>
                      <span className="text-[9px] text-teal-200 font-semibold bg-slate-900/80 px-1.5 py-0.5 rounded mt-0.5 max-w-[80px] truncate">
                        {member.ownerName.split(" ")[0]} ({member.desiredMonth}월)
                      </span>
                    </div>
                  );
                })}

              {/* Waitlist / Noise Pins (Outliers separated by HDBSCAN) */}
              <div
                className="absolute top-6 left-6 z-10 flex flex-col items-center opacity-85"
                title="시공 시기 불일치 (10월 희망) - 대기 풀 분류"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500/80 text-white text-[10px] font-bold flex items-center justify-center border border-amber-300">
                  대기
                </div>
                <span className="text-[9px] text-amber-300 bg-slate-900/90 px-1 rounded mt-0.5">
                  10월(시기불일치)
                </span>
              </div>

              <div
                className="absolute bottom-6 right-6 z-10 flex flex-col items-center opacity-85"
                title="지리적 거리 초과 (여의도 >4.5km) - 대기 풀 분류"
              >
                <div className="w-6 h-6 rounded-full bg-rose-500/80 text-white text-[10px] font-bold flex items-center justify-center border border-rose-300">
                  대기
                </div>
                <span className="text-[9px] text-rose-300 bg-slate-900/90 px-1 rounded mt-0.5">
                  여의도(거리초과)
                </span>
              </div>
            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>내 주택 (기준점)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-teal-500" />
                  <span>HDBSCAN 유효 군집 참여 세대</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>대기 풀 (거리/시기 불일치 격리)</span>
                </span>
              </div>
            </div>

            {/* Interactive HDBSCAN Parameters Controls */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-700">
                <span className="font-bold flex items-center space-x-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span>군집화 가중치 & 파라미터 미세 조정</span>
                </span>
                <button
                  onClick={() =>
                    setParams({
                      w1_distance: 0.45,
                      w2_time: 0.25,
                      w3_material: 0.15,
                      w4_structure: 0.15,
                      minClusterSize: 3,
                      searchRadiusKm: 1.5,
                      timeWindowMonths: 2,
                      enableGreedyMerge: true,
                    })
                  }
                  className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>기본값 초기화</span>
                </button>
              </div>

              {/* Slider 1: min_cluster_size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>최소 성사 인원 (min_cluster_size):</span>
                    <span className="font-bold text-teal-800">{params.minClusterSize}세대</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={5}
                    step={1}
                    value={params.minClusterSize}
                    onChange={(e) =>
                      setParams((prev) => ({ ...prev, minClusterSize: Number(e.target.value) }))
                    }
                    className="w-full accent-teal-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>2세대</span>
                    <span>3세대 (권장)</span>
                    <span>5세대</span>
                  </div>
                </div>

                {/* Slider 2: searchRadiusKm */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>탐색 반경 임계치:</span>
                    <span className="font-bold text-emerald-800">{params.searchRadiusKm} km</span>
                  </div>
                  <input
                    type="range"
                    min={0.8}
                    max={3.0}
                    step={0.1}
                    value={params.searchRadiusKm}
                    onChange={(e) =>
                      setParams((prev) => ({ ...prev, searchRadiusKm: Number(e.target.value) }))
                    }
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0.8km</span>
                    <span>1.5km (도보권)</span>
                    <span>3.0km</span>
                  </div>
                </div>
              </div>

              {/* Formula & HDBSCAN Rationale */}
              <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200 text-xs text-teal-950 space-y-1.5">
                <div className="flex items-center space-x-1.5 font-bold text-teal-900">
                  <Info className="w-3.5 h-3.5 text-teal-600" />
                  <span>시공간 복합 거리 함수 d(i, j)</span>
                </div>
                <p className="font-mono text-[11px] bg-white/80 p-2 rounded border border-teal-200/80 text-teal-900">
                  d(i, j) = {params.w1_distance} × 지리거리 + {params.w2_time} × 시공월차이 +{" "}
                  {params.w3_material} × 자재스펙차이 + {params.w4_structure} × 건물구조차이
                </p>
                <p className="text-[11px] text-teal-800 leading-relaxed">
                  💡 <strong>K-Means 대신 HDBSCAN을 쓰는 이유:</strong> 사전에 군집 개수(k)를 임의로 정할 필요가 없으며,
                  조건이 맞지 않는 외딴 세대(여의도 원거리, 10월 희망 세대)를 억지로 묶지 않고 <strong>"대기 풀"</strong>로 안전하게 격리합니다.
                </p>
              </div>
            </div>
          </div>

          {/* CLUSTER PARTICIPANTS & WAITLIST POOL (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Matched Cluster Overview */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                  HDBSCAN 군집 형성 성공
                </span>
                <span className="text-xs bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-bold">
                  {activeCluster?.householdCount || 0}세대 통합 발주권
                </span>
              </div>

              <div className="my-2">
                <div className="text-4xl font-black">{activeCluster?.costBreakdown.savingsRate}%</div>
                <div className="text-xs text-emerald-100 font-semibold mt-0.5">
                  예상 공사비 절감률 (세대당 약 {activeCluster?.costBreakdown.savingsAmountPerHousehold}만원 인하)
                </div>
              </div>

              <div className="mt-4 p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20 text-xs space-y-1">
                <div className="font-bold text-emerald-100">
                  {activeCluster?.name || "마포구 1등급 창호 패키지"}
                </div>
                <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                  반경 {activeCluster?.radiusKm}km 이내 연남·성산 동일 규격 세대들이 공장 직발주 대량 생산 물량 조건을 충족하였습니다.
                </p>
              </div>
            </div>

            {/* Matched Neighbor List */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>군집 참여 세대 ({activeCluster?.members.length || 0}건)</span>
                </h3>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  전체 호환 적격
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {activeCluster?.members.map((member) => (
                  <div
                    key={member.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      member.isUser
                        ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/20"
                        : "bg-slate-50 border-slate-200/80"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                        <span>{member.ownerName}</span>
                        {member.isUser && (
                          <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-semibold">
                            나
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {member.address} · {member.desiredScheduleText}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-full">
                      {member.registeredAgo}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Waitlist / Noise Pool Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>대기 풀 (Waitlist Pool, {matchingResult.waitlistPool.length}건)</span>
                </h3>
                <span className="text-[11px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  추가 모집 대상
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                거리 임계치(1.5km)를 초과하거나 시공 시기 차이(3개월 이상)로 인해 억지 매칭을 방지하고 보류된 세대입니다.
              </p>

              <div className="space-y-2">
                {matchingResult.waitlistPool.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{item.ownerName}</div>
                      <div className="text-[11px] text-amber-900">
                        {item.address} · 희망: {item.desiredScheduleText}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      대기 중
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GREEDY COST OPTIMIZATION & FINAL PACKAGE                            */}
      {/* ========================================================================= */}
      {activeTab === 3 && activeCluster && (
        <div className="space-y-6">
          {/* Greedy Optimization Highlight Banner */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">
                  그리디 비용 최적화 모델 (Cost Optimization Engine)
                </h2>
              </div>

              {/* Greedy Merge Toggle */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-600 font-medium">탐욕적 인접 군집 병합:</span>
                <button
                  onClick={() =>
                    setParams((prev) => ({
                      ...prev,
                      enableGreedyMerge: !prev.enableGreedyMerge,
                    }))
                  }
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    params.enableGreedyMerge
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {params.enableGreedyMerge ? "활성화 (최적화 ON)" : "비활성화 (기본 분할)"}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>그룹 총비용 = 자재비(물량 할인 곡선) + 인건비 + 이동/물류비 + 고정비(사다리차·비계 1/N)</strong>
              <br />
              인접 군집(연남 3세대 + 성산 2세대)을 통합했을 때, 자재 단가 추가 인하와 사다리차 고정비 분담 효과가 추가 이동 물류비보다 크므로 탐욕적(Greedy) 병합을 실행하여 세대당 공사비를 극대화하여 절감하였습니다.
            </p>

            {/* Cost Breakdown Cards (4 components) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {/* 1. Material Cost */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>1. 자재비 (물량 할인)</span>
                  <span className="text-emerald-700 font-bold">
                    -{activeCluster.costBreakdown.materialDiscountRate}%
                  </span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {activeCluster.costBreakdown.materialCostPerHousehold.toLocaleString()}만원
                </div>
                <div className="text-[11px] text-slate-500">
                  개별 580만 →{" "}
                  <strong className="text-emerald-700">
                    {activeCluster.costBreakdown.materialCostPerHousehold}만원
                  </strong>
                  <br />
                  창호 공장 직출고 대량 생산 단가
                </div>
              </div>

              {/* 2. Labor Cost */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>2. 인건비 (연속 시공)</span>
                  <span className="text-emerald-700 font-bold">-14.2%</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {activeCluster.costBreakdown.laborCostPerHousehold.toLocaleString()}만원
                </div>
                <div className="text-[11px] text-slate-500">
                  개별 240만 →{" "}
                  <strong className="text-emerald-700">
                    {activeCluster.costBreakdown.laborCostPerHousehold}만원
                  </strong>
                  <br />
                  전문 시공팀 집중 일정 투입
                </div>
              </div>

              {/* 3. Logistics Cost */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>3. 이동 및 물류비</span>
                  <span className="text-slate-600 font-bold">거리 연동</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {activeCluster.costBreakdown.logisticsCostPerHousehold.toLocaleString()}만원
                </div>
                <div className="text-[11px] text-slate-500">
                  반경 {activeCluster.radiusKm}km 군집 내 근접 이동
                  <br />
                  자재 적재 차량 순회 하역
                </div>
              </div>

              {/* 4. Fixed Equipment Overhead */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>4. 고정비 (사다리차·설계)</span>
                  <span className="text-blue-700 font-bold">1/{activeCluster.householdCount} 분담</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {activeCluster.costBreakdown.fixedCostPerHousehold.toLocaleString()}만원
                </div>
                <div className="text-[11px] text-slate-500">
                  총 280만원 ÷ {activeCluster.householdCount}세대 분담
                  <br />
                  사다리차·비계 운반비 n분의 1 경감
                </div>
              </div>
            </div>

            {/* Total Per Household vs Individual Baseline */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  세대당 최종 예상 공사비
                </span>
                <div className="flex items-baseline space-x-3 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {activeCluster.costBreakdown.totalCostPerHousehold.toLocaleString()}만원
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    개별 시중가 {activeCluster.costBreakdown.standardBaselinePricePerHousehold.toLocaleString()}만원
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black">
                    -{activeCluster.costBreakdown.savingsRate}% 절감
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  내 주택 1세대 기준 <strong>{activeCluster.costBreakdown.savingsAmountPerHousehold.toLocaleString()}만원</strong> 직접 절감 · 그룹 전체 총 <strong>{activeCluster.costBreakdown.totalGroupSavings.toLocaleString()}만원</strong> 절감
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">추천 최적 그룹 규모 (Optimal Scale)</div>
                <div className="text-2xl font-black text-teal-300">
                  {activeCluster.costBreakdown.optimalScale}세대
                </div>
                <div className="text-[10px] text-slate-400">
                  (물류비 상승 임계점 이전 최적 효율)
                </div>
              </div>
            </div>

            {/* Non-linear Material Discount Curve Representation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center space-x-1.5">
                  <PieChart className="w-3.5 h-3.5 text-slate-600" />
                  <span>자재비 물량 할인 곡선 (Asymptote Floor 26.5%)</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  현재 {activeCluster.householdCount}세대 달성 지점: {activeCluster.costBreakdown.materialDiscountRate}%
                </span>
              </div>

              {/* Progress Stepper Bars */}
              <div className="grid grid-cols-6 gap-2 text-center text-xs">
                {[
                  { n: 1, rate: 0 },
                  { n: 2, rate: 8 },
                  { n: 3, rate: 13.5 },
                  { n: 5, rate: 20.2, active: activeCluster.householdCount === 5 },
                  { n: 8, rate: 24.1 },
                  { n: "10+", rate: 26.5 },
                ].map((tier, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border transition-all ${
                      tier.active
                        ? "bg-emerald-100 border-emerald-500 font-bold text-emerald-950 ring-1 ring-emerald-500/30"
                        : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="text-[10px] text-slate-500">{tier.n}세대</div>
                    <div className="text-xs font-black text-slate-900">{tier.rate}%</div>
                    {tier.active && (
                      <div className="text-[9px] text-emerald-700 font-bold mt-0.5">
                        현재 단계
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Package Announcement Card & CTA */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>최종 패키징 승인 완료</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            {activeCluster?.name || "마포구 1등급 창호 5세대 통합 패키지"}
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            AI 매칭 엔진이 {activeCluster?.householdCount || 5}세대의 규격과 일정을 검증하여 표준 공고를 생성했습니다.
            다음 단계에서 국토교통부 인증 시공사들의 <strong>역경매(Reverse Auction)</strong> 입찰 결과를 확인하세요.
          </p>
        </div>

        <button
          onClick={handleProceedToStep4}
          className="w-full md:w-auto px-6 py-4 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center justify-center space-x-2 shadow-sm shrink-0"
        >
          <span>Step 4. 시공사 역경매 입찰 확인</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Prev Navigation */}
      <div className="flex justify-start">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Step 2. 수요 조건 수정하기</span>
        </button>
      </div>
    </div>
  );
};
