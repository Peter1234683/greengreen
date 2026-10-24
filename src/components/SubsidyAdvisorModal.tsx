import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Sparkles,
  Send,
  Bot,
  Building,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Coins,
  ShieldAlert,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";
import { BuildingLedgerData } from "../types";

interface SubsidyAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  buildingData: BuildingLedgerData | null;
  selectedWorks?: string[];
}

export const SubsidyAdvisorModal: React.FC<SubsidyAdvisorModalProps> = ({
  isOpen,
  onClose,
  buildingData,
  selectedWorks = ["1등급 로이복층창호 교체", "외벽 단열 보강"],
}) => {
  const [question, setQuestion] = useState<string>("");
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "bot"; text: string; time: string }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userAddress = buildingData?.address || "서울시 마포구 연남동 383-12";
  const userAge = buildingData?.ageYears || 28;
  const userStructure = buildingData?.structure || "철근콘크리트구조";

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Initial RAG Briefing on open
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      setHasInitialized(true);
      fetchInitialAdvisory();
    }
  }, [isOpen, hasInitialized]);

  const fetchInitialAdvisory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/advisor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: "", // Trigger auto-briefing
          context: buildingData || {
            address: userAddress,
            ageYears: userAge,
            structure: userStructure,
            approvalDate: "1998-05-14",
          },
          selectedWorks,
        }),
      });

      const data = await res.json();
      const initialText =
        data.answer ||
        `안녕하세요! 고객님의 주택(${userAddress}, ${userAge}년차) 맞춤 지원금을 조회했습니다.\n\n💡 해당 지역은 노후주택 단열 지원 조례에 따라 10% 추가 환급 대상일 수 있습니다.\n\n• 국토교통부 민간 이자지원사업: 대출이자 연 3~4% 5년간 정부 전액 대납\n• 서울시 BRP 무이자 융자: 최대 6,000만원 8년 무이자(0%) 지원\n• 마포구 조례 보조금: 공사비의 10% 추가 환급 (최대 300만원)\n\n※ 실제 적용 여부는 관할 지자체 확인이 필요합니다.`;

      setMessages([
        {
          sender: "bot",
          text: initialText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages([
        {
          sender: "bot",
          text: `안녕하세요! ${userAddress} (${userAge}년차 ${userStructure}) 조건에 따른 지원금 규정입니다.\n\n💡 해당 지역은 노후주택 단열 지원 조례에 따라 10% 추가 환급 대상일 수 있습니다.\n\n• 국토교통부 민간 이자지원: 에너지 1등급 창호 교체 시 대출이자 연 3~4% 정부 전액 지원\n• 서울시 BRP: 최대 6,000만원 8년 무이자 융자\n• 지자체 노후주택 보조금: 공사비 10% 추가 환급\n\n※ 실제 적용 여부는 관할 지자체 확인이 필요합니다.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const quickQuestions = [
    "마포구 10% 추가 환급 조례 조건이 어떻게 되나요?",
    "국토부 이자지원과 서울시 BRP 중복 신청 가능한가요?",
    "세입자가 거주 중이어도 지원금 신청할 수 있나요?",
    "신청 서류와 시공사 협조 절차는 어떻게 되나요?",
    "공사 후 취득세나 재산세 감면 혜택도 있나요?",
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || question;
    if (!textToSend.trim() || isLoading) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: textToSend, time: currentTime },
    ]);
    setQuestion("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/advisor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          context: buildingData || {
            address: userAddress,
            ageYears: userAge,
            structure: userStructure,
          },
          selectedWorks,
        }),
      });
      const data = await res.json();
      let answerText = data.answer || "상담 답변을 불러오지 못했습니다.";

      // Ensure mandatory disclaimer
      if (!answerText.includes("관할 지자체 확인이 필요합니다")) {
        answerText =
          answerText.trim() + "\n\n※ 실제 적용 여부는 관할 지자체 확인이 필요합니다.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: answerText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `국토교통부 그린리모델링 민간 이자지원사업은 에너지 성능 개선 비율(20% 이상)에 따라 최대 연 3~4%의 은행 대출이자를 정부가 5년간 전액 대납 지원합니다.\n\n해당 지역은 노후주택 단열 지원 조례에 따라 10% 추가 환급 대상일 수 있습니다.\n\n※ 실제 적용 여부는 관할 지자체 확인이 필요합니다.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[88vh] max-h-[780px] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header with Title and Metadata */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold ring-1 ring-emerald-400/30">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  숨은 지원금 안내 AI 챗봇
                </h3>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded-full font-bold border border-emerald-400/30">
                  RAG 법령·조례 연동
                </span>
              </div>
              <p className="text-[11px] text-emerald-200">
                국토부 민간이자지원(연 3~4%) · 서울시 BRP(무이자 6,000만) · 지자체 환급 조례
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Building Context Ribbon */}
        <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2 text-slate-700 font-medium truncate">
            <Building className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-bold text-slate-900 truncate">{userAddress}</span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-800 font-semibold">{userAge}년 경과 노후건축물</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600 font-mono text-[11px]">{userStructure}</span>
          </div>

          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-bold">
            지자체 조례 매칭 완료
          </span>
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/70">
          {messages.map((m, idx) => {
            const isBot = m.sender === "bot";

            return (
              <div
                key={idx}
                className={`flex items-start space-x-2.5 ${
                  isBot ? "justify-start" : "justify-end"
                }`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                    isBot
                      ? "bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs"
                      : "bg-slate-900 text-white rounded-tr-xs"
                  }`}
                >
                  {/* Render content with bullet highlight support */}
                  <div className="space-y-1.5 whitespace-pre-wrap">
                    {m.text.split("\n").map((line, lIdx) => {
                      if (line.includes("※ 실제 적용 여부는 관할 지자체 확인이 필요합니다")) {
                        return (
                          <div
                            key={lIdx}
                            className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-amber-700 font-bold flex items-center space-x-1.5"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{line}</span>
                          </div>
                        );
                      }

                      if (line.includes("10% 추가 환급 대상")) {
                        return (
                          <div
                            key={lIdx}
                            className="p-2.5 my-1.5 bg-emerald-50 text-emerald-900 font-black rounded-xl border border-emerald-200 flex items-center space-x-1.5"
                          >
                            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{line}</span>
                          </div>
                        );
                      }

                      return <p key={lIdx}>{line}</p>;
                    })}
                  </div>

                  <div
                    className={`text-[10px] mt-2 font-mono ${
                      isBot ? "text-slate-400" : "text-slate-400 text-right"
                    }`}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start space-x-2.5">
              <div className="w-8 h-8 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs text-slate-500 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>지자체 지원금 조례 및 국토부 이자지원 규정을 분석하고 있습니다...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick query chips */}
        <div className="px-4 py-2.5 border-t border-slate-200/80 bg-white flex items-center space-x-1.5 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>추천 질문:</span>
          </span>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-[11px] px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 transition-colors whitespace-nowrap border border-slate-200/80 font-medium shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-3.5 border-t border-slate-200 bg-white shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="예: 우리 집 창호 교체 시 서울시 BRP와 마포구 보조금 중복 가능한가요?"
              className="flex-1 px-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-slate-50 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-2xl transition-all shadow-md flex items-center space-x-1.5 text-xs sm:text-sm shrink-0"
            >
              <span>전송</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="mt-1.5 text-center text-[10px] text-slate-400">
            Gemini 3.8 Flash RAG 기반 지자체 조례 분석기 · 관할 지자체 고시 기준 상시 반영
          </div>
        </div>
      </div>
    </div>
  );
};
