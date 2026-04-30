function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function isoWeekYear(date: Date): { year: number; week: number } {
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const diff = (target.getTime() - firstThursday.getTime()) / 86400000;
  const week = 1 + Math.round((diff - 3 + ((firstThursday.getDay() + 6) % 7)) / 7);
  return { year: target.getFullYear(), week };
}

export function weekKey(date: Date = new Date()): string {
  const { year, week } = isoWeekYear(date);
  return `${year}-W${pad2(week)}`;
}

export function weekKeysBack(count: number, from: Date = new Date()): string[] {
  const start = startOfWeek(from);
  const keys: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() - 7 * i);
    keys.push(weekKey(d));
  }
  return keys;
}

export function weekLabel(offsetWeeks: number): string {
  if (offsetWeeks === 0) return "이번 주";
  if (offsetWeeks === 1) return "지난 주";
  return `${offsetWeeks}주 전`;
}
