import { useState, useEffect } from "react";
import {
  BuildingRecord,
  ContractorProfile,
  ReviewRecord,
  UserRole,
  UserSession,
} from "../types/greentopia";
import {
  generateDaeguBuildings,
  SEED_CONTRACTORS,
  SEED_REVIEWS,
} from "../data/daeguSeedData";

interface GreenTopiaState {
  currentUser: UserSession | null;
  activeRole: UserRole;
  showOnboarding: boolean;
  buildings: BuildingRecord[];
  contractors: ContractorProfile[];
  reviews: ReviewRecord[];
  myBuilding: BuildingRecord | null;
  myContractorProfile: ContractorProfile | null;
}

const STORAGE_KEY = "greentopia_state_v1";

// 기본 세션 (시연용 기본 고객 계정: 대구 대명동 단독주택 건물주)
const DEFAULT_CUSTOMER_SESSION: UserSession = {
  id: "USER-OWNER-DEMO",
  role: "customer",
  name: "이진호 (건물주)",
  email: "jinho.lee@greentopia.kr",
  phone: "010-3491-8822",
  buildingId: "BLD-DG-001",
};

// 기본 사업자 세션 (대구에너지윈도우 대표)
const DEFAULT_CONTRACTOR_SESSION: UserSession = {
  id: "USER-CONT-001",
  role: "contractor",
  name: "김창호 대표 (시공사)",
  email: "energywin@daegu-gr.co.kr",
  phone: "053-745-8821",
  contractorId: "CONT-DG-001",
};

// 기본 관리자 세션
const DEFAULT_ADMIN_SESSION: UserSession = {
  id: "USER-ADMIN-01",
  role: "admin",
  name: "그린토피아 운영팀장",
  email: "admin@greentopia.kr",
};

class Store {
  private state: GreenTopiaState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): GreenTopiaState {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.buildings) && parsed.buildings.length >= 100) {
          return parsed;
        }
      } catch {
        // parsing error fallback
      }
    }

    const buildings = generateDaeguBuildings();
    const contractors = [...SEED_CONTRACTORS];
    const reviews = [...SEED_REVIEWS];
    const myBuilding = buildings[0] || null;
    const myContractorProfile = contractors[0] || null;

    return {
      currentUser: DEFAULT_CUSTOMER_SESSION,
      activeRole: "customer",
      showOnboarding: false,
      buildings,
      contractors,
      reviews,
      myBuilding,
      myContractorProfile,
    };
  }

  private persist() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch {
        // quota exceeded fallback
      }
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): GreenTopiaState {
    return this.state;
  }

  // 역할 전환 (고객 <-> 사업자 <-> 관리자)
  switchRole(role: UserRole) {
    let session = this.state.currentUser;
    if (role === "customer") {
      session = DEFAULT_CUSTOMER_SESSION;
    } else if (role === "contractor") {
      session = DEFAULT_CONTRACTOR_SESSION;
    } else {
      session = DEFAULT_ADMIN_SESSION;
    }

    this.state = {
      ...this.state,
      activeRole: role,
      currentUser: session,
      showOnboarding: false,
    };
    this.persist();
  }

  // 온보딩 화면 표시 토글
  setShowOnboarding(show: boolean) {
    this.state = {
      ...this.state,
      showOnboarding: show,
    };
    this.persist();
  }

  // 일반 고객 가입 완료
  registerCustomer(userData: {
    name: string;
    phone: string;
    email: string;
    building: Omit<BuildingRecord, "id" | "ownerId" | "createdAt">;
  }) {
    const userId = `USER-OWNER-${Date.now()}`;
    const buildingId = `BLD-DG-${Date.now()}`;

    const newBuilding: BuildingRecord = {
      ...userData.building,
      id: buildingId,
      ownerId: userId,
      createdAt: new Date().toISOString(),
    };

    const newSession: UserSession = {
      id: userId,
      role: "customer",
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      buildingId,
    };

    this.state = {
      ...this.state,
      currentUser: newSession,
      activeRole: "customer",
      showOnboarding: false,
      buildings: [newBuilding, ...this.state.buildings],
      myBuilding: newBuilding,
    };
    this.persist();
  }

  // 시공업체 가입 완료 ("심사 대기" 상태로 등록)
  registerContractor(contractorData: Omit<ContractorProfile, "id" | "userId" | "pqStatus" | "completedProjectsCount" | "reputationScore" | "reviewsCount">) {
    const userId = `USER-CONT-${Date.now()}`;
    const contractorId = `CONT-DG-${Date.now()}`;

    const newContractor: ContractorProfile = {
      ...contractorData,
      id: contractorId,
      userId,
      pqStatus: "pending", // PQ 1차 서류 확인 전 심사 대기 상태
      pqReviewNotes: "신규 가입: 국토부 GR 사업자 및 건설업 면허 1차 서류 심사 대기",
      completedProjectsCount: 0,
      grExperienceYears: 1,
      reputationScore: 0,
      reviewsCount: 0,
    };

    const newSession: UserSession = {
      id: userId,
      role: "contractor",
      name: `${contractorData.representativeName} (${contractorData.companyName})`,
      email: contractorData.email,
      phone: contractorData.contactPhone,
      contractorId,
    };

    this.state = {
      ...this.state,
      currentUser: newSession,
      activeRole: "contractor",
      showOnboarding: false,
      contractors: [newContractor, ...this.state.contractors],
      myContractorProfile: newContractor,
    };
    this.persist();
  }

  // 관리자 기능: 시공업체 PQ 심사 승인 / 반려
  updateContractorPqStatus(contractorId: string, status: "approved" | "rejected", notes?: string) {
    this.state = {
      ...this.state,
      contractors: this.state.contractors.map((c) => {
        if (c.id === contractorId) {
          return {
            ...c,
            pqStatus: status,
            pqReviewNotes: notes || (status === "approved" ? "관리자 승인 완료: 입찰 참여 가능" : "서류 미비로 인한 보완 요청"),
            pqApprovedAt: status === "approved" ? new Date().toISOString() : undefined,
          };
        }
        return c;
      }),
    };

    // 현재 로그인된 업체가 변경 대상인 경우 동기화
    if (this.state.myContractorProfile?.id === contractorId) {
      this.state.myContractorProfile = {
        ...this.state.myContractorProfile,
        pqStatus: status,
        pqReviewNotes: notes || (status === "approved" ? "관리자 승인 완료: 입찰 참여 가능" : "서류 미비로 인한 보완 요청"),
      };
    }

    this.persist();
  }

  // 초기 상태 리셋
  resetToSeed() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.state = this.loadInitialState();
    this.notify();
  }
}

export const greentopiaStore = new Store();

// React Hook
export function useGreenTopia() {
  const [state, setState] = useState<GreenTopiaState>(greentopiaStore.getState());

  useEffect(() => {
    return greentopiaStore.subscribe(() => {
      setState(greentopiaStore.getState());
    });
  }, []);

  return {
    ...state,
    switchRole: (role: UserRole) => greentopiaStore.switchRole(role),
    setShowOnboarding: (show: boolean) => greentopiaStore.setShowOnboarding(show),
    registerCustomer: greentopiaStore.registerCustomer.bind(greentopiaStore),
    registerContractor: greentopiaStore.registerContractor.bind(greentopiaStore),
    updateContractorPqStatus: greentopiaStore.updateContractorPqStatus.bind(greentopiaStore),
    resetToSeed: greentopiaStore.resetToSeed.bind(greentopiaStore),
  };
}
