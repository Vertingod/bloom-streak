import { describe, expect, it } from "vitest";

import type { DashboardHabit } from "@/features/dashboard/dashboard-model";
import { buildHabitDetailSummary } from "../habit-detail-model";

const baseHabit: DashboardHabit = {
  id: "habit-1",
  userId: "local-user",
  name: "Read English",
  category: "study",
  color: "sky",
  icon: "book-open",
  frequency: "daily",
  startDate: "2026-07-07",
  archived: false,
  displayOrder: 0,
  createdAt: "2026-07-07T00:00:00.000Z",
  updatedAt: "2026-07-07T00:00:00.000Z",
  completedToday: true,
  currentStreak: 3,
  longestStreak: 6,
  totalCheckins: 12,
  last7Days: [],
  last30Days: Array.from({ length: 30 }, (_, index) => ({
    date: `2026-07-${String(index + 7).padStart(2, "0")}`,
    completed: index < 12,
  })),
};

describe("buildHabitDetailSummary", () => {
  it("summarizes a habit history window and achievement groups", () => {
    const summary = buildHabitDetailSummary({
      habit: baseHabit,
      habits: [baseHabit],
      todayAllDone: true,
    });

    expect(summary.last30Completed).toBe(12);
    expect(summary.last30Total).toBe(30);
    expect(summary.last30Percentage).toBe(40);
    expect(summary.unlockedAchievements.map((achievement) => achievement.id)).toEqual([
      "first-sprout",
      "three-day-rhythm",
    ]);
    expect(summary.lockedAchievements.map((achievement) => achievement.id)).toEqual([
      "seven-day-bloom",
      "habit-21-days",
    ]);
  });
});
