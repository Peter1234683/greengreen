import {
  ClusterHouseholdCompletion,
  ContractorReview,
  ContractorTrustProfile,
  InspectionChecklistItem,
} from "../types";
import { PRESET_AFTER_IMAGES, PRESET_SAMPLE_IMAGES } from "../services/sampleImages";

// -------------------------------------------------------------
// 1. Cluster Participating Households (for Cross-Verification)
// -------------------------------------------------------------
export const CLUSTER_HOUSEHOLDS_COMPLETION: ClusterHouseholdCompletion[] = [
  {
    id: "hh-101",
    unitName: "101호 (김*수 님)",
    address: "서울시 마포구 연남동 239-12 1층",
    workSummary: "26mm 로이복층 1등급 시스템 이중창 4개소",
    completionDate: "2026.04.18",
    status: "준공 승인 완료",
    beforeThumb: PRESET_SAMPLE_IMAGES[0].dataUrl,
    afterThumb: PRESET_AFTER_IMAGES[0].dataUrl,
    lotNumber: "LOT-2026-LX041",
    inspectionScore: 98,
    contractorName: "그린이엔씨건설(주)",
    notes: "우레탄폼 100% 밀실 충진 및 초내후성 변성실리콘 코킹 균일 도포 합격",
  },
  {
    id: "hh-202",
    unitName: "202호 (박*영 님)",
    address: "서울시 마포구 연남동 239-12 2층",
    workSummary: "26mm 로이 시스템 이중창 5개소 + 외벽 코킹",
    completionDate: "2026.04.19",
    status: "준공 승인 완료",
    beforeThumb: PRESET_SAMPLE_IMAGES[1].dataUrl,
    afterThumb: PRESET_AFTER_IMAGES[1].dataUrl,
    lotNumber: "LOT-2026-LX041",
    inspectionScore: 97,
    contractorName: "그린이엔씨건설(주)",
    notes: "동일 묶음 자재(LOT-2026-LX041) 안착 및 북측 발코니 열교 결로 개선 확인",
  },
  {
    id: "hh-301",
    unitName: "301호 (이*진 님)",
    address: "서울시 마포구 연남동 239-12 3층",
    workSummary: "26mm 로이 복층창호 3개소",
    completionDate: "2026.04.20",
    status: "AI 검측 진행중",
    beforeThumb: PRESET_SAMPLE_IMAGES[2].dataUrl,
    afterThumb: PRESET_AFTER_IMAGES[2].dataUrl,
    lotNumber: "LOT-2026-LX042",
    inspectionScore: 95,
    contractorName: "그린이엔씨건설(주)",
    notes: "창호 프레임 안착 완료, 현장 준공 사진 Gemini 비전 감리 판정 대기 중",
  },
  {
    id: "hh-102",
    unitName: "102호 (최*호 님)",
    address: "서울시 마포구 연남동 239-14 1층",
    workSummary: "26mm 로이 시스템 이중창 4개소",
    completionDate: "2026.04.21",
    status: "사진 접수완료",
    beforeThumb: PRESET_SAMPLE_IMAGES[0].dataUrl,
    afterThumb: PRESET_AFTER_IMAGES[0].dataUrl,
    lotNumber: "LOT-2026-LX041",
    inspectionScore: 96,
    contractorName: "그린이엔씨건설(주)",
    notes: "시공사 준공 사진 등록 완료, 소유주와 AI 감리원 공동 검측 접수",
  },
];

// -------------------------------------------------------------
// 2. Initial Reviews with Anomaly Outlier Detection
// -------------------------------------------------------------
export const INITIAL_CONTRACTOR_REVIEWS: ContractorReview[] = [
  {
    id: "rev-1",
    householdName: "김*수 (마포구 연남동 101호)",
    clusterTitle: "연남동 다가구 5세대 로이창호 공동구매",
    ratingOverall: 5,
    ratingQuality: 5,
    ratingSchedule: 5,
    ratingKindness: 5,
    comment:
      "공동구매로 18%나 할인받아 진행했는데 품질이 기대 이상입니다. 기존 알루미늄 샤시 때는 겨울마다 결로 물방울이 줄줄 흘렀는데 교체 후 결로가 100% 사라지고 외풍 소음도 완벽 차단되었습니다. 시공 소장님도 매우 친절하셨습니다.",
    createdAt: "2026.04.21",
    isVerified: true,
    isOutlier: false,
    workType: "26mm 로이 시스템 이중창",
  },
  {
    id: "rev-2",
    householdName: "박*영 (마포구 연남동 202호)",
    clusterTitle: "연남동 다가구 5세대 로이창호 공동구매",
    ratingOverall: 5,
    ratingQuality: 5,
    ratingSchedule: 4,
    ratingKindness: 5,
    comment:
      "약속된 당일 오전 8시에 정확히 팀이 들어와서 기존 창호 철거부터 우레탄폼 충진까지 하루 만에 깔끔하게 끝내주셨습니다. 에스크로로 중도금과 잔금이 단계별로 안전하게 보호되니 공사비 떼일 걱정 없이 안심하고 지켜볼 수 있었습니다.",
    createdAt: "2026.04.22",
    isVerified: true,
    isOutlier: false,
    workType: "26mm 로이 시스템 이중창 + 코킹",
  },
  {
    id: "rev-3",
    householdName: "이*진 (마포구 성미산로 301호)",
    clusterTitle: "연남동 다가구 5세대 로이창호 공동구매",
    ratingOverall: 4,
    ratingQuality: 5,
    ratingSchedule: 4,
    ratingKindness: 4,
    comment:
      "단열 효과가 정말 확실합니다. 실내 온도가 2~3도 올라간 느낌이고 보일러 트는 시간이 절반으로 줄었습니다. 5% A/S 유보금이 3개월간 에스크로에 묶여 있으니 사후 관리도 신뢰가 갑니다.",
    createdAt: "2026.04.22",
    isVerified: true,
    isOutlier: false,
    workType: "26mm 로이 시스템창호",
  },
  {
    id: "rev-4",
    householdName: "익명 세대 (클러스터 외부 불일치)",
    clusterTitle: "연남동 다가구 5세대 로이창호 공동구매",
    ratingOverall: 1,
    ratingQuality: 1,
    ratingSchedule: 1,
    ratingKindness: 1,
    comment:
      "골목길에 자재 트럭 세워두고 공사해서 주차하기 불편했습니다. 시공 자체는 안 해봤지만 시끄럽네요.",
    createdAt: "2026.04.23",
    isVerified: false,
    isOutlier: true,
    outlierReason:
      "클러스터 평균 평점(4.7점) 대비 극단치 편차(-3.7점) 및 실제 시공 검증 미확인 비방 리뷰 감지",
    workType: "단순 통행 불만",
  },
];

// -------------------------------------------------------------
// 3. Outlier Anomaly Detection Logic
// -------------------------------------------------------------
export interface AnomalyAnalysisResult {
  clusterAverage: number;
  qualityAverage: number;
  scheduleAverage: number;
  kindnessAverage: number;
  outlierCount: number;
  verifiedCount: number;
}

export function analyzeReviewAnomalies(
  reviews: ContractorReview[]
): AnomalyAnalysisResult {
  const verifiedReviews = reviews.filter((r) => r.isVerified);
  const targetPool = verifiedReviews.length > 0 ? verifiedReviews : reviews;

  const clusterAverage =
    targetPool.reduce((acc, r) => acc + r.ratingOverall, 0) / (targetPool.length || 1);
  const qualityAverage =
    targetPool.reduce((acc, r) => acc + r.ratingQuality, 0) / (targetPool.length || 1);
  const scheduleAverage =
    targetPool.reduce((acc, r) => acc + r.ratingSchedule, 0) / (targetPool.length || 1);
  const kindnessAverage =
    targetPool.reduce((acc, r) => acc + r.ratingKindness, 0) / (targetPool.length || 1);

  const outlierCount = reviews.filter((r) => r.isOutlier).length;
  const verifiedCount = reviews.filter((r) => r.isVerified).length;

  return {
    clusterAverage: Math.round(clusterAverage * 10) / 10,
    qualityAverage: Math.round(qualityAverage * 10) / 10,
    scheduleAverage: Math.round(scheduleAverage * 10) / 10,
    kindnessAverage: Math.round(kindnessAverage * 10) / 10,
    outlierCount,
    verifiedCount,
  };
}

export function detectReviewOutlier(
  review: {
    ratingOverall: number;
    ratingQuality: number;
    ratingSchedule: number;
    ratingKindness: number;
    comment: string;
    isVerified: boolean;
  },
  existingReviews: ContractorReview[]
): { isOutlier: boolean; reason?: string } {
  const verified = existingReviews.filter((r) => r.isVerified);
  const pool = verified.length > 0 ? verified : existingReviews;
  const avg = pool.reduce((acc, r) => acc + r.ratingOverall, 0) / (pool.length || 1);

  // Criteria 1: Extreme statistical deviation (|score - mean| >= 1.8)
  const diff = Math.abs(review.ratingOverall - avg);
  if (diff >= 1.8 && review.ratingOverall <= 2) {
    return {
      isOutlier: true,
      reason: `클러스터 참여 세대 평균 평점(${avg.toFixed(1)}점) 대비 현저한 편차(${diff.toFixed(1)}점) 감지 (교차 검증 필요)`,
    };
  }

  // Criteria 2: Internal inconsistency (e.g. quality 5 stars but overall 1 star)
  const subAvg = (review.ratingQuality + review.ratingSchedule + review.ratingKindness) / 3;
  if (Math.abs(review.ratingOverall - subAvg) >= 2.5) {
    return {
      isOutlier: true,
      reason: `종합 평점(${review.ratingOverall}점)과 세부 항목 평균(${subAvg.toFixed(1)}점) 간 비정상적 불일치 감지`,
    };
  }

  // Criteria 3: Extremely short unverified negative review
  if (!review.isVerified && review.ratingOverall <= 2 && review.comment.length < 15) {
    return {
      isOutlier: true,
      reason: "미검증 계정의 무근거 단문 부정 평가 감지",
    };
  }

  return { isOutlier: false };
}

// -------------------------------------------------------------
// 4. Contractor Trust Profile (Cumulative Reputation & Safety)
// -------------------------------------------------------------
export const DEFAULT_CONTRACTOR_TRUST_PROFILES: Record<string, ContractorTrustProfile> = {
  "그린이엔씨건설(주)": {
    contractorName: "그린이엔씨건설(주)",
    representativeName: "김정호",
    businessNumber: "105-86-49201",
    licenseNumber: "서울 마포 제2018-01-094호",
    licenseName: "금속구조물·창호·온돌공사업 (전문건설업)",
    establishedYear: 2012,
    reputationScore: 4.88,
    totalReviews: 142,
    accidentFreeProjects: 342,
    warrantyFulfillmentRate: 100,
    insuranceCoverage: "DB손해보험 영업배상책임보험 5억원 가입",
    completedClusters: 28,
    officeLocation: "서울특별시 마포구 월드컵북로 120, 3층",
    highlights: [
      "국토교통부 그린리모델링 우수사업자 3년 연속 선정 (2023~2025)",
      "창호 시공 12년 무사고 연속 342건 달성",
      "SGI서울보증 하자이행보증증권 100% 의무 발행",
      "에너지 1등급 시스템창호 본사 직영 시공팀 파견",
    ],
  },
  "한결하우징시스템": {
    contractorName: "한결하우징시스템",
    representativeName: "이성민",
    businessNumber: "214-81-78923",
    licenseNumber: "서울 영등포 제2015-02-118호",
    licenseName: "실내건축공사업 / 금속창호온돌공사업",
    establishedYear: 2015,
    reputationScore: 4.92,
    totalReviews: 96,
    accidentFreeProjects: 215,
    warrantyFulfillmentRate: 100,
    insuranceCoverage: "현대해상 영업배상책임보험 3억원 가입",
    completedClusters: 19,
    officeLocation: "서울특별시 영등포구 선유로 49길 23",
    highlights: [
      "서울시 BRP 건물에너지효율화사업 공식 협력 시공사",
      "연속 215건 무사고 준공 기록",
      "자체 5년 무상 A/S 긴급출동 보증팀 운영",
    ],
  },
};

// -------------------------------------------------------------
// 5. Standard AI Completion Inspection Checklist Baseline
// -------------------------------------------------------------
export const STANDARD_COMPLETION_CHECKLIST: InspectionChecklistItem[] = [
  {
    id: "chk-material-1",
    category: "계약 자재 규격 일치율",
    contractSpec: "계약서 제3조: 24mm/26mm 고단열 로이복층유리 1등급 (KS L 2003 인증)",
    verifiedStatus: "O",
    comment: "LG 하우시스 정품 26mm 로이복층유리 식별 마크 및 에너지소비효율 1등급 인증 라벨 육안 일치",
    isContractMaterialMatch: true,
  },
  {
    id: "chk-foam-2",
    category: "외벽 접합부 우레탄폼 밀실 충진",
    contractSpec: "계약서 제4조: 창틀과 골조 사이 열교 방지용 고난연 우레탄폼 100% 밀실 충진",
    verifiedStatus: "O",
    comment: "창틀 주위 단열재 빈틈 없는 100% 밀실 충진 확인, 열교(Thermal Bridge) 차단 완료",
    isContractMaterialMatch: true,
  },
  {
    id: "chk-caulk-3",
    category: "실리콘 코킹 균일도 및 방수성",
    contractSpec: "계약서 제4조: 창호 전용 초내후성 비오염 변성실리콘 12~15mm 두께 균일 도포",
    verifiedStatus: "O",
    comment: "코킹 비드에 기포나 찢김 없이 매끄럽게 마감되어 빗물 침투 및 누수 위험 원천 차단",
    isContractMaterialMatch: true,
  },
  {
    id: "chk-level-4",
    category: "프레임 수평·수직 허용오차",
    contractSpec: "계약서 제5조: 창호 프레임 개폐 수평·수직 허용오차 ±2.0mm 이내 정밀 안착",
    verifiedStatus: "O",
    comment: "레이저 레벨기 계측 오차 0.7mm로 합격 기준(±2mm) 충족, 창짝 부드러운 개폐 확인",
    isContractMaterialMatch: true,
  },
  {
    id: "chk-clean-5",
    category: "철거 잔재물 반출 및 준공 청소",
    contractSpec: "계약서 제7조: 기존 알루미늄 샤시 전량 폐기물 처리 및 세대 내 준공 청소",
    verifiedStatus: "O",
    comment: "기존 노후 알루미늄 샤시 폐기물 일체 반출 완료 및 주변 바닥 정리정돈 상태 양호",
    isContractMaterialMatch: true,
  },
];
