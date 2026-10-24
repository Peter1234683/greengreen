import { BuildingRecord, ContractorProfile, ReviewRecord, ConstructionDomain } from "../types/greentopia";

// 생활 언어 질문과 공종 매핑 목록
export const DEMAND_QUESTIONS = [
  {
    id: "old_window",
    userPhrase: "창호가 오래되고 외풍이 심해요",
    relatedDomain: "window" as ConstructionDomain,
    benefit: "냉난방 에너지 최대 40% 절감",
  },
  {
    id: "cold_winter",
    userPhrase: "겨울철에 보일러를 틀어도 방안이 썰렁해요",
    relatedDomain: "outer_wall" as ConstructionDomain,
    benefit: "벽체 결로 방지 및 실내온도 3~4℃ 상승",
  },
  {
    id: "high_bills",
    userPhrase: "전기·가스 요금 고지서가 너무 많이 나와요",
    relatedDomain: "window" as ConstructionDomain,
    benefit: "사계절 공과금 월 8~15만원 절감 효과",
  },
  {
    id: "boiler_issue",
    userPhrase: "보일러가 10년 이상 되어 교체를 고민 중이에요",
    relatedDomain: "boiler" as ConstructionDomain,
    benefit: "친환경 1등급 콘덴싱으로 가스비 28% 즉시 절감",
  },
  {
    id: "roof_leak",
    userPhrase: "지붕 누수나 최상층 여름 더위가 심해요",
    relatedDomain: "roof" as ConstructionDomain,
    benefit: "최상층 열손실 차단 및 방수 수명 연장",
  },
  {
    id: "ventilation_mold",
    userPhrase: "환기가 잘 안 되고 곰팡이가 자주 생겨요",
    relatedDomain: "ventilation" as ConstructionDomain,
    benefit: "열손실 없는 24시간 청정 환기",
  },
];

// 대구 8개 구 중심 동네 좌표 및 주소 베이스
interface DaeguDistrict {
  sigungu: string;
  dongs: { name: string; roadName: string; lat: number; lng: number }[];
}

const DAEGU_DISTRICTS: DaeguDistrict[] = [
  {
    sigungu: "대구광역시 남구",
    dongs: [
      { name: "대명동", roadName: "대명로", lat: 35.8450, lng: 128.5830 },
      { name: "이천동", roadName: "이천로", lat: 35.8520, lng: 128.5980 },
      { name: "봉덕동", roadName: "봉덕로", lat: 35.8410, lng: 128.5990 },
    ],
  },
  {
    sigungu: "대구광역시 서구",
    dongs: [
      { name: "비산동", roadName: "비산로", lat: 35.8780, lng: 128.5630 },
      { name: "평리동", roadName: "평리로", lat: 35.8670, lng: 128.5520 },
      { name: "원대동", roadName: "원대로", lat: 35.8850, lng: 128.5710 },
    ],
  },
  {
    sigungu: "대구광역시 중구",
    dongs: [
      { name: "남산동", roadName: "남산로", lat: 35.8620, lng: 128.5870 },
      { name: "대봉동", roadName: "대봉로", lat: 35.8580, lng: 128.6010 },
      { name: "삼덕동", roadName: "삼덕로", lat: 35.8650, lng: 128.6060 },
    ],
  },
  {
    sigungu: "대구광역시 북구",
    dongs: [
      { name: "침산동", roadName: "침산남로", lat: 35.8870, lng: 128.5890 },
      { name: "산격동", roadName: "대학로", lat: 35.8910, lng: 128.6100 },
      { name: "복현동", roadName: "복현로", lat: 35.8950, lng: 128.6210 },
    ],
  },
  {
    sigungu: "대구광역시 동구",
    dongs: [
      { name: "신암동", roadName: "아양로", lat: 35.8810, lng: 128.6250 },
      { name: "효목동", roadName: "화랑로", lat: 35.8750, lng: 128.6430 },
      { name: "지저동", roadName: "해동로", lat: 35.8920, lng: 128.6450 },
    ],
  },
  {
    sigungu: "대구광역시 달서구",
    dongs: [
      { name: "송현동", roadName: "월배로", lat: 35.8280, lng: 128.5480 },
      { name: "두류동", roadName: "두류공원로", lat: 35.8530, lng: 128.5570 },
      { name: "본리동", roadName: "구마로", lat: 35.8360, lng: 128.5360 },
    ],
  },
  {
    sigungu: "대구광역시 수성구",
    dongs: [
      { name: "만촌동", roadName: "만촌로", lat: 35.8610, lng: 128.6490 },
      { name: "지산동", roadName: "지범로", lat: 35.8260, lng: 128.6360 },
      { name: "범어동", roadName: "동대구로", lat: 35.8570, lng: 128.6250 },
    ],
  },
];

// 대구 가상 노후 저층주택 100동 생성
export function generateDaeguBuildings(): BuildingRecord[] {
  const buildings: BuildingRecord[] = [];
  const currentYear = 2026;

  const usageTypes: BuildingRecord["usageType"][] = ["단독주택", "다가구주택", "다세대주택", "연립주택"];
  const structures: BuildingRecord["structure"][] = [
    "조적조 (벽돌/연와)",
    "조적조 (벽돌/연와)",
    "철근콘크리트구조",
    "철근콘크리트구조",
    "경량철골조",
  ];

  const timings = ["즉시 (1~2개월 내)", "봄 (3~5월)", "가을 (9~11월)", "미정"];

  for (let i = 1; i <= 100; i++) {
    const district = DAEGU_DISTRICTS[i % DAEGU_DISTRICTS.length];
    const dongObj = district.dongs[i % district.dongs.length];
    
    // 약간의 GPS 오차 (반경 약 300m~1.2km)
    const latOffset = ((i * 13) % 21 - 10) * 0.0007;
    const lngOffset = ((i * 17) % 21 - 10) * 0.0008;

    const houseNumber = ((i * 7) % 190) + 12;
    const roadNum = ((i * 3) % 80) + 1;
    const roadAddress = `${district.sigungu} ${dongObj.roadName} ${roadNum}길 ${houseNumber}`;
    const jibunAddress = `${district.sigungu} ${dongObj.name} ${houseNumber}-${(i % 15) + 1}`;

    // 연식: 1982년 ~ 2012년 (평균 1993년 전후)
    const approvalYear = 1982 + (i % 31);
    const ageYears = currentYear - approvalYear;

    const usageType = usageTypes[i % usageTypes.length];
    const structure = structures[i % structures.length];

    const floorsAbove = usageType === "단독주택" ? 1 + (i % 2) : 2 + (i % 3);
    const households = usageType === "단독주택" ? 1 : usageType === "다가구주택" ? 3 + (i % 4) : 4 + (i % 6);
    const grossAreaSqm = 65 + (i % 8) * 18 + floorsAbove * 30;

    // 공사 수요 태그 (2~3개 조합)
    const demandCount = 2 + (i % 2);
    const selectedDemands: string[] = [];
    const relatedDomains: ConstructionDomain[] = [];

    const d1 = DEMAND_QUESTIONS[i % DEMAND_QUESTIONS.length];
    selectedDemands.push(d1.userPhrase);
    relatedDomains.push(d1.relatedDomain);

    const d2 = DEMAND_QUESTIONS[(i + 2) % DEMAND_QUESTIONS.length];
    if (!selectedDemands.includes(d2.userPhrase)) {
      selectedDemands.push(d2.userPhrase);
      if (!relatedDomains.includes(d2.relatedDomain)) relatedDomains.push(d2.relatedDomain);
    }

    if (demandCount === 3) {
      const d3 = DEMAND_QUESTIONS[(i + 4) % DEMAND_QUESTIONS.length];
      if (!selectedDemands.includes(d3.userPhrase)) {
        selectedDemands.push(d3.userPhrase);
        if (!relatedDomains.includes(d3.relatedDomain)) relatedDomains.push(d3.relatedDomain);
      }
    }

    // 에너지 등급 및 요금
    const energyGrade = ageYears >= 35 ? "7등급 (취약)" : ageYears >= 25 ? "6등급 (미흡)" : "5등급 (보통)";
    const monthlyGasBillAvgWon = Math.round((140000 + (ageYears * 2500) + (i % 5) * 15000) / 1000) * 1000;
    const monthlyElectricityBillAvgWon = Math.round((55000 + (i % 7) * 8000) / 1000) * 1000;

    const estimatedBudgetWon = Math.round((12000000 + (grossAreaSqm * 90000)) / 1000000) * 1000000;

    buildings.push({
      id: `BLD-DG-${String(i).padStart(3, "0")}`,
      ownerId: `USER-OWNER-${String(i).padStart(3, "0")}`,
      address: jibunAddress,
      roadAddress,
      sigungu: district.sigungu,
      dong: dongObj.name,
      latitude: +(dongObj.lat + latOffset).toFixed(6),
      longitude: +(dongObj.lng + lngOffset).toFixed(6),
      usageType,
      structure,
      approvalYear,
      ageYears,
      grossAreaSqm,
      floorsAbove,
      households,
      energyGrade,
      monthlyGasBillAvgWon,
      monthlyElectricityBillAvgWon,
      selectedDemands,
      relatedDomains,
      preferredTiming: timings[i % timings.length],
      estimatedBudgetWon,
      wantsCoConstruction: i % 10 !== 0, // 90% 공동공사 참여 희망
      createdAt: new Date(Date.now() - (100 - i) * 86400000).toISOString(),
    });
  }

  return buildings;
}

// 대구 시공업체 15곳
export const SEED_CONTRACTORS: ContractorProfile[] = [
  {
    id: "CONT-DG-001",
    userId: "USER-CONT-001",
    companyName: "(주)대구에너지윈도우",
    representativeName: "김창호",
    businessNumber: "502-81-49201",
    contactPhone: "053-745-8821",
    email: "energywin@daegu-gr.co.kr",
    specialties: ["window", "outer_wall"],
    activityRegions: ["대구 전지역", "수성구", "동구", "중구"],
    isGrCertified: true,
    grCertificationNumber: "국토부-GR-2023-0491",
    licenseType: "금속구조물·창호·온실공사업",
    licenseNumber: "대구-2018-02-0041",
    warrantyGuaranteed: true,
    pqStatus: "approved",
    pqReviewNotes: "국토교통부 정식 등록 그린리모델링 창호 전문업체, 하자이행보증 3년 완비",
    pqApprovedAt: "2025-01-15T09:00:00Z",
    completedProjectsCount: 148,
    grExperienceYears: 9,
    reputationScore: 4.86,
    reviewsCount: 38,
    representativeProject: "대구 수성구 만촌동 노후 다가구 로이 복층 시스템창호 14세대 일괄시공",
    averageSquareMeterPriceWon: {
      window: 290000,
      outer_wall: 110000,
      inner_wall: 75000,
      boiler: 1200000,
      roof: 95000,
      ventilation: 1800000,
    },
  },
  {
    id: "CONT-DG-002",
    userId: "USER-CONT-002",
    companyName: "영남그린단열건설",
    representativeName: "박단열",
    businessNumber: "503-86-12093",
    contactPhone: "053-621-3310",
    email: "yngreen@daum.net",
    specialties: ["outer_wall", "inner_wall", "roof"],
    activityRegions: ["대구 남구", "대구 서구", "대구 달서구"],
    isGrCertified: true,
    grCertificationNumber: "국토부-GR-2022-0112",
    licenseType: "실내건축공사업 / 습식방수공사업",
    licenseNumber: "대구남구-2019-01-0089",
    warrantyGuaranteed: true,
    pqStatus: "approved",
    pqReviewNotes: "준불연 외단열미장공법(EIFS) 및 지붕 쿨루프 시공 실적 우수",
    pqApprovedAt: "2025-02-10T11:00:00Z",
    completedProjectsCount: 96,
    grExperienceYears: 7,
    reputationScore: 4.79,
    reviewsCount: 29,
    representativeProject: "대구 남구 대명동 단독주택 밀집구역 8개동 외단열 공동시공",
    averageSquareMeterPriceWon: {
      window: 310000,
      outer_wall: 98000,
      inner_wall: 68000,
      boiler: 1250000,
      roof: 88000,
      ventilation: 1900000,
    },
  },
  {
    id: "CONT-DG-003",
    userId: "USER-CONT-003",
    companyName: "(주)한빛에코설비",
    representativeName: "이동혁",
    businessNumber: "504-88-77402",
    contactPhone: "053-352-9904",
    email: "hanbiteco@naver.com",
    specialties: ["boiler", "ventilation"],
    activityRegions: ["대구 북구", "대구 동구", "대구 중구"],
    isGrCertified: true,
    grCertificationNumber: "국토부-GR-2024-0083",
    licenseType: "기계가스설비공사업",
    licenseNumber: "대구북구-2020-04-0012",
    warrantyGuaranteed: true,
    pqStatus: "approved",
    pqReviewNotes: "친환경 1등급 콘덴싱 보일러 및 폐열회수 환기장치(ERV) 전문",
    pqApprovedAt: "2025-03-01T14:30:00Z",
    completedProjectsCount: 210,
    grExperienceYears: 6,
    reputationScore: 4.91,
    reviewsCount: 52,
    representativeProject: "대구 북구 침산동 노후연립 32세대 친환경 콘덴싱 보일러 공동교체",
    averageSquareMeterPriceWon: {
      window: 320000,
      outer_wall: 115000,
      inner_wall: 80000,
      boiler: 980000,
      roof: 105000,
      ventilation: 1550000,
    },
  },
  {
    id: "CONT-DG-004",
    userId: "USER-CONT-004",
    companyName: "대건종합그린하우징",
    representativeName: "최원석",
    businessNumber: "501-82-66319",
    contactPhone: "053-568-1120",
    email: "daegun_green@gmail.com",
    specialties: ["window", "outer_wall", "inner_wall", "boiler", "roof"],
    activityRegions: ["대구 전지역"],
    isGrCertified: true,
    grCertificationNumber: "국토부-GR-2021-0029",
    licenseType: "종합건설업 / 건축공사업",
    licenseNumber: "대구-2016-01-0005",
    warrantyGuaranteed: true,
    pqStatus: "approved",
    pqReviewNotes: "건물 전체 패키지 그린리모델링 종합면허 보유사, 국토부 장관 표창",
    pqApprovedAt: "2025-01-08T10:00:00Z",
    completedProjectsCount: 184,
    grExperienceYears: 11,
    reputationScore: 4.88,
    reviewsCount: 44,
    representativeProject: "대구 서구 비산동 도시재생 연계 노후주택 11동 패키지 그린리모델링",
    averageSquareMeterPriceWon: {
      window: 285000,
      outer_wall: 95000,
      inner_wall: 70000,
      boiler: 1100000,
      roof: 89000,
      ventilation: 1650000,
    },
  },
  {
    id: "CONT-DG-005",
    userId: "USER-CONT-005",
    companyName: "(주)수성에코시스템창호",
    representativeName: "정지훈",
    businessNumber: "514-87-90114",
    contactPhone: "053-766-2244",
    email: "suseong_eco@naver.com",
    specialties: ["window"],
    activityRegions: ["대구 수성구", "대구 동구", "대구 중구"],
    isGrCertified: true,
    grCertificationNumber: "국토부-GR-2023-0812",
    licenseType: "금속구조물·창호·온실공사업",
    licenseNumber: "대구수성-2021-02-0055",
    warrantyGuaranteed: true,
    pqStatus: "approved",
    pqReviewNotes: "LX하우시스 / KCC 대구 공식 GR 대리점, 창호 원데이 시공 기술",
    pqApprovedAt: "2025-02-18T16:00:00Z",
    completedProjectsCount: 112,
    grExperienceYears: 8,
    reputationScore: 4.82,
    reviewsCount: 31,
    representativeProject: "대구 수성구 범어동 20년 다가구주택 6동 시스템창호 공동발주",
    averageSquareMeterPriceWon: {
      window: 295000,
      outer_wall: 120000,
      inner_wall: 85000,
      boiler: 1300000,
      roof: 100000,
      ventilation: 1850000,
    },
  },
  {
    id: "CONT-DG-006",
    userId: "USER-CONT-006",
    companyName: "달서단열엔지니어링",
    representativeName: "강성호",
    businessNumber: "513-81-54321",
    contactPhone: "053-633-8890",
    email: "dalseo_insul@daum.net",
    specialties: ["outer_wall", "inner_wall"],
    activityRegions: ["대구 달서구", "대구 남구"],
    isGrCertified: true,
    grCertificationNumber: "국토부-GR-2023-0199",
    licenseType: "실내건축공사업",
    licenseNumber: "대구달서-2020-01-0043",
    warrantyGuaranteed: true,
    pqStatus: "approved",
    pqReviewNotes: "실내 열교 부위 정밀 열화상 측정 및 3중 기밀 테이핑 단열 특화",
    pqApprovedAt: "2025-02-25T13:00:00Z",
    completedProjectsCount: 78,
    grExperienceYears: 5,
    reputationScore: 4.75,
    reviewsCount: 22,
    representativeProject: "대구 달서구 송현동 노후 벽돌단독 5동 내외단열 연속 시공",
    averageSquareMeterPriceWon: {
      window: 315000,
      outer_wall: 92000,
      inner_wall: 65000,
      boiler: 1280000,
      roof: 92000,
      ventilation: 1800000,
    },
  },
  {
    id: "CONT-DG-007",
    userId: "USER-CONT-007",
    companyName: "(주)삼한루프이노베이션",
    representativeName: "윤상민",
    businessNumber: "505-85-33219",
    contactPhone: "053-958-4411",
    email: "samhan_roof@naver.com",
    specialties: ["roof", "outer_wall"],
    activityRegions: ["대구 북구", "대구 동구", "대구 서구"],
    isGrCertified: true,
    grCertificationNumber: "국토부-GR-2022-0450",
    licenseType: "지붕판금·건축물조립공사업",
    licenseNumber: "대구북구-2018-03-0021",
    warrantyGuaranteed: true,
    pqStatus: "approved",
    pqReviewNotes: "지붕 고반사 쿨루프 및 태양광 차열 복합 공법 인증",
    pqApprovedAt: "2025-03-05T09:30:00Z",
    completedProjectsCount: 94,
    grExperienceYears: 9,
    reputationScore: 4.80,
    reviewsCount: 25,
    representativeProject: "대구 북구 복현동 슬래브 지붕 7개동 쿨루프 단열방수 일괄시공",
    averageSquareMeterPriceWon: {
      window: 330000,
      outer_wall: 102000,
      inner_wall: 72000,
      boiler: 1350000,
      roof: 82000,
      ventilation: 1950000,
    },
  },
  {
    id: "CONT-DG-008",
    userId: "USER-CONT-008",
    companyName: "동구친환경보일러",
    representativeName: "한경태",
    businessNumber: "506-82-11904",
    contactPhone: "053-962-7733",
    email: "donggu_boiler@hanmail.net",
    specialties: ["boiler"],
    activityRegions: ["대구 동구", "대구 수성구", "대구 북구"],
    isGrCertified: true,
    grCertificationNumber: "국토부-GR-2024-0311",
    licenseType: "난방시공업(제1종)",
    licenseNumber: "대구동구-2017-02-0018",
    warrantyGuaranteed: true,
    pqStatus: "approved",
    pqReviewNotes: "경동나비엔 / 귀뚜라미 대구 총판 연계 신속 A/S 대응 보장",
    pqApprovedAt: "2025-03-12T15:00:00Z",
    completedProjectsCount: 310,
    grExperienceYears: 12,
    reputationScore: 4.92,
    reviewsCount: 67,
    representativeProject: "대구 동구 신암동 저층빌라단지 19세대 친환경 보일러 당일 공동시공",
    averageSquareMeterPriceWon: {
      window: 340000,
      outer_wall: 125000,
      inner_wall: 85000,
      boiler: 940000,
      roof: 110000,
      ventilation: 1600000,
    },
  },
  {
    id: "CONT-DG-009",
    userId: "USER-CONT-009",
    companyName: "(주)대현그린창호",
    representativeName: "조현철",
    businessNumber: "507-88-29401",
    contactPhone: "053-254-6688",
    email: "daehyun_win@gmail.com",
    specialties: ["window", "inner_wall"],
    activityRegions: ["대구 중구", "대구 남구", "대구 서구"],
    isGrCertified: true,
    grCertificationNumber: "국토부-GR-2023-0665",
    licenseType: "금속구조물·창호·온실공사업",
    licenseNumber: "대구중구-2020-02-0019",
    warrantyGuaranteed: true,
    pqStatus: "approved",
    pqReviewNotes: "원도심 좁은 골목길 맞춤형 특수 사다리차 및 소음 저감 시공",
    pqApprovedAt: "2025-03-15T10:00:00Z",
    completedProjectsCount: 88,
    grExperienceYears: 6,
    reputationScore: 4.77,
    reviewsCount: 20,
    representativeProject: "대구 중구 남산동 한옥 및 벽돌주택 5개동 시스템창호 공동교체",
    averageSquareMeterPriceWon: {
      window: 298000,
      outer_wall: 112000,
      inner_wall: 73000,
      boiler: 1220000,
      roof: 98000,
      ventilation: 1750000,
    },
  },
  {
    id: "CONT-DG-010",
    userId: "USER-CONT-010",
    companyName: "원탑단열하우징",
    representativeName: "송명근",
    businessNumber: "508-81-99882",
    contactPhone: "053-525-4401",
    email: "onetop_insul@naver.com",
    specialties: ["outer_wall", "roof"],
    activityRegions: ["대구 서구", "대구 달서구", "대구 북구"],
    isGrCertified: true,
    grCertificationNumber: "국토부-GR-2022-0720",
    licenseType: "실내건축공사업",
    licenseNumber: "대구서구-2019-01-0033",
    warrantyGuaranteed: true,
    pqStatus: "approved",
    pqReviewNotes: "고밀도 글라스울 및 에어로젤 단열재 복합 시공 기술 보유",
    pqApprovedAt: "2025-03-20T17:00:00Z",
    completedProjectsCount: 65,
    grExperienceYears: 5,
    reputationScore: 4.73,
    reviewsCount: 18,
    representativeProject: "대구 서구 평리동 노후 다가구 4개동 연속 외단열 리뉴얼",
    averageSquareMeterPriceWon: {
      window: 325000,
      outer_wall: 96000,
      inner_wall: 71000,
      boiler: 1290000,
      roof: 87000,
      ventilation: 1850000,
    },
  },
  {
    id: "CONT-DG-011",
    userId: "USER-CONT-011",
    companyName: "(주)그린에어테크",
    representativeName: "임승진",
    businessNumber: "509-86-44331",
    contactPhone: "053-751-0988",
    email: "greenair_tech@daum.net",
    specialties: ["ventilation", "boiler"],
    activityRegions: ["대구 전지역"],
    isGrCertified: true,
    grCertificationNumber: "국토부-GR-2024-0512",
    licenseType: "기계설비·가스시설시공업",
    licenseNumber: "대구-2022-03-0077",
    warrantyGuaranteed: true,
    pqStatus: "approved",
    pqReviewNotes: "천장 매립형 환기배관 무타공 공법 및 미세먼지 필터 교체 3년 케어",
    pqApprovedAt: "2025-04-01T11:00:00Z",
    completedProjectsCount: 74,
    grExperienceYears: 4,
    reputationScore: 4.85,
    reviewsCount: 19,
    representativeProject: "대구 수성구 지산동 노후빌라 12세대 무타공 청정환기 공동시공",
    averageSquareMeterPriceWon: {
      window: 335000,
      outer_wall: 118000,
      inner_wall: 79000,
      boiler: 1050000,
      roof: 102000,
      ventilation: 1500000,
    },
  },
  {
    id: "CONT-DG-012",
    userId: "USER-CONT-012",
    companyName: "대구그린윈드윈도우",
    representativeName: "서동원",
    businessNumber: "510-87-65432",
    contactPhone: "053-625-7788",
    email: "greenwind_dg@gmail.com",
    specialties: ["window", "outer_wall"],
    activityRegions: ["대구 남구", "대구 달서구", "대구 중구"],
    isGrCertified: true,
    grCertificationNumber: "국토부-GR-2023-0941",
    licenseType: "금속구조물·창호·온실공사업",
    licenseNumber: "대구남구-2021-02-0031",
    warrantyGuaranteed: true,
    pqStatus: "approved",
    pqReviewNotes: "독일식 시스템 하드웨어 적용 및 단열 1등급 로이유리 전문",
    pqApprovedAt: "2025-04-10T14:00:00Z",
    completedProjectsCount: 92,
    grExperienceYears: 7,
    reputationScore: 4.81,
    reviewsCount: 26,
    representativeProject: "대구 남구 봉덕동 다가구 7동 로이 시스템창호 동시 교체",
    averageSquareMeterPriceWon: {
      window: 292000,
      outer_wall: 104000,
      inner_wall: 74000,
      boiler: 1240000,
      roof: 93000,
      ventilation: 1720000,
    },
  },
  
  // 신규 가입 심사 대기 (PQ 심사 테스트용 3개사)
  {
    id: "CONT-DG-013",
    userId: "USER-CONT-013",
    companyName: "(주)수성신성단열",
    representativeName: "문경민",
    businessNumber: "511-89-10293",
    contactPhone: "053-741-9980",
    email: "sinsung_insul@naver.com",
    specialties: ["outer_wall", "inner_wall"],
    activityRegions: ["대구 수성구", "대구 동구"],
    isGrCertified: true,
    grCertificationNumber: "국토부-GR-2025-신청중",
    licenseType: "실내건축공사업",
    licenseNumber: "대구수성-2024-01-0091",
    warrantyGuaranteed: true,
    pqStatus: "pending",
    pqReviewNotes: "신규 가입: 국토부 GR 사업자 확인증류 검토 대기",
    completedProjectsCount: 24,
    grExperienceYears: 3,
    reputationScore: 4.60,
    reviewsCount: 5,
    representativeProject: "대구 수성구 만촌동 단독주택 외벽 불연단열재 시공 3건",
    averageSquareMeterPriceWon: {
      window: 310000,
      outer_wall: 94000,
      inner_wall: 66000,
      boiler: 1250000,
      roof: 90000,
      ventilation: 1800000,
    },
  },
  {
    id: "CONT-DG-014",
    userId: "USER-CONT-014",
    companyName: "대구미래창호시스템",
    representativeName: "배형진",
    businessNumber: "512-88-77112",
    contactPhone: "053-584-6633",
    email: "miraewin_dg@daum.net",
    specialties: ["window"],
    activityRegions: ["대구 달서구", "대구 서구"],
    isGrCertified: false,
    licenseType: "금속창호공사업",
    licenseNumber: "대구달서-2023-02-0044",
    warrantyGuaranteed: true,
    pqStatus: "pending",
    pqReviewNotes: "신규 가입: 일반 금속창호 면허 보유, 국토부 GR 등록 서류 보완 요청 중",
    completedProjectsCount: 35,
    grExperienceYears: 2,
    reputationScore: 4.50,
    reviewsCount: 4,
    representativeProject: "대구 달서구 본리동 빌라 2동 창호 교체",
    averageSquareMeterPriceWon: {
      window: 288000,
      outer_wall: 110000,
      inner_wall: 76000,
      boiler: 1260000,
      roof: 96000,
      ventilation: 1780000,
    },
  },
  {
    id: "CONT-DG-015",
    userId: "USER-CONT-015",
    companyName: "영남에코설비플랜트",
    representativeName: "고태우",
    businessNumber: "515-81-33490",
    contactPhone: "053-381-5522",
    email: "yngnam_eco@gmail.com",
    specialties: ["boiler", "roof"],
    activityRegions: ["대구 북구", "대구 서구"],
    isGrCertified: true,
    grCertificationNumber: "국토부-GR-2024-0994",
    licenseType: "기계설비·가스시설시공업",
    licenseNumber: "대구북구-2023-03-0015",
    warrantyGuaranteed: false,
    pqStatus: "pending",
    pqReviewNotes: "신규 가입: 하자보증보험 발급 확약서 확인 대기",
    completedProjectsCount: 19,
    grExperienceYears: 2,
    reputationScore: 4.45,
    reviewsCount: 3,
    representativeProject: "대구 북구 산격동 주택 4가구 고효율 보일러 교체",
    averageSquareMeterPriceWon: {
      window: 330000,
      outer_wall: 115000,
      inner_wall: 80000,
      boiler: 990000,
      roof: 88000,
      ventilation: 1650000,
    },
  },
];

// 샘플 완료 공사 및 리뷰
export const SEED_REVIEWS: ReviewRecord[] = [
  {
    id: "REV-001",
    projectId: "PRJ-COMP-01",
    buildingId: "BLD-DG-003",
    contractorId: "CONT-DG-001",
    customerName: "이*영",
    ratingOverall: 5,
    ratings: {
      quality: 5,
      schedule: 5,
      safetyClean: 5,
      communication: 4,
      asResponse: 5,
      costValue: 5,
    },
    comment: "이웃 3가구와 함께 로이 복층창호로 공동교체했습니다. 단체 발주라 개별 견적보다 가구당 220만원 가량 저렴했고, 이번 겨울 가스비가 작년 대비 38%나 줄었습니다. 시공 후 뒷정리도 아주 깔끔했습니다.",
    contractorReply: "이용해 주셔서 대단히 감사합니다. 이번 겨울 따뜻하게 보내셨다니 큰 보람입니다. 3년 무상 A/S가 보증되니 언제든 연락 부탁드립니다.",
    postInspectionMonths: 6,
    hasDefectReported: false,
    createdAt: "2025-11-20T10:30:00Z",
  },
  {
    id: "REV-002",
    projectId: "PRJ-COMP-02",
    buildingId: "BLD-DG-008",
    contractorId: "CONT-DG-002",
    customerName: "정*석",
    ratingOverall: 4.8,
    ratings: {
      quality: 5,
      schedule: 4,
      safetyClean: 5,
      communication: 5,
      asResponse: 5,
      costValue: 5,
    },
    comment: "30년 된 벽돌 단독주택 외단열공사였습니다. 비가 오는 날이 끼어서 일정이 이틀 늦어졌지만, 매일 작업 전후 사진을 보내주셔서 안심할 수 있었습니다. 외풍이 확실히 사라졌습니다.",
    contractorReply: "우천으로 인해 작업 일정이 지연되었음에도 너그럽게 양해해 주셔서 감사드립니다. 안전과 품질을 최우선으로 시공 완료했습니다.",
    postInspectionMonths: 12,
    hasDefectReported: false,
    createdAt: "2025-12-05T15:10:00Z",
  },
  {
    id: "REV-003",
    projectId: "PRJ-COMP-03",
    buildingId: "BLD-DG-012",
    contractorId: "CONT-DG-003",
    customerName: "강*구",
    ratingOverall: 5,
    ratings: {
      quality: 5,
      schedule: 5,
      safetyClean: 5,
      communication: 5,
      asResponse: 5,
      costValue: 5,
    },
    comment: "빌라 주민 8세대가 모여 콘덴싱 보일러를 한번에 교체했습니다. 공동구매 방식이라 단체 할인을 톡톡히 받았고 대구시 친환경 보일러 보조금 서류 대행까지 한 번에 처리해 주셔서 정말 편했습니다.",
    contractorReply: "보조금 수령까지 문제없이 마무리되어 기쁩니다. 정기 점검 시기에 다시 연락드리겠습니다.",
    postInspectionMonths: 6,
    hasDefectReported: false,
    createdAt: "2026-01-14T11:45:00Z",
  },
];
