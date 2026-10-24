import React, { useState } from "react";
import { ContractorProfile, BuildingRecord } from "../../types/greentopia";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Users,
  Search,
  Filter,
  Layers,
} from "lucide-react";

interface AdminDashboardProps {
  contractors: ContractorProfile[];
  buildings: BuildingRecord[];
  onUpdatePqStatus: (contractorId: string, status: "approved" | "rejected", notes?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  contractors,
  buildings,
  onUpdatePqStatus,
}) => {
  const [filterPq, setFilterPq] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [searchKeyword, setSearchKeyword] = useState("");

  const pendingCount = contractors.filter((c) => c.pqStatus === "pending").length;
  const approvedCount = contractors.filter((c) => c.pqStatus === "approved").length;

  const filteredContractors = contractors.filter((c) => {
    if (filterPq !== "all" && c.pqStatus !== filterPq) return false;
    if (
      searchKeyword &&
      !c.companyName.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      !c.representativeName.toLowerCase().includes(searchKeyword.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* 1. Admin Header Banner */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                그린토피아 플랫폼 운영 관리자 콘솔
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              시공업체 자격 심사(PQ) 및 플랫폼 운영 관리
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              국토부 그린리모델링(GR) 사업자 증빙 및 전문건설업 면허를 확인하여 입찰 권한을 부여합니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-center min-w-[100px]">
              <span className="text-[11px] text-slate-400 block mb-0.5">심사 대기</span>
              <span className="text-xl font-bold text-amber-400 tabular-nums">
                {pendingCount}개사
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-center min-w-[100px]">
              <span className="text-[11px] text-slate-400 block mb-0.5">승인 완료</span>
              <span className="text-xl font-bold text-emerald-400 tabular-nums">
                {approvedCount}개사
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block mb-1">등록 노후 주택</span>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {buildings.length}동
          </div>
          <span className="text-[11px] text-emerald-700">대구 8개 구 전역</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block mb-1">가입 시공업체</span>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {contractors.length}곳
          </div>
          <span className="text-[11px] text-slate-500">창호·단열·설비 전문</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block mb-1">가동 예정 클러스터</span>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            18개
          </div>
          <span className="text-[11px] text-emerald-700">남구/서구/수성구</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block mb-1">공동공사 참여율</span>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            91%
          </div>
          <span className="text-[11px] text-slate-500">100동 중 91동 찬성</span>
        </div>
      </div>

      {/* 3. Contractor PQ Management Table */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">시공업체 자격 심사 (PQ 1차)</h2>
            <p className="text-xs text-slate-500">
              신규 등록된 시공사의 서류를 검토하고 입찰 권한을 부여합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {(["pending", "approved", "all"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterPq(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    filterPq === tab
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab === "pending"
                    ? `대기 (${pendingCount})`
                    : tab === "approved"
                    ? `승인 (${approvedCount})`
                    : `전체 (${contractors.length})`}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="업체명 또는 대표자 검색"
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Contractor List */}
        <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
          {filteredContractors.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              해당 조건의 시공업체가 없습니다.
            </div>
          ) : (
            filteredContractors.map((cont) => (
              <div
                key={cont.id}
                className="p-4 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{cont.companyName}</span>
                    <span className="text-xs text-slate-500">대표: {cont.representativeName}</span>

                    {/* Status Badge */}
                    {cont.pqStatus === "pending" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                        <Clock className="w-3 h-3" />
                        <span>심사 대기</span>
                      </span>
                    )}
                    {cont.pqStatus === "approved" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>입찰 승인</span>
                      </span>
                    )}
                    {cont.pqStatus === "rejected" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800">
                        <XCircle className="w-3 h-3" />
                        <span>반려됨</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                    <span>사업자: {cont.businessNumber}</span>
                    <span>면허: {cont.licenseType} ({cont.licenseNumber})</span>
                    <span>
                      GR 인증:{" "}
                      <strong className={cont.isGrCertified ? "text-emerald-700" : "text-slate-400"}>
                        {cont.isGrCertified ? "국토부 등록" : "미등록"}
                      </strong>
                    </span>
                    <span>하자보증: {cont.warrantyGuaranteed ? "보증 가능" : "불가"}</span>
                  </div>

                  {cont.pqReviewNotes && (
                    <p className="text-[11px] text-slate-500 italic">
                      참고: {cont.pqReviewNotes}
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  {cont.pqStatus !== "approved" && (
                    <button
                      onClick={() => onUpdatePqStatus(cont.id, "approved", "관리자 즉시 승인: PQ 1차 통과")}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition"
                    >
                      승인 처리
                    </button>
                  )}

                  {cont.pqStatus !== "rejected" && (
                    <button
                      onClick={() => onUpdatePqStatus(cont.id, "rejected", "서류 미비로 보완 요청")}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition"
                    >
                      반려
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
