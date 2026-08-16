import { Trophy } from "lucide-react";

import { getGardenAchievementBadges, type Achievement, type AchievementHabit } from "@/features/achievements/achievement-rules";
import { AchievementIllustration } from "@/features/achievements/components/achievement-illustration";
import { cn } from "@/lib/utils";

function AchievementGrid({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {achievements.map((achievement) => (
        <article
          key={achievement.id}
          className={cn(
            "flex items-center gap-3 rounded-2xl border p-3 transition",
            achievement.unlocked ? "border-primary/25 bg-primary/10" : "border-border bg-muted/35 opacity-75",
          )}
        >
          <AchievementIllustration illustration={achievement.illustration} title={achievement.label} className="size-14" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium leading-tight">{achievement.label}</h3>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[0.7rem] font-medium",
                  achievement.unlocked ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground",
                )}
              >
                {achievement.unlocked ? "已解锁" : "未解锁"}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{achievement.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function GardenAchievementPanel({ habits, perfectDayCount }: { habits: AchievementHabit[]; perfectDayCount: number }) {
  const achievements = getGardenAchievementBadges({ habits, perfectDayCount });
  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;

  return (
    <>
      <details
        data-mobile-achievement-summary
        className="group rounded-[1.75rem] border border-white/70 bg-card/82 shadow-sm backdrop-blur lg:hidden"
      >
        <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-3 rounded-[1.75rem] px-4 py-3 outline-none transition hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary/45 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Trophy className="size-4" />
              <span>{"花园成就"}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {unlockedCount} / {achievements.length} {"枚已解锁"}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <span className="group-open:hidden">{"展开全部成就"}</span>
            <span className="hidden group-open:inline">{"收起成就"}</span>
          </span>
        </summary>
        <div className="border-t border-border/70 px-4 py-4">
          <AchievementGrid achievements={achievements} />
        </div>
      </details>

      <section className="hidden rounded-[1.75rem] border border-white/70 bg-card/82 p-4 shadow-sm backdrop-blur lg:block">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Trophy className="size-4" />
              <span>{"花园成就"}</span>
            </div>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">{"你的长期回响"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {"已解锁"} {unlockedCount} / {achievements.length} {"枚，记录整个花园的成长。"}
            </p>
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {unlockedCount}/{achievements.length}
          </div>
        </div>

        <div className="mt-4">
          <AchievementGrid achievements={achievements} />
        </div>
      </section>
    </>
  );
}
