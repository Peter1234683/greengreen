import {
  BuildingLedgerData,
  ClusterCostBreakdown,
  ClusteringParameters,
  CompatibilityGroup,
  DecomposedDemandItem,
  MatchingEngineResult,
  MaterialStandardFamilyType,
  OptimizedCluster,
  StructureFamilyType,
  WorkCategoryType,
} from "../types";

// -------------------------------------------------------------
// Pre-seeded Realistic Candidate Demands (Mapo-gu, Seodaemun-gu)
// -------------------------------------------------------------
export const SEED_NEIGHBOR_DEMANDS: DecomposedDemandItem[] = [
  // Cluster Candidates 1: Yeonnam-dong / Seongsan-dong (PVC Double Low-E / RC)
  {
    id: "seed-1",
    demandId: "dem-101",
    isUser: false,
    ownerName: "김*수 (연남동)",
    address: "서울시 마포구 성미산로 128 (다가구 3층)",
    coords: { lat: 37.5645, lng: 126.921 },
    workCategory: "창호",
    workTitle: "1등급 로이 복층창호 전면 교체",
    materialSpec: "PVC 이중창 (26mm 로이복층유리, 아르곤 주입)",
    materialStandardFamily: "PVC_DOUBLE_LOW_E",
    buildingStructure: "철근콘크리트구조",
    structureFamily: "RC",
    desiredMonth: 4,
    desiredScheduleText: "2026년 4월 ~ 5월 (봄철)",
    budgetCap: 1050,
    areaSqMeters: 185,
    floorCount: 3,
    registeredAgo: "1일 전",
  },
  {
    id: "seed-2",
    demandId: "dem-102",
    isUser: false,
    ownerName: "이*진 (연남동)",
    address: "서울시 마포구 동교로27길 45 (다세대 4세대)",
    coords: { lat: 37.5615, lng: 126.9242 },
    workCategory: "창호",
    workTitle: "1등급 로이 복층창호 전면 교체",
    materialSpec: "PVC 이중창 (26mm 로이복층유리, 아르곤 주입)",
    materialStandardFamily: "PVC_DOUBLE_LOW_E",
    buildingStructure: "철근콘크리트구조",
    structureFamily: "RC",
    desiredMonth: 4,
    desiredScheduleText: "2026년 4월 (즉시 착공)",
    budgetCap: 950,
    areaSqMeters: 210,
    floorCount: 4,
    registeredAgo: "2일 전",
  },
  {
    id: "seed-3",
    demandId: "dem-103",
    isUser: false,
    ownerName: "박*호 (성산동)",
    address: "서울시 마포구 성산로 38 (단독주택)",
    coords: { lat: 37.5678, lng: 126.9152 },
    workCategory: "창호",
    workTitle: "고기밀 1등급 시스템 이중창",
    materialSpec: "PVC 이중창 (26mm 로이복층유리, 아르곤 주입)",
    materialStandardFamily: "PVC_DOUBLE_LOW_E",
    buildingStructure: "철근콘크리트구조",
    structureFamily: "RC",
    desiredMonth: 5,
    desiredScheduleText: "2026년 5월 초",
    budgetCap: 1100,
    areaSqMeters: 160,
    floorCount: 2,
    registeredAgo: "3일 전",
  },
  {
    id: "seed-4",
    demandId: "dem-104",
    isUser: false,
    ownerName: "정*우 (연남동)",
    address: "서울시 마포구 연남로 52 (빌라 2세대)",
    coords: { lat: 37.5632, lng: 126.9268 },
    workCategory: "창호",
    workTitle: "외창 전체 로이 복층창호 교체",
    materialSpec: "PVC 이중창 (26mm 로이복층유리, 아르곤 주입)",
    materialStandardFamily: "PVC_DOUBLE_LOW_E",
    buildingStructure: "철근콘크리트구조",
    structureFamily: "RC",
    desiredMonth: 4,
    desiredScheduleText: "2026년 4월 ~ 5월",
    budgetCap: 1000,
    areaSqMeters: 175,
    floorCount: 3,
    registeredAgo: "4시간 전",
  },
  {
    id: "seed-5",
    demandId: "dem-105",
    isUser: false,
    ownerName: "최*혁 (성산동)",
    address: "서울시 마포구 월드컵북로 142 (상가주택)",
    coords: { lat: 37.5695, lng: 126.9125 },
    workCategory: "창호",
    workTitle: "주택층 1등급 로이창 교체",
    materialSpec: "PVC 이중창 (26mm 로이복층유리, 아르곤 주입)",
    materialStandardFamily: "PVC_DOUBLE_LOW_E",
    buildingStructure: "철근콘크리트구조",
    structureFamily: "RC",
    desiredMonth: 5,
    desiredScheduleText: "2026년 5월",
    budgetCap: 1200,
    areaSqMeters: 240,
    floorCount: 4,
    registeredAgo: "방금 전",
  },

  // Incompatible Spec 1: Aluminum Single Glass (Different Material Standard - Must NOT mix)
  {
    id: "seed-incomp-al",
    demandId: "dem-106",
    isUser: false,
    ownerName: "강*석 (서교동)",
    address: "서울시 마포구 와우산로 88 (근린생활)",
    coords: { lat: 37.5542, lng: 126.9248 },
    workCategory: "창호",
    workTitle: "상가 알루미늄 슬림 단창 교체",
    materialSpec: "알루미늄 시스템 단창 (16mm 일반복층)",
    materialStandardFamily: "AL_SINGLE",
    buildingStructure: "철근콘크리트구조",
    structureFamily: "RC",
    desiredMonth: 4,
    desiredScheduleText: "2026년 4월",
    budgetCap: 800,
    areaSqMeters: 130,
    floorCount: 2,
    registeredAgo: "5일 전",
  },

  // Incompatible Structure 1: Brick/Masonry Structure (Different Structure Family - Must NOT mix)
  {
    id: "seed-incomp-brick",
    demandId: "dem-107",
    isUser: false,
    ownerName: "윤*자 (망원동)",
    address: "서울시 마포구 망원로 73 (적벽돌 조적조 단독)",
    coords: { lat: 37.5582, lng: 126.9035 },
    workCategory: "창호",
    workTitle: "노후 벽돌조 창틀 전면 보강 및 창호 교체",
    materialSpec: "PVC 이중창 (26mm 로이복층유리)",
    materialStandardFamily: "PVC_DOUBLE_LOW_E",
    buildingStructure: "벽돌조 (조적구조)",
    structureFamily: "BRICK",
    desiredMonth: 4,
    desiredScheduleText: "2026년 4월",
    budgetCap: 900,
    areaSqMeters: 145,
    floorCount: 2,
    registeredAgo: "3일 전",
  },

  // Different Work Category 1: Exterior Insulation (PF Board / RC)
  {
    id: "seed-insul-1",
    demandId: "dem-108",
    isUser: false,
    ownerName: "오*택 (연희동)",
    address: "서울시 서대문구 연희맛로 23 (다가구)",
    coords: { lat: 37.5688, lng: 126.932 },
    workCategory: "외단열",
    workTitle: "외벽 준불연 PF보드 외단열 보강",
    materialSpec: "준불연 페놀폼(PF)보드 100mm + 미장스톤 마감",
    materialStandardFamily: "PF_BOARD_100MM",
    buildingStructure: "철근콘크리트구조",
    structureFamily: "RC",
    desiredMonth: 5,
    desiredScheduleText: "2026년 5월",
    budgetCap: 850,
    areaSqMeters: 190,
    floorCount: 3,
    registeredAgo: "2일 전",
  },
  {
    id: "seed-insul-2",
    demandId: "dem-109",
    isUser: false,
    ownerName: "한*미 (연남동)",
    address: "서울시 마포구 성미산로29길 14 (다세대)",
    coords: { lat: 37.5658, lng: 126.9245 },
    workCategory: "외단열",
    workTitle: "외벽 단열 및 열교 결로 방지",
    materialSpec: "준불연 페놀폼(PF)보드 100mm + 메쉬미장",
    materialStandardFamily: "PF_BOARD_100MM",
    buildingStructure: "철근콘크리트구조",
    structureFamily: "RC",
    desiredMonth: 5,
    desiredScheduleText: "2026년 5월",
    budgetCap: 780,
    areaSqMeters: 165,
    floorCount: 3,
    registeredAgo: "1일 전",
  },
  {
    id: "seed-insul-3",
    demandId: "dem-110",
    isUser: false,
    ownerName: "송*철 (연희동)",
    address: "서울시 서대문구 증가로 64 (상가주택)",
    coords: { lat: 37.572, lng: 126.928 },
    workCategory: "외단열",
    workTitle: "외벽 고단열 복합 마감 공사",
    materialSpec: "준불연 페놀폼(PF)보드 100mm + 실리콘페인트",
    materialStandardFamily: "PF_BOARD_100MM",
    buildingStructure: "철근콘크리트구조",
    structureFamily: "RC",
    desiredMonth: 5,
    desiredScheduleText: "2026년 5월",
    budgetCap: 920,
    areaSqMeters: 220,
    floorCount: 4,
    registeredAgo: "방금 전",
  },

  // Outlier / Waitlist Candidate 1: Geographically Too Far (>4.5km, Yeouido)
  {
    id: "seed-outlier-far",
    demandId: "dem-111",
    isUser: false,
    ownerName: "배*호 (여의도동)",
    address: "서울시 영등포구 여의대방로 43 (빌라)",
    coords: { lat: 37.521, lng: 126.928 },
    workCategory: "창호",
    workTitle: "1등급 로이 이중창 교체",
    materialSpec: "PVC 이중창 (26mm 로이복층유리, 아르곤 주입)",
    materialStandardFamily: "PVC_DOUBLE_LOW_E",
    buildingStructure: "철근콘크리트구조",
    structureFamily: "RC",
    desiredMonth: 4,
    desiredScheduleText: "2026년 4월",
    budgetCap: 1000,
    areaSqMeters: 150,
    floorCount: 3,
    registeredAgo: "6일 전",
  },

  // Outlier / Waitlist Candidate 2: Schedule Too Far (Desired October 2026 - 6 months apart)
  {
    id: "seed-outlier-time",
    demandId: "dem-112",
    isUser: false,
    ownerName: "류*정 (연남동)",
    address: "서울시 마포구 동교로 210 (다세대)",
    coords: { lat: 37.562, lng: 126.9235 },
    workCategory: "창호",
    workTitle: "1등급 로이 이중창 교체",
    materialSpec: "PVC 이중창 (26mm 로이복층유리, 아르곤 주입)",
    materialStandardFamily: "PVC_DOUBLE_LOW_E",
    buildingStructure: "철근콘크리트구조",
    structureFamily: "RC",
    desiredMonth: 10,
    desiredScheduleText: "2026년 10월 (가을 이사철)",
    budgetCap: 950,
    areaSqMeters: 170,
    floorCount: 3,
    registeredAgo: "4일 전",
  },

  // Equipment / Boiler Category (Condensing Boiler / RC)
  {
    id: "seed-boiler-1",
    demandId: "dem-113",
    isUser: false,
    ownerName: "신*영 (성산동)",
    address: "서울시 마포구 성암로 15 (다세대 8세대)",
    coords: { lat: 37.5702, lng: 126.9112 },
    workCategory: "설비",
    workTitle: "친환경 1등급 콘덴싱 보일러 전세대 일괄 교체",
    materialSpec: "1등급 콘덴싱 가스보일러 + 분배기 교체",
    materialStandardFamily: "CONDENSING_BOILER",
    buildingStructure: "철근콘크리트구조",
    structureFamily: "RC",
    desiredMonth: 4,
    desiredScheduleText: "2026년 4월",
    budgetCap: 600,
    areaSqMeters: 380,
    floorCount: 4,
    registeredAgo: "2일 전",
  },
];

// Helper: Haversine distance in km
export function calculateHaversineDistanceKm(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// -------------------------------------------------------------
// 1) Demand Decomposition & Hard Filtering Module
// -------------------------------------------------------------
export function decomposeAndFilterDemands(
  userBuilding: BuildingLedgerData,
  userSelectedWorks: string[],
  userBudgetCap: number,
  userDesiredSchedule: string,
  candidateDemands: DecomposedDemandItem[] = SEED_NEIGHBOR_DEMANDS
): {
  allDecomposedItems: DecomposedDemandItem[];
  compatibilityGroups: CompatibilityGroup[];
  userDecomposedItems: DecomposedDemandItem[];
} {
  // Determine user's desired month (parse from schedule string, default 4)
  let userDesiredMonth = 4;
  if (userDesiredSchedule.includes("5월")) userDesiredMonth = 5;
  else if (userDesiredSchedule.includes("6월")) userDesiredMonth = 6;
  else if (userDesiredSchedule.includes("3월")) userDesiredMonth = 3;

  // Determine user structure family
  const structStr = userBuilding.structure || "철근콘크리트구조";
  let userStructureFamily: StructureFamilyType = "RC";
  if (structStr.includes("조적") || structStr.includes("벽돌") || structStr.includes("연와")) {
    userStructureFamily = "BRICK";
  } else if (structStr.includes("목조")) {
    userStructureFamily = "WOOD";
  }

  // Decompose user's registered demand into distinct work items
  const userDecomposedItems: DecomposedDemandItem[] = [];
  const userArea = parseFloat(String(userBuilding.grossArea || "198").replace(/[^0-9.]/g, "")) || 198;
  const userFloors = parseInt(String(userBuilding.floors || "3").replace(/[^0-9]/g, "")) || 3;

  // If user selected windows (or default)
  const hasWindow = userSelectedWorks.some((w) => w.includes("window") || w.includes("창호")) || userSelectedWorks.length === 0;
  if (hasWindow) {
    userDecomposedItems.push({
      id: "user-item-window",
      demandId: "user-demand-main",
      isUser: true,
      ownerName: "나 (내 주택)",
      address: userBuilding.address,
      coords: { lat: 37.5638, lng: 126.9225 }, // Mapo Yeonnam-dong center
      workCategory: "창호",
      workTitle: "고효율 1등급 로이 복층창호 전면 교체",
      materialSpec: "PVC 이중창 (26mm 로이복층유리, 아르곤 주입, 1등급)",
      materialStandardFamily: "PVC_DOUBLE_LOW_E",
      buildingStructure: userBuilding.structure,
      structureFamily: userStructureFamily,
      desiredMonth: userDesiredMonth,
      desiredScheduleText: userDesiredSchedule,
      budgetCap: userBudgetCap,
      areaSqMeters: userArea,
      floorCount: userFloors,
      registeredAgo: "방금 전 (접수완료)",
    });
  }

  // If user also selected exterior insulation
  const hasInsulation = userSelectedWorks.some((w) => w.includes("insulation") || w.includes("단열"));
  if (hasInsulation) {
    userDecomposedItems.push({
      id: "user-item-insul",
      demandId: "user-demand-main",
      isUser: true,
      ownerName: "나 (내 주택)",
      address: userBuilding.address,
      coords: { lat: 37.5638, lng: 126.9225 },
      workCategory: "외단열",
      workTitle: "외벽/외기 접촉부 고단열 복합 보강공사",
      materialSpec: "준불연 페놀폼(PF)보드 100mm + 기밀방습시트",
      materialStandardFamily: "PF_BOARD_100MM",
      buildingStructure: userBuilding.structure,
      structureFamily: userStructureFamily,
      desiredMonth: userDesiredMonth,
      desiredScheduleText: userDesiredSchedule,
      budgetCap: Math.round(userBudgetCap * 0.8),
      areaSqMeters: userArea,
      floorCount: userFloors,
      registeredAgo: "방금 전 (접수완료)",
    });
  }

  const allItems = [...userDecomposedItems, ...candidateDemands];

  // Hard Filtering Rule:
  // Must match exactly: (workCategory) && (materialStandardFamily) && (structureFamily)
  const groupMap = new Map<string, CompatibilityGroup>();

  for (const item of allItems) {
    const key = `${item.workCategory}__${item.materialStandardFamily}__${item.structureFamily}`;
    if (!groupMap.has(key)) {
      const categoryNames: Record<WorkCategoryType, string> = {
        창호: "창호 교체 공사",
        외단열: "외벽 고단열 보강 공사",
        지붕: "지붕 방수 및 단열 개량",
        설비: "친환경 고효율 보일러/설비",
      };

      const specDescriptions: Record<MaterialStandardFamilyType, string> = {
        PVC_DOUBLE_LOW_E: "26mm 로이복층유리 PVC 시스템 이중창 (에너지 1등급)",
        AL_SINGLE: "알루미늄 시스템 단창 (16mm 일반복층/상가형)",
        PF_BOARD_100MM: "준불연 페놀폼(PF보드) 100mm 고기밀 외단열",
        EPS_BOARD: "비드법 2종 EPS 단열재 150mm",
        STEEL_ROOF: "경사지붕 칼라강판 단열형 마감",
        CONDENSING_BOILER: "친환경 1등급 콘덴싱 가스보일러",
      };

      const structureDescriptions: Record<StructureFamilyType, string> = {
        RC: "철근콘크리트 라멘/벽식조 (창호 앵커링 직고정 방식)",
        BRICK: "조적/벽돌 구조 (개구부 인방 보강 및 실리콘 2중 코킹 필요)",
        WOOD: "목조 구조 (기밀 방습지 연계 테이핑 시공 방식)",
      };

      groupMap.set(key, {
        groupId: `cg-${key}`,
        name: `${categoryNames[item.workCategory]} [${item.materialStandardFamily}]`,
        workCategory: item.workCategory,
        materialStandardFamily: item.materialStandardFamily,
        structureFamily: item.structureFamily,
        specDescription: specDescriptions[item.materialStandardFamily] || item.materialSpec,
        structureDescription: structureDescriptions[item.structureFamily] || item.buildingStructure,
        demands: [],
      });
    }

    groupMap.get(key)!.demands.push(item);
  }

  const compatibilityGroups = Array.from(groupMap.values());

  return {
    allDecomposedItems: allItems,
    compatibilityGroups,
    userDecomposedItems,
  };
}

// -------------------------------------------------------------
// 2) HDBSCAN Spatio-Temporal Clustering Module
// -------------------------------------------------------------

// Calculate composite spatio-temporal distance between two demand items
export function calculateSpatioTemporalDistance(
  a: DecomposedDemandItem,
  b: DecomposedDemandItem,
  params: ClusteringParameters
): number {
  // 1. Geographic distance (km) normalized by searchRadiusKm
  const geoDistKm = calculateHaversineDistanceKm(a.coords, b.coords);
  const normGeoDist = geoDistKm / Math.max(0.5, params.searchRadiusKm);

  // 2. Schedule difference in months normalized by timeWindowMonths
  const timeDiffMonths = Math.abs(a.desiredMonth - b.desiredMonth);
  const normTimeDist = timeDiffMonths / Math.max(1, params.timeWindowMonths);

  // 3. Material specification difference within family
  // (Both are already in same materialStandardFamily due to hard filter, but slight spec detail can differ)
  const specDiff = a.materialSpec === b.materialSpec ? 0 : 0.2;

  // 4. Building structure difference within family
  const structDiff = a.buildingStructure === b.buildingStructure ? 0 : 0.15;

  // Composite weighted distance
  const totalDist =
    params.w1_distance * normGeoDist +
    params.w2_time * normTimeDist +
    params.w3_material * specDiff +
    params.w4_structure * structDiff;

  return totalDist;
}

export function runHDBSCANClustering(
  compatibilityGroup: CompatibilityGroup,
  params: ClusteringParameters
): {
  rawClusters: DecomposedDemandItem[][];
  waitlistPool: DecomposedDemandItem[];
} {
  const items = compatibilityGroup.demands;
  const n = items.length;

  if (n === 0) {
    return { rawClusters: [], waitlistPool: [] };
  }

  // If items count is less than minimum cluster size, all go directly to waitlist pool
  if (n < params.minClusterSize) {
    return {
      rawClusters: [],
      waitlistPool: [...items],
    };
  }

  // Build pairwise distance matrix
  const distMatrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        distMatrix[i][j] = 0;
      } else {
        distMatrix[i][j] = calculateSpatioTemporalDistance(items[i], items[j], params);
      }
    }
  }

  // Compute Core Distance for each point:
  // In HDBSCAN, core_dist(p) = distance to its k-nearest neighbor where k = minClusterSize - 1
  const kNeighbor = Math.max(1, Math.min(params.minClusterSize - 1, n - 1));
  const coreDistances: number[] = items.map((_, i) => {
    const sortedDists = [...distMatrix[i]].sort((a, b) => a - b);
    return sortedDists[kNeighbor] || 0;
  });

  // Compute Mutual Reachability Distance (MRD)
  // d_mrd(a, b) = max(core_dist(a), core_dist(b), d(a, b))
  const mrdMatrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      mrdMatrix[i][j] = Math.max(coreDistances[i], coreDistances[j], distMatrix[i][j]);
    }
  }

  // Density-reachability clustering threshold:
  // Points must be within spatio-temporal boundary (norm distance <= 1.15)
  // and geographic distance <= searchRadiusKm * 1.3
  const MAX_REACHABILITY_THRESHOLD = 1.15;
  const visited = new Set<number>();
  const rawClusters: DecomposedDemandItem[][] = [];
  const waitlistPool: DecomposedDemandItem[] = [];

  for (let i = 0; i < n; i++) {
    if (visited.has(i)) continue;

    // BFS / Density component expansion
    const currentClusterIndices: number[] = [i];
    visited.add(i);

    const queue: number[] = [i];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      for (let neighbor = 0; neighbor < n; neighbor++) {
        if (neighbor === curr) continue;

        // Check Mutual Reachability Distance AND absolute geo distance constraint
        const geoKm = calculateHaversineDistanceKm(items[curr].coords, items[neighbor].coords);
        const timeDiff = Math.abs(items[curr].desiredMonth - items[neighbor].desiredMonth);

        const isReachable =
          mrdMatrix[curr][neighbor] <= MAX_REACHABILITY_THRESHOLD &&
          geoKm <= params.searchRadiusKm * 1.35 &&
          timeDiff <= params.timeWindowMonths;

        if (isReachable && !visited.has(neighbor)) {
          visited.add(neighbor);
          currentClusterIndices.push(neighbor);
          queue.push(neighbor);
        }
      }
    }

    // HDBSCAN Minimum Cluster Size Condition:
    // If the formed cluster has at least minClusterSize households, it's a valid cluster.
    // Otherwise, these isolated/low-density points are classified as noise / "대기 풀(Waitlist)".
    if (currentClusterIndices.length >= params.minClusterSize) {
      rawClusters.push(currentClusterIndices.map((idx) => items[idx]));
    } else {
      currentClusterIndices.forEach((idx) => {
        waitlistPool.push(items[idx]);
      });
    }
  }

  return { rawClusters, waitlistPool };
}

// -------------------------------------------------------------
// 3) Greedy Cost Optimization Model & Merge/Split
// -------------------------------------------------------------

// Calculate non-linear material discount curve with asymptote floor
export function calculateMaterialDiscountRate(householdCount: number): number {
  if (householdCount <= 1) return 0;
  // Curve: Rapid savings initially, converging towards 26.5% discount floor
  // N=2: 8%, N=3: 13.5%, N=4: 17.5%, N=5: 20.2%, N=8: 24.1%, N=10+: 25.8%
  const MAX_DISCOUNT_FLOOR = 26.5;
  const decayRate = 0.38;
  const discount = MAX_DISCOUNT_FLOOR * (1 - Math.exp(-decayRate * (householdCount - 1)));
  return Number(discount.toFixed(1));
}

// Full Cost Model Calculator for a cluster
export function computeClusterCost(
  members: DecomposedDemandItem[],
  workCategory: WorkCategoryType
): ClusterCostBreakdown {
  const N = Math.max(1, members.length);

  // Baseline standard price per household (시중 개별 공사 견적)
  const baselinePrices: Record<WorkCategoryType, number> = {
    창호: 1000, // 1,000만원
    외단열: 880, // 880만원
    지붕: 750, // 750만원
    설비: 550, // 550만원
  };
  const standardBaseline = baselinePrices[workCategory] || 1000;

  // Breakdown proportions of individual baseline
  const baseMaterialPortion = standardBaseline * 0.58; // 58% material
  const baseLaborPortion = standardBaseline * 0.24; // 24% labor
  const baseLogisticsPortion = 30; // 30만원 baseline transport
  const totalFixedEquipmentOverhead = 280; // 280만원 (사다리차 1일 임대 + 비계 운반 + 인허가/감리)

  // 1. Material Cost (with volume discount curve)
  const materialDiscountRate = calculateMaterialDiscountRate(N);
  const materialCostPerHousehold = Math.round(
    baseMaterialPortion * (1 - materialDiscountRate / 100)
  );

  // 2. Labor Cost (continuous team deployment efficiency)
  const laborDiscountRate = Math.min(18, Math.max(0, 3.8 * (N - 1)));
  const laborCostPerHousehold = Math.round(baseLaborPortion * (1 - laborDiscountRate / 100));

  // 3. Logistics & Movement Cost (scales with cluster spread in km)
  // Calculate average spread from centroid
  let centerLat = 0;
  let centerLng = 0;
  members.forEach((m) => {
    centerLat += m.coords.lat;
    centerLng += m.coords.lng;
  });
  centerLat /= N;
  centerLng /= N;

  const avgDistanceToCenterKm =
    members.reduce(
      (sum, m) => sum + calculateHaversineDistanceKm({ lat: centerLat, lng: centerLng }, m.coords),
      0
    ) / N;

  // Logistics penalty: if spread exceeds 1km, transport cost increases
  const logisticsCostPerHousehold = Math.round(
    baseLogisticsPortion + Math.max(0, avgDistanceToCenterKm * 18)
  );

  // 4. Fixed Cost (Equipment & Overhead shared across N households)
  // Shared crane, scaffolding truck, centralized permit inspection:
  const fixedCostPerHousehold = Math.round(totalFixedEquipmentOverhead / N);

  // 5. Total Cost per Household
  const totalCostPerHousehold =
    materialCostPerHousehold +
    laborCostPerHousehold +
    logisticsCostPerHousehold +
    fixedCostPerHousehold;

  const savingsAmountPerHousehold = Math.max(0, standardBaseline - totalCostPerHousehold);
  const savingsRate = Number(((savingsAmountPerHousehold / standardBaseline) * 100).toFixed(1));
  const totalClusterCost = totalCostPerHousehold * N;
  const totalGroupSavings = savingsAmountPerHousehold * N;

  // Recommended optimal scale (plateau where logistics cost begins to offset additional material discounts)
  const optimalScale = workCategory === "창호" ? 6 : workCategory === "외단열" ? 5 : 8;

  return {
    standardBaselinePricePerHousehold: standardBaseline,
    materialCostPerHousehold,
    materialDiscountRate,
    laborCostPerHousehold,
    logisticsCostPerHousehold,
    fixedCostPerHousehold,
    totalCostPerHousehold,
    totalClusterCost,
    savingsRate,
    savingsAmountPerHousehold,
    totalGroupSavings,
    optimalScale,
  };
}

// Greedy Cluster Merge Optimization:
// Evaluates pairs of adjacent clusters. If merging reduces average per-household cost
// (material discount & equipment sharing outweigh the logistics spread penalty), merge them!
export function optimizeClustersWithGreedyMerge(
  rawClusters: DecomposedDemandItem[][],
  workCategory: WorkCategoryType,
  enabled: boolean = true
): OptimizedCluster[] {
  let clusters: OptimizedCluster[] = rawClusters.map((members, idx) => {
    const cost = computeClusterCost(members, workCategory);
    let cLat = 0;
    let cLng = 0;
    members.forEach((m) => {
      cLat += m.coords.lat;
      cLng += m.coords.lng;
    });
    cLat /= members.length;
    cLng /= members.length;

    const maxRadius = Math.max(
      0.3,
      ...members.map((m) =>
        calculateHaversineDistanceKm({ lat: cLat, lng: cLng }, m.coords)
      )
    );

    return {
      clusterId: `cluster-${workCategory}-${idx + 1}`,
      name: `마포구 ${workCategory} ${members.length}세대 통합 패키지`,
      workCategory,
      materialSpec: members[0]?.materialSpec || "표준 규격",
      structureType: members[0]?.buildingStructure || "철근콘크리트구조",
      centerCoords: { lat: Number(cLat.toFixed(5)), lng: Number(cLng.toFixed(5)) },
      radiusKm: Number(maxRadius.toFixed(2)),
      householdCount: members.length,
      members,
      status: "성사(발주가능)" as const,
      costBreakdown: cost,
      greedyMergeLog: "초기 HDBSCAN 밀도 군집 형성 완료",
      isUserIncluded: members.some((m) => m.isUser),
    };
  });

  if (!enabled || clusters.length < 2) {
    return clusters;
  }

  // Greedy pairwise merge evaluation loop
  let mergedAny = true;
  while (mergedAny && clusters.length >= 2) {
    mergedAny = false;
    let bestMergePair: [number, number] | null = null;
    let bestSavingsImprovement = 0;

    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const c1 = clusters[i];
        const c2 = clusters[j];

        // Evaluate distance between cluster centroids
        const centroidDist = calculateHaversineDistanceKm(c1.centerCoords, c2.centerCoords);
        if (centroidDist > 2.5) {
          // Centroids too far (>2.5km) to share crane/scaffolding safely
          continue;
        }

        // Calculate combined cost if merged
        const combinedMembers = [...c1.members, ...c2.members];
        const combinedCost = computeClusterCost(combinedMembers, workCategory);

        // Weighted current cost
        const currentAvgPerHousehold =
          (c1.costBreakdown.totalCostPerHousehold * c1.householdCount +
            c2.costBreakdown.totalCostPerHousehold * c2.householdCount) /
          (c1.householdCount + c2.householdCount);

        const savingsDiff = currentAvgPerHousehold - combinedCost.totalCostPerHousehold;

        // If merging saves at least 15만원/household and is the best improvement
        if (savingsDiff > 15 && savingsDiff > bestSavingsImprovement) {
          bestSavingsImprovement = savingsDiff;
          bestMergePair = [i, j];
        }
      }
    }

    if (bestMergePair) {
      const [idxA, idxB] = bestMergePair;
      const cA = clusters[idxA];
      const cB = clusters[idxB];
      const mergedMembers = [...cA.members, ...cB.members];
      const mergedCost = computeClusterCost(mergedMembers, workCategory);

      let cLat = 0;
      let cLng = 0;
      mergedMembers.forEach((m) => {
        cLat += m.coords.lat;
        cLng += m.coords.lng;
      });
      cLat /= mergedMembers.length;
      cLng /= mergedMembers.length;

      const maxRadius = Math.max(
        0.3,
        ...mergedMembers.map((m) =>
          calculateHaversineDistanceKm({ lat: cLat, lng: cLng }, m.coords)
        )
      );

      const mergedCluster: OptimizedCluster = {
        clusterId: `cluster-merged-${cA.clusterId}-${cB.clusterId}`,
        name: `마포구 ${workCategory} ${mergedMembers.length}세대 탐욕적 최적 병합 패키지`,
        workCategory,
        materialSpec: mergedMembers[0]?.materialSpec || "표준 규격",
        structureType: mergedMembers[0]?.buildingStructure || "철근콘크리트구조",
        centerCoords: { lat: Number(cLat.toFixed(5)), lng: Number(cLng.toFixed(5)) },
        radiusKm: Number(maxRadius.toFixed(2)),
        householdCount: mergedMembers.length,
        members: mergedMembers,
        status: "성사(발주가능)" as const,
        costBreakdown: mergedCost,
        greedyMergeLog: `탐욕적 병합 성공: 인접 군집(${cA.householdCount}세대 + ${cB.householdCount}세대) 통합으로 세대당 +${Math.round(
          bestSavingsImprovement
        )}만원 추가 절감 달성`,
        isUserIncluded: mergedMembers.some((m) => m.isUser),
      };

      // Replace merged clusters
      clusters = clusters.filter((_, idx) => idx !== idxA && idx !== idxB);
      clusters.unshift(mergedCluster);
      mergedAny = true;
    }
  }

  return clusters;
}

// -------------------------------------------------------------
// Main AI Matching Engine Pipeline
// -------------------------------------------------------------
export function executeMatchingEngine(
  userBuilding: BuildingLedgerData,
  userSelectedWorks: string[],
  userBudgetCap: number,
  userDesiredSchedule: string,
  params: ClusteringParameters = {
    w1_distance: 0.45,
    w2_time: 0.25,
    w3_material: 0.15,
    w4_structure: 0.15,
    minClusterSize: 3,
    searchRadiusKm: 1.5,
    timeWindowMonths: 2,
    enableGreedyMerge: true,
  }
): MatchingEngineResult {
  // Step 1: Demand Decomposition & Strict Hard Filtering
  const { allDecomposedItems, compatibilityGroups } = decomposeAndFilterDemands(
    userBuilding,
    userSelectedWorks,
    userBudgetCap,
    userDesiredSchedule,
    SEED_NEIGHBOR_DEMANDS
  );

  const allOptimizedClusters: OptimizedCluster[] = [];
  const globalWaitlist: DecomposedDemandItem[] = [];

  // Step 2 & 3: Run HDBSCAN and Greedy Optimization for each Compatibility Group
  for (const group of compatibilityGroups) {
    const { rawClusters, waitlistPool } = runHDBSCANClustering(group, params);
    waitlistPool.forEach((w) => globalWaitlist.push(w));

    if (rawClusters.length > 0) {
      const optimized = optimizeClustersWithGreedyMerge(
        rawClusters,
        group.workCategory,
        params.enableGreedyMerge
      );
      optimized.forEach((c) => allOptimizedClusters.push(c));
    }
  }

  // Identify cluster containing the user (priority selection)
  let selectedCluster = allOptimizedClusters.find((c) => c.isUserIncluded) || null;
  if (!selectedCluster && allOptimizedClusters.length > 0) {
    selectedCluster = allOptimizedClusters[0];
  }

  // Calculate high-level summary
  const matchedHouseholds = allOptimizedClusters.reduce((sum, c) => sum + c.householdCount, 0);
  const totalSavings = allOptimizedClusters.reduce(
    (sum, c) => sum + c.costBreakdown.totalGroupSavings,
    0
  );
  const avgSavingsRate =
    allOptimizedClusters.length > 0
      ? Number(
          (
            allOptimizedClusters.reduce((sum, c) => sum + c.costBreakdown.savingsRate, 0) /
            allOptimizedClusters.length
          ).toFixed(1)
        )
      : 0;

  return {
    timestamp: new Date().toISOString(),
    totalInputDemands: SEED_NEIGHBOR_DEMANDS.length + 1,
    totalDecomposedItems: allDecomposedItems.length,
    compatibilityGroups,
    clusters: allOptimizedClusters,
    waitlistPool: globalWaitlist,
    selectedCluster,
    summary: {
      matchedHouseholds,
      waitlistHouseholds: globalWaitlist.length,
      averageSavingsRate: avgSavingsRate,
      totalSavingsAmount: totalSavings,
    },
  };
}
