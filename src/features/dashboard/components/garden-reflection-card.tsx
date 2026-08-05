import { Leaf, Quote, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DashboardModel } from "@/features/dashboard/dashboard-model";
import { buildGardenReflection, type GardenReflectionTone } from "@/features/dashboard/garden-reflection";
import { cn } from "@/lib/utils";

const toneClassNames: Record<GardenReflectionTone, string> = {
  empty: "from-card/95 via-secondary/35 to-muted/55",
  quiet: "from-card/95 via-sky-50/70 to-secondary/35",
  growing: "from-card/95 via-emerald-50/75 to-primary/12",
  complete: "from-card/95 via-amber-50/80 to-primary/18",
};

export function GardenReflectionCard({ model }: { model: DashboardModel }) {
  const reflection = buildGardenReflection(model);

  return (
    <Card
      data-garden-reflection-card
      className={cn("overflow-hidden border-white/70 bg-gradient-to-br shadow-sm backdrop-blur", toneClassNames[reflection.tone])}
    >
      <CardContent className="relative p-5">
        <div className="absolute -right-8 -top-10 size-28 rounded-full bg-accent/40 blur-2xl" />
        <div className="absolute -bottom-12 -left-8 size-32 rounded-full bg-primary/15 blur-2xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              <Quote className="size-3.5" />
              {"\u4eca\u65e5\u56de\u54cd"}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">{reflection.title}</h2>
          </div>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background/80 text-primary shadow-sm">
            {reflection.tone === "complete" ? <Sparkles className="size-5" /> : <Leaf className="size-5" />}
          </div>
        </div>

        <p className="relative mt-3 text-sm leading-7 text-muted-foreground">{reflection.body}</p>

        <div className="relative mt-4 grid gap-2 sm:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-[1.25rem] border border-white/65 bg-background/65 p-3 shadow-sm">
            <p className="text-xs text-muted-foreground">{"\u4eca\u65e5\u8fdb\u5ea6"}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-primary">{reflection.primaryMetric}</p>
          </div>
          <div className="rounded-[1.25rem] border border-white/65 bg-background/65 p-3 shadow-sm">
            <p className="text-xs text-muted-foreground">{reflection.secondaryMetric}</p>
            <p className="mt-1 text-sm font-medium leading-6 text-foreground">{reflection.nextAction}</p>
          </div>
        </div>

        {reflection.highlightHabitName && (
          <p className="relative mt-3 inline-flex max-w-full items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="size-3.5 shrink-0" />
            <span className="truncate">{reflection.highlightHabitName}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
