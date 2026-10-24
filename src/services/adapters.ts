import { BuildingRecord, BuildingStructure, BuildingUsageType, ConstructionDomain } from "../types/greentopia";
import { generateDaeguBuildings } from "../data/daeguSeedData";

// ==========================================
// 1. 건축물대장 어댑터 (BuildingRegistryAdapter)
// ==========================================

export interface BuildingRegistryInfo {
  address: string;
  roadAddress: string;
  sigungu: string;
  dong: string;
  approvalYear: number;
  ageYears: number;
  usageType: BuildingUsageType;
  structure: BuildingStructure;
  grossAreaSqm: number;
  floorsAbove: number;
  households: number;
  latitude: number;
  longitude: number;
}

export interface IBuildingRegistryAdapter {
  searchAddress(keyword: string): Promise<BuildingRegistryInfo[]>;
  lookupByAddress(address: string): Promise<BuildingRegistryInfo>;
}

export class MockBuildingRegistryAdapter implements IBuildingRegistryAdapter {
  private cachedBuildings: BuildingRecord[] = [];

  constructor() {
    this.cachedBuildings = generateDaeguBuildings();
  }

  async searchAddress(keyword: string): Promise<BuildingRegistryInfo[]> {
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) {
      // 키워드가 없으면 대구 주요 동네 대표 6건 반환
      return this.cachedBuildings.slice(0, 6).map(this.toRegistryInfo);
    }

    const matches = this.cachedBuildings.filter(
      (b) =>
        b.address.toLowerCase().includes(trimmed) ||
        b.roadAddress.toLowerCase().includes(trimmed) ||
        b.dong.toLowerCase().includes(trimmed) ||
        b.sigungu.toLowerCase().includes(trimmed)
    );

    if (matches.length > 0) {
      return matches.slice(0, 10).map(this.toRegistryInfo);
    }

    // 일치 결과가 없는 경우 해당 키워드로 가상 건축물대장 정보 생성
    const defaultInfo: BuildingRegistryInfo = {
      address: `대구광역시 ${keyword.includes("대구") ? keyword : "남구 대명동 " + keyword}`,
      roadAddress: `대구광역시 남구 대명로 45길 12`,
      sigungu: "대구광역시 남구",
      dong: "대명동",
      approvalYear: 1991,
      ageYears: 35,
      usageType: "단독주택",
      structure: "조적조 (벽돌/연와)",
      grossAreaSqm: 115.4,
      floorsAbove: 2,
      households: 2,
      latitude: 35.8450,
      longitude: 128.5830,
    };

    return [defaultInfo];
  }

  async lookupByAddress(address: string): Promise<BuildingRegistryInfo> {
    const found = this.cachedBuildings.find(
      (b) => b.address === address || b.roadAddress === address
    );

    if (found) {
      return this.toRegistryInfo(found);
    }

    // 기본 모의 정보 반환
    return {
      address,
      roadAddress: address,
      sigungu: "대구광역시 남구",
      dong: "대명동",
      approvalYear: 1993,
      ageYears: 33,
      usageType: "다가구주택",
      structure: "조적조 (벽돌/연와)",
      grossAreaSqm: 142.5,
      floorsAbove: 2,
      households: 3,
      latitude: 35.8450,
      longitude: 128.5830,
    };
  }

  private toRegistryInfo(b: BuildingRecord): BuildingRegistryInfo {
    return {
      address: b.address,
      roadAddress: b.roadAddress,
      sigungu: b.sigungu,
      dong: b.dong,
      approvalYear: b.approvalYear,
      ageYears: b.ageYears,
      usageType: b.usageType,
      structure: b.structure,
      grossAreaSqm: b.grossAreaSqm,
      floorsAbove: b.floorsAbove,
      households: b.households,
      latitude: b.latitude,
      longitude: b.longitude,
    };
  }
}

// ==========================================
// 2. 에너지 진단 어댑터 (EnergyDiagnosisAdapter)
// ==========================================

export interface DiagnosisDomainEstimate {
  domain: ConstructionDomain;
  title: string;
  savingKwhYear: number;
  savingPercent: number;
  estAnnualCostSavedWon: number;
  priorityOrder: number;
}

export interface EnergyDiagnosisResult {
  mode: "simple_heuristic" | "grai_external" | "grai_api";
  isEstimated: boolean; // "간이 추정치" 안내 여부
  energyGrade: string; // 1~7등급
  energyLossPercent: number;
  annualEnergyDemandKwhM2: number;
  peerComparison: {
    myBuildingKwh: number;
    sameAgeAverageKwh: number;
    modernStandardKwh: number;
  };
  domainBreakdown: DiagnosisDomainEstimate[];
  totalAnnualSavingsWon: number;
  subsidyEligible: boolean; // 2016.1.1 이전 준공
  freeConsultingGuidance: {
    title: string;
    description: string;
    eligible: boolean;
    applyUrl: string;
  };
  graiPlatformUrl: string;
}

export interface IEnergyDiagnosisAdapter {
  diagnoseSimple(building: Partial<BuildingRecord>): Promise<EnergyDiagnosisResult>;
  getGraiExternalLink(buildingId?: string): string;
  // TODO: GR-AI 공식 REST API 협의 시 연결할 메소드 자리 (스크래핑 금지 원칙 준수)
  diagnoseViaApi?(buildingId: string): Promise<EnergyDiagnosisResult>;
}

export class DefaultEnergyDiagnosisAdapter implements IEnergyDiagnosisAdapter {
  readonly graiPlatformUrl = "https://grai.ibed.cloud";

  getGraiExternalLink(_buildingId?: string): string {
    return this.graiPlatformUrl;
  }

  async diagnoseSimple(building: Partial<BuildingRecord>): Promise<EnergyDiagnosisResult> {
    const age = building.ageYears || 32;
    const area = building.grossAreaSqm || 110;
    const structure = building.structure || "조적조 (벽돌/연와)";

    // 건축 연식 및 구조 기반 간이 에너지 소요량 (kWh/㎡·년)
    let baseKwh = 240 + age * 3.8;
    if (structure.includes("조적")) baseKwh += 35;
    if (structure.includes("철근콘크리트")) baseKwh += 15;

    // 등급 산출 (1~7등급 간이 추정)
    let energyGrade = "7등급 (매우 취약)";
    let energyLossPercent = 48;
    if (baseKwh < 200) {
      energyGrade = "4등급 (보통)";
      energyLossPercent = 22;
    } else if (baseKwh < 260) {
      energyGrade = "5등급 (개선 권장)";
      energyLossPercent = 32;
    } else if (baseKwh < 330) {
      energyGrade = "6등급 (미흡)";
      energyLossPercent = 42;
    }

    // 공종별 개선 시 예상 절감량 (규칙 기반 추정치)
    const windowSavingKwh = Math.round(baseKwh * 0.28 * area);
    const wallSavingKwh = Math.round(baseKwh * 0.22 * area);
    const boilerSavingKwh = Math.round(baseKwh * 0.15 * area);
    const roofSavingKwh = Math.round(baseKwh * 0.10 * area);

    const costPerKwhWon = 135; // 난방 및 전력 가중 평균 단가(원/kWh)

    const domainBreakdown: DiagnosisDomainEstimate[] = [
      {
        domain: "window",
        title: "고단열 로이 시스템 창호 교체",
        savingKwhYear: windowSavingKwh,
        savingPercent: 28,
        estAnnualCostSavedWon: Math.round((windowSavingKwh * costPerKwhWon) / 10000) * 10000,
        priorityOrder: 1,
      },
      {
        domain: "outer_wall",
        title: "외벽 준불연 복합단열 보강",
        savingKwhYear: wallSavingKwh,
        savingPercent: 22,
        estAnnualCostSavedWon: Math.round((wallSavingKwh * costPerKwhWon) / 10000) * 10000,
        priorityOrder: 2,
      },
      {
        domain: "boiler",
        title: "친환경 1등급 콘덴싱 보일러",
        savingKwhYear: boilerSavingKwh,
        savingPercent: 15,
        estAnnualCostSavedWon: Math.round((boilerSavingKwh * costPerKwhWon) / 10000) * 10000,
        priorityOrder: 3,
      },
      {
        domain: "roof",
        title: "지붕 고반사 쿨루프 및 단열방수",
        savingKwhYear: roofSavingKwh,
        savingPercent: 10,
        estAnnualCostSavedWon: Math.round((roofSavingKwh * costPerKwhWon) / 10000) * 10000,
        priorityOrder: 4,
      },
    ];

    const totalAnnualSavingsWon = domainBreakdown.reduce(
      (sum, item) => sum + item.estAnnualCostSavedWon,
      0
    );

    // 국토부 그린리모델링 이자지원 대상 조건: 10년 이상 경과 건물 (2016.1.1 이전 사용승인)
    const approvalYear = building.approvalYear || (2026 - age);
    const subsidyEligible = approvalYear < 2016;

    return {
      mode: "simple_heuristic",
      isEstimated: true,
      energyGrade,
      energyLossPercent,
      annualEnergyDemandKwhM2: Math.round(baseKwh),
      peerComparison: {
        myBuildingKwh: Math.round(baseKwh),
        sameAgeAverageKwh: Math.round(baseKwh * 0.95),
        modernStandardKwh: 120, // 2026년 기준 신축 주택 기준
      },
      domainBreakdown,
      totalAnnualSavingsWon,
      subsidyEligible,
      freeConsultingGuidance: {
        title: "2026 국토부 민간건축물 그린리모델링 무료 컨설팅",
        description:
          "사용승인 10년 이상 노후 주택은 정부 공인 에너지 진단사의 정밀 진단 및 공사비 이자지원(최대 3~4%p) 혜택을 받을 수 있습니다.",
        eligible: subsidyEligible,
        applyUrl: "https://www.greenremodeling.or.kr",
      },
      graiPlatformUrl: this.graiPlatformUrl,
    };
  }
}

// 싱글톤 어댑터 인스턴스
export const buildingRegistryAdapter = new MockBuildingRegistryAdapter();
export const energyDiagnosisAdapter = new DefaultEnergyDiagnosisAdapter();
