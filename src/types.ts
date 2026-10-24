export interface BuildingLedgerData {
  address: string;
  roadAddress: string;
  approvalDate: string; // 사용승인일 (e.g. 1993-10-15)
  ageYears: number; // 경과 연수
  grossArea: string; // 연면적 (m²)
  structure: string; // 주요 구조 (e.g. 철근콘크리트구조, 조적조, 벽돌구조)
  purpose: string; // 주용도 (e.g. 다가구주택, 단독주택, 다세대주택)
  floors: string; // 층수 (e.g. 지상 3층 / 지하 1층)
  heatingType: string; // 난방 방식 (e.g. 개별난방 도시가스)
  insulationStandardAtBuild: string; // 준공 당시 적용 단열 기준 (e.g. 1992년 기준 외벽 50mm 미만)
  currentCodeGap: string; // 현행 기준 대비 단열 성능 격차
}

export interface DefectItem {
  part: string;
  finding: string;
  severity: "high" | "medium" | "low";
  recommendation: string;
}

export interface RecommendedWorkItem {
  id: string;
  title: string;
  category: "창호" | "단열" | "설비" | "신재생" | "스마트제어";
  priority: "필수(최우선)" | "권장" | "선택";
  estimatedCostRange: string;
  subsidyEligible: boolean;
  subsidyNote: string;
  expectedBenefit: string;
  compatibilitySpecs: string;
}

export interface DiagnosisResult {
  agingScore: number; // 0 ~ 100
  riskLevel: "심각(위험)" | "주의(개선권장)" | "양호";
  insulationGrade: string; // e.g. "F등급 (취약)"
  energyLossReductionEst: number; // e.g. 36%
  defects: DefectItem[];
  recommendedWorks: RecommendedWorkItem[];
  expertVerdict: string;
  clusterSuitability: string;
  isAiGenerated?: boolean;
}

export interface RegisteredDemand {
  id: string;
  address: string;
  selectedWorks: string[]; // ids of RecommendedWorkItem
  maxBudget: number; // 만원 단위
  desiredSchedule: string; // e.g. "2026년 4월 ~ 5월"
  contactPhone: string;
  buildingData: BuildingLedgerData;
  createdAt: string;
}

export interface DemandCluster {
  id: string;
  name: string;
  region: string;
  centerCoords: { lat: number; lng: number };
  radiusKm: number;
  workCategory: string;
  specStandard: string;
  currentHouseholds: number;
  targetHouseholds: number;
  discountRate: number; // %
  nextTierHouseholdsNeeded: number;
  nextTierDiscountRate: number;
  status: "모집중" | "공고발행" | "입찰마감";
}

export interface ContractorBid {
  id: string;
  contractorName: string;
  establishedYear: number;
  completedProjects: number;
  rating: number; // 1~5
  bidPrice: number; // 만원 (세대당 평균)
  standardPrice: number; // 만원
  discountRate: number; // %
  warrantyPeriodYears: number; // A/S 보증기간 (년)
  specHighlights: string[];
}

export interface EvaluationItem {
  category: string;
  score: number;
  status: "우수" | "양호" | "주의";
  comment: string;
}

export interface InspectionChecklistItem {
  id: string;
  category: string;
  contractSpec: string; // 계약서에 명시된 자재 규격 (예: 로이유리 24mm/26mm KS L 2003)
  verifiedStatus: "O" | "X"; // O(적합/일치) | X(부적합/재시공)
  comment: string;
  isContractMaterialMatch: boolean;
}

export interface FinishInspectionResult {
  overallScore: number;
  verdict: "승인(우수)" | "조건부 승인(경미한 보완)" | "재시공(반려)";
  passRate: number;
  evaluationItems: EvaluationItem[];
  checklistItems?: InspectionChecklistItem[];
  detailedAnalysis: string;
  retentionAdvice: string;
  keyDifferences: string[];
  inspectedAt: string;
  isAiGenerated: boolean;
}

// -------------------------------------------------------------
// Step 6 Trust & Reputation Types
// -------------------------------------------------------------

export interface ClusterHouseholdCompletion {
  id: string;
  unitName: string; // 예: "101호 (김*수 님)"
  address: string;
  workSummary: string; // 예: "고효율 26mm 로이 시스템 이중창"
  completionDate: string;
  status: "준공 승인 완료" | "AI 검측 진행중" | "사진 접수완료";
  beforeThumb: string;
  afterThumb: string;
  lotNumber: string; // e.g., "LOT-2026-LX942"
  inspectionScore: number;
  contractorName: string;
  notes: string;
}

export interface ContractorReview {
  id: string;
  householdName: string; // 예: "김*수 (마포구 연남동 101호)"
  clusterTitle: string; // 예: "연남동 다가구 5세대 로이창호 패키지"
  ratingOverall: number; // 1~5
  ratingQuality: number; // 시공 품질 1~5
  ratingSchedule: number; // 일정 준수 1~5
  ratingKindness: number; // 친절도 및 소통 1~5
  comment: string;
  createdAt: string;
  isVerified: boolean; // 실제 에스크로 완료 세대 검증
  isOutlier: boolean; // 이상치 자동 감지 플래그
  outlierReason?: string; // 이상치 사유
  workType: string;
}

export interface ContractorTrustProfile {
  contractorName: string;
  representativeName: string;
  businessNumber: string;
  licenseNumber: string;
  licenseName: string;
  establishedYear: number;
  reputationScore: number; // 예: 4.88
  totalReviews: number;
  accidentFreeProjects: number; // 무사고 시공 건수
  warrantyFulfillmentRate: number; // 하자보수 이행률 (100%)
  insuranceCoverage: string; // 영업배상책임보험
  completedClusters: number;
  officeLocation: string;
  highlights: string[];
}

// -------------------------------------------------------------
// Step 3 AI Matching Engine & Spatio-Temporal Clustering Types
// -------------------------------------------------------------

export type WorkCategoryType = "창호" | "외단열" | "지붕" | "설비";
export type StructureFamilyType = "RC" | "BRICK" | "WOOD";
export type MaterialStandardFamilyType =
  | "PVC_DOUBLE_LOW_E"
  | "AL_SINGLE"
  | "PF_BOARD_100MM"
  | "EPS_BOARD"
  | "STEEL_ROOF"
  | "CONDENSING_BOILER";

export interface DecomposedDemandItem {
  id: string;
  demandId: string;
  isUser: boolean;
  ownerName: string;
  address: string;
  coords: { lat: number; lng: number };
  workCategory: WorkCategoryType;
  workTitle: string;
  materialSpec: string;
  materialStandardFamily: MaterialStandardFamilyType;
  buildingStructure: string;
  structureFamily: StructureFamilyType;
  desiredMonth: number; // e.g. 4 for 2026-04, 5 for 2026-05
  desiredScheduleText: string;
  budgetCap: number; // 만원
  areaSqMeters: number;
  floorCount: number;
  registeredAgo: string;
}

export interface CompatibilityGroup {
  groupId: string;
  name: string;
  workCategory: WorkCategoryType;
  materialStandardFamily: MaterialStandardFamilyType;
  structureFamily: StructureFamilyType;
  specDescription: string;
  structureDescription: string;
  demands: DecomposedDemandItem[];
}

export interface ClusteringParameters {
  w1_distance: number; // 지리적 거리 가중치 (default 0.45)
  w2_time: number; // 시공월 차이 가중치 (default 0.25)
  w3_material: number; // 자재규격 차이 가중치 (default 0.15)
  w4_structure: number; // 건물구조 차이 가중치 (default 0.15)
  minClusterSize: number; // 최소 성사 인원 (default 3)
  searchRadiusKm: number; // 탐색 반경 (default 1.5km)
  timeWindowMonths: number; // 시공 시기 차이 임계치 (default 2개월)
  enableGreedyMerge: boolean; // 그리디 병합 최적화 활성화 여부
}

export interface ClusterCostBreakdown {
  standardBaselinePricePerHousehold: number; // 만원 (개별 시공 기준단가)
  materialCostPerHousehold: number; // 만원 (물량 할인 반영)
  materialDiscountRate: number; // % (물량 할인 곡선)
  laborCostPerHousehold: number; // 만원 (연속 시공 효율)
  logisticsCostPerHousehold: number; // 만원 (거리/물류비)
  fixedCostPerHousehold: number; // 만원 (사다리차·장비·설계 고정비 n분할)
  totalCostPerHousehold: number; // 만원
  totalClusterCost: number; // 만원 (총 도급 규모)
  savingsRate: number; // %
  savingsAmountPerHousehold: number; // 만원
  totalGroupSavings: number; // 만원
  optimalScale: number; // 추천 최적 규모 (세대수)
}

export interface OptimizedCluster {
  clusterId: string;
  name: string;
  workCategory: WorkCategoryType;
  materialSpec: string;
  structureType: string;
  centerCoords: { lat: number; lng: number };
  radiusKm: number;
  householdCount: number;
  members: DecomposedDemandItem[];
  status: "성사(발주가능)" | "대기풀(추가모집필요)";
  costBreakdown: ClusterCostBreakdown;
  greedyMergeLog?: string;
  isUserIncluded: boolean;
}

export interface MatchingEngineResult {
  timestamp: string;
  totalInputDemands: number;
  totalDecomposedItems: number;
  compatibilityGroups: CompatibilityGroup[];
  clusters: OptimizedCluster[];
  waitlistPool: DecomposedDemandItem[];
  selectedCluster: OptimizedCluster | null;
  summary: {
    matchedHouseholds: number;
    waitlistHouseholds: number;
    averageSavingsRate: number;
    totalSavingsAmount: number;
  };
}

