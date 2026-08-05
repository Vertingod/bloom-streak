import { Leaf } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DashboardHabit } from "@/features/dashboard/dashboard-model";
import { habitColors } from "@/features/habits/habit-config";
import { cn } from "@/lib/utils";

export function GardenOverview({ habits }: { habits: DashboardHabit[] }) {
  const completed = habits.filter((habit) => habit.completedToday).length;
  const colorById = new Map(habitColors.map((color) => [color.id, color]));

  return (
    <Card className="border-white/70 bg-card/80 shadow-xl shadow-emerald-900/5 backdrop-blur">
      <CardContent className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{"\u4eca\u65e5\u82b1\u56ed"}</h2>
            <p className="text-sm text-muted-foreground">{completed} / {habits.length} {"\u682a\u5df2\u6d47\u704c"}</p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Leaf className="size-5" />
          </div>
        </div>

        <div className="relative min-h-64 overflow-hidden rounded-[2rem] border bg-gradient-to-br from-emerald-50 via-amber-50 to-lime-50 p-4">
          <div className="absolute -right-12 -top-12 size-40 rounded-full bg-amber-200/45 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 size-44 rounded-full bg-emerald-200/60 blur-3xl" />

          {habits.length === 0 ? (
            <div className="relative flex min-h-52 flex-col items-center justify-center text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white/80 text-primary shadow-sm">
                <Leaf className="size-8" />
              </div>
              <p className="font-medium">{"\u82b1\u56ed\u8fd8\u5728\u7b49\u5f85\u7b2c\u4e00\u9897\u5c0f\u82bd"}</p>
              <p className="mt-1 text-sm text-muted-foreground">{"\u70b9\u51fb\u65b0\u5efa\u4e60\u60ef\uff0c\u5f00\u59cb\u4eca\u5929\u7684\u6d47\u704c\u3002"}</p>
            </div>
          ) : (
            <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3">
              {habits.map((habit) => {
                const color = colorById.get(habit.color);

                return (
                  <div key={habit.id} className="rounded-[1.5rem] border border-white/70 bg-white/65 p-3 text-center shadow-sm backdrop-blur">
                    <div className={cn("mx-auto flex size-16 items-end justify-center rounded-full border", color?.className)}>
                      <div
                        className={cn(
                          "mb-3 rounded-full bg-primary/80 transition-all",
                          habit.completedToday ? "h-10 w-7 shadow-lg shadow-primary/25" : "h-5 w-5 opacity-70",
                        )}
                      />
                    </div>
                    <p className="mt-3 truncate text-sm font-medium">{habit.name}</p>
                    <p className="text-xs text-muted-foreground">{habit.currentStreak} {"\u5929"}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
