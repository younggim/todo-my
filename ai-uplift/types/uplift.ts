export type TodoCadence = "daily" | "weekly" | "monthly";

export const TODO_CADENCES: TodoCadence[] = ["daily", "weekly", "monthly"];

export const TODO_CADENCE_LABELS: Record<TodoCadence, string> = {
  daily: "1일 Todo",
  weekly: "1주 Todo",
  monthly: "1개월 Todo",
};

export type UpliftTodo = {
  id: string;
  cadence: TodoCadence;
  title: string;
  done: boolean;
  createdAt: number;
};

export type CustomTip = {
  id: string;
  text: string;
  createdAt: number;
};

export type UpliftCase = {
  id: string;
  title: string;
  description: string;
  url: string;
};

export const JOB_KEYS = [
  "developer",
  "designer",
  "marketer",
  "pm",
  "planner",
  "office",
] as const;

export type JobKey = (typeof JOB_KEYS)[number];

export const JOB_LABELS: Record<JobKey, string> = {
  developer: "개발자",
  designer: "디자이너",
  marketer: "마케터",
  pm: "PM",
  planner: "기획자",
  office: "일반사무직",
};

export type JobAttempt = {
  id: string;
  title: string;
  description: string;
};

export type WeekAttempt = {
  id: string;
  weekKey: string;
  text: string;
  createdAt: number;
};

export type RecommendationHistory = {
  weekKey: string;
  job: JobKey;
  attemptId: string;
};

export type GapCategory = "large" | "medium" | "small";

export const GAP_CATEGORY_LABELS: Record<GapCategory, string> = {
  large: "격차 큼",
  medium: "격차 중간",
  small: "격차 작음",
};

export type Utilization = {
  current: number;
  target: number;
};

export const MAX_WEEKLY_ATTEMPTS = 5;
export const RETRO_WEEKS = 4;
