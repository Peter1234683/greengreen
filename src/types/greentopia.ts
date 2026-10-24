// GreenTopia Domain Types & Schemas

export type UserRole = "customer" | "contractor" | "admin";

export type ContractorPqStatus = "pending" | "approved" | "rejected";

export type ConstructionDomain = 
  | "window"       // 고단열 창호
  | "outer_wall"   // 외단열
  | "inner_wall"   // 내단열/바닥
  | "boiler"       // 고효율 콘덴싱 보일러
  | "roof"         // 지붕단열/방수
  | "ventilation"; // 열회수 환기장치

export type BuildingUsageType = "단독주택" | "다가구주택" | "다세대주택" | "연립주택";

export type BuildingStructure = 
  | "조적조 (벽돌/연와)"
  | "철근콘크리트구조"
  | "목구조"
  | "경량철골조"
  | "기타";

export interface DemandTag {
  id: string;
  label: string;
  relatedDomain: ConstructionDomain;
  userPhrase: string; // 생활 언어 질문
}

export interface BuildingRecord {
  id: string;
  ownerId: string;
  address: string;
  roadAddress: string;
  sigungu: string; // e.g. "대구광역시 중구", "남구", "수성구", "달서구"
  dong: string;    // e.g. "대봉동", "대명동", "범어동"
  latitude: number;
  longitude: number;
  usageType: BuildingUsageType;
  structure: BuildingStructure;
  approvalYear: number; // 사용승인연도 (예: 1988)
  ageYears: number;     // 경과연수
  grossAreaSqm: number; // 연면적 (㎡)
  floorsAbove: number;  // 지상 층수
  households: number;   // 세대수
  
  // 에너지 & 진단 데이터 (간이 진단)
  energyGrade: string;  // "1등급" ~ "7등급" 또는 "취약 (E/F/G)"
  monthlyGasBillAvgWon: number; // 월평균 가스비
  monthlyElectricityBillAvgWon: number; // 월평균 전기비
  
  // 공사 수요 태그 (생활 언어 매핑)
  selectedDemands: string[]; // e.g. ["창호가 오래되었다", "겨울철 실내가 춥다"]
  relatedDomains: ConstructionDomain[];
  
  // 사용자 선호 및 일정
  preferredTiming: string; // "즉시 (1~2개월 내)" | "봄 (3~5월)" | "가을 (9~11월)" | "미정"
  estimatedBudgetWon: number;
  wantsCoConstruction: boolean; // 공동공사 참여 의향 (true/false)
  
  createdAt: string;
}

export interface ContractorProfile {
  id: string;
  userId: string;
  companyName: string;      // 상호
  representativeName: string; // 대표자명
  businessNumber: string;   // 사업자등록번호 (000-00-00000)
  contactPhone: string;     // 연락처
  email: string;
  specialties: ConstructionDomain[]; // 시공 가능 공종
  activityRegions: string[]; // 활동 권역 (예: ["대구 중구", "대구 남구", "대구 수성구"])
  
  // GR 사업자 및 면허 정보
  isGrCertified: boolean;   // 국토부 그린리모델링 사업자 등록 여부
  grCertificationNumber?: string;
  licenseType: string;      // 예: "실내건축공사업", "금속창호·지붕건축물조립공사업", "기계가스설비공사업"
  licenseNumber: string;
  warrantyGuaranteed: boolean; // 하자보증보험 발급 가능 여부
  
  // 자격 심사 (PQ) 상태
  pqStatus: ContractorPqStatus;
  pqReviewNotes?: string;
  pqApprovedAt?: string;
  
  // 실적 & 평판
  completedProjectsCount: number;
  grExperienceYears: number;
  reputationScore: number; // 5.0 만점
  reviewsCount: number;
  representativeProject: string; // 대표 실적
  averageSquareMeterPriceWon: Record<ConstructionDomain, number>; // 공종별 ㎡ 기준 단가
}

export interface ReviewRecord {
  id: string;
  projectId: string;
  buildingId: string;
  contractorId: string;
  customerName: string;
  ratingOverall: number; // 종합 별점 (1~5)
  ratings: {
    quality: number;      // 시공 품질
    schedule: number;     // 공기 준수
    safetyClean: number;  // 청결 및 안전
    communication: number;// 소통
    asResponse: number;   // A/S 대응
    costValue: number;    // 가격 대비 만족도
  };
  negativeTags?: string[]; // 불만 태그 (일정 지연, 추가비용 요구 등)
  comment: string;
  contractorReply?: string;
  postInspectionMonths?: number; // 6개월, 1년차 하자 추적
  hasDefectReported?: boolean;
  createdAt: string;
}

export interface ClusterRecord {
  id: string;
  title: string;
  targetDomain: ConstructionDomain;
  targetDomainLabel: string;
  sigungu: string;
  buildingIds: string[];
  totalBuildingsCount: number;
  radiusKm: number;
  averageCompatibilityScore: number; // 100점 만점
  matchingReasons: string[]; // 묶인 이유 체크리스트
  status: "gathering" | "bidding" | "awarded" | "in_progress" | "completed";
  minBuildingsRequired: number;
  createdAt: string;
}

export interface UserSession {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  buildingId?: string;
  contractorId?: string;
}
