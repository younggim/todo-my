import type {
  GapCategory,
  JobAttempt,
  JobKey,
  UpliftCase,
} from "@/types/uplift";

export const CASES: UpliftCase[] = [
  {
    id: "case-1",
    title: "ChatGPT로 회의록 자동 요약",
    description:
      "녹취 텍스트를 붙여넣고 결정사항·할일·의문점 3섹션으로 정리시키기.",
    url: "https://chatgpt.com",
  },
  {
    id: "case-2",
    title: "Cursor로 코드 리팩터링 1차 검토",
    description: "PR 변경 diff를 Cursor에 보내 누락 케이스·네이밍 후보 받기.",
    url: "https://cursor.com",
  },
  {
    id: "case-3",
    title: "Claude로 긴 PDF 핵심 발췌",
    description:
      "100페이지 보고서 → 결론·반론·내가 더 알아야 할 5가지로 압축 요청.",
    url: "https://claude.ai",
  },
  {
    id: "case-4",
    title: "Notion AI로 회의 안건 초안",
    description: "프로젝트 페이지에서 다음 회의 안건 초안 자동 생성하기.",
    url: "https://www.notion.so/help/ai",
  },
  {
    id: "case-5",
    title: "Perplexity로 사실 확인 검색",
    description:
      "근거 출처 링크가 따라붙는 검색 — 일반 구글 검색보다 정리 빠름.",
    url: "https://www.perplexity.ai",
  },
  {
    id: "case-6",
    title: "GitHub Copilot으로 테스트 케이스 생성",
    description:
      "함수 시그니처에 주석으로 의도 적고 Copilot에게 edge case 테스트 작성 시키기.",
    url: "https://github.com/features/copilot",
  },
  {
    id: "case-7",
    title: "Gemini로 스프레드시트 데이터 변환",
    description:
      "Google Sheets에서 자연어로 컬럼 변환·요약·중복 제거 지시.",
    url: "https://workspace.google.com/products/gemini",
  },
  {
    id: "case-8",
    title: "Whisper로 영상 자막 추출 후 정리",
    description:
      "회의 영상 → 자막 추출 → AI에 요약시켜 5분 내 회의록 만들기.",
    url: "https://openai.com/research/whisper",
  },
  {
    id: "case-9",
    title: "v0로 프로토타입 UI 빠르게 그리기",
    description:
      "텍스트 한 문장으로 React 컴포넌트 시안을 받아 디자인 검토 회의에 사용.",
    url: "https://v0.app",
  },
  {
    id: "case-10",
    title: "AI에게 1주일 회고 인터뷰 받기",
    description:
      "내 메모를 붙여놓고 '이번 주 내가 놓친 것을 5가지 질문으로 짚어줘' 요청.",
    url: "https://chatgpt.com",
  },
];

const ATTEMPTS_DEVELOPER: JobAttempt[] = [
  {
    id: "dev-1",
    title: "Cursor로 새 컴포넌트 1개 작성",
    description: "주석으로 props·동작을 명세하고 AI에 1차 구현시킨 뒤 손으로 다듬기.",
  },
  {
    id: "dev-2",
    title: "PR diff를 Claude에 붙여넣고 review",
    description: "리뷰어 관점 코멘트 5개를 받아본 뒤 셀프 리뷰 보강.",
  },
  {
    id: "dev-3",
    title: "Copilot으로 단위 테스트 자동 작성",
    description: "edge case 테스트 5개를 함수 1개에 대해 생성 후 정리.",
  },
  {
    id: "dev-4",
    title: "Whisper + Claude로 회의 회고 메모",
    description: "팀 회의 녹취 → 결정·할일·내 액션을 5분 내 정리.",
  },
  {
    id: "dev-5",
    title: "AI 도움으로 SQL 1쿼리 최적화",
    description: "느린 쿼리 EXPLAIN 결과를 붙이고 인덱스·재작성 옵션 받기.",
  },
];

const ATTEMPTS_DESIGNER: JobAttempt[] = [
  {
    id: "des-1",
    title: "v0로 첫 화면 시안 1개 생성",
    description: "텍스트 1문장으로 시안을 받고 손으로 정리.",
  },
  {
    id: "des-2",
    title: "Midjourney로 무드 보드 만들기",
    description: "프로젝트 키워드 5개로 이미지 12장 컬렉션 생성.",
  },
  {
    id: "des-3",
    title: "AI에게 디자인 비평 받기",
    description: "스크린샷 보내고 Hick's law·대비·일관성 관점 피드백 요청.",
  },
  {
    id: "des-4",
    title: "Figma plugin으로 카피 변형 5개",
    description: "AI 카피 plugin으로 톤 차이 있는 5가지 안 받기.",
  },
  {
    id: "des-5",
    title: "AI로 a11y 문제 점검",
    description: "디자인 스크린샷에 대해 색대비·터치영역·라벨 누락 검토 요청.",
  },
];

const ATTEMPTS_MARKETER: JobAttempt[] = [
  {
    id: "mkt-1",
    title: "AI로 광고 카피 5개 변형",
    description: "타깃·후크·CTA 축으로 5가지 변형 받고 A/B 테스트 후보로.",
  },
  {
    id: "mkt-2",
    title: "Perplexity로 경쟁사 포지셔닝 정리",
    description: "경쟁사 5곳 페이지 → 슬로건·USP·약점 표로.",
  },
  {
    id: "mkt-3",
    title: "AI로 캠페인 KPI 후보 5개",
    description: "캠페인 목적 한 문장 → 측정 가능한 KPI 5개 받기.",
  },
  {
    id: "mkt-4",
    title: "고객 인터뷰 노트 → 인사이트 클러스터",
    description: "노트 5개 붙여넣고 반복 패턴·이상치 요약.",
  },
  {
    id: "mkt-5",
    title: "AI로 뉴스레터 1편 초안",
    description: "이번 주 주제 3개 → 뉴스레터 헤드라인·본문·CTA.",
  },
];

const ATTEMPTS_PM: JobAttempt[] = [
  {
    id: "pm-1",
    title: "AI로 PRD 초안 1편",
    description: "feature 한 줄 → 사용자·문제·성공기준·제외 4섹션 초안.",
  },
  {
    id: "pm-2",
    title: "스프린트 회고 자동 정리",
    description: "팀 코멘트 모두 붙이고 keep/problem/try 분류 받기.",
  },
  {
    id: "pm-3",
    title: "사용자 피드백 → 우선순위 매트릭스",
    description: "피드백 30개 → impact/effort 표로.",
  },
  {
    id: "pm-4",
    title: "AI로 이해관계자 메일 초안",
    description: "결정 사항 · 리스크 · 다음 단계 3섹션 한 줄 메일.",
  },
  {
    id: "pm-5",
    title: "릴리스 노트 자동화",
    description: "PR 제목·설명 묶음 → 사용자 친화적 릴리스 노트.",
  },
];

const ATTEMPTS_PLANNER: JobAttempt[] = [
  {
    id: "plan-1",
    title: "AI에게 사업기획 가설 비판 받기",
    description: "한 페이지 기획안 → 약점·반례·검증 질문 5개.",
  },
  {
    id: "plan-2",
    title: "AI로 SWOT 1차 작성",
    description: "도메인 키워드만 주고 SWOT 표 초안.",
  },
  {
    id: "plan-3",
    title: "경쟁 제품 분석 매트릭스",
    description: "경쟁사 5개 → 가격·핵심기능·고객층 표.",
  },
  {
    id: "plan-4",
    title: "AI로 KPI 트리 만들기",
    description: "비즈니스 목표 1개 → 하위 KPI 트리.",
  },
  {
    id: "plan-5",
    title: "AI로 1페이지 사업계획서",
    description: "지표·고객·솔루션·재무 4섹션 초안 생성.",
  },
];

const ATTEMPTS_OFFICE: JobAttempt[] = [
  {
    id: "off-1",
    title: "AI로 회의록 5분 정리",
    description: "메모 → 결정 사항·할일·다음 회의 안건.",
  },
  {
    id: "off-2",
    title: "이메일 톤 다듬기 자동화",
    description: "초안 한 통 → 격식·중립·친근 3가지 톤 변형.",
  },
  {
    id: "off-3",
    title: "엑셀 수식 AI에 물어보기",
    description: "원하는 결과 자연어로 → VLOOKUP/INDEX-MATCH 수식 받기.",
  },
  {
    id: "off-4",
    title: "회의 안건 자동 생성",
    description: "지난 회의 메모 + 이번 주 이슈 → 안건 5개.",
  },
  {
    id: "off-5",
    title: "AI로 자료 한 장 요약 카드",
    description: "보고서 → 1장 슬라이드용 핵심 카드 3개.",
  },
];

export const ATTEMPTS_BY_JOB: Record<JobKey, JobAttempt[]> = {
  developer: ATTEMPTS_DEVELOPER,
  designer: ATTEMPTS_DESIGNER,
  marketer: ATTEMPTS_MARKETER,
  pm: ATTEMPTS_PM,
  planner: ATTEMPTS_PLANNER,
  office: ATTEMPTS_OFFICE,
};

export const SYSTEM_TIPS: Record<GapCategory, string[]> = {
  large: [
    "AI를 이미 쓰고 있는 동료에게 '하루에 어떻게 쓰는지' 30분 인터뷰 잡기.",
    "이번 주 반복 작업 1개를 골라 AI로 대체할 수 있을지 5분만 시도.",
    "프롬프트 1개를 메모장에 저장하고 매일 한 번씩 쓰기.",
    "AI를 쓰는 사람의 워크플로 영상 1편을 끝까지 보기.",
  ],
  medium: [
    "기존 작업 흐름에 AI 단계를 1개만 끼워넣어 보기 (예: 1차 초안 → 본인 다듬기).",
    "이번 주 한 번이라도 'AI 없이 했지만 더 빨랐을 일' 1개 적어두기.",
    "AI 출력을 검수하는 자기만의 체크리스트 5줄 만들기.",
    "프롬프트를 짧게 → 길게 다시 써보고 결과 차이 비교.",
  ],
  small: [
    "AI를 쓰는 영역을 새로 1개 더 확장 (예: 코드 → 글쓰기, 글쓰기 → 데이터).",
    "본인의 잘 쓴 프롬프트 5개를 정리해 동료에게 공유.",
    "주 1회 'AI가 한 일 vs 내가 한 일' 비교 회고 5분.",
    "AI 결과를 곧이 쓰지 않고 의도적으로 비판해보는 시간 갖기.",
  ],
};

export function categorizeGap(gap: number): GapCategory {
  if (gap >= 30) return "large";
  if (gap >= 10) return "medium";
  return "small";
}
