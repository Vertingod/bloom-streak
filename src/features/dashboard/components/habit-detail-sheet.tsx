import { CalendarDays, CheckCircle2, LockKeyhole, Trophy, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AchievementIllustration } from "@/features/achievements/components/achievement-illustration";
import type { DashboardHabit } from "@/features/dashboard/dashboard-model";
import { buildHabitDetailSummary } from "@/features/dashboard/habit-detail-model";
import { habitCategories, habitColors } from "@/features/habits/habit-config";
import { cn } from "@/lib/utils";

type HabitDetailSheetProps = {
  open: boolean;
  habit: DashboardHabit | null;
  habits: DashboardHabit[];
  todayAllDone: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HabitDetailSheet({
  open,
  habit,
  habits,
  todayAllDone,
  onOpenChange,
}: HabitDetailSheetProps) {
  if (!open || !habit) {
    return null;
  }

  const summary = buildHabitDetailSummary({ habit, habits, todayAllDone });
  const category = habitCategories.find((item) => item.id === habit.category);
  const color = habitColors.find((item) => item.id === habit.color);
  const achievements = [...summary.unlockedAchievements, ...summary.lockedAchievements];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/18 px-3 pb-3 pt-10 backdrop-blur-sm sm:items-center sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`${habit.name} \u8be6\u60c5`}
        className="max-h-[92dvh] w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/75 bg-card/95 shadow-2xl shadow-primary/10 backdrop-blur"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border/60 p-5 sm:p-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Habit detail</p>
            <h2 className="mt-1 truncate text-2xl font-semibold tracking-tight">{habit.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {category?.label ?? "\u4e60\u60ef"} {"\u00b7"} {habit.frequency === "daily" ? "\u6bcf\u5929" : "\u5de5\u4f5c\u65e5"} {"\u00b7"} {habit.completedToday ? "\u4eca\u5929\u5df2\u6d47\u704c" : "\u4eca\u5929\u5f85\u6d47\u704c"}
            </p>
          </div>
          <Button type="button" variant="ghost" size="icon-sm" aria-label={"\u5173\u95ed\u8be6\u60c5"} onClick={() => onOpenChange(false)}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="max-h-[calc(92dvh-6rem)] overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label={"\u5f53\u524d\u8fde\u7eed"} value={`${habit.currentStreak} \u5929`} />
            <MetricCard label={"\u6700\u957f\u8fde\u7eed"} value={`${habit.longestStreak} \u5929`} />
            <MetricCard label={"\u7d2f\u8ba1\u6253\u5361"} value={`${habit.totalCheckins} \u6b21`} />
          </div>

          <section className="mt-5 rounded-[1.75rem] border bg-background/70 p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CalendarDays className="size-4 text-primary" />
                  <span>{"30 \u5929\u5b8c\u6210\u7387"}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {"\u6700\u8fd1"} {summary.last30Total} {"\u5929\u5b8c\u6210"} {summary.last30Completed} {"\u5929\uff0c\u7528\u5c0f\u683c\u5b50\u770b\u89c1\u8282\u594f\u3002"}
                </p>
              </div>
              <div className="text-4xl font-semibold tracking-tight text-primary">{summary.last30Percentage}%</div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${summary.last30Percentage}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-10 gap-1.5 sm:grid-cols-15">
              {habit.last30Days.map((day) => (
                <span
                  key={day.date}
                  data-history-cell={day.date}
                  title={`${formatDayLabel(day.date)} ${day.completed ? "\u5df2\u5b8c\u6210" : "\u672a\u5b8c\u6210"}`}
                  aria-label={`${formatDayLabel(day.date)} ${day.completed ? "\u5df2\u5b8c\u6210" : "\u672a\u5b8c\u6210"}`}
                  className={cn(
                    "aspect-square rounded-[0.65rem] border transition",
                    day.completed
                      ? cn("border-primary/30 bg-primary shadow-sm shadow-primary/20", color?.glowClassName)
                      : "border-border/75 bg-muted/55",
                  )}
                />
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-[1.75rem] border bg-background/70 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Trophy className="size-4 text-primary" />
              <span>{"\u6210\u5c31\u5fbd\u7ae0"}</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {achievements.map((achievement) => (
                <article
                  key={achievement.id}
                  className={cn(
                    "rounded-2xl border p-3",
                    achievement.unlocked
                      ? "border-primary/25 bg-primary/10"
                      : "border-border bg-muted/35 text-muted-foreground",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <AchievementIllustration
                      illustration={achievement.illustration}
                      title={achievement.label}
                      className="size-12"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-medium text-foreground">{achievement.label}</h3>
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", achievement.unlocked ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground")}>
                          {achievement.unlocked ? <CheckCircle2 className="size-3" /> : <LockKeyhole className="size-3" />}
                          {achievement.unlocked ? "\u5df2\u89e3\u9501" : "\u672a\u89e3\u9501"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{achievement.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border bg-background/70 p-4 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function formatDayLabel(dateKey: string) {
  return dateKey.slice(5).replace("-", "/");
}
