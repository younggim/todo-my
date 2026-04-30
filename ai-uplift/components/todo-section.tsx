"use client";

import { useEffect, useState } from "react";
import {
  loadTodos,
  makeId,
  saveTodos,
} from "@/lib/uplift-storage";
import {
  TODO_CADENCE_LABELS,
  type TodoCadence,
  type UpliftTodo,
} from "@/types/uplift";

export function TodoSection({ cadence }: { cadence: TodoCadence }) {
  const [hydrated, setHydrated] = useState(false);
  const [todos, setTodos] = useState<UpliftTodo[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTodos(loadTodos());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveTodos(todos);
  }, [todos, hydrated]);

  const items = todos.filter((t) => t.cadence === cadence);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) {
      setError("내용을 입력하세요");
      return;
    }
    setError(null);
    const next: UpliftTodo = {
      id: makeId(),
      cadence,
      title: trimmed,
      done: false,
      createdAt: Date.now(),
    };
    setTodos([...todos, next]);
    setDraft("");
  }

  function toggle(id: string) {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  function remove(id: string) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  return (
    <section
      aria-label={TODO_CADENCE_LABELS[cadence]}
      className="rounded-lg border border-border bg-background p-4 space-y-3"
    >
      <h3 className="font-semibold">{TODO_CADENCE_LABELS[cadence]}</h3>
      <form onSubmit={handleAdd} className="flex gap-2" noValidate>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="할 일 입력"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
          aria-invalid={error ? true : undefined}
        />
        <button
          type="submit"
          className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90"
        >
          추가
        </button>
      </form>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">할 일이 없습니다</p>
      ) : (
        <ul className="space-y-2">
          {items.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 text-sm"
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggle(todo.id)}
                aria-label={`${todo.title} 완료`}
                className="h-4 w-4 cursor-pointer"
              />
              <span
                className={
                  todo.done
                    ? "flex-1 line-through text-muted-foreground"
                    : "flex-1"
                }
              >
                {todo.title}
              </span>
              <button
                type="button"
                onClick={() => remove(todo.id)}
                className="text-xs text-muted-foreground hover:text-destructive"
                aria-label={`${todo.title} 삭제`}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
