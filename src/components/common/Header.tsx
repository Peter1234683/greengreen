import React, { useState } from "react";
import { UserRole } from "../../types/greentopia";
import { usePWAInstall } from "../../hooks/usePWAInstall";
import { Download, RefreshCw } from "lucide-react";

interface HeaderProps {
  activeRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onOpenOnboarding: () => void;
  onResetSeed: () => void;
  userName?: string;
  totalBuildingsCount: number;
  totalContractorsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onSwitchRole,
  onOpenOnboarding,
  onResetSeed,
  userName,
  totalBuildingsCount,
  totalContractorsCount,
}) => {
  const { isInstallable, install, isIOS } = usePWAInstall();
  const [showIosGuide, setShowIosGuide] = useState(false);

  return (
    <header className="header sticky top-0 z-40 bg-[#F8F7F4]/95 backdrop-blur-md px-6 sm:px-12 py-5 flex items-center justify-between border-b border-[rgba(17,17,19,0.08)]">
      {/* Brand (Variation 4: Clean, 1.5rem, bold, -0.04em tracking) */}
      <div
        className="brand cursor-pointer shrink-0"
        onClick={() => onSwitchRole("customer")}
      >
        <div className="flex items-baseline gap-2.5">
          <span className="font-inter font-bold text-2xl tracking-[-0.04em] text-[#111113]">
            GreenTopia
          </span>
          <span className="hidden md:inline font-jetbrains text-[9px] uppercase tracking-[0.2em] text-[#111113]/40">
            DAEGU PILOT
          </span>
        </div>
      </div>

      {/* Nav Links (Variation 4: JetBrains Mono 0.65rem, uppercase, 0.15em tracking, accent underline) */}
      <nav className="nav-links overflow-x-auto shrink-0">
        <button
          type="button"
          onClick={() => onSwitchRole("customer")}
          className={activeRole === "customer" ? "active" : ""}
        >
          건물주
        </button>
        <button
          type="button"
          onClick={() => onSwitchRole("contractor")}
          className={activeRole === "contractor" ? "active" : ""}
        >
          시공업체
        </button>
        <button
          type="button"
          onClick={() => onSwitchRole("admin")}
          className={activeRole === "admin" ? "active" : ""}
        >
          관리자
        </button>
        <button
          type="button"
          onClick={onOpenOnboarding}
          title="온보딩 안내 다시보기"
        >
          온보딩
        </button>
      </nav>

      {/* Utilities: PWA install, Reset Seed, User status */}
      <div className="flex items-center gap-3 shrink-0">
        {isInstallable && (
          <button
            onClick={install}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2E5C4E] text-white text-xs font-jetbrains rounded-full hover:bg-[#24493e] transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PWA INSTALL</span>
          </button>
        )}

        {isIOS && !isInstallable && (
          <button
            onClick={() => setShowIosGuide(true)}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 border border-[rgba(17,17,19,0.15)] text-[#111113] text-xs font-jetbrains rounded-full hover:bg-black/5 transition"
          >
            + HOME
          </button>
        )}

        <button
          onClick={onResetSeed}
          className="p-2 text-[#111113]/50 hover:text-[#2E5C4E] hover:bg-black/5 rounded-full transition-all"
          title="대구 100동 노후 주택 및 15개 시공업체 시드 데이터 재설정"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-[rgba(17,17,19,0.1)] text-xs font-jetbrains text-[#111113]/60">
          <span className="w-2 h-2 rounded-full bg-[#2E5C4E]"></span>
          <span className="text-[#111113] font-medium">{userName || "DAEGU_PILOT"}</span>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm border border-[rgba(17,17,19,0.12)] bg-[#FFFFFF] p-6 text-[#111113] rounded-2xl shadow-xl">
            <h3 className="text-base font-bold font-inter text-[#2E5C4E]">아이폰 홈 화면에 추가</h3>
            <p className="mt-2 text-xs text-[#111113]/70 leading-relaxed font-jetbrains">
              1. 사파리 브라우저 하단 <strong>공유(Share)</strong> 버튼 선택
              <br />
              2. <strong>'홈 화면에 추가'</strong>를 선택하세요.
            </p>
            <button
              onClick={() => setShowIosGuide(false)}
              className="mt-5 w-full bg-[#2E5C4E] py-2.5 text-xs font-jetbrains font-bold text-white uppercase rounded-full hover:bg-[#24493e]"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
