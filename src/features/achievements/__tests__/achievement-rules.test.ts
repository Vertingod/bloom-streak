import { describe, expect, it } from "vitest";

import type { AchievementHabit } from "@/features/achievements/achievement-rules";
import {
  getGardenAchievementBadges,
  getHabitAchievementBadges,
} from "@/features/achievements/achievement-rules";

function habit(overrides: Partial<AchievementHabit> = {}): AchievementHabit {
  return {
    id: "habit-1",
    userId: "local-user",
    name: "Read English",
    category: "study",
    color: "sky",
    icon: "book-open",
    frequency: "daily",
    startDate: "2026-07-01",
    archived: false,
    displayOrder: 0,
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
    completedToday: true,
    currentStreak: 0,
    longestStreak: 0,
    totalCheckins: 0,
    last7Days: [],
    last30Days: [],
    ...overrides,
  };
}

describe("achievement rules", () => {
  it("unlocks the 21-day single-habit badge from the best streak", () => {
    const badges = getHabitAchievementBadges({
      stats: habit({ currentStreak: 4, longestStreak: 21, totalCheckins: 21 }),
    });

    expect(badges).toContainEqual(
      expect.objectContaining({
        id: "habit-21-days",
        label: "21 \u5929\u6210\u4e60\u60ef",
        scope: "habit",
        unlocked: true,
        illustration: "tree",
      }),
    );
  });

  it("calculates garden-wide achievements across active habits", () => {
    const badges = getGardenAchievementBadges({
      habits: [
        habit({ id: "habit-1", currentStreak: 21, longestStreak: 21, totalCheckins: 21 }),
        habit({ id: "habit-2", currentStreak: 3, longestStreak: 3, totalCheckins: 4 }),
        habit({ id: "habit-3", currentStreak: 0, longestStreak: 0, totalCheckins: 1 }),
      ],
      todayAllDone: false,
    });

    const unlockedIds = badges.filter((badge) => badge.unlocked).map((badge) => badge.id);

    expect(unlockedIds).toEqual(
      expect.arrayContaining([
        "garden-first-habit",
        "garden-three-habits",
        "garden-ten-checkins",
        "garden-first-21-day-habit",
        "garden-achievement-collector-3",
        "garden-achievement-collector-7",
      ]),
    );
  });

  it("uses all user habits for historical checkins and mastered habit totals", () => {
    const badges = getGardenAchievementBadges({
      habits: [
        habit({ id: "habit-1", archived: true, currentStreak: 0, longestStreak: 21, totalCheckins: 21 }),
        habit({ id: "habit-2", currentStreak: 0, longestStreak: 0, totalCheckins: 0 }),
      ],
      perfectDayCount: 1,
    });

    const unlockedIds = badges.filter((badge) => badge.unlocked).map((badge) => badge.id);

    expect(unlockedIds).toEqual(
      expect.arrayContaining(["garden-ten-checkins", "garden-first-21-day-habit", "perfect-day"]),
    );
    expect(badges.find((badge) => badge.id === "perfect-day")).toMatchObject({
      label: "第一次全盛开",
      unlocked: true,
    });
  });
});
