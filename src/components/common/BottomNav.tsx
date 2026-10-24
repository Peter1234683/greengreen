import React from "react";
import { UserRole } from "../../types/greentopia";
import {
  Home,
  Activity,
  Users,
  Briefcase,
  User,
  Search,
  FileText,
  Hammer,
  Star,
} from "lucide-react";

export type CustomerTab = "home" | "diagnosis" | "cluster" | "my_project" | "my_page";
export type ContractorTab = "bids_search" | "bids_manage" | "my_work" | "reputation" | "my_page";

interface BottomNavProps {
  role: UserRole;
  currentCustomerTab: CustomerTab;
  currentContractorTab: ContractorTab;
  onSelectCustomerTab: (tab: CustomerTab) => void;
  onSelectContractorTab: (tab: ContractorTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  role,
  currentCustomerTab,
  currentContractorTab,
  onSelectCustomerTab,
  onSelectContractorTab,
}) => {
  if (role === "admin") {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d0d]/95 backdrop-blur-md border-t border-[rgba(248,247,244,0.1)] lg:hidden">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {role === "customer" ? (
          <>
            <button
              onClick={() => onSelectCustomerTab("home")}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                currentCustomerTab === "home"
                  ? "text-[#22c55e] font-bold"
                  : "text-[rgba(248,247,244,0.5)] hover:text-[#f8f7f4]"
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight font-mono">홈</span>
            </button>

            <button
              onClick={() => onSelectCustomerTab("diagnosis")}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                currentCustomerTab === "diagnosis"
                  ? "text-[#22c55e] font-bold"
                  : "text-[rgba(248,247,244,0.5)] hover:text-[#f8f7f4]"
              }`}
            >
              <Activity className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight font-mono">진단</span>
            </button>

            <button
              onClick={() => onSelectCustomerTab("cluster")}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                currentCustomerTab === "cluster"
                  ? "text-[#22c55e] font-bold"
                  : "text-[rgba(248,247,244,0.5)] hover:text-[#f8f7f4]"
              }`}
            >
              <Users className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight font-mono">공동공사</span>
            </button>

            <button
              onClick={() => onSelectCustomerTab("my_project")}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                currentCustomerTab === "my_project"
                  ? "text-[#22c55e] font-bold"
                  : "text-[rgba(248,247,244,0.5)] hover:text-[#f8f7f4]"
              }`}
            >
              <Briefcase className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight font-mono">내 공사</span>
            </button>

            <button
              onClick={() => onSelectCustomerTab("my_page")}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                currentCustomerTab === "my_page"
                  ? "text-[#22c55e] font-bold"
                  : "text-[rgba(248,247,244,0.5)] hover:text-[#f8f7f4]"
              }`}
            >
              <User className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight font-mono">마이</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onSelectContractorTab("bids_search")}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                currentContractorTab === "bids_search"
                  ? "text-[#22c55e] font-bold"
                  : "text-[rgba(248,247,244,0.5)] hover:text-[#f8f7f4]"
              }`}
            >
              <Search className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight font-mono">공고</span>
            </button>

            <button
              onClick={() => onSelectContractorTab("bids_manage")}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                currentContractorTab === "bids_manage"
                  ? "text-[#22c55e] font-bold"
                  : "text-[rgba(248,247,244,0.5)] hover:text-[#f8f7f4]"
              }`}
            >
              <FileText className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight font-mono">입찰</span>
            </button>

            <button
              onClick={() => onSelectContractorTab("my_work")}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                currentContractorTab === "my_work"
                  ? "text-[#22c55e] font-bold"
                  : "text-[rgba(248,247,244,0.5)] hover:text-[#f8f7f4]"
              }`}
            >
              <Hammer className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight font-mono">시공</span>
            </button>

            <button
              onClick={() => onSelectContractorTab("reputation")}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                currentContractorTab === "reputation"
                  ? "text-[#22c55e] font-bold"
                  : "text-[rgba(248,247,244,0.5)] hover:text-[#f8f7f4]"
              }`}
            >
              <Star className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight font-mono">평판</span>
            </button>

            <button
              onClick={() => onSelectContractorTab("my_page")}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
                currentContractorTab === "my_page"
                  ? "text-[#22c55e] font-bold"
                  : "text-[rgba(248,247,244,0.5)] hover:text-[#f8f7f4]"
              }`}
            >
              <User className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight font-mono">마이</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
