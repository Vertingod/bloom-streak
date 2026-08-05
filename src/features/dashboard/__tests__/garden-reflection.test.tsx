import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { DashboardHabit, DashboardModel } from "@/features/dashboard/dashboard-model";
import { buildGardenReflection } from "@/features/dashboard/garden-reflection";
import { GardenReflectionCard } from "@/features/dashboard/components/garden-reflection-card";

function habit(overrides: Partial<DashboardHabit> = {}): DashboardHabit {
  return {
    id: "habit-1",
    userId: "local-user",
    name: "Morning water",
    category: "health",
    color: "sage",
    icon: "droplet",
    frequency: "daily",
    startDate: "2026-08-01",
    archived: false,
    displayOrder: 0,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    completedToday: false,
    currentStreak: 0,
    longestStreak: 0,
    totalCheckins: 0,
    last7Days: [],
    last30Days: [],
    ...overrides,
  };
}

function model(overrides: Partial<DashboardModel> = {}): DashboardModel {
  const habits = overrides.habits ?? [];
  return {
    todayDateKey: "2026-08-05",
    habits,
    allHabits: overrides.allHabits ?? habits,
    progress: overrides.progress ?? {
      total: habits.length,
      completed: habits.filter((item) => item.completedToday).length,
      percentage: habits.length === 0 ? 0 : Math.round((habits.filter((item) => item.completedToday).length / habits.length) * 100),
      allDone: habits.length > 0 && habits.every((item) => item.completedToday),
    },
    perfectDayCount: overrides.perfectDayCount ?? 0,
  };
}

describe("garden reflection", () => {
  it("gives a seed prompt when the garden is empty", () => {
    const reflection = buildGardenReflection(model());

    expect(reflection.tone).toBe("empty");
    expect(reflection.title).toBe("\u82b1\u56ed\u8fd8\u5728\u7b49\u7b2c\u4e00\u9897\u5c0f\u82bd");
    expect(reflection.primaryMetric).toBe("0 \u4e2a\u4e60\u60ef");
  });

  it("celebrates a perfect day with a warm non-generic message", () => {
    const reflection = buildGardenReflection(
      model({
        habits: [habit({ completedToday: true, currentStreak: 7, totalCheckins: 12 })],
        perfectDayCount: 2,
      }),
    );

    expect(reflection.tone).toBe("complete");
    expect(reflection.title).toContain("\u4eca\u5929\u5168\u90e8\u76db\u5f00");
    expect(reflection.body).toContain("\u7b2c 2 \u6b21\u5168\u76db\u5f00");
  });

  it("uses the strongest current streak as part of the daily reflection", () => {
    const reflection = buildGardenReflection(
      model({
        habits: [
          habit({ id: "habit-1", name: "Read", completedToday: true, currentStreak: 21, totalCheckins: 31 }),
          habit({ id: "habit-2", name: "Run", completedToday: false, currentStreak: 3, totalCheckins: 4 }),
        ],
      }),
    );

    expect(reflection.tone).toBe("growing");
    expect(reflection.highlightHabitName).toBe("Read");
    expect(reflection.body).toContain("21 \u5929");
    expect(reflection.nextAction).toContain("1 \u682a");
  });

  it("renders a compact emotional card for the dashboard", () => {
    const markup = renderToStaticMarkup(
      <GardenReflectionCard
        model={model({ habits: [habit({ completedToday: true, currentStreak: 3, totalCheckins: 5 })] })}
      />,
    );

    expect(markup).toContain("data-garden-reflection-card");
    expect(markup).toContain("\u4eca\u65e5\u56de\u54cd");
    expect(markup).toContain("Morning water");
  });
});
