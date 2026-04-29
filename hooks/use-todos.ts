"use client";

import * as React from "react";

import { loadTodos, saveTodos } from "@/lib/todo-storage";
import type { Todo, TodoStatus } from "@/types/todo";

type UseTodosReturn = {
  todos: Todo[];
  hydrated: boolean;
  addTodo: (title: string, dueDate?: string) => void;
  removeTodo: (id: string) => void;
  moveTodo: (id: string, status: TodoStatus) => void;
};

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setTodos(loadTodos());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (hydrated) saveTodos(todos);
  }, [todos, hydrated]);

  const addTodo = React.useCallback((title: string, dueDate?: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: trimmed,
        status: "todo",
        createdAt: Date.now(),
        ...(dueDate ? { dueDate } : {}),
      },
    ]);
  }, []);

  const removeTodo = React.useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const moveTodo = React.useCallback((id: string, status: TodoStatus) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  return { todos, hydrated, addTodo, removeTodo, moveTodo };
}
