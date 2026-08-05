import { CalendarDays, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { DashboardModel } from "@/features/dashboard/dashboard-model";

export function TodayHero({ model, onCreateHabit }: { model: DashboardModel; onCreateHabit: () => void }) {
  const hasHabits = model.progress.total > 0;

  return (
    <section className="relative overflow-hidden rounded-[2.2rem] border border-white/70 bg-card/85 p-5 shadow-2xl shadow-emerald-900/10 backdrop-blur md:p-7">
      <div className="absolute -right-16 -top-20 size-52 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="absolute -bottom-20 -left-16 size-56 rounded-full bg-emerald-200/55 blur-3xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/65 px-3 py-1 text-sm text-muted-foreground">
            <CalendarDays className="size-4 text-primary" />
            {model.todayDateKey || "--"}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">BloomStreak Garden</p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-balance md:text-5xl">
              {hasHabits ? "\u4eca\u5929\u7684\u82b1\u56ed\uff0c\u6b63\u5728\u88ab\u4f60\u70b9\u4eae\u3002" : "\u5148\u79cd\u4e0b\u7b2c\u4e00\u4e2a\u5c0f\u4e60\u60ef\u3002"}
            </h1>
            <p className="max-w-xl leading-7 text-muted-foreground">
              {hasHabits
                ? `\u5df2\u6d47\u704c ${model.progress.completed} / ${model.progress.total} \u4e2a\u4e60\u60ef\uff0c\u5b8c\u6210\u5ea6 ${model.progress.percentage}%\u3002`
                : "\u4ece\u4e00\u4e2a\u53ef\u5b8c\u6210\u7684\u5c0f\u52a8\u4f5c\u5f00\u59cb\uff0c\u8ba9\u8fde\u7eed\u5e26\u6765\u53ef\u89c1\u7684\u751f\u957f\u611f\u3002"}
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-[1.7rem] border bg-background/70 p-4 shadow-sm md:min-w-72">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{"\u4eca\u65e5\u8fdb\u5ea6"}</span>
            <span className="font-semibold">{model.progress.percentage}%</span>
          </div>
          <Progress value={model.progress.percentage} className="h-3" />
          <Button className="h-11 w-full rounded-full" onClick={onCreateHabit}>
            <Plus className="size-4" />
            {"\u65b0\u5efa\u4e60\u60ef"}
          </Button>
        </div>
      </div>
    </section>
  );
}
