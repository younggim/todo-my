"use client";

import { useState } from "react";
import { TodoSection } from "@/components/todo-section";
import { TipsSection } from "@/components/tips-section";
import { UtilizationForm } from "@/components/utilization-form";
import { TODO_CADENCES, type Utilization } from "@/types/uplift";

export default function HomePage() {
  const [utilization, setUtilization] = useState<Utilization | null>(null);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <header>
          <h2 className="text-2xl font-bold">입력 & Tips</h2>
          <p className="text-sm text-muted-foreground">
            현재·목표 활용율과 1일/1주/1개월 Todo를 입력하세요.
          </p>
        </header>
        <div className="rounded-lg border border-border bg-background p-4">
          <UtilizationForm onChange={setUtilization} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TODO_CADENCES.map((cadence) => (
            <TodoSection key={cadence} cadence={cadence} />
          ))}
        </div>
      </section>

      <TipsSection utilization={utilization} />
    </div>
  );
}
