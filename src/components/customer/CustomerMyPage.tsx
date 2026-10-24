import React from "react";
import { BuildingRecord, UserSession } from "../../types/greentopia";
import {
  Building2,
  User,
  Shield,
  FileText,
  MapPin,
  Calendar,
  Layers,
  HelpCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface CustomerMyPageProps {
  currentUser: UserSession | null;
  building: BuildingRecord | null;
  onOpenCommunity: () => void;
  onOpenAdvisor: () => void;
  onOpenOnboarding: () => void;
}

export const CustomerMyPage: React.FC<CustomerMyPageProps> = ({
  currentUser,
  building,
  onOpenCommunity,
  onOpenAdvisor,
  onOpenOnboarding,
}) => {
  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* User Card */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
            {currentUser?.name?.slice(0, 1) || "고"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">{currentUser?.name || "홍길동"}</h1>
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                일반 고객 (건물주)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser?.email || "owner.daegu@greentopia.kr"} · {currentUser?.phone || "010-9876-5432"}
            </p>
          </div>
        </div>

        {/* Registered Building Card */}
        {building && (
          <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>등록된 내 건물 정보</span>
              </span>
              <span className="text-[11px] text-slate-500">건축물대장 매핑됨</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">{building.roadAddress || building.address}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[11px] text-slate-600">
              <div className="bg-white p-2 rounded-xl border border-slate-100">
                <span className="text-slate-400 block">용도/구조</span>
                <span className="font-semibold text-slate-800">{building.usageType} · {building.structure}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-100">
                <span className="text-slate-400 block">사용승인/연식</span>
                <span className="font-semibold text-slate-800">{building.approvalYear}년 ({building.ageYears}년차)</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-100">
                <span className="text-slate-400 block">연면적 / 층수</span>
                <span className="font-semibold text-slate-800">{building.grossAreaSqm}㎡ / {building.floorsAbove}층</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-100">
                <span className="text-slate-400 block">공동공사 참여의향</span>
                <span className="font-semibold text-emerald-700">{building.wantsCoConstruction ? "참여 희망 (90%)" : "미정"}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Helpful Shortcuts */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 mb-2">지원 및 커뮤니티 바로가기</h2>

        <button
          onClick={onOpenCommunity}
          className="w-full p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/20 transition flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">이웃 리모델링 커뮤니티</span>
              <span className="text-[11px] text-slate-500">대구 이웃 주민들의 실제 시공 후기 및 꿀팁 공유</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700">열기</span>
        </button>

        <button
          onClick={onOpenAdvisor}
          className="w-full p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/20 transition flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">국토부 정부 지원금 계산기</span>
              <span className="text-[11px] text-slate-500">이자지원 사업(최대 4%p) 및 무료 컨설팅 대상 여부 확인</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700">확인</span>
        </button>

        <button
          onClick={onOpenOnboarding}
          className="w-full p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/20 transition flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">서비스 온보딩 다시보기</span>
              <span className="text-[11px] text-slate-500">그린토피아 소개 및 회원가입 화면 재체험</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-700">체험</span>
        </button>
      </section>
    </div>
  );
};
