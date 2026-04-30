"use client";

import { useEffect, useState } from "react";
import {
  loadCustomTips,
  makeId,
  saveCustomTips,
} from "@/lib/uplift-storage";
import { categorizeGap, SYSTEM_TIPS } from "@/lib/seeds";
import {
  GAP_CATEGORY_LABELS,
  type CustomTip,
  type Utilization,
} from "@/types/uplift";

export function TipsSection({ utilization }: { utilization: Utilization | null }) {
  const [hydrated, setHydrated] = useState(false);
  const [tips, setTips] = useState<CustomTip[]>([]);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    setTips(loadCustomTips());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveCustomTips(tips);
  }, [tips, hydrated]);

  const gap =
    utilization != null
      ? Math.max(0, utilization.target - utilization.current)
      : null;
  const category = gap != null ? categorizeGap(gap) : null;
  const systemTips = category ? SYSTEM_TIPS[category] : [];

  function addTip(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    setTips([...tips, { id: makeId(), text: trimmed, createdAt: Date.now() }]);
    setDraft("");
  }

  function startEdit(id: string, text: string) {
    setEditingId(id);
    setEditingText(text);
  }

  function saveEdit() {
    if (editingId == null) return;
    const trimmed = editingText.trim();
    if (!trimmed) return;
    setTips(tips.map((t) => (t.id === editingId ? { ...t, text: trimmed } : t)));
    setEditingId(null);
    setEditingText("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingText("");
  }

  function removeTip(id: string) {
    setTips(tips.filter((t) => t.id !== id));
  }

  return (
    <section className="rounded-lg border border-border bg-background p-4 space-y-5">
      <div className="space-y-3">
        <h3 className="font-semibold">추천 Tips</h3>
        {category == null ? (
          <p className="text-sm text-muted-foreground">
            활용율을 먼저 입력하면 추천 Tips가 보입니다
          </p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              {GAP_CATEGORY_LABELS[category]} 카테고리
            </p>
            <ul className="space-y-1.5 text-sm">
              {systemTips.map((tip, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <hr className="border-border" />

      <div className="space-y-3">
        <h3 className="font-semibold">내 Tips</h3>
        <form onSubmit={addTip} className="flex gap-2" noValidate>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="나만의 활용 팁"
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90"
          >
            추가
          </button>
        </form>
        {tips.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            아직 등록된 내 Tips가 없습니다
          </p>
        ) : (
          <ul className="space-y-2">
            {tips.map((tip) => (
              <li key={tip.id} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground mt-0.5">•</span>
                {editingId === tip.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={saveEdit}
                      className="text-xs px-2 py-1 rounded-md bg-primary text-primary-foreground"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-xs px-2 py-1 rounded-md border border-border"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1">{tip.text}</span>
                    <button
                      type="button"
                      onClick={() => startEdit(tip.id, tip.text)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      편집
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTip(tip.id)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      삭제
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
