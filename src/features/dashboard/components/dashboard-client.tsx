"use client";

import { useState } from "react";

import { useDashboardData } from "@/features/dashboard/use-dashboard-data";
import { CreateHabitSheet } from "./create-habit-sheet";
import { GardenOverview } from "./garden-overview";
import { HabitCard } from "./habit-card";
import { TodayHero } from "./today-hero";

export function DashboardClient() {
  const [createOpen, setCreateOpen] = useState(false);
  const { model, loading, createHabit, completeHabit } = useDashboardData();

  return (
    <main className="min-h-[100dvh] px-4 py-5 text-foreground sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <TodayHero model={model} onCreateHabit={() => setCreateOpen(true)} />

        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <GardenOverview habits={model.habits} />

          <section className="space-y-3">
            <div className="flex items-end justify-between gap-3 px-1">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{"\u4eca\u65e5\u4e60\u60ef"}</h2>
                <p className="text-sm text-muted-foreground">{"\u6253\u5361\u540e\u4f1a\u81ea\u52a8\u5199\u5165 LocalStorage\uff0c\u540c\u4e00\u5929\u4e0d\u4f1a\u91cd\u590d\u8bb0\u5f55\u3002"}</p>
              </div>
            </div>

            {loading ? (
              <div className="rounded-[1.75rem] border bg-card/75 p-6 text-muted-foreground shadow-sm">{"\u6b63\u5728\u6574\u7406\u4eca\u5929\u7684\u82b1\u56ed..."}</div>
            ) : model.habits.length === 0 ? (
              <div className="rounded-[1.75rem] border bg-card/75 p-6 shadow-sm">
                <p className="font-medium">{"\u8fd8\u6ca1\u6709\u4e60\u60ef"}</p>
                <p className="mt-1 text-sm text-muted-foreground">{"\u70b9\u51fb\u53f3\u4e0a\u65b9\u7684\u65b0\u5efa\u4e60\u60ef\uff0c\u5efa\u7acb\u4f60\u7684\u7b2c\u4e00\u4e2a\u8fde\u7eed\u3002"}</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {model.habits.map((habit) => (
                  <HabitCard key={habit.id} habit={habit} onComplete={(habitId) => void completeHabit(habitId)} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <CreateHabitSheet open={createOpen} onOpenChange={setCreateOpen} onCreate={createHabit} />
    </main>
  );
}
