import type { DashboardHabit, DashboardModel } from "@/features/dashboard/dashboard-model";

export type GardenReflectionTone = "empty" | "quiet" | "growing" | "complete";

export type GardenReflection = {
  tone: GardenReflectionTone;
  title: string;
  body: string;
  nextAction: string;
  primaryMetric: string;
  secondaryMetric: string;
  highlightHabitName: string | null;
};

function pluralPlant(count: number) {
  return `${count} \u682a`;
}

function findStrongestHabit(habits: DashboardHabit[]) {
  return [...habits].sort(
    (a, b) => b.currentStreak - a.currentStreak || b.totalCheckins - a.totalCheckins || a.displayOrder - b.displayOrder,
  )[0] ?? null;
}

export function buildGardenReflection(model: DashboardModel): GardenReflection {
  const total = model.progress.total;
  const completed = model.progress.completed;
  const remaining = Math.max(total - completed, 0);
  const strongestHabit = findStrongestHabit(model.allHabits.filter((habit) => !habit.archived));
  const bestStreak = strongestHabit?.currentStreak ?? 0;
  const totalCheckins = model.allHabits.reduce((sum, habit) => sum + habit.totalCheckins, 0);

  if (model.allHabits.filter((habit) => !habit.archived).length === 0) {
    return {
      tone: "empty",
      title: "\u82b1\u56ed\u8fd8\u5728\u7b49\u7b2c\u4e00\u9897\u5c0f\u82bd",
      body: "\u5148\u79cd\u4e0b\u4e00\u4e2a\u4eca\u5929\u80fd\u5b8c\u6210\u7684\u5c0f\u52a8\u4f5c\uff0c\u8ba9\u81ea\u5f8b\u4ece\u4e00\u6b21\u8f7b\u677e\u7684\u6d47\u704c\u5f00\u59cb\u3002",
      nextAction: "\u70b9\u51fb\u65b0\u5efa\u4e60\u60ef\uff0c\u4e0d\u9700\u8981\u4e00\u5f00\u59cb\u5c31\u5f88\u5b8c\u7f8e\u3002",
      primaryMetric: "0 \u4e2a\u4e60\u60ef",
      secondaryMetric: "\u4eca\u5929\u5148\u79cd\u4e0b 1 \u9897",
      highlightHabitName: null,
    };
  }

  if (total > 0 && model.progress.allDone) {
    return {
      tone: "complete",
      title: "\u4eca\u5929\u5168\u90e8\u76db\u5f00",
      body: `\u4f60\u5df2\u7ecf\u5b8c\u6210\u4eca\u5929\u7684 ${pluralPlant(total)}\u5c0f\u4e60\u60ef\uff0c\u8fd9\u662f\u82b1\u56ed\u7684\u7b2c ${Math.max(model.perfectDayCount, 1)} \u6b21\u5168\u76db\u5f00\u3002`,
      nextAction: bestStreak >= 21 ? "21 \u5929\u91cc\u7a0b\u7891\u5df2\u7ecf\u5f00\u82b1\uff0c\u660e\u5929\u53ea\u8981\u7ee7\u7eed\u8f7b\u8f7b\u6d47\u704c\u3002" : "\u628a\u8fd9\u4e2a\u8282\u594f\u6536\u8d77\u6765\uff0c\u660e\u5929\u518d\u7ed9\u5b83\u4e00\u70b9\u5149\u3002",
      primaryMetric: `${completed} / ${total}`,
      secondaryMetric: bestStreak > 0 ? `\u6700\u957f\u8fde\u7eed ${bestStreak} \u5929` : `\u7d2f\u8ba1 ${totalCheckins} \u6b21\u6d47\u704c`,
      highlightHabitName: strongestHabit?.name ?? null,
    };
  }

  if (completed === 0) {
    return {
      tone: "quiet",
      title: "\u82b1\u56ed\u4eca\u5929\u8fd8\u5f88\u5b89\u9759",
      body: bestStreak > 0
        ? `${strongestHabit?.name ?? "\u6709\u4e00\u4e2a\u4e60\u60ef"}\u5df2\u7ecf\u79ef\u7d2f ${bestStreak} \u5929\uff0c\u4eca\u5929\u53ea\u8981\u5148\u5b8c\u6210\u4e00\u4ef6\u5c0f\u4e8b\u5c31\u80fd\u628a\u8282\u594f\u627e\u56de\u6765\u3002`
        : "\u4e0d\u7528\u6025\u7740\u4e00\u6b21\u505a\u5b8c\uff0c\u5148\u9009\u4e00\u682a\u6700\u5bb9\u6613\u6d47\u704c\u7684\u4e60\u60ef\u3002",
      nextAction: `\u5148\u5b8c\u6210 1 \u682a\uff0c\u5269\u4e0b ${pluralPlant(remaining)}\u53ef\u4ee5\u6162\u6162\u6765\u3002`,
      primaryMetric: `${completed} / ${total}`,
      secondaryMetric: `\u7d2f\u8ba1 ${totalCheckins} \u6b21\u6d47\u704c`,
      highlightHabitName: strongestHabit?.name ?? null,
    };
  }

  return {
    tone: "growing",
    title: "\u4eca\u5929\u5df2\u7ecf\u6709\u5149\u4e86",
    body: strongestHabit
      ? `${strongestHabit.name}\u6b63\u5728\u4fdd\u6301 ${bestStreak} \u5929\u7684\u8282\u594f\uff0c\u4f60\u4e0d\u662f\u5728\u8ffd\u8d76\u5b8c\u7f8e\uff0c\u800c\u662f\u5728\u7167\u987e\u4e00\u4e2a\u6b63\u5728\u53d8\u7a33\u7684\u81ea\u5df1\u3002`
      : "\u4eca\u5929\u5df2\u7ecf\u5f00\u59cb\u4e86\uff0c\u82b1\u56ed\u6b63\u5728\u6162\u6162\u53d8\u4eae\u3002",
    nextAction: remaining === 0 ? "\u518d\u68c0\u67e5\u4e00\u4e0b\u4eca\u5929\u7684\u82b1\u56ed\u3002" : `\u8fd8\u6709 ${pluralPlant(remaining)}\u7b49\u4f60\u6d47\u704c\uff0c\u4e0b\u4e00\u6b65\u53ea\u9700\u8981\u5f88\u5c0f\u3002`,
    primaryMetric: `${completed} / ${total}`,
    secondaryMetric: bestStreak >= 21 ? "21 \u5929\u6210\u4e60\u60ef\u8fdb\u884c\u4e2d" : `\u6700\u957f\u8fde\u7eed ${bestStreak} \u5929`,
    highlightHabitName: strongestHabit?.name ?? null,
  };
}
