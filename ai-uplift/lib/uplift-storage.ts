import {
  JOB_KEYS,
  TODO_CADENCES,
  type CustomTip,
  type JobKey,
  type RecommendationHistory,
  type TodoCadence,
  type UpliftTodo,
  type Utilization,
  type WeekAttempt,
} from "@/types/uplift";

const KEY_UTILIZATION = "ai-uplift:utilization:v1";
const KEY_TODOS = "ai-uplift:todos:v1";
const KEY_CUSTOM_TIPS = "ai-uplift:customTips:v1";
const KEY_CASE_CHECKS = "ai-uplift:caseChecks:v1";
const KEY_JOB = "ai-uplift:job:v1";
const KEY_WEEK_ATTEMPTS = "ai-uplift:weekAttempts:v1";
const KEY_REC_HISTORY = "ai-uplift:recHistory:v1";

function safeRead<T>(key: string, validator: (value: unknown) => T | null): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return validator(parsed);
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private mode errors
  }
}

function isInt0to100(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 100;
}

export function loadUtilization(): Utilization | null {
  return safeRead<Utilization>(KEY_UTILIZATION, (v) => {
    if (!v || typeof v !== "object") return null;
    const obj = v as Record<string, unknown>;
    if (!isInt0to100(obj.current) || !isInt0to100(obj.target)) return null;
    return { current: obj.current, target: obj.target };
  });
}

export function saveUtilization(value: Utilization): void {
  safeWrite(KEY_UTILIZATION, value);
}

function isCadence(value: unknown): value is TodoCadence {
  return typeof value === "string" && (TODO_CADENCES as string[]).includes(value);
}

function isTodo(value: unknown): value is UpliftTodo {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.title === "string" &&
    typeof v.done === "boolean" &&
    typeof v.createdAt === "number" &&
    isCadence(v.cadence)
  );
}

export function loadTodos(): UpliftTodo[] {
  return (
    safeRead<UpliftTodo[]>(KEY_TODOS, (v) => {
      if (!Array.isArray(v)) return null;
      return v.filter(isTodo);
    }) ?? []
  );
}

export function saveTodos(todos: UpliftTodo[]): void {
  safeWrite(KEY_TODOS, todos);
}

function isCustomTip(value: unknown): value is CustomTip {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.text === "string" &&
    typeof v.createdAt === "number"
  );
}

export function loadCustomTips(): CustomTip[] {
  return (
    safeRead<CustomTip[]>(KEY_CUSTOM_TIPS, (v) => {
      if (!Array.isArray(v)) return null;
      return v.filter(isCustomTip);
    }) ?? []
  );
}

export function saveCustomTips(tips: CustomTip[]): void {
  safeWrite(KEY_CUSTOM_TIPS, tips);
}

export function loadCaseChecks(): Record<string, boolean> {
  return (
    safeRead<Record<string, boolean>>(KEY_CASE_CHECKS, (v) => {
      if (!v || typeof v !== "object" || Array.isArray(v)) return null;
      const out: Record<string, boolean> = {};
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        if (typeof val === "boolean") out[k] = val;
      }
      return out;
    }) ?? {}
  );
}

export function saveCaseChecks(checks: Record<string, boolean>): void {
  safeWrite(KEY_CASE_CHECKS, checks);
}

function isJobKey(value: unknown): value is JobKey {
  return typeof value === "string" && (JOB_KEYS as readonly string[]).includes(value);
}

export function loadJob(): JobKey | null {
  return safeRead<JobKey>(KEY_JOB, (v) => (isJobKey(v) ? v : null));
}

export function saveJob(job: JobKey): void {
  safeWrite(KEY_JOB, job);
}

function isWeekAttempt(value: unknown): value is WeekAttempt {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.weekKey === "string" &&
    typeof v.text === "string" &&
    typeof v.createdAt === "number"
  );
}

export function loadWeekAttempts(): WeekAttempt[] {
  return (
    safeRead<WeekAttempt[]>(KEY_WEEK_ATTEMPTS, (v) => {
      if (!Array.isArray(v)) return null;
      return v.filter(isWeekAttempt);
    }) ?? []
  );
}

export function saveWeekAttempts(attempts: WeekAttempt[]): void {
  safeWrite(KEY_WEEK_ATTEMPTS, attempts);
}

function isRecHistory(value: unknown): value is RecommendationHistory {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.weekKey === "string" &&
    isJobKey(v.job) &&
    typeof v.attemptId === "string"
  );
}

export function loadRecHistory(): RecommendationHistory[] {
  return (
    safeRead<RecommendationHistory[]>(KEY_REC_HISTORY, (v) => {
      if (!Array.isArray(v)) return null;
      return v.filter(isRecHistory);
    }) ?? []
  );
}

export function saveRecHistory(history: RecommendationHistory[]): void {
  safeWrite(KEY_REC_HISTORY, history);
}

export function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
