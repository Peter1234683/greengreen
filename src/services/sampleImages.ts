export interface SampleImageItem {
  id: string;
  title: string;
  defectDesc: string;
  category: string;
  dataUrl: string;
}

// Helper to generate clean, recognizable SVG photo placeholders converted to Data URI
function createSvgDataUrl(title: string, sub: string, accentColor: string, iconType: "window" | "mold" | "wall"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#334155" stroke-width="0.8" opacity="0.4"/>
      </pattern>
    </defs>
    <rect width="640" height="480" fill="url(#bg)"/>
    <rect width="640" height="480" fill="url(#grid)"/>

    <!-- Defect Visual Illustration -->
    <rect x="80" y="70" width="480" height="280" rx="12" fill="#1e293b" stroke="${accentColor}" stroke-width="2.5" stroke-dasharray="6,4"/>
    
    <!-- Window / Wall Graphic -->
    <rect x="120" y="100" width="190" height="220" fill="#334155" rx="6" stroke="#64748b" stroke-width="2"/>
    <rect x="330" y="100" width="190" height="220" fill="#334155" rx="6" stroke="#64748b" stroke-width="2"/>
    <line x1="215" y1="100" x2="215" y2="320" stroke="#475569" stroke-width="2"/>
    <line x1="425" y1="100" x2="425" y2="320" stroke="#475569" stroke-width="2"/>

    <!-- Warning / Detection Pin Overlay -->
    <circle cx="215" cy="270" r="28" fill="${accentColor}" fill-opacity="0.25"/>
    <circle cx="215" cy="270" r="16" fill="${accentColor}"/>
    <circle cx="215" cy="270" r="6" fill="#ffffff"/>

    <circle cx="450" cy="140" r="24" fill="#ef4444" fill-opacity="0.25"/>
    <circle cx="450" cy="140" r="14" fill="#ef4444"/>
    <circle cx="450" cy="140" r="5" fill="#ffffff"/>

    <!-- Text banner -->
    <rect x="80" y="380" width="480" height="65" rx="10" fill="#020617" stroke="#334155" stroke-width="1.5"/>
    <text x="110" y="408" font-family="sans-serif" font-size="17" font-weight="bold" fill="#f8fafc">${title}</text>
    <text x="110" y="430" font-family="sans-serif" font-size="13" fill="#94a3b8">${sub} (AI 비전 진단 대상)</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const PRESET_SAMPLE_IMAGES: SampleImageItem[] = [
  {
    id: "sample-window-condensation",
    title: "노후 알루미늄 샤시 결로 및 틈새 외풍",
    defectDesc: "은색 알루미늄 단판 창틀 하부에 결로수 고임, 모헤어 마모로 인한 기밀 저하 및 창문 하단 결로 얼룩",
    category: "창호 결로",
    dataUrl: createSvgDataUrl(
      "노후 알루미늄 창호 & 하부 결로수 맺힘",
      "열관류율 취약(단판유리) 및 프레임 틈새 침기",
      "#38bdf8",
      "window"
    ),
  },
  {
    id: "sample-wall-mold",
    title: "북측 발코니/방 모서리 열교 및 곰팡이",
    defectDesc: "외벽과 슬래브가 만나는 코너 부위 열교(Thermal Bridge)로 표면온도 저하 및 흑색 곰팡이 번식",
    category: "단열/곰팡이",
    dataUrl: createSvgDataUrl(
      "벽체 모서리 열교 현상 및 곰팡이 군집",
      "내단열 탈락 및 외기 직접 접촉부 온도차 9℃ 이상",
      "#f59e0b",
      "mold"
    ),
  },
  {
    id: "sample-exterior-crack",
    title: "외벽 드라이비트 균열 및 실리콘 탈락",
    defectDesc: "창호 주변 코킹 경화로 빗물 침투 및 외단열재 마감 미세 균열로 열손실 가속",
    category: "외벽/실리콘",
    dataUrl: createSvgDataUrl(
      "창틀 외부 코킹 경화 균열 및 단열 탈락",
      "빗물 미세 누수 및 외벽 단열 불연속 부위",
      "#ef4444",
      "wall"
    ),
  },
];

// Helper to generate clean, verified After repair SVGs
function createAfterSvgDataUrl(title: string, sub: string, specLabel: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
    <defs>
      <linearGradient id="afterBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#022c22"/>
      </linearGradient>
      <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#10b981" stop-opacity="0.15"/>
      </linearGradient>
    </defs>
    <rect width="640" height="480" fill="url(#afterBg)"/>

    <!-- Finished Outer Window Frame -->
    <rect x="70" y="55" width="500" height="320" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="3"/>

    <!-- Premium White PVC Multi-Chamber Sash Frames -->
    <rect x="95" y="80" width="215" height="260" fill="url(#glassGrad)" rx="8" stroke="#f8fafc" stroke-width="10"/>
    <rect x="330" y="80" width="215" height="260" fill="url(#glassGrad)" rx="8" stroke="#f8fafc" stroke-width="10"/>

    <!-- Glass Double Pane & Low-E Argon Reflective Line -->
    <line x1="120" y1="95" x2="270" y2="320" stroke="#a7f3d0" stroke-width="2.5" opacity="0.6"/>
    <line x1="355" y1="95" x2="505" y2="320" stroke="#a7f3d0" stroke-width="2.5" opacity="0.6"/>

    <!-- High-elasticity Silicone Bead Seal (Bottom) -->
    <rect x="90" y="340" width="460" height="12" rx="4" fill="#047857"/>

    <!-- 1st Grade Energy Efficiency Stamp -->
    <circle cx="500" cy="115" r="26" fill="#10b981" stroke="#ffffff" stroke-width="2"/>
    <text x="479" y="119" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">1등급 인증</text>

    <!-- Inspection Pass Badge -->
    <rect x="110" y="95" width="110" height="24" rx="6" fill="#065f46" stroke="#34d399" stroke-width="1"/>
    <text x="120" y="111" font-family="sans-serif" font-size="10" font-weight="bold" fill="#6ee7b7">✓ KS L 2003 정품</text>

    <!-- Quality Checkpoints Pins (Green) -->
    <circle cx="200" cy="346" r="14" fill="#10b981" fill-opacity="0.3"/>
    <circle cx="200" cy="346" r="7" fill="#10b981"/>
    <circle cx="200" cy="346" r="3" fill="#ffffff"/>

    <circle cx="330" cy="210" r="14" fill="#10b981" fill-opacity="0.3"/>
    <circle cx="330" cy="210" r="7" fill="#10b981"/>
    <circle cx="330" cy="210" r="3" fill="#ffffff"/>

    <!-- Text banner -->
    <rect x="70" y="390" width="500" height="65" rx="10" fill="#020617" stroke="#10b981" stroke-width="1.5"/>
    <text x="95" y="418" font-family="sans-serif" font-size="16" font-weight="bold" fill="#34d399">${title}</text>
    <text x="95" y="438" font-family="sans-serif" font-size="12" fill="#94a3b8">${sub} · [${specLabel}]</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const PRESET_AFTER_IMAGES: SampleImageItem[] = [
  {
    id: "after-window-system",
    title: "1등급 26mm 로이 복층 이중창 시공 완료",
    defectDesc: "노후 알루미늄 창호 완전 철거 후 LX하우시스 슈퍼세이브 26mm 아르곤 로이유리 및 백색 PVC 프레임 시공",
    category: "창호 준공",
    dataUrl: createAfterSvgDataUrl(
      "1등급 로이 복층창호 시공 완료",
      "고단열 우레탄폼 100% 충진 및 기밀 테이핑 마감",
      "에너지소비효율 1등급"
    ),
  },
  {
    id: "after-insulation-pf",
    title: "준불연 PF보드 외벽 단열 보강 및 항균 마감",
    defectDesc: "북측 벽체 곰팡이 멸균 처리 후 준불연 PF보드 100mm 밀착 시공 및 기밀방습시트 결로 완벽 차단",
    category: "단열 준공",
    dataUrl: createAfterSvgDataUrl(
      "외벽 고단열 복합 보강 시공 완료",
      "표면온도 18.5℃ 유지 및 친환경 항균 도장 마감",
      "준불연 PF보드 100mm"
    ),
  },
  {
    id: "after-silicone-recaulk",
    title: "외벽 프레임 V커팅 2차 방수 코킹 완료",
    defectDesc: "기존 노후 경화 코킹 완전 파쇄 후 변성실리콘 초내후성 실란트 15mm 폭 균일 도포",
    category: "방수 코킹",
    dataUrl: createAfterSvgDataUrl(
      "고내후성 변성실리콘 코킹 재시공 완료",
      "빗물 누수 원천 차단 및 신축 조인트 탄성 복원",
      "초내후성 변성실리콘"
    ),
  },
];

