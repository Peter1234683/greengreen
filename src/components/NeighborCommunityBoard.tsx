import React, { useState } from "react";
import {
  MessageSquareText,
  Sparkles,
  Heart,
  MessageCircle,
  Eye,
  Search,
  Filter,
  PenSquare,
  Building2,
  Calendar,
  Tag,
  ArrowRight,
  TrendingDown,
  Award,
  CheckCircle2,
  Share2,
  X,
  Send,
  Camera,
  Layers,
  ThumbsUp,
  MapPin,
  HelpCircle,
  Flame,
  Lightbulb,
  Coins,
  Users,
  ChevronRight,
} from "lucide-react";
import {
  CommunityCategory,
  CommunityComment,
  CommunityPost,
  CATEGORY_LABELS,
  NEIGHBORHOOD_DONG_LIST,
  INITIAL_COMMUNITY_POSTS,
} from "../data/communityData";
import { PRESET_AFTER_IMAGES, PRESET_SAMPLE_IMAGES } from "../services/sampleImages";

interface NeighborCommunityBoardProps {
  onClose?: () => void;
  onNavigateToDemandRegister?: () => void;
}

export const NeighborCommunityBoard: React.FC<NeighborCommunityBoardProps> = ({
  onClose,
  onNavigateToDemandRegister,
}) => {
  // Data states
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory>("ALL");
  const [selectedDong, setSelectedDong] = useState<string>("전체 동네");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // Modal states
  const [activePost, setActivePost] = useState<CommunityPost | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);

  // Comment input state for active post
  const [commentAuthor, setCommentAuthor] = useState<string>("연남동 이웃 주민");
  const [commentDong, setCommentDong] = useState<string>("마포구 연남동");
  const [commentText, setCommentText] = useState<string>("");

  // New Post Form state
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCategory, setNewCategory] = useState<CommunityCategory>("KNOWHOW");
  const [newDong, setNewDong] = useState<string>("마포구 연남동");
  const [newAuthorName, setNewAuthorName] = useState<string>("연남동 30년차 주민");
  const [newBuildingType, setNewBuildingType] = useState<string>("1995년 준공 다가구주택 (3층)");
  const [newBuildingAge, setNewBuildingAge] = useState<number>(31);
  const [newWorkTypes, setNewWorkTypes] = useState<string>("창호, 외단열");
  const [newSavingsWon, setNewSavingsWon] = useState<number>(3500000);
  const [newSummary, setNewSummary] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [newTip1, setNewTip1] = useState<string>("");
  const [newTip2, setNewTip2] = useState<string>("");
  const [selectedPresetImage, setSelectedPresetImage] = useState<number>(0);

  // Upvote / Like Handler
  const handleLikePost = (postId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updated = { ...p, likeCount: p.likeCount + 1 };
          if (activePost?.id === postId) {
            setActivePost(updated);
          }
          return updated;
        }
        return p;
      })
    );
  };

  // Add Comment Handler
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activePost) return;

    const newComment: CommunityComment = {
      id: `c-${Date.now()}`,
      author: commentAuthor.trim() || "동네 주민",
      dong: commentDong,
      content: commentText.trim(),
      createdAt: "방금 전",
      likeCount: 0,
    };

    const updatedPost = {
      ...activePost,
      comments: [newComment, ...activePost.comments],
      commentCount: activePost.commentCount + 1,
    };

    setActivePost(updatedPost);
    setPosts((prev) => prev.map((p) => (p.id === activePost.id ? updatedPost : p)));
    setCommentText("");
  };

  // Submit New Post Handler
  const handleSubmitNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const keyTipsArray: string[] = [];
    if (newTip1.trim()) keyTipsArray.push(newTip1.trim());
    if (newTip2.trim()) keyTipsArray.push(newTip2.trim());
    if (keyTipsArray.length === 0) {
      keyTipsArray.push("시공 전 현장 사진과 자재 정품 인증 라벨을 꼼꼼하게 대조하세요.");
    }

    const createdPost: CommunityPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory === "ALL" ? "KNOWHOW" : newCategory,
      categoryLabel: CATEGORY_LABELS[newCategory === "ALL" ? "KNOWHOW" : newCategory],
      authorName: newAuthorName.trim() || "동네 주민",
      authorBadge: "동네 이웃",
      dong: newDong,
      buildingType: newBuildingType.trim() || "노후 주택",
      buildingAgeYears: newBuildingAge || 30,
      workTypes: newWorkTypes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      savingsAmountWon: newSavingsWon > 0 ? newSavingsWon : undefined,
      summary:
        newSummary.trim() ||
        newContent.slice(0, 110) + (newContent.length > 110 ? "..." : ""),
      content: newContent.trim(),
      keyTips: keyTipsArray,
      beforeThumb: PRESET_SAMPLE_IMAGES[selectedPresetImage]?.dataUrl,
      afterThumb: PRESET_AFTER_IMAGES[selectedPresetImage]?.dataUrl,
      likeCount: 1,
      commentCount: 0,
      viewCount: 1,
      createdAt: "방금 전",
      comments: [],
    };

    setPosts([createdPost, ...posts]);
    setIsWriteModalOpen(false);

    // Reset Form
    setNewTitle("");
    setNewSummary("");
    setNewContent("");
    setNewTip1("");
    setNewTip2("");
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    // Category match
    if (selectedCategory !== "ALL" && post.category !== selectedCategory) {
      return false;
    }
    // Dong match
    if (selectedDong !== "전체 동네" && post.dong !== selectedDong) {
      return false;
    }
    // Search keyword match
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchDong = post.dong.toLowerCase().includes(q);
      const matchAuthor = post.authorName.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchDong && !matchAuthor) {
        return false;
      }
    }
    return true;
  });

  const bestPosts = posts.filter((p) => p.isBest);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden border border-emerald-600/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200 text-xs font-bold border border-emerald-500/40 flex items-center space-x-1">
                <MessageSquareText className="w-3.5 h-3.5 text-emerald-400" />
                <span>주민 소통 & 경험 공유 광장</span>
              </span>
              <span className="text-xs text-emerald-100 font-medium">
                실제 거주민 100% 리얼 후기
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              이웃 리모델링 커뮤니티
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              우리 동네 노후주택 단열 공사 경험담, 서울시·구청 지원금 승인 노하우, 이웃 세대 묶음 할인 모집까지 생생한 정보를 이웃들과 자유롭게 나눕니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-102"
            >
              <PenSquare className="w-4 h-4 text-emerald-700" />
              <span>내 리모델링 경험담 쓰기</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/90 text-white text-xs font-bold border border-emerald-500/40 transition-colors flex items-center justify-center space-x-1"
              >
                <span>진단 단계로 돌아가기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Ambient deco */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Top Weekly Best Picks Spotlight Banner */}
      {bestPosts.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </span>
              <h2 className="text-xs sm:text-sm font-black text-amber-950">
                이번 주 동네 주민 추천 베스트 노하우 (Weekly Best)
              </h2>
            </div>
            <span className="text-[11px] text-amber-800 font-semibold hidden sm:inline">
              이웃들이 가장 많이 저장한 절감 꿀팁
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {bestPosts.slice(0, 3).map((bp) => (
              <div
                key={bp.id}
                onClick={() => setActivePost(bp)}
                className="p-3.5 rounded-xl bg-white border border-amber-200 hover:border-emerald-500 transition-all cursor-pointer shadow-xs hover:shadow-sm flex flex-col justify-between group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold">
                      {bp.categoryLabel}
                    </span>
                    <span className="text-slate-400">{bp.dong}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 line-clamp-2 transition-colors">
                    {bp.title}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium">{bp.authorName}</span>
                  <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                    <span className="flex items-center space-x-0.5">
                      <ThumbsUp className="w-3 h-3 text-emerald-600" />
                      <span>{bp.likeCount}</span>
                    </span>
                    <span>댓글 {bp.commentCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Search & Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="제목, 내용, 동네(예: 연남동, 로이유리, BRP) 검색..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dong Selector */}
          <div className="flex items-center space-x-2 shrink-0">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <select
              value={selectedDong}
              onChange={(e) => setSelectedDong(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {NEIGHBORHOOD_DONG_LIST.map((dong) => (
                <option key={dong} value={dong}>
                  {dong}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-1">
          {(
            [
              "ALL",
              "KNOWHOW",
              "REVIEW",
              "SUBSIDY",
              "QA",
              "GROUP_RECRUIT",
            ] as CommunityCategory[]
          ).map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                <span>{CATEGORY_LABELS[cat]}</span>
                {cat === "ALL" && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-white">
                    {posts.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Posts Feed Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            총 <strong>{filteredPosts.length}개</strong>의 게시글
            {selectedDong !== "전체 동네" && (
              <span className="ml-1 text-emerald-700 font-bold">({selectedDong})</span>
            )}
          </span>
          <span className="text-[11px] text-slate-400">
            실시간 이웃 교류 활성화 중
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">
              조건에 맞는 게시글이 없습니다.
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              선택하신 동네나 검색어에 등록된 글이 없습니다. 다른 동네를 선택하거나 첫 번째 노하우를 직접 남겨보세요!
            </p>
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSelectedDong("전체 동네");
                setSearchKeyword("");
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setActivePost(post)}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between group space-y-4"
              >
                {/* Top Meta info */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[11px]">
                        {post.categoryLabel}
                      </span>
                      <span className="text-slate-400 font-medium">{post.dong}</span>
                    </div>

                    {post.savingsAmountWon && (
                      <span className="text-[11px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 flex items-center space-x-1">
                        <TrendingDown className="w-3 h-3" />
                        <span>-{(post.savingsAmountWon / 10000).toLocaleString()}만원 절약</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  {/* Building Type Tag */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      🏢 {post.buildingType} ({post.buildingAgeYears}년차)
                    </span>
                    {post.workTypes.map((wt) => (
                      <span
                        key={wt}
                        className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]"
                      >
                        #{wt}
                      </span>
                    ))}
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {post.summary}
                  </p>

                  {/* Key Tips Bullet Card */}
                  {post.keyTips.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
                      <div className="font-bold text-emerald-800 flex items-center space-x-1">
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>핵심 꿀팁:</span>
                      </div>
                      <p className="line-clamp-1 pl-4 text-slate-600">
                        {post.keyTips[0]}
                      </p>
                    </div>
                  )}

                  {/* Visual Thumbnails (Before & After) */}
                  {post.beforeThumb && post.afterThumb && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="relative h-24 rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
                        <img
                          src={post.beforeThumb}
                          alt="Before"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-black/70 text-[9px] text-rose-300 px-1 rounded font-bold">
                          시공 전
                        </span>
                      </div>
                      <div className="relative h-24 rounded-lg overflow-hidden bg-slate-900 border border-emerald-400">
                        <img
                          src={post.afterThumb}
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-emerald-950/80 text-[9px] text-emerald-300 px-1 rounded font-bold">
                          시공 후 (1등급)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Footer: Author & Metrics */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-slate-800">{post.authorName}</span>
                    <span className="text-[10px] text-slate-400">· {post.createdAt}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px]">
                    <button
                      onClick={(e) => handleLikePost(post.id, e)}
                      className="flex items-center space-x-1 text-slate-500 hover:text-rose-600 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>{post.likeCount}</span>
                    </button>
                    <span className="flex items-center space-x-1 text-slate-500">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.commentCount}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-slate-400">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{post.viewCount}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Post Detail Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-xs">
                    {activePost.categoryLabel}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {activePost.dong}
                  </span>
                  {activePost.savingsAmountWon && (
                    <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      총 {(activePost.savingsAmountWon / 10000).toLocaleString()}만원 절감
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {activePost.title}
                </h2>

                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="font-bold text-slate-700">
                    {activePost.authorName} ({activePost.authorBadge})
                  </span>
                  <span>·</span>
                  <span>{activePost.createdAt}</span>
                  <span>·</span>
                  <span>조회 {activePost.viewCount}회</span>
                </div>
              </div>

              <button
                onClick={() => setActivePost(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Building Spec Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-800">{activePost.buildingType}</span>
                <span className="text-slate-400">({activePost.buildingAgeYears}년차 노후주택)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500">시공 공종:</span>
                {activePost.workTypes.map((wt) => (
                  <span
                    key={wt}
                    className="font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded text-[11px]"
                  >
                    {wt}
                  </span>
                ))}
              </div>
            </div>

            {/* Before / After Photos if available */}
            {activePost.beforeThumb && activePost.afterThumb && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>주민 제공 실제 시공 전/후 사진</span>
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-rose-700 block">
                      착공 전 (노후 샤시 결로)
                    </span>
                    <div className="h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                      <img
                        src={activePost.beforeThumb}
                        alt="Before"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-700 block">
                      준공 후 (26mm 로이 1등급)
                    </span>
                    <div className="h-44 rounded-xl overflow-hidden bg-slate-900 border border-emerald-400">
                      <img
                        src={activePost.afterThumb}
                        alt="After"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Post Main Body */}
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line space-y-3 font-normal">
              {activePost.content}
            </div>

            {/* Key Tips Box */}
            {activePost.keyTips.length > 0 && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <h4 className="text-xs font-bold text-emerald-950 flex items-center space-x-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>이웃이 전하는 핵심 시공 & 절감 꿀팁 체크리스트</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-emerald-900">
                  {activePost.keyTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Like & Share Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleLikePost(activePost.id)}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>이웃 글 도움돼요 ({activePost.likeCount})</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert("게시글 링크가 복사되었습니다!");
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>공유하기</span>
                </button>
              </div>
            </div>

            {/* -------------------------------------------------------------
                COMMENTS SECTION
                ------------------------------------------------------------- */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900">
                  이웃들의 실시간 댓글 ({activePost.comments.length})
                </h4>
              </div>

              {/* Comment Input Form */}
              <form onSubmit={handleAddComment} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="작성자 닉네임"
                    className="w-1/3 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-emerald-500"
                  />
                  <select
                    value={commentDong}
                    onChange={(e) => setCommentDong(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {NEIGHBORHOOD_DONG_LIST.filter((d) => d !== "전체 동네").map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="이웃에게 질문이나 응원의 댓글을 남겨보세요..."
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-40 transition-colors flex items-center space-x-1 shrink-0 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>등록</span>
                  </button>
                </div>
              </form>

              {/* Existing Comments List */}
              <div className="space-y-2.5">
                {activePost.comments.length === 0 ? (
                  <p className="text-center py-4 text-xs text-slate-400">
                    첫 번째 댓글을 남겨 이웃과 소통해보세요!
                  </p>
                ) : (
                  activePost.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-800">
                            {comment.author}
                          </span>
                          <span className="text-slate-400">({comment.dong})</span>
                        </div>
                        <span className="text-slate-400">{comment.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. New Post Modal (새 글 쓰기) */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <PenSquare className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">
                  내 리모델링 경험담 & 노하우 공유하기
                </h3>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewPost} className="space-y-4 text-xs">
              {/* Category & Dong */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    게시판 카테고리
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CommunityCategory)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value="KNOWHOW">💡 시공 노하우 & 팁</option>
                    <option value="REVIEW">📸 시공 전·후 후기</option>
                    <option value="SUBSIDY">💰 지원금 꿀팁</option>
                    <option value="QA">❓ 우리동네 Q&A</option>
                    <option value="GROUP_RECRUIT">🤝 이웃 모집 & 공동구매</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    거주 동네
                  </label>
                  <select
                    value={newDong}
                    onChange={(e) => setNewDong(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    {NEIGHBORHOOD_DONG_LIST.filter((d) => d !== "전체 동네").map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  제목
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 연남동 30년차 다가구, 이웃과 창호 묶음으로 350만원 아낀 팁!"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Building Spec */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    건축물 유형
                  </label>
                  <input
                    type="text"
                    value={newBuildingType}
                    onChange={(e) => setNewBuildingType(e.target.value)}
                    placeholder="1995년 준공 다가구주택"
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    건물 연식 (년)
                  </label>
                  <input
                    type="number"
                    value={newBuildingAge}
                    onChange={(e) => setNewBuildingAge(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Work Types & Savings */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    시공 항목 (쉼표 구분)
                  </label>
                  <input
                    type="text"
                    value={newWorkTypes}
                    onChange={(e) => setNewWorkTypes(e.target.value)}
                    placeholder="창호, 외단열, BRP"
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    절감 금액 (원)
                  </label>
                  <input
                    type="number"
                    value={newSavingsWon}
                    onChange={(e) => setNewSavingsWon(Number(e.target.value))}
                    placeholder="3500000"
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  상세 경험담 및 후기 내용
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="공사 과정, 자재 선택 기준, 시공사 감리 요령, 난방비 절감 체감 등을 솔직하게 작성해주세요."
                  className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Key Tips inputs */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">
                  💡 이웃들을 위한 핵심 꿀팁 2가지 (선택)
                </span>
                <input
                  type="text"
                  value={newTip1}
                  onChange={(e) => setNewTip1(e.target.value)}
                  placeholder="꿀팁 1: 예) BRP 융자 신청 전 구청 담당자에게 사전 서류 검토 필수"
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  value={newTip2}
                  onChange={(e) => setNewTip2(e.target.value)}
                  placeholder="꿀팁 2: 예) 창틀 사이 우레탄폼 밀실 충진 여부 직접 확인하기"
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              {/* Photo Presets */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  대표 시공 사진 샘플 첨부
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_SAMPLE_IMAGES.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedPresetImage(idx)}
                      className={`p-1.5 rounded-lg border text-left transition-all ${
                        selectedPresetImage === idx
                          ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 font-bold text-emerald-950"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      <div className="h-14 rounded overflow-hidden mb-1 bg-slate-900">
                        <img
                          src={img.dataUrl}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] block line-clamp-1">
                        {img.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>게시글 등록하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeighborCommunityBoard;
