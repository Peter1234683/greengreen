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
    <header className="sticky top-0 z-40 bg-[#fdfcf8]/95 backdrop-blur-md border-b border-[rgba(26,28,30,0.08)] px-6 lg:px-12 py-5 flex items-center justify-between gap-6">
      {/* Zone 1: Brand (Variation 3 Editorial Cormorant Garamond) */}
      <div className="brand cursor-pointer shrink-0" onClick={() => onSwitchRole("customer")}>
        <div className="flex items-baseline gap-3">
          <h1 className="font-serif-garamond text-3xl font-semibold italic text-[#1a1c1e] tracking-tight">
            GreenTopia
          </h1>
          <span className="hidden sm:inline font-geist text-[10px] uppercase tracking-[0.2em] text-[rgba(26,28,30,0.6)] font-medium">
            PLATFORM OPERATING CONSOLE
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation (Variation 3 Top Nav) */}
      <nav className="top-nav shrink-0 overflow-x-auto">
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

      {/* Zone 3: Actions (PWA install, Seed Reset, System Status) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* PWA Install */}
        {isInstallable && (
          <button
            onClick={install}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#059669] text-white text-xs font-geist font-semibold tracking-wide rounded-full hover:bg-[#047857] transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PWA INSTALL</span>
          </button>
        )}

        {isIOS && !isInstallable && (
          <button
            onClick={() => setShowIosGuide(true)}
            className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 border border-[rgba(26,28,30,0.15)] text-[#1a1c1e] text-xs font-geist rounded-full hover:bg-black/5 transition"
          >
            + HOME
          </button>
        )}

        {/* Reset Seed Button */}
        <button
          onClick={onResetSeed}
          className="p-2 text-[rgba(26,28,30,0.5)] hover:text-[#059669] hover:bg-black/5 rounded-full transition-all"
          title="대구 100동 및 15개 시공업체 시드 데이터 재설정"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* User Status / Mode Marker in Geist Mono */}
        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-[rgba(26,28,30,0.12)] text-xs font-geist text-[rgba(26,28,30,0.7)]">
          <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
          <span className="text-[#1a1c1e] font-medium">{userName || "DAEGU_PILOT"}</span>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm border border-[rgba(26,28,30,0.12)] bg-[#ffffff] p-6 text-[#1a1c1e] rounded-2xl shadow-xl">
            <h3 className="text-base font-bold font-inter text-[#059669]">아이폰 홈 화면에 추가</h3>
            <p className="mt-2 text-xs text-[rgba(26,28,30,0.7)] leading-relaxed font-geist">
              1. 사파리 브라우저 하단 <strong>공유(Share)</strong> 버튼 선택
              <br />
              2. <strong>'홈 화면에 추가'</strong>를 선택하세요.
            </p>
            <button
              onClick={() => setShowIosGuide(false)}
              className="mt-5 w-full bg-[#059669] py-2.5 text-xs font-geist font-bold text-white uppercase rounded-full hover:bg-[#047857]"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
