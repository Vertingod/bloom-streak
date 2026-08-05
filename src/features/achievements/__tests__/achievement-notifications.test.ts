import { describe, expect, it } from "vitest";

import type { Achievement, AchievementHabit } from "@/features/achievements/achievement-rules";
import { buildNewAchievementCelebrations } from "@/features/achievements/achievement-notifications";

const unlockedHabitAchievement: Achievement = {
  id: "first-sprout",
  scope: "habit",
  label: "\u7b2c\u4e00\u9897\u5c0f\u82bd",
  description: "\u5b8c\u6210\u7b2c\u4e00\u6b21\u6253\u5361\u3002",
  unlocked: true,
  illustration: "sprout",
};

const lockedGardenAchievement: Achievement = {
  id: "garden-three-habits",
  scope: "garden",
  label: "\u4e09\u682a\u6210\u56ed",
  description: "\u62e5\u6709 3 \u4e2a\u6d3b\u8dc3\u4e60\u60ef\u3002",
  unlocked: false,
  illustration: "grove",
};

const unlockedGardenAchievement: Achievement = {
  id: "garden-ten-checkins",
  scope: "garden",
  label: "\u5341\u6b21\u6d47\u704c",
  description: "\u7d2f\u8ba1\u5b8c\u6210 10 \u6b21\u6253\u5361\u3002",
  unlocked: true,
  illustration: "watering-can",
};

const habit = {
  id: "habit-1",
  name: "Read English",
} as AchievementHabit;

describe("achievement notifications", () => {
  it("returns only newly unlocked habit and garden achievement celebrations", () => {
    const celebrations = buildNewAchievementCelebrations({
      habitAchievements: [{ habit, achievements: [unlockedHabitAchievement] }],
      gardenAchievements: [lockedGardenAchievement, unlockedGardenAchievement],
      seenAchievementIds: new Set(["habit:habit-1:first-sprout"]),
    });

    expect(celebrations).toEqual([
      {
        instanceId: "garden:garden-ten-checkins",
        title: "\u5341\u6b21\u6d47\u704c",
        subtitle: "\u5168\u5c40\u6210\u5c31",
        achievement: unlockedGardenAchievement,
      },
    ]);
  });
});
