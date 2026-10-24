export type GreenPartnerTier = "MASTER" | "GOLD" | "SILVER";

export interface ComplaintTagStat {
  tag: string;
  count: number;
  ratePercent: number; // e.g. 0.8%
  status: "양호" | "주의" | "청정";
  description: string;
}

export interface DetailedCategoryRating {
  category: string;
  score: number; // e.g. 4.9
  weightLabel: string;
}

export interface VerifiedCustomerReviewSummary {
  id: string;
  author: string;
  buildingType: string;
  rating: number;
  period: string;
  comment: string;
  workSummary: string;
  complaintReported: boolean;
  complaintTag?: string;
  resolutionNote?: string;
  followUpCheck?: string; // e.g. "시공 6개월 경과: 누수/결로 무하자 확인"
}

export interface ContractorReputationProfile {
  bidId: string;
  contractorName: string;
  partnerTier: GreenPartnerTier;
  partnerTierTitle: string; // e.g. "최우수 마스터 그린파트너 (Master)"
  tierDescription: string;
  certificationNumber: string; // e.g. "국토부-GR-2024-089A"
  overallRating: number; // 4.9
  totalReviewedHouseholds: number; // 284세대
  repeatRecommendationRate: number; // 98.4%

  // Detailed Ratings
  categoryRatings: DetailedCategoryRating[];

  // Complaint & Defect Statistics
  totalComplaintsCount: number; // 3건
  complaintRatePercent: number; // 1.1%
  complaintResolvedRate: number; // 100%
  averageResolutionHours: number; // 14시간

  // Specific Complaint Tags Breakdown
  complaintTags: ComplaintTagStat[];

  // 6-Month / 1-Year Follow-up Defect Tracking
  postConstructionDefectRate: number; // 0.0% (시공 후 하자 발생률)
  warrantyInsuranceIssuanceRate: number; // 100% (SGI서울보증)

  // Real Customer Reviews
  recentReviews: VerifiedCustomerReviewSummary[];
}

export const CONTRACTOR_REPUTATION_DATABASE: Record<string, ContractorReputationProfile> = {
  "bid-1": {
    bidId: "bid-1",
    contractorName: "(주)에코하임 그린건설",
    partnerTier: "MASTER",
    partnerTierTitle: "최우수 마스터 그린파트너",
    tierDescription: "최근 3개년 누적 300건 이상 준공 · 평균 평점 4.85 이상 · 불만율 1.5% 미만 최상위 시공사",
    certificationNumber: "국토부·그린토피아 GR-M2024-0012",
    overallRating: 4.9,
    totalReviewedHouseholds: 284,
    repeatRecommendationRate: 98.6,
    categoryRatings: [
      { category: "시공 품질 (단열·기밀·마감)", score: 4.9, weightLabel: "정밀 레이저 계측" },
      { category: "공사기간 준수 (당일 시공)", score: 4.9, weightLabel: "1일 철거·창호 안착" },
      { category: "청결 및 현장 안전관리", score: 4.8, weightLabel: "보양재 100% 철거 잔재물 반출" },
      { category: "소통 및 친절도", score: 4.9, weightLabel: "실시간 메신저 공정 공유" },
      { category: "A/S 및 사후 대응 속도", score: 4.9, weightLabel: "접수 후 24시간 내 방문" },
      { category: "가격 대비 만족도 (가성비)", score: 4.8, weightLabel: "공동구매 18% 단가 인하" },
    ],
    totalComplaintsCount: 3,
    complaintRatePercent: 1.1,
    complaintResolvedRate: 100,
    averageResolutionHours: 12,
    complaintTags: [
      { tag: "일정 지연", count: 2, ratePercent: 0.7, status: "양호", description: "우천 기상악화로 인한 1일 순연 (사전 안내 후 동의)" },
      { tag: "추가비용 요구", count: 0, ratePercent: 0.0, status: "청정", description: "에스크로 계약 외 추가금 0건 준수" },
      { tag: "마감 불량", count: 1, ratePercent: 0.4, status: "양호", description: "발코니 실리콘 라인 미세 보완 (당일 무상 재도포)" },
      { tag: "소음·분진 관리 미흡", count: 0, ratePercent: 0.0, status: "청정", description: "이웃 주민 사전 양해 및 흡진기 가동" },
      { tag: "연락 두절", count: 0, ratePercent: 0.0, status: "청정", description: "전담 현장소장 핫라인 상시 가동" },
      { tag: "하자 처리 지연", count: 0, ratePercent: 0.0, status: "청정", description: "접수 당일 즉각 출동 원칙" },
      { tag: "안전관리 미흡", count: 0, ratePercent: 0.0, status: "청정", description: "사다리차 안전 통제선 및 작업자 헬멧 착용" },
    ],
    postConstructionDefectRate: 0.0,
    warrantyInsuranceIssuanceRate: 100,
    recentReviews: [
      {
        id: "rev-eco-1",
        author: "김*수 님",
        buildingType: "연남동 다가구 2층",
        rating: 5.0,
        period: "2026.04 시공",
        comment: "공동구매로 진행해서 혹시나 품질이 떨어질까 걱정했는데 정품 26mm 로이창호에 단열 폼까지 꽉 채워주셨습니다. 외풍이 완전히 잡혀서 실내 온도가 3도나 올랐습니다.",
        workSummary: "LX 슈퍼세이브7 로이 26mm 전면 교체",
        complaintReported: false,
        followUpCheck: "시공 6개월 경과: 누수/결로 0건 (무하자 인증)",
      },
      {
        id: "rev-eco-2",
        author: "이*진 님",
        buildingType: "성미산로 단독주택",
        rating: 4.8,
        period: "2026.03 시공",
        comment: "공사 당일 비가 살짝 와서 일정이 하루 미뤄졌지만 소장님이 전날 미리 연락주시고 다음 날 오셔서 당일 저녁에 완벽히 마무리해주셨습니다. 매우 신뢰가 갑니다.",
        workSummary: "고단열 시스템 이중창 5개소",
        complaintReported: true,
        complaintTag: "일정 지연",
        resolutionNote: "기상악화 1일 순연 후 당일 연장작업으로 정시 완료",
        followUpCheck: "시공 3개월 경과: 방음·단열 만족도 100%",
      },
      {
        id: "rev-eco-3",
        author: "박*호 님",
        buildingType: "월드컵북로 다세대 3층",
        rating: 5.0,
        period: "2026.02 시공",
        comment: "기존 알루미늄 샤시 철거 잔재물도 바닥 스크래치 하나 없이 싹 청소해주셨어요. 에스크로로 잔금 묶어두고 검수하니 마음 편했습니다.",
        workSummary: "외벽 창호 4세트 + 방풍도어",
        complaintReported: false,
        followUpCheck: "시공 9개월 경과: 결로 0% 유지 중",
      },
    ],
  },

  "bid-2": {
    bidId: "bid-2",
    contractorName: "한빛 에너지시스템",
    partnerTier: "GOLD",
    partnerTierTitle: "골드 그린파트너",
    tierDescription: "최근 2개년 150건 이상 준공 · 세대당 최저가 경쟁력 · 불만율 2.5% 미만 우수 시공사",
    certificationNumber: "국토부·그린토피아 GR-G2024-0045",
    overallRating: 4.7,
    totalReviewedHouseholds: 198,
    repeatRecommendationRate: 94.2,
    categoryRatings: [
      { category: "시공 품질 (단열·기밀·마감)", score: 4.6, weightLabel: "KCC 글라스 정품 인증" },
      { category: "공사기간 준수 (당일 시공)", score: 4.8, weightLabel: "공동 시공팀 직접 투입" },
      { category: "청결 및 현장 안전관리", score: 4.5, weightLabel: "기본 정리정돈" },
      { category: "소통 및 친절도", score: 4.7, weightLabel: "일일 공정 보고" },
      { category: "A/S 및 사후 대응 속도", score: 4.6, weightLabel: "3년 무상 A/S" },
      { category: "가격 대비 만족도 (가성비)", score: 4.9, weightLabel: "단독 최저가 790만원" },
    ],
    totalComplaintsCount: 4,
    complaintRatePercent: 2.0,
    complaintResolvedRate: 100,
    averageResolutionHours: 18,
    complaintTags: [
      { tag: "일정 지연", count: 1, ratePercent: 0.5, status: "양호", description: "물류 배송 일시 지연 (2시간 후 정상 재개)" },
      { tag: "추가비용 요구", count: 0, ratePercent: 0.0, status: "청정", description: "계약 단가 100% 준수" },
      { tag: "마감 불량", count: 2, ratePercent: 1.0, status: "주의", description: "창틀 코킹 마감 잔여물 재정돈 (AS팀 당일 조치)" },
      { tag: "소음·분진 관리 미흡", count: 1, ratePercent: 0.5, status: "양호", description: "철거 시 분진 커버 추가 설치" },
      { tag: "연락 두절", count: 0, ratePercent: 0.0, status: "청정", description: "현장 관리자 항시 대기" },
      { tag: "하자 처리 지연", count: 0, ratePercent: 0.0, status: "청정", description: "24시간 이내 하자보수 접수 처리" },
      { tag: "안전관리 미흡", count: 0, ratePercent: 0.0, status: "청정", description: "작업장 안전수칙 준수" },
    ],
    postConstructionDefectRate: 0.5,
    warrantyInsuranceIssuanceRate: 100,
    recentReviews: [
      {
        id: "rev-han-1",
        author: "최*식 님",
        buildingType: "망원동 다가구",
        rating: 4.8,
        period: "2026.03 시공",
        comment: "가격이 가장 저렴해서 선택했는데 창호 열어보고 닫아보니 아주 묵직하고 소음도 잘 막아줍니다. 가성비 최고입니다.",
        workSummary: "KCC 프라임 26mm 이중창",
        complaintReported: false,
        followUpCheck: "시공 4개월 경과: 하자 없음",
      },
      {
        id: "rev-han-2",
        author: "윤*자 님",
        buildingType: "성산동 단독주택",
        rating: 4.5,
        period: "2026.02 시공",
        comment: "실리콘 모서리 부분이 살짝 거칠어서 말씀드렸더니 다음 날 바로 오셔서 깔끔하게 다시 발라주셨습니다. 사후 대응이 빨라요.",
        workSummary: "창호 4개소 교체",
        complaintReported: true,
        complaintTag: "마감 불량",
        resolutionNote: "실리콘 코킹 비드 현장 당일 재시공 완료",
        followUpCheck: "시공 5개월 경과: 방수·기밀 정상 유지",
      },
    ],
  },

  "bid-3": {
    bidId: "bid-3",
    contractorName: "(주)그린텍 엔지니어링",
    partnerTier: "MASTER",
    partnerTierTitle: "최우수 마스터 그린파트너",
    tierDescription: "최근 5개년 400건 이상 준공 · 열화상 진단 감리 특화 · 불만율 1.2% 미만 기술형 시공사",
    certificationNumber: "국토부·그린토피아 GR-M2023-0008",
    overallRating: 4.8,
    totalReviewedHouseholds: 320,
    repeatRecommendationRate: 97.5,
    categoryRatings: [
      { category: "시공 품질 (단열·기밀·마감)", score: 4.9, weightLabel: "열화상 전후 리포트 제공" },
      { category: "공사기간 준수 (당일 시공)", score: 4.8, weightLabel: "표준 공정표 준수" },
      { category: "청결 및 현장 안전관리", score: 4.8, weightLabel: "전문 환경정비팀 동행" },
      { category: "소통 및 친절도", score: 4.7, weightLabel: "정부 지원서류 원스톱 대행" },
      { category: "A/S 및 사후 대응 속도", score: 4.8, weightLabel: "4년 무상 보증" },
      { category: "가격 대비 만족도 (가성비)", score: 4.7, weightLabel: "기술 진단비 무상 포함" },
    ],
    totalComplaintsCount: 4,
    complaintRatePercent: 1.2,
    complaintResolvedRate: 100,
    averageResolutionHours: 15,
    complaintTags: [
      { tag: "일정 지연", count: 2, ratePercent: 0.6, status: "양호", description: "현장 골조 보강 필요로 1일 일정 협의 조정" },
      { tag: "추가비용 요구", count: 0, ratePercent: 0.0, status: "청정", description: "에스크로 계약 금액 일치" },
      { tag: "마감 불량", count: 1, ratePercent: 0.3, status: "양호", description: "손잡이 락킹 압력 미세 조정" },
      { tag: "소음·분진 관리 미흡", count: 1, ratePercent: 0.3, status: "양호", description: "계단실 통행로 보양재 추가 보강" },
      { tag: "연락 두절", count: 0, ratePercent: 0.0, status: "청정", description: "사무국 및 현장소장 핫라인 가동" },
      { tag: "하자 처리 지연", count: 0, ratePercent: 0.0, status: "청정", description: "사후 점검 100% 이행" },
      { tag: "안전관리 미흡", count: 0, ratePercent: 0.0, status: "청정", description: "철저한 안전장구류 착용" },
    ],
    postConstructionDefectRate: 0.0,
    warrantyInsuranceIssuanceRate: 100,
    recentReviews: [
      {
        id: "rev-tec-1",
        author: "정*원 님",
        buildingType: "연남로 다세대",
        rating: 4.9,
        period: "2026.04 시공",
        comment: "시공 전후로 열화상 카메라로 찍어서 파란색 외풍 구멍이 빨간색으로 따뜻하게 바뀐 사진을 리포트로 주셔서 너무 신기하고 뿌듯했습니다.",
        workSummary: "현대L&C 홈샤시 고단열 이중창",
        complaintReported: false,
        followUpCheck: "시공 6개월 경과: 단열성능 최우수 유지",
      },
    ],
  },

  "bid-4": {
    bidId: "bid-4",
    contractorName: "공간패시브건축",
    partnerTier: "MASTER",
    partnerTierTitle: "최우수 마스터 그린파트너",
    tierDescription: "독일 패시브하우스 기밀 공법 · 5년 무상 A/S · 불만율 0.9% 미만 프리미엄 시공사",
    certificationNumber: "국토부·그린토피아 GR-M2025-0031",
    overallRating: 4.9,
    totalReviewedHouseholds: 165,
    repeatRecommendationRate: 99.1,
    categoryRatings: [
      { category: "시공 품질 (단열·기밀·마감)", score: 5.0, weightLabel: "독일 기밀 테이프 3중 시공" },
      { category: "공사기간 준수 (당일 시공)", score: 4.8, weightLabel: "정밀 시공 원칙 준수" },
      { category: "청결 및 현장 안전관리", score: 4.9, weightLabel: "실내 미세먼지 측정 관리" },
      { category: "소통 및 친절도", score: 4.9, weightLabel: "건축사 출신 감리 책임제" },
      { category: "A/S 및 사후 대응 속도", score: 4.9, weightLabel: "5년 무상 보증 및 연 1회 방문" },
      { category: "가격 대비 만족도 (가성비)", score: 4.7, weightLabel: "프리미엄 기밀 시방 적용" },
    ],
    totalComplaintsCount: 1,
    complaintRatePercent: 0.6,
    complaintResolvedRate: 100,
    averageResolutionHours: 8,
    complaintTags: [
      { tag: "일정 지연", count: 1, ratePercent: 0.6, status: "양호", description: "정밀 기밀도 측정 작업으로 당일 1시간 연장 완료" },
      { tag: "추가비용 요구", count: 0, ratePercent: 0.0, status: "청정", description: "추가비용 일체 없음" },
      { tag: "마감 불량", count: 0, ratePercent: 0.0, status: "청정", description: "하자 불량 접수 0건" },
      { tag: "소음·분진 관리 미흡", count: 0, ratePercent: 0.0, status: "청정", description: "클린룸 수준 실내 보양" },
      { tag: "연락 두절", count: 0, ratePercent: 0.0, status: "청정", description: "대표 건축사 직통 번호 공유" },
      { tag: "하자 처리 지연", count: 0, ratePercent: 0.0, status: "청정", description: "긴급출동 2시간 원칙" },
      { tag: "안전관리 미흡", count: 0, ratePercent: 0.0, status: "청정", description: "무사고 안전 인증" },
    ],
    postConstructionDefectRate: 0.0,
    warrantyInsuranceIssuanceRate: 100,
    recentReviews: [
      {
        id: "rev-pas-1",
        author: "한*림 님",
        buildingType: "서교동 단독주택",
        rating: 5.0,
        period: "2026.03 시공",
        comment: "기밀 테이프로 창문 틈을 전부 막아주시는데 외풍이 아예 안 느껴집니다. 도로 차 소리도 안 들려서 호텔에 온 것 같아요. 5년 무상 A/S라 안심입니다.",
        workSummary: "독일 패시브 시스템 창호 4개소",
        complaintReported: false,
        followUpCheck: "시공 8개월 경과: 기밀도 1등급 지속 유지",
      },
    ],
  },
};
