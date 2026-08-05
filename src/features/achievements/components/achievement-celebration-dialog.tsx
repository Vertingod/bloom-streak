import { Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AchievementCelebration } from "@/features/achievements/achievement-notifications";
import { AchievementIllustration } from "@/features/achievements/components/achievement-illustration";

type AchievementCelebrationDialogProps = {
  celebration: AchievementCelebration | null;
  newCount: number;
  onClose: () => void;
};

export function AchievementCelebrationDialog({ celebration, newCount, onClose }: AchievementCelebrationDialogProps) {
  if (!celebration) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/20 px-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-label="\u89e3\u9501\u65b0\u6210\u5c31"
        className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/80 bg-card p-5 text-center shadow-2xl shadow-primary/20"
      >
        <Button type="button" variant="ghost" size="icon-sm" className="absolute right-3 top-3" aria-label="\u5173\u95ed\u6210\u5c31\u5f39\u7a97" onClick={onClose}>
          <X className="size-4" />
        </Button>
        <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-primary/10">
          <AchievementIllustration illustration={celebration.achievement.illustration} title={celebration.title} className="size-24" />
        </div>
        <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" />
          {"\u89e3\u9501\u65b0\u6210\u5c31"}
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">{celebration.title}</h2>
        <p className="mt-1 text-sm font-medium text-primary">{celebration.subtitle}</p>
        <p className="mt-2 text-sm text-muted-foreground">{celebration.achievement.description}</p>
        {newCount > 1 && (
          <p className="mt-3 rounded-2xl bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
            {"\u672c\u6b21\u65b0\u589e"} {newCount} {"\u679a\uff0c\u5176\u4ed6\u6210\u5c31\u5df2\u6536\u85cf\u5230\u82b1\u56ed\u6210\u5c31\u91cc\u3002"}
          </p>
        )}
        <Button type="button" className="mt-5 h-11 w-full rounded-full" onClick={onClose}>
          {"\u6536\u4e0b\u8fd9\u679a\u5fbd\u7ae0"}
        </Button>
      </section>
    </div>
  );
}
