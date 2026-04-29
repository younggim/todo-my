"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddTodoFormProps = {
  onAdd: (title: string) => void;
};

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [value, setValue] = React.useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="새 할 일을 입력하세요"
        aria-label="새 할 일 제목"
      />
      <Button type="submit" disabled={!value.trim()}>
        <Plus />
        추가
      </Button>
    </form>
  );
}
