import type { Achievement, AchievementHabit } from "@/features/achievements/achievement-rules";

export const SEEN_ACHIEVEMENTS_STORAGE_KEY = "bloom-streak:seen-achievements:v1";

export type HabitAchievementGroup = {
  habit: AchievementHabit;
  achievements: Achievement[];
};

export type AchievementCelebration = {
  instanceId: string;
  title: string;
  subtitle: string;
  achievement: Achievement;
};

export function getHabitAchievementInstanceId(habitId: string, achievementId: string) {
  return `habit:${habitId}:${achievementId}`;
}

export function getGardenAchievementInstanceId(achievementId: string) {
  return `garden:${achievementId}`;
}

export function buildNewAchievementCelebrations(input: {
  habitAchievements: HabitAchievementGroup[];
  gardenAchievements: Achievement[];
  seenAchievementIds: Set<string>;
}): AchievementCelebration[] {
  const habitCelebrations = input.habitAchievements.flatMap(({ habit, achievements }) =>
    achievements
      .filter((achievement) => achievement.unlocked)
      .map((achievement) => ({
        instanceId: getHabitAchievementInstanceId(habit.id, achievement.id),
        title: achievement.label,
        subtitle: habit.name,
        achievement,
      })),
  );

  const gardenCelebrations = input.gardenAchievements
    .filter((achievement) => achievement.unlocked)
    .map((achievement) => ({
      instanceId: getGardenAchievementInstanceId(achievement.id),
      title: achievement.label,
      subtitle: "\u5168\u5c40\u6210\u5c31",
      achievement,
    }));

  return [...habitCelebrations, ...gardenCelebrations].filter(
    (celebration) => !input.seenAchievementIds.has(celebration.instanceId),
  );
}

export function readSeenAchievementIds(storage: Pick<Storage, "getItem">) {
  const raw = storage.getItem(SEEN_ACHIEVEMENTS_STORAGE_KEY);

  if (!raw) {
    return new Set<string>();
  }

  try {
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []);
  } catch {
    return new Set<string>();
  }
}

export function writeSeenAchievementIds(storage: Pick<Storage, "setItem">, ids: Iterable<string>) {
  storage.setItem(SEEN_ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(Array.from(new Set(ids)).sort()));
}
