"use client";

import * as React from "react";

import { AddTodoForm } from "@/components/add-todo-form";
import { KanbanColumn } from "@/components/kanban-column";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTodos } from "@/hooks/use-todos";
import { TODO_STATUSES } from "@/types/todo";

export function KanbanBoard() {
  const { todos, hydrated, addTodo, removeTodo, moveTodo } = useTodos();

  const handleDragStart = React.useCallback(() => {}, []);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kanban Todo</h1>
          <p className="text-sm text-muted-foreground">
            드래그해서 상태를 바꾸고, 브라우저에 자동으로 저장됩니다.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <AddTodoForm onAdd={addTodo} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TODO_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            todos={hydrated ? todos.filter((t) => t.status === status) : []}
            onDrop={moveTodo}
            onDragStart={handleDragStart}
            onRemove={removeTodo}
          />
        ))}
      </div>
    </main>
  );
}
