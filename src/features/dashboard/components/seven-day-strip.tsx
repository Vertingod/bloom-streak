import type { DayCompletion } from "@/lib/habit-stats";
import { cn } from "@/lib/utils";

const weekdayLabels = ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"];

export function SevenDayStrip({ days }: { days: DayCompletion[] }) {
  return (
    <div className="grid grid-cols-7 gap-1.5" aria-label={"\u6700\u8fd1 7 \u5929\u5b8c\u6210\u60c5\u51b5"}>
      {days.map((day) => {
        const weekday = weekdayLabels[new Date(`${day.date}T12:00:00Z`).getUTCDay()];

        return (
          <div key={day.date} className="flex flex-col items-center gap-1">
            <span className="text-[0.65rem] text-muted-foreground">{weekday}</span>
            <span
              title={`${day.date} ${day.completed ? "\u5df2\u5b8c\u6210" : "\u672a\u5b8c\u6210"}`}
              className={cn(
                "size-3 rounded-full border transition",
                day.completed
                  ? "border-primary bg-primary shadow-sm shadow-primary/30"
                  : "border-border bg-background/80",
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
