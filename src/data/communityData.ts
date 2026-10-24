import { PRESET_AFTER_IMAGES, PRESET_SAMPLE_IMAGES } from "../services/sampleImages";

export type CommunityCategory =
  | "ALL"
  | "KNOWHOW" // 시공 노하우 & 팁
  | "REVIEW" // 시공 전·후 솔직 후기
  | "SUBSIDY" // 지원금 & 지자체 꿀팁
  | "QA" // 우리동네 Q&A
  | "GROUP_RECRUIT"; // 이웃 모집 & 묶음 요청

export interface CommunityComment {
  id: string;
  author: string;
  dong: string;
  content: string;
  createdAt: string;
  likeCount: number;
}

export interface CommunityPost {
  id: string;
  title: string;
  category: "KNOWHOW" | "REVIEW" | "SUBSIDY" | "QA" | "GROUP_RECRUIT";
  categoryLabel: string;
  authorName: string;
  authorBadge: string;
  dong: string;
  buildingType: string;
  buildingAgeYears: number;
  workTypes: string[];
  savingsAmountWon?: number;
  summary: string;
  content: string;
  keyTips: string[];
  imageUrl?: string;
  beforeThumb?: string;
  afterThumb?: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  isBest?: boolean;
  isNotice?: boolean;
  comments: CommunityComment[];
}

export const CATEGORY_LABELS: Record<string, string> = {
  ALL: "전체 글",
  KNOWHOW: "💡 시공 노하우 & 팁",
  REVIEW: "📸 시공 전·후 후기",
  SUBSIDY: "💰 지원금 꿀팁",
  QA: "❓ 우리동네 Q&A",
  GROUP_RECRUIT: "🤝 이웃 모집 & 공동구매",
};

export const NEIGHBORHOOD_DONG_LIST = [
  "전체 동네",
  "마포구 연남동",
  "마포구 성산동",
  "마포구 망원동",
  "마포구 서교동",
  "마포구 합정동",
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    title: "연남동 32년차 붉은벽돌 다가구, 이웃 4세대 묶어서 1등급 로이창호 교체한 생생 후기!",
    category: "REVIEW",
    categoryLabel: "📸 시공 전·후 후기",
    authorName: "연남동 터줏대감",
    authorBadge: "동네 시공 마스터",
    dong: "마포구 연남동",
    buildingType: "1994년 준공 다가구주택 (지상 3층)",
    buildingAgeYears: 32,
    workTypes: ["창호", "외단열"],
    savingsAmountWon: 4200000,
    summary:
      "겨울마다 결로 물방울이 줄줄 흐르던 노후 알루미늄 샤시를 이웃 4세대와 공동구매로 묶어 공사했습니다. 가구당 105만원(총 420만원) 절감했고, 이번 겨울 난방비가 35% 줄었습니다.",
    content: `안녕하세요 연남동 주민 여러분! 30년 넘은 붉은벽돌 다가구주택에 살면서 매년 겨울만 되면 발코니와 창문 아래 결로 곰팡이 때문에 도배를 새로 하느라 지쳤던 사람입니다.

이번에 그린 캠프 플랫폼에서 옆집 202호 박씨 아저씨, 뒷집 최선생님 댁과 함께 '연남동 다가구 묶음 클러스터'로 수요를 등록했습니다.
시공업체 4곳이 역경매 입찰을 들어왔는데, 단독으로 견적 받았을 때 1,000만원 부르던 26mm 로이복층유리 1등급 시스템 이중창을 세대당 820만원에 낙찰받았습니다!

공사 당일 아침 8시에 시공팀 3조가 동시에 들어와서 철거부터 우레탄폼 100% 밀실 충진, 실리콘 코킹까지 하루 만에 끝내주셨네요.
에스크로 계좌로 대금이 묶여 있어서 시공 소장님도 끝까지 꼼꼼하게 봐주셨고, AI 비전 감리에서 실리콘 균일도 96점 나와서 안심하고 준공 승인했습니다.`,
    keyTips: [
      "창호 교체 시 창틀 사이 우레탄폼을 꼼꼼하게 채우는지 꼭 현장에서 직접 눈으로 확인하세요.",
      "단독으로 부르면 자재 운반 사다리차 비용을 혼자 다 내야 하는데, 4세대가 모이니까 사다리차 1대로 하루에 분담해서 80만원 아꼈습니다.",
      "서울시 BRP 무이자 융자(최대 6천만원 8년) 신청 서류는 시공업체 선정 후 구청 건축과에 바로 접수하면 2주 안에 승인 나옵니다.",
    ],
    beforeThumb: PRESET_SAMPLE_IMAGES[0].dataUrl,
    afterThumb: PRESET_AFTER_IMAGES[0].dataUrl,
    likeCount: 42,
    commentCount: 9,
    viewCount: 684,
    createdAt: "2026.04.22",
    isBest: true,
    comments: [
      {
        id: "c-101",
        author: "연남동 햇살빌라",
        dong: "마포구 연남동",
        content: "와 전후 사진 차이가 확 나네요! 혹시 유리 두께가 26mm면 기존 방충망이나 커튼 박스 간섭은 없었나요?",
        createdAt: "2026.04.22 14:30",
        likeCount: 5,
      },
      {
        id: "c-102",
        author: "연남동 터줏대감 (작성자)",
        dong: "마포구 연남동",
        content: "@연남동 햇살빌라 님, 기존 알루미늄 틀을 완전히 털어내고 신형 와이드 프레임으로 앉혀서 커튼 박스 안쪽으로 1.5cm 여유 있게 딱 맞아떨어졌습니다!",
        createdAt: "2026.04.22 15:10",
        likeCount: 4,
      },
      {
        id: "c-103",
        author: "성산동 단독사랑",
        dong: "마포구 성산동",
        content: "사다리차 비용 분담 아이디어 정말 좋네요. 저희 동네도 묶음 시공 모집 열어봐야겠습니다.",
        createdAt: "2026.04.23 09:12",
        likeCount: 3,
      },
    ],
  },
  {
    id: "post-2",
    title: "마포구 BRP 건물에너지효율화 융자 6,000만원 0% 무이자 승인받은 꿀팁 정리",
    category: "SUBSIDY",
    categoryLabel: "💰 지원금 꿀팁",
    authorName: "성산동 금융요정",
    authorBadge: "지원금 길라잡이",
    dong: "마포구 성산동",
    buildingType: "1989년식 단독주택 (연와조)",
    buildingAgeYears: 37,
    workTypes: ["창호", "외단열", "지붕"],
    savingsAmountWon: 7200000,
    summary:
      "복잡해 보이는 서울시 BRP(건물에너지효율화사업) 8년 무이자 융자 신청 서류와 구청 심사 통과 노하우를 정리해 드립니다. 시중 대출 금리 4.5% 대비 8년간 이자만 720만원 절약했습니다.",
    content: `안녕하세요, 성산2동 37년차 낡은 단독주택을 물려받아 이번에 전면 리모델링한 주민입니다.
공사비가 총 4,800만원 정도 책정되어 목돈 마련이 막막했는데, 서울시 BRP 사업을 통해 8년 균등분할 무이자(연 0.0%) 융자를 받았습니다.

핵심 요령 3가지만 기억하시면 100% 승인됩니다:
1. 반드시 에너지소비효율 1등급 창호 또는 고효율 단열재 KS 인증서 시험성적서가 첨부되어야 합니다. (시공사에 미리 요구하면 PDF로 줍니다)
2. 건물등기부등본 상 주택 소유자 명의와 공사 계약서 서명자 명의가 일치해야 합니다.
3. 구청 방문 전 국토교통부 그린리모델링 사업자 등록 여부를 조회하세요. 비등록 무자격 동네 인테리어 업체와 계약하면 BRP 융자 대상에서 제외됩니다.`,
    keyTips: [
      "마포구청 환경과(또는 주택과) BRP 담당관에게 공사 착공 15일 전에 사전 서류 검토를 넣으세요.",
      "농협, 우리, 신한 등 시중 협약 은행에 대출 한도 사전 조회를 미리 해두면 공사 일정 차질이 없습니다.",
      "에스크로 지급 증빙서류(이체확인증)가 완공 후 구청 최종 준공계 서류로 들어가므로 증빙을 잘 챙겨두세요.",
    ],
    beforeThumb: PRESET_SAMPLE_IMAGES[1].dataUrl,
    afterThumb: PRESET_AFTER_IMAGES[1].dataUrl,
    likeCount: 58,
    commentCount: 14,
    viewCount: 1042,
    createdAt: "2026.04.20",
    isBest: true,
    comments: [
      {
        id: "c-201",
        author: "망원동 빌라주",
        dong: "마포구 망원동",
        content: "상세한 정리 정말 감사합니다! 8년 무이자면 월 원금만 50만원씩 갚으면 되니 부담이 전혀 없네요.",
        createdAt: "2026.04.20 18:20",
        likeCount: 7,
      },
    ],
  },
  {
    id: "post-3",
    title: "창호 시공 시 실리콘 코킹과 모헤어 감리할 때 꼭 봐야 할 5가지 체크포인트",
    category: "KNOWHOW",
    categoryLabel: "💡 시공 노하우 & 팁",
    authorName: "서교동 은퇴감리사",
    authorBadge: "건축기사",
    dong: "마포구 서교동",
    buildingType: "1997년식 상가주택",
    buildingAgeYears: 29,
    workTypes: ["창호", "외단열"],
    summary:
      "현업에서 30년간 감리를 보며 쌓은 창호 시공 체크리스트입니다. 창틀 수평계 확인, 우레탄폼 충진 깊이, 초내후성 변성실리콘 두께(12mm 이상) 보는 법을 공유합니다.",
    content: `서교동 골목길 상가주택 3층에 거주하는 주민입니다.
많은 이웃분들이 창호 교체 후 '비싼 1등급으로 바꿨는데 왜 여전히 우풍이 들지?' 하고 의아해하십니다.
유리가 좋아도 프레임 결합부 마감 시공이 엉망이면 열교(Thermal Bridge)로 찬바람이 그대로 들어옵니다.

[셀프 감리 핵심 5가지]
1. 기존 창틀 철거 후 벽돌 골조 면의 이물질 청소 확인
2. 창틀 프레임 레이저 수평계 오차 ±2mm 이내 확인 (문짝 기울어짐 방지)
3. 난연 우레탄폼을 외벽과 내벽 사이 100% 밀실하게 쏘는지 (겉만 살짝 쏘는 업체 주의)
4. 외부 실리콘은 일반 초산/비초산이 아니라 '변성 우레탄계' 또는 '초내후성 창호 전용 실리콘' 사용 여부
5. 창짝 하부 레일에 빗물 배수홀(위핑홀) 역풍 차단 캡 부착 여부`,
    keyTips: [
      "시공 기사님들께 음료수 드리면서 '소장님 우레탄폼 안쪽까지 꽉 채워주시는 것 맞죠?' 하고 관심 표하는 것만으로도 품질이 달라집니다.",
      "시공 전/후 사진을 각 창호별로 클로즈업해서 3장씩 찍어두시면 에스크로 A/S 유보금 해제할 때 결정적 근거가 됩니다.",
    ],
    beforeThumb: PRESET_SAMPLE_IMAGES[2].dataUrl,
    afterThumb: PRESET_AFTER_IMAGES[2].dataUrl,
    likeCount: 67,
    commentCount: 11,
    viewCount: 1250,
    createdAt: "2026.04.19",
    isBest: true,
    comments: [
      {
        id: "c-301",
        author: "연남동 초보집주인",
        dong: "마포구 연남동",
        content: "변성실리콘 마킹 확인하는 팁 메모했습니다. 전문가의 재능기부 감사드립니다!",
        createdAt: "2026.04.19 21:05",
        likeCount: 6,
      },
    ],
  },
  {
    id: "post-4",
    title: "[모집 마감임박] 망원동 망원시장 인근 다가구 2세대 추가로 묶음 할인 15% 완성해요!",
    category: "GROUP_RECRUIT",
    categoryLabel: "🤝 이웃 모집 & 공동구매",
    authorName: "망원동 희망이네",
    authorBadge: "클러스터 리더",
    dong: "마포구 망원동",
    buildingType: "1996년 준공 다가구주택",
    buildingAgeYears: 30,
    workTypes: ["창호", "외단열"],
    savingsAmountWon: 3500000,
    summary:
      "망원시장 도보 3분 거리 빌라/다가구 세대 모집 중입니다. 현재 3세대 모였고 2세대만 더 오시면 5세대 풀로 묶여 시공사 견적 15% 확정 인하됩니다. 5월 초 착공 희망!",
    content: `망원1동 주민 여러분 안녕하세요!
망원시장 근처 30년차 다가구주택 3세대가 모여서 고단열 로이창호 + 옥상 방수 단열 공동구매를 추진하고 있습니다.
그린 캠프 알고리즘 확인 결과 2세대만 추가 합류하면 최소 클러스터 요건(5세대)이 충족되어 역경매 패키지 공고가 자동으로 뜹니다.

• 모집 대상: 망원1동, 망원2동 반경 800m 이내 노후 주택/빌라
• 공사 항목: 26mm 로이창호 교체 (또는 외벽/옥상 단열)
• 희망 일정: 2026년 5월 중순 착공
• 예상 절감액: 세대당 약 150만~200만원 절약 예상

댓글 달아주시거나 참여 신청 주시면 바로 클러스터 합류 안내드리겠습니다!`,
    keyTips: [
      "같은 골목 세대끼리 묶이면 자재 하역 및 청소 차량 동선이 일원화되어 시공사도 단가를 과감하게 깎아줍니다.",
    ],
    beforeThumb: PRESET_SAMPLE_IMAGES[0].dataUrl,
    likeCount: 31,
    commentCount: 8,
    viewCount: 450,
    createdAt: "2026.04.23",
    comments: [
      {
        id: "c-401",
        author: "망원우체국 옆집",
        dong: "마포구 망원동",
        content: "저희 집 망원로 4길 다세대 2층인데 참여 가능한가요? 거실창 2개랑 방창 3개 교체 희망합니다!",
        createdAt: "2026.04.23 11:30",
        likeCount: 2,
      },
      {
        id: "c-402",
        author: "망원동 희망이네 (작성자)",
        dong: "마포구 망원동",
        content: "@망원우체국 옆집 님, 네 가능합니다! 거리상 400m라 동일 클러스터 묶음 반경 안쪽입니다. Step 2에서 수요 등록하실 때 '망원동 묶음' 선택하시면 자동 연동됩니다!",
        createdAt: "2026.04.23 11:45",
        likeCount: 2,
      },
    ],
  },
  {
    id: "post-5",
    title: "질문: 노후 빌라 꼭대기층 천장 결로 곰팡이, 창호만 바꿔도 잡히나요? 아니면 외단열 필수인가요?",
    category: "QA",
    categoryLabel: "❓ 우리동네 Q&A",
    authorName: "성산동 고민중",
    authorBadge: "주민 질문",
    dong: "마포구 성산동",
    buildingType: "1998년식 4층 빌라 4층",
    buildingAgeYears: 28,
    workTypes: ["창호", "외단열"],
    summary:
      "빌라 4층(최상층) 모서리 코너 부위에서 겨울마다 물방울이 맺히는데, 창호만 1등급으로 바꾸면 해결되는지, 지붕/외벽 단열도 함께 해야 하는지 경험자분들 조언 부탁드립니다.",
    content: `안녕하세요, 성산동 빌라 꼭대기층 401호 주민입니다.
겨울만 되면 외벽과 맞닿은 안방 천장 모서리 쪽에 결로수가 생기고 곰팡이가 피어납니다.
인테리어 가게에서는 창호만 로이유리로 바꾸면 실내 온도가 올라가서 결로가 사라진다고 하는데,
어떤 분들은 옥상 슬래브 열교 현상이라 옥상 단열이나 외벽 PF보드 보강을 안 하면 창문만 바꿔선 안 잡힌다고 하네요.

혹시 비슷한 경험으로 해결해보신 성산동 이웃분 계실까요?`,
    keyTips: [
      "자가진단 비전 카메라로 찍어봤더니 표면 온도차 8.5℃로 열교 취약 판정이 나왔습니다.",
    ],
    beforeThumb: PRESET_SAMPLE_IMAGES[1].dataUrl,
    likeCount: 19,
    commentCount: 5,
    viewCount: 382,
    createdAt: "2026.04.21",
    comments: [
      {
        id: "c-501",
        author: "서교동 은퇴감리사",
        dong: "마포구 서교동",
        content: "꼭대기층 모서리 결로는 전형적인 '슬래브-벽체 교차부 열교'입니다. 창호만 바꾸면 실내 습도가 오히려 갇혀서 천장 모서리에 결로가 더 심해질 수 있습니다. 반드시 창호 교체와 함께 천장 코너부 내단열(E보드 33mm 이상) 또는 옥상 외단열 보강을 병행하셔야 합니다.",
        createdAt: "2026.04.21 16:40",
        likeCount: 8,
      },
      {
        id: "c-502",
        author: "성산동 고민중 (작성자)",
        dong: "마포구 성산동",
        content: "@서교동 은퇴감리사 님, 큰일 날 뻔했네요! 말씀대로 복합 시공 패키지로 수요 등록 변경해야겠습니다. 정말 감사합니다!",
        createdAt: "2026.04.21 17:10",
        likeCount: 3,
      },
    ],
  },
];
