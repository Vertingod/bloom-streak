import type { Habit } from "@/features/habits/types";
import type { HabitStats } from "@/lib/habit-stats";

export type Achievement = {
  id: string;
  label: string;
  description: string;
  unlocked: boolean;
};

export function getAchievementBadges(input: {
  habits: Habit[];
  stats: HabitStats;
  todayAllDone: boolean;
}): Achievement[] {
  return [
    {
      id: "first-sprout",
      label: "第一颗小芽",
      description: "完成第一次打卡。",
      unlocked: input.stats.totalCheckins >= 1,
    },
    {
      id: "three-day-rhythm",
      label: "三日节奏",
      description: "连续坚持 3 天。",
      unlocked: input.stats.currentStreak >= 3,
    },
    {
      id: "seven-day-bloom",
      label: "七日绽放",
      description: "连续坚持 7 天。",
      unlocked: input.stats.currentStreak >= 7,
    },
    {
      id: "garden-keeper",
      label: "花园守护者",
      description: "种下至少 5 个活跃习惯。",
      unlocked: input.habits.filter((habit) => !habit.archived).length >= 5,
    },
    {
      id: "perfect-day",
      label: "今日全盛开",
      description: "完成今天所有习惯。",
      unlocked: input.todayAllDone,
    },
  ];
}
