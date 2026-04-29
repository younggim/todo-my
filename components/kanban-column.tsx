"use client";

import * as React from "react";

import { TodoCard } from "@/components/todo-card";
import { cn } from "@/lib/utils";
import { TODO_STATUS_LABELS, type Todo, type TodoStatus } from "@/types/todo";

type KanbanColumnProps = {
  status: TodoStatus;
  todos: Todo[];
  onDrop: (id: string, status: TodoStatus) => void;
  onDragStart: (id: string) => void;
  onRemove: (id: string) => void;
};

export function KanbanColumn({ status, todos, onDrop, onDragStart, onRemove }: KanbanColumnProps) {
  const [over, setOver] = React.useState(false);

  return (
    <section
      aria-label={TODO_STATUS_LABELS[status]}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        if (!over) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setOver(false);
        const id = event.dataTransfer.getData("text/plain");
        if (id) onDrop(id, status);
      }}
      className={cn(
        "flex min-h-64 flex-col gap-3 rounded-xl bg-muted/40 p-3 ring-1 ring-foreground/5 transition-colors",
        over && "bg-accent/60 ring-ring/40",
      )}
    >
      <header className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium">{TODO_STATUS_LABELS[status]}</h2>
        <span className="text-xs text-muted-foreground">{todos.length}</span>
      </header>
      <div className="flex flex-col gap-2">
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onRemove={onRemove} onDragStart={onDragStart} />
        ))}
        {todos.length === 0 && (
          <p className="px-1 py-6 text-center text-xs text-muted-foreground">비어 있음</p>
        )}
      </div>
    </section>
  );
}
