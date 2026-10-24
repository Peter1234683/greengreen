import React from "react";
import { Leaf, Sparkles, Building2, Users, Gavel, ShieldCheck, HelpCircle, HardHat, FileCheck, MessageSquareText } from "lucide-react";

interface HeaderProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  onOpenAdvisor: () => void;
  onOpenCommunity?: () => void;
  isCommunityActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onSelectStep,
  onOpenAdvisor,
  onOpenCommunity,
  isCommunityActive = false,
}) => {
  const steps = [
    { number: 1, title: "1. 자가진단", sub: "대장 + AI 비전", icon: Building2 },
    { number: 2, title: "2. 수요 등록", sub: "공사·예산 선택", icon: Leaf },
    { number: 3, title: "3. 수요 군집화", sub: "이웃 묶음 할인", icon: Users },
    { number: 4, title: "4. 지도·역경매", sub: "시공사 입찰 경쟁", icon: Gavel },
    { number: 5, title: "5. 공정 관리", sub: "시공 현장 감리", icon: HardHat },
    { number: 6, title: "6. 계약·신뢰장치", sub: "에스크로·AI검측·평판", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectStep(1)}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-bold">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">그린 캠프</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                  Green Camp
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                AI 기반 민간건축물 그린리모델링 수요 매칭 플랫폼
              </p>
            </div>
          </div>

          {/* Right Action: Community Board & Subsidy Advisor */}
          <div className="flex items-center space-x-2">
            {onOpenCommunity && (
              <button
                onClick={onOpenCommunity}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-all shadow-xs cursor-pointer ${
                  isCommunityActive
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-emerald-500/30"
                    : "text-slate-700 bg-white hover:bg-slate-50 border-slate-300"
                }`}
              >
                <MessageSquareText className={`w-4 h-4 ${isCommunityActive ? "text-emerald-400" : "text-emerald-600"}`} />
                <span>이웃 커뮤니티</span>
                <span className="hidden sm:inline text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  실제 후기
                </span>
              </button>
            )}

            <button
              onClick={onOpenAdvisor}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>정부 지원금 AI 상담</span>
            </button>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="py-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <nav className="flex space-x-2 sm:space-x-4 min-w-max">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = !isCommunityActive && currentStep === s.number;
              const isPast = !isCommunityActive && currentStep > s.number;

              return (
                <button
                  key={s.number}
                  onClick={() => onSelectStep(s.number)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-left transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-900"
                      : isPast
                      ? "bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100 border border-emerald-200/60"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? "bg-emerald-500 text-white"
                        : isPast
                        ? "bg-emerald-200 text-emerald-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">{s.title}</div>
                    <div className={`text-[10px] ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                      {s.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
