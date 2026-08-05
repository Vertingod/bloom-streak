import type { Habit } from "@/features/habits/types";
import type { HabitStats } from "@/lib/habit-stats";

export type AchievementScope = "habit" | "garden";

export type AchievementIllustration =
  | "sprout"
  | "rhythm"
  | "bloom"
  | "tree"
  | "grove"
  | "watering-can"
  | "trophy"
  | "sun";

export type Achievement = {
  id: string;
  scope: AchievementScope;
  label: string;
  description: string;
  unlocked: boolean;
  illustration: AchievementIllustration;
};

export type AchievementHabit = Habit & HabitStats;

export function getHabitAchievementBadges(input: {
  stats: HabitStats;
}): Achievement[] {
  return [
    {
      id: "first-sprout",
      scope: "habit",
      label: "\u7b2c\u4e00\u9897\u5c0f\u82bd",
      description: "\u5b8c\u6210\u7b2c\u4e00\u6b21\u6253\u5361\u3002",
      unlocked: input.stats.totalCheckins >= 1,
      illustration: "sprout",
    },
    {
      id: "three-day-rhythm",
      scope: "habit",
      label: "\u4e09\u65e5\u8282\u594f",
      description: "\u8fde\u7eed\u575a\u6301 3 \u5929\u3002",
      unlocked: input.stats.currentStreak >= 3 || input.stats.longestStreak >= 3,
      illustration: "rhythm",
    },
    {
      id: "seven-day-bloom",
      scope: "habit",
      label: "\u4e03\u65e5\u7efd\u653e",
      description: "\u8fde\u7eed\u575a\u6301 7 \u5929\u3002",
      unlocked: input.stats.currentStreak >= 7 || input.stats.longestStreak >= 7,
      illustration: "bloom",
    },
    {
      id: "habit-21-days",
      scope: "habit",
      label: "21 \u5929\u6210\u4e60\u60ef",
      description: "\u4fd7\u8bdd\u8bf4 21 \u5929\u517b\u597d\u4e00\u4e2a\u597d\u4e60\u60ef\uff0c\u8fd9\u682a\u4e60\u60ef\u5df2\u7ecf\u957f\u6210\u5c0f\u6811\u3002",
      unlocked: input.stats.currentStreak >= 21 || input.stats.longestStreak >= 21,
      illustration: "tree",
    },
  ];
}

export function getGardenAchievementBadges(input: {
  habits: AchievementHabit[];
  todayAllDone?: boolean;
  perfectDayCount?: number;
}): Achievement[] {
  const activeHabits = input.habits.filter((habit) => !habit.archived);
  const totalCheckins = input.habits.reduce((sum, habit) => sum + habit.totalCheckins, 0);
  const masteredHabits = input.habits.filter((habit) => habit.currentStreak >= 21 || habit.longestStreak >= 21).length;
  const unlockedHabitAchievementCount = input.habits.reduce(
    (sum, habit) => sum + getHabitAchievementBadges({ stats: habit }).filter((achievement) => achievement.unlocked).length,
    0,
  );
  const perfectDayCount = input.perfectDayCount ?? (input.todayAllDone ? 1 : 0);

  const baseGardenAchievements: Achievement[] = [
    {
      id: "garden-first-habit",
      scope: "garden",
      label: "\u79cd\u4e0b\u7b2c\u4e00\u682a",
      description: "\u521b\u5efa\u7b2c\u4e00\u4e2a\u6d3b\u8dc3\u4e60\u60ef\uff0c\u82b1\u56ed\u5f00\u59cb\u53d1\u82bd\u3002",
      unlocked: activeHabits.length >= 1,
      illustration: "sprout",
    },
    {
      id: "garden-three-habits",
      scope: "garden",
      label: "\u4e09\u682a\u6210\u56ed",
      description: "\u62e5\u6709 3 \u4e2a\u6d3b\u8dc3\u4e60\u60ef\uff0c\u5c5e\u4e8e\u4f60\u7684\u65e5\u5e38\u82b1\u56ed\u6210\u5f62\u4e86\u3002",
      unlocked: activeHabits.length >= 3,
      illustration: "grove",
    },
    {
      id: "garden-keeper",
      scope: "garden",
      label: "\u82b1\u56ed\u5b88\u62a4\u8005",
      description: "\u79cd\u4e0b\u81f3\u5c11 5 \u4e2a\u6d3b\u8dc3\u4e60\u60ef\u3002",
      unlocked: activeHabits.length >= 5,
      illustration: "grove",
    },
    {
      id: "garden-ten-checkins",
      scope: "garden",
      label: "\u5341\u6b21\u6d47\u704c",
      description: "\u7d2f\u8ba1\u5b8c\u6210 10 \u6b21\u6253\u5361\uff0c\u7a33\u5b9a\u611f\u6b63\u5728\u7d2f\u79ef\u3002",
      unlocked: totalCheckins >= 10,
      illustration: "watering-can",
    },
    {
      id: "garden-fifty-checkins",
      scope: "garden",
      label: "\u4e94\u5341\u6b21\u6d47\u704c",
      description: "\u7d2f\u8ba1\u5b8c\u6210 50 \u6b21\u6253\u5361\uff0c\u82b1\u56ed\u5df2\u7ecf\u6709\u81ea\u5df1\u7684\u8282\u594f\u3002",
      unlocked: totalCheckins >= 50,
      illustration: "sun",
    },
    {
      id: "garden-first-21-day-habit",
      scope: "garden",
      label: "\u7b2c\u4e00\u682a\u6210\u6811",
      description: "\u81f3\u5c11\u6709 1 \u4e2a\u4e60\u60ef\u8fbe\u5230 21 \u5929\u91cc\u7a0b\u7891\u3002",
      unlocked: masteredHabits >= 1,
      illustration: "tree",
    },
    {
      id: "perfect-day",
      scope: "garden",
      label: "\u7b2c\u4e00\u6b21\u5168\u76db\u5f00",
      description: "\u81f3\u5c11\u6709 1 \u5929\u5b8c\u6210\u5f53\u65e5\u6240\u6709\u5e94\u6d47\u704c\u7684\u4e60\u60ef\u3002",
      unlocked: perfectDayCount >= 1,
      illustration: "bloom",
    },
  ];

  const baseUnlockedCount = unlockedHabitAchievementCount + baseGardenAchievements.filter((achievement) => achievement.unlocked).length;

  return [
    ...baseGardenAchievements,
    {
      id: "garden-achievement-collector-3",
      scope: "garden",
      label: "\u6210\u5c31\u6536\u85cf\u5bb6 I",
      description: "\u7d2f\u8ba1\u89e3\u9501 3 \u679a\u4e60\u60ef\u6216\u82b1\u56ed\u6210\u5c31\u3002",
      unlocked: baseUnlockedCount >= 3,
      illustration: "trophy",
    },
    {
      id: "garden-achievement-collector-7",
      scope: "garden",
      label: "\u6210\u5c31\u6536\u85cf\u5bb6 II",
      description: "\u7d2f\u8ba1\u89e3\u9501 7 \u679a\u4e60\u60ef\u6216\u82b1\u56ed\u6210\u5c31\u3002",
      unlocked: baseUnlockedCount >= 7,
      illustration: "trophy",
    },
  ];
}

export function getAchievementBadges(input: {
  habits: AchievementHabit[];
  stats: HabitStats;
  todayAllDone?: boolean;
  perfectDayCount?: number;
}): Achievement[] {
  return [
    ...getHabitAchievementBadges({ stats: input.stats }),
    ...getGardenAchievementBadges({
      habits: input.habits,
      todayAllDone: input.todayAllDone,
      perfectDayCount: input.perfectDayCount,
    }),
  ];
}
