"use client";

import { useEffect, useState } from "react";
import { loadUtilization, saveUtilization } from "@/lib/uplift-storage";
import type { Utilization } from "@/types/uplift";

type FieldErrors = Partial<Record<"current" | "target", string>>;

function parseField(value: string): { ok: true; value: number } | { ok: false; error: string } {
  if (value.trim() === "") return { ok: false, error: "값을 입력하세요" };
  const n = Number(value);
  if (!Number.isInteger(n)) return { ok: false, error: "0과 100 사이 정수를 입력하세요" };
  if (n < 0 || n > 100) return { ok: false, error: "0과 100 사이 정수를 입력하세요" };
  return { ok: true, value: n };
}

export function UtilizationForm({
  onChange,
}: {
  onChange?: (value: Utilization | null) => void;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [util, setUtil] = useState<Utilization | null>(null);
  const [currentInput, setCurrentInput] = useState("");
  const [targetInput, setTargetInput] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const stored = loadUtilization();
    if (stored) {
      setUtil(stored);
      setCurrentInput(String(stored.current));
      setTargetInput(String(stored.target));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) onChange?.(util);
  }, [util, hydrated, onChange]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cur = parseField(currentInput);
    const tar = parseField(targetInput);
    const nextErrors: FieldErrors = {};
    if (!cur.ok) nextErrors.current = cur.error;
    if (!tar.ok) nextErrors.target = tar.error;
    setErrors(nextErrors);
    if (cur.ok && tar.ok) {
      const next = { current: cur.value, target: tar.value };
      saveUtilization(next);
      setUtil(next);
    }
  }

  const gap =
    util != null ? Math.max(0, util.target - util.current) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">현재 활용율 (%)</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            aria-invalid={errors.current ? true : undefined}
            aria-describedby={errors.current ? "current-error" : undefined}
          />
          {errors.current && (
            <span id="current-error" className="block mt-1 text-xs text-destructive">
              {errors.current}
            </span>
          )}
        </label>
        <label className="block">
          <span className="text-sm font-medium">목표 활용율 (%)</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            aria-invalid={errors.target ? true : undefined}
            aria-describedby={errors.target ? "target-error" : undefined}
          />
          {errors.target && (
            <span id="target-error" className="block mt-1 text-xs text-destructive">
              {errors.target}
            </span>
          )}
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          저장
        </button>
        {util && (
          <p className="text-sm text-muted-foreground">
            <span>현재 {util.current}%</span>
            {" · "}
            <span>목표 {util.target}%</span>
            {" · "}
            <span className="font-medium text-foreground">격차 {gap}%</span>
          </p>
        )}
      </div>
    </form>
  );
}
