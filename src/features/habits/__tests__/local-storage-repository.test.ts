import { describe, expect, it } from "vitest";

import type { HabitDraft } from "../types";
import {
  createLocalCheckinRepository,
  createLocalHabitRepository,
} from "../local-storage-repository";

class MemoryStorage implements Storage {
  private items = new Map<string, string>();

  get length() {
    return this.items.size;
  }

  clear() {
    this.items.clear();
  }

  getItem(key: string) {
    return this.items.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.items.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.items.delete(key);
  }

  setItem(key: string, value: string) {
    this.items.set(key, value);
  }
}

const draft: HabitDraft = {
  name: "Morning water",
  category: "health",
  color: "sage",
  icon: "droplet",
  frequency: "daily",
  startDate: "2026-08-05",
};

describe("local storage repositories", () => {
  it("creates habits with stable local metadata and lists active habits in display order", async () => {
    const storage = new MemoryStorage();
    const habits = createLocalHabitRepository(storage, {
      now: () => new Date("2026-08-05T01:00:00.000Z"),
      createId: () => "habit-1",
    });

    const created = await habits.createHabit("local-user", draft);
    const listed = await habits.listHabits("local-user");

    expect(created).toMatchObject({
      id: "habit-1",
      userId: "local-user",
      archived: false,
      displayOrder: 0,
      createdAt: "2026-08-05T01:00:00.000Z",
      updatedAt: "2026-08-05T01:00:00.000Z",
      ...draft,
    });
    expect(listed).toEqual([created]);
  });

  it("stores only one check-in for the same local user, habit, and date", async () => {
    const storage = new MemoryStorage();
    const checkins = createLocalCheckinRepository(storage, {
      createId: () => "checkin-1",
    });

    const first = await checkins.completeHabit({
      userId: "local-user",
      habitId: "habit-1",
      date: "2026-08-05",
      completedAt: "2026-08-05T02:00:00.000Z",
    });
    const second = await checkins.completeHabit({
      userId: "local-user",
      habitId: "habit-1",
      date: "2026-08-05",
      completedAt: "2026-08-05T03:00:00.000Z",
    });

    expect(second).toEqual(first);
    await expect(checkins.listCheckinsForHabit("habit-1")).resolves.toHaveLength(1);
  });
});
