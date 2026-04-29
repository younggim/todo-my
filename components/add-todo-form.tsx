"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddTodoFormProps = {
  onAdd: (title: string, dueDate?: string) => void;
};

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    onAdd(title, dueDate || undefined);
    setTitle("");
    setDueDate("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:flex-row">
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="새 할 일을 입력하세요"
        aria-label="새 할 일 제목"
        className="flex-1"
      />
      <Input
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        aria-label="마감일 (선택)"
        className="sm:w-44"
      />
      <Button type="submit" disabled={!title.trim()}>
        <Plus />
        추가
      </Button>
    </form>
  );
}
