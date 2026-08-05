import { getCheckinUniqueKey } from "@/features/checkins/checkin-repository";
import type { CheckinRepository } from "@/features/checkins/checkin-repository";
import type { Habit, HabitCheckin } from "@/features/habits/types";
import type { BloomStreakStorage } from "@/lib/storage";
import { createEmptyStorage, LOCAL_STORAGE_KEY } from "@/lib/storage";
import { DEFAULT_TIMEZONE, getUserTimezone } from "@/lib/date";
import type { HabitRepository } from "@/features/habits/habit-repository";

export type LocalRepositoryOptions = {
  now?: () => Date;
  createId?: () => string;
  timezone?: string;
  storageKey?: string;
};

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function getNow(options?: LocalRepositoryOptions) {
  return (options?.now?.() ?? new Date()).toISOString();
}

function createId(options?: LocalRepositoryOptions) {
  if (options?.createId) {
    return options.createId();
  }

  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getTimezone(options?: LocalRepositoryOptions) {
  return options?.timezone ?? getUserTimezone?.() ?? DEFAULT_TIMEZONE;
}

function getKey(options?: LocalRepositoryOptions) {
  return options?.storageKey ?? LOCAL_STORAGE_KEY;
}

function normalizeStorage(value: unknown, timezone: string): BloomStreakStorage {
  if (!value || typeof value !== "object") {
    return createEmptyStorage(timezone);
  }

  const candidate = value as Partial<BloomStreakStorage>;

  return {
    version: 1,
    habits: Array.isArray(candidate.habits) ? candidate.habits : [],
    checkins: Array.isArray(candidate.checkins) ? candidate.checkins : [],
    settings: {
      timezone: candidate.settings?.timezone ?? timezone,
    },
  };
}

export function readLocalStorage(
  storage: StorageLike,
  options?: LocalRepositoryOptions,
): BloomStreakStorage {
  const timezone = getTimezone(options);
  const raw = storage.getItem(getKey(options));

  if (!raw) {
    return createEmptyStorage(timezone);
  }

  try {
    return normalizeStorage(JSON.parse(raw), timezone);
  } catch {
    return createEmptyStorage(timezone);
  }
}

export function writeLocalStorage(
  storage: StorageLike,
  value: BloomStreakStorage,
  options?: LocalRepositoryOptions,
) {
  storage.setItem(getKey(options), JSON.stringify(value));
}

export function createLocalHabitRepository(
  storage: StorageLike,
  options?: LocalRepositoryOptions,
): HabitRepository {
  return {
    async listHabits(userId) {
      const state = readLocalStorage(storage, options);

      return state.habits
        .filter((habit) => habit.userId === userId && !habit.archived)
        .sort((a, b) => a.displayOrder - b.displayOrder || a.createdAt.localeCompare(b.createdAt));
    },

    async createHabit(userId, draft) {
      const state = readLocalStorage(storage, options);
      const timestamp = getNow(options);
      const displayOrder = state.habits.filter((habit) => habit.userId === userId).length;
      const habit: Habit = {
        ...draft,
        id: createId(options),
        userId,
        archived: false,
        displayOrder,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      writeLocalStorage(
        storage,
        {
          ...state,
          habits: [...state.habits, habit],
        },
        options,
      );

      return habit;
    },

    async updateHabit(habitId, patch) {
      const state = readLocalStorage(storage, options);
      const timestamp = getNow(options);
      let updatedHabit: Habit | null = null;

      const habits = state.habits.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }

        updatedHabit = {
          ...habit,
          ...patch,
          updatedAt: timestamp,
        };
        return updatedHabit;
      });

      if (!updatedHabit) {
        throw new Error(`Habit not found: ${habitId}`);
      }

      writeLocalStorage(storage, { ...state, habits }, options);
      return updatedHabit;
    },

    async archiveHabit(habitId) {
      const state = readLocalStorage(storage, options);
      const timestamp = getNow(options);
      let archivedHabit: Habit | null = null;

      const habits = state.habits.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }

        archivedHabit = {
          ...habit,
          archived: true,
          updatedAt: timestamp,
        };
        return archivedHabit;
      });

      if (!archivedHabit) {
        throw new Error(`Habit not found: ${habitId}`);
      }

      writeLocalStorage(storage, { ...state, habits }, options);
      return archivedHabit;
    },
  };
}

export function createLocalCheckinRepository(
  storage: StorageLike,
  options?: LocalRepositoryOptions,
): CheckinRepository {
  return {
    async listCheckins(userId) {
      const state = readLocalStorage(storage, options);
      return state.checkins.filter((checkin) => checkin.userId === userId);
    },

    async listCheckinsForHabit(habitId) {
      const state = readLocalStorage(storage, options);
      return state.checkins
        .filter((checkin) => checkin.habitId === habitId)
        .sort((a, b) => a.date.localeCompare(b.date));
    },

    async completeHabit(input) {
      const state = readLocalStorage(storage, options);
      const existing = state.checkins.find(
        (checkin) => getCheckinUniqueKey(checkin) === getCheckinUniqueKey(input),
      );

      if (existing) {
        return existing;
      }

      const checkin: HabitCheckin = {
        id: createId(options),
        userId: input.userId,
        habitId: input.habitId,
        date: input.date,
        completedAt: input.completedAt,
        note: input.note ?? null,
        createdAt: input.completedAt,
      };

      writeLocalStorage(
        storage,
        {
          ...state,
          checkins: [...state.checkins, checkin],
        },
        options,
      );

      return checkin;
    },
  };
}

