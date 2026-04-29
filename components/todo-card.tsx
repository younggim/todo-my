"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Todo } from "@/types/todo";

type TodoCardProps = {
  todo: Todo;
  onRemove: (id: string) => void;
  onDragStart: (id: string) => void;
};

export function TodoCard({ todo, onRemove, onDragStart }: TodoCardProps) {
  return (
    <Card
      size="sm"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", todo.id);
        onDragStart(todo.id);
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      <CardContent className="flex items-start justify-between gap-2">
        <p className="flex-1 break-words text-sm leading-snug">{todo.title}</p>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Delete ${todo.title}`}
          onClick={() => onRemove(todo.id)}
        >
          <Trash2 />
        </Button>
      </CardContent>
    </Card>
  );
}
