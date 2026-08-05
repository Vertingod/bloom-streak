import { Trophy } from "lucide-react";

import { getGardenAchievementBadges, type AchievementHabit } from "@/features/achievements/achievement-rules";
import { AchievementIllustration } from "@/features/achievements/components/achievement-illustration";
import { cn } from "@/lib/utils";

type GardenAchievementPanelProps = {
  habits: AchievementHabit[];
  perfectDayCount: number;
};

export function GardenAchievementPanel({ habits, perfectDayCount }: GardenAchievementPanelProps) {
  const achievements = getGardenAchievementBadges({ habits, perfectDayCount });
  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;

  return (
    <section className="rounded-[1.75rem] border border-white/70 bg-card/82 p-4 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Trophy className="size-4" />
            <span>{"\u82b1\u56ed\u6210\u5c31"}</span>
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{"\u4f60\u7684\u957f\u671f\u56de\u54cd"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {"\u5df2\u89e3\u9501"} {unlockedCount} / {achievements.length} {"\u679a\uff0c\u8bb0\u5f55\u6574\u4e2a\u82b1\u56ed\u7684\u6210\u957f\u3002"}
          </p>
        </div>
        <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {unlockedCount}/{achievements.length}
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
                <span className={cn("rounded-full px-2 py-0.5 text-[0.7rem] font-medium", achievement.unlocked ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground")}>
                  {achievement.unlocked ? "\u5df2\u89e3\u9501" : "\u672a\u89e3\u9501"}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{achievement.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
