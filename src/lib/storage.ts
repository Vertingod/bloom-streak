import type { Habit, HabitCheckin } from "@/features/habits/types";

export const LOCAL_STORAGE_KEY = "bloom-streak:v1";
export const LOCAL_USER_ID = "local-user";

export type BloomStreakStorage = {
  version: 1;
  habits: Habit[];
  checkins: HabitCheckin[];
  settings: {
    timezone: string;
  };
};

export function createEmptyStorage(timezone: string): BloomStreakStorage {
  return {
    version: 1,
    habits: [],
    checkins: [],
    settings: {
      timezone,
    },
  };
}
