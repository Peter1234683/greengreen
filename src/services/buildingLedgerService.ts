import { BuildingLedgerData } from "../types";

/**
 * 국토교통부 건축물대장 표제부 조회 서비스 모듈
 * (현재는 고도화된 Mock 데이터 엔진으로 동작하며, 공공데이터포털 API Key 발급 시 실제 엔드포인트로 1:1 교체 가능하도록 설계됨)
 */

export const PRESET_BUILDINGS: Array<{
  label: string;
  badge: string;
  data: BuildingLedgerData;
}> = [
  {
    label: "마포구 연남동 32년차 다가구주택 (창호/결로 취약)",
    badge: "32년 경과 · 조적조",
    data: {
      address: "서울특별시 마포구 성미산로 142 (연남동 239-1)",
      roadAddress: "서울특별시 마포구 성미산로 142",
      approvalDate: "1993-04-18",
      ageYears: 33,
      grossArea: "214.8 m² (지하1층~지상3층 5가구)",
      structure: "벽돌구조(연와조) 및 철근콘크리트지붕",
      purpose: "다가구주택(단독주택)",
      floors: "지하 1층 / 지상 3층",
      heatingType: "개별난방 (도시가스)",
      insulationStandardAtBuild: "1992년 단열 기준 (외벽 단열재 50mm 미만)",
      currentCodeGap: "현행 2024년 기준(140mm 이상) 대비 약 65% 미달, 창호는 알루미늄 단창 수준",
    },
  },
  {
    label: "송파구 삼전동 26년차 다세대빌라 (외벽 크랙/열교)",
    badge: "26년 경과 · RC조",
    data: {
      address: "서울특별시 송파구 백제고분로27길 19 (삼전동 88-3)",
      roadAddress: "서울특별시 송파구 백제고분로27길 19",
      approvalDate: "1999-11-20",
      ageYears: 27,
      grossArea: "389.2 m² (8세대)",
      structure: "철근콘크리트조 평슬래브지붕",
      purpose: "다세대주택(공동주택)",
      floors: "지상 4층",
      heatingType: "개별난방 (노후 가스보일러)",
      insulationStandardAtBuild: "1998년 단열 기준 (외벽 스티로폼 50~70mm)",
      currentCodeGap: "창호 모헤어 삭음으로 외풍 다량 유입, 북측 코너부 곰팡이 고위험",
    },
  },
  {
    label: "성북구 정릉동 38년차 노후 단독주택 (지붕/벽체 취약)",
    badge: "38년 경과 · 연와조",
    data: {
      address: "서울특별시 성북구 솔샘로18길 35 (정릉동 412-8)",
      roadAddress: "서울특별시 성북구 솔샘로18길 35",
      approvalDate: "1987-09-05",
      ageYears: 39,
      grossArea: "128.4 m² (단독주택 1가구)",
      structure: "시멘트벽돌조 기와지붕",
      purpose: "단독주택",
      floors: "지상 2층",
      heatingType: "개별난방 (등유/가스)",
      insulationStandardAtBuild: "1980년대 초 단열 의무 기준 미흡",
      currentCodeGap: "단열층 거의 부재, 겨울철 실내 온도 14℃ 이하 급락, 그린리모델링 최우선 대상",
    },
  },
  {
    label: "성남시 분당구 정자동 30년차 구축 아파트 (1기 신도시)",
    badge: "30년 경과 · 아파트",
    data: {
      address: "경기도 성남시 분당구 정자일로 135 (정자동 한솔마을)",
      roadAddress: "경기도 성남시 분당구 정자일로 135",
      approvalDate: "1995-05-12",
      ageYears: 31,
      grossArea: "105.8 m² (전용 84.9 m²)",
      structure: "철근콘크리트 벽식구조",
      purpose: "아파트(공동주택)",
      floors: "지상 18층",
      heatingType: "지역난방 (열병합)",
      insulationStandardAtBuild: "1990년대 초 준공 기준 (알루미늄 16mm 복층)",
      currentCodeGap: "발코니 확장부 하부 결로 및 창틀 누기 심각, 단지 내 이웃 공동교체 수요 높음",
    },
  },
];

/**
 * 사용자가 입력한 주소로 건축물대장 데이터 조회
 * (공공데이터포털 실제 API 연동 시 이 함수 내부의 fetch 로직만 변경하면 됨)
 */
export async function fetchBuildingLedger(addressQuery: string): Promise<BuildingLedgerData> {
  // Simulate network latency (200~400ms)
  await new Promise((resolve) => setTimeout(resolve, 350));

  const trimmed = addressQuery.trim();

  // 1. Check if matches any preset address
  const matchedPreset = PRESET_BUILDINGS.find((p) =>
    trimmed.includes(p.data.roadAddress) ||
    trimmed.includes(p.data.address.split(" ")[2] || "") ||
    trimmed.includes(p.label.split(" ")[0])
  );

  if (matchedPreset) {
    return { ...matchedPreset.data, address: trimmed || matchedPreset.data.address };
  }

  // 2. Generate plausible metadata for custom addresses based on address string heuristic
  const currentYear = 2026;
  let estimatedYear = 1994;
  if (trimmed.includes("아파트")) estimatedYear = 1997;
  else if (trimmed.includes("빌라") || trimmed.includes("연립")) estimatedYear = 1998;
  else if (trimmed.includes("길") || trimmed.includes("로")) estimatedYear = 1991;

  const ageYears = currentYear - estimatedYear;
  const isMasonry = trimmed.includes("단독") || estimatedYear < 1992;
  const structure = isMasonry ? "연와조 및 시멘트블록구조" : "철근콘크리트구조";
  const purpose = trimmed.includes("아파트") ? "아파트" : trimmed.includes("빌라") ? "다세대주택" : "다가구주택";

  return {
    address: trimmed,
    roadAddress: trimmed,
    approvalDate: `${estimatedYear}-06-25`,
    ageYears,
    grossArea: "195.4 m²",
    structure,
    purpose,
    floors: "지하 1층 / 지상 3층",
    heatingType: "개별난방 (도시가스)",
    insulationStandardAtBuild: `${estimatedYear}년 당시 단열 기준 (외벽 50mm 미만)`,
    currentCodeGap: `현행 2024년 고효율 기준 대비 단열 성능 약 ${Math.min(75, ageYears * 2)}% 부족, 창호 기밀성 E~F등급 추정`,
  };
}
