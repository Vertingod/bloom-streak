import { BookOpen, Check, Droplet, Dumbbell, Heart, Leaf, Moon, PenLine, Settings2, Sparkles } from "lucide-react";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardHabit } from "@/features/dashboard/dashboard-model";
import { habitCategories, habitColors } from "@/features/habits/habit-config";
import type { HabitIcon } from "@/features/habits/types";
import { cn } from "@/lib/utils";
import { SevenDayStrip } from "./seven-day-strip";
import { StreakBadge } from "./streak-badge";

const iconMap: Record<HabitIcon, ComponentType<{ className?: string }>> = {
  leaf: Leaf,
  droplet: Droplet,
  "book-open": BookOpen,
  dumbbell: Dumbbell,
  sparkles: Sparkles,
  moon: Moon,
  "pen-line": PenLine,
  heart: Heart,
};

export function HabitCard({
  habit,
  onComplete,
  onEdit,
}: {
  habit: DashboardHabit;
  onComplete: (habitId: string) => void;
  onEdit: (habit: DashboardHabit) => void;
}) {
  const Icon = iconMap[habit.icon];
  const color = habitColors.find((item) => item.id === habit.color);
  const category = habitCategories.find((item) => item.id === habit.category);

  return (
    <Card className={cn("border-white/70 bg-card/82 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg", habit.completedToday && "ring-2 ring-primary/15")}>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm", color?.className)}>
              <Icon className="size-5" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold">{habit.name}</h3>
              <p className="text-sm text-muted-foreground">{category?.label ?? "\u4e60\u60ef"} · {habit.frequency === "daily" ? "\u6bcf\u5929" : "\u5de5\u4f5c\u65e5"}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StreakBadge streak={habit.currentStreak} />
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => onEdit(habit)} aria-label={"\u7f16\u8f91\u4e60\u60ef"}>
              <Settings2 className="size-4" />
            </Button>
          </div>
        </div>

        <SevenDayStrip days={habit.last7Days} />

        <div className="flex items-center justify-between gap-3 rounded-[1.25rem] bg-muted/55 p-3">
          <div>
            <p className="text-sm font-medium">{habit.completedToday ? "\u4eca\u5929\u5df2\u6d47\u704c" : "\u4eca\u5929\u8fd8\u672a\u6d47\u704c"}</p>
            <p className="text-xs text-muted-foreground">{"\u7d2f\u8ba1"} {habit.totalCheckins} {"\u6b21"} · {"\u6700\u957f"} {habit.longestStreak} {"\u5929"}</p>
          </div>
          <Button
            size="sm"
            className="rounded-full"
            variant={habit.completedToday ? "secondary" : "default"}
            disabled={habit.completedToday}
            onClick={() => onComplete(habit.id)}
          >
            <Check className="size-4" />
            {habit.completedToday ? "\u5df2\u5b8c\u6210" : "\u6253\u5361"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
