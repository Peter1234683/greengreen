import React, { useState } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  MessageCircle,
  Users,
  Sparkles,
  TrendingDown,
  Building,
} from "lucide-react";
import { OptimizedCluster } from "../types";

interface InviteNeighborsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cluster: OptimizedCluster | null;
  currentHouseholds: number;
  neededForNextDiscount: number;
  nextDiscountPercent: number;
  nextDiscountAmountWon: number; // 만원
}

export const InviteNeighborsModal: React.FC<InviteNeighborsModalProps> = ({
  isOpen,
  onClose,
  cluster,
  currentHouseholds,
  neededForNextDiscount,
  nextDiscountPercent,
  nextDiscountAmountWon,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const clusterName = cluster?.name || "마포구 연남·성산 1등급 창호 공동구매";
  const shareUrl = `https://greencamp.kr/cluster/mapo-${cluster?.clusterId || "window-1"}`;
  const shareMessage = `[그린캠프 이웃 초대]\n🏡 ${clusterName}\n현재 우리 동네 ${currentHouseholds}세대가 함께 창호 공동구매를 진행 중입니다!\n단 ${neededForNextDiscount}세대만 추가 참여하면 전 세대 시공 단가 ${nextDiscountPercent}% 추가 인하(세대당 -${nextDiscountAmountWon}만원 절감)가 확정됩니다.\n\n▶ 참여 신청 및 우리 집 진단: ${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full w-fit mb-3 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>동네 이웃 초대 & 공동구매 단가 인하</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1.5">
          이웃을 초대해 단가를 더 낮춰보세요!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
          우리 동네 <strong>{neededForNextDiscount}세대</strong>만 더 모이면,
          참여하는 모든 이웃의 공사비가 <strong>{nextDiscountPercent}% 추가 인하</strong>됩니다.
        </p>

        {/* Gamification Goal Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200 mb-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-emerald-900 flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>다음 레벨(단가 추가 인하)까지</span>
            </span>
            <span className="font-black text-emerald-700 text-sm">
              {currentHouseholds} / {currentHouseholds + neededForNextDiscount}세대
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-emerald-200/70 h-2.5 rounded-full overflow-hidden mb-3">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{
                width: `${(currentHouseholds / (currentHouseholds + neededForNextDiscount)) * 100}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-emerald-800 bg-white/80 p-2.5 rounded-xl border border-emerald-200/70">
            <span className="flex items-center space-x-1 font-semibold">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>추가 인하 확정 혜택:</span>
            </span>
            <span className="font-black text-emerald-700">
              전 세대 각 -{nextDiscountAmountWon}만원 추가 절감!
            </span>
          </div>
        </div>

        {/* Kakao-style Card Preview */}
        <div className="mb-5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            카카오톡 공유 카드 미리보기
          </label>
          <div className="bg-[#FEE500] rounded-2xl p-4 border border-[#FEE500]/80 shadow-xs text-slate-900 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <div className="w-5 h-5 rounded-md bg-slate-900 text-yellow-300 font-black text-[10px] flex items-center justify-center">
                  GC
                </div>
                <span className="text-xs font-bold text-slate-800">그린 캠프 동네 알림</span>
              </div>
              <span className="text-[10px] bg-slate-900/10 px-2 py-0.5 rounded-full font-semibold">
                마포구 공동구매
              </span>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-xs">
              <div className="text-xs font-black text-slate-900 mb-1">
                🏡 우리 동네 창호 교체 {currentHouseholds}세대 대기 중!
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                "현재 {currentHouseholds}세대 매칭 완료. <strong>단 {neededForNextDiscount}세대 추가 모집 시</strong> 사다리차·물류비 N분할로 단가 <strong>{nextDiscountPercent}% 추가 인하</strong> 확정!"
              </p>
              <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md">
                ✓ 국토교통부 표준 시방서 기준 1등급 로이창호 · 무상 A/S 5년
              </div>
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleCopyText}
            className="w-full py-3 bg-[#FEE500] hover:bg-[#FADA0A] text-slate-900 font-black rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center space-x-2 shadow-xs"
          >
            <MessageCircle className="w-4 h-4 fill-slate-900" />
            <span>
              {copiedText ? "단톡방 문구가 복사되었습니다! ✓" : "카카오톡 단톡방용 문구 복사하기"}
            </span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">링크 복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>공동구매 참여 링크 복사</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
              title="QR코드 보기"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR코드</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
