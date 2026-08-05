import type { SupabaseClient } from "@supabase/supabase-js";

import type { CheckinRepository } from "@/features/checkins/checkin-repository";
import { getCheckinUniqueKey } from "@/features/checkins/checkin-repository";
import type { HabitRepository } from "@/features/habits/habit-repository";
import type { Habit, HabitCheckin, HabitDraft } from "@/features/habits/types";
import { readLocalStorage } from "@/features/habits/local-storage-repository";
import type { Database } from "@/lib/supabase/database.types";
import { LOCAL_USER_ID, type BloomStreakStorage } from "@/lib/storage";

type Supabase = SupabaseClient<Database>;
type HabitRow = Database["public"]["Tables"]["habits"]["Row"];
type HabitInsert = Database["public"]["Tables"]["habits"]["Insert"];
type HabitUpdate = Database["public"]["Tables"]["habits"]["Update"];
type CheckinRow = Database["public"]["Tables"]["checkins"]["Row"];
type CheckinInsert = Database["public"]["Tables"]["checkins"]["Insert"];
type StorageLike = Pick<Storage, "getItem" | "setItem">;

export function mapHabitRowToHabit(row: HabitRow): Habit {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    category: row.category,
    color: row.color,
    icon: row.icon,
    frequency: row.frequency,
    startDate: row.start_date,
    archived: row.archived,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCheckinRowToCheckin(row: CheckinRow): HabitCheckin {
  return {
    id: row.id,
    userId: row.user_id,
    habitId: row.habit_id,
    date: row.date,
    completedAt: row.completed_at,
    note: row.note,
    createdAt: row.created_at,
  };
}

function mapHabitToInsert(habit: Habit, remoteUserId: string): HabitInsert {
  return {
    id: habit.id,
    user_id: remoteUserId,
    name: habit.name,
    category: habit.category,
    color: habit.color,
    icon: habit.icon,
    frequency: habit.frequency,
    start_date: habit.startDate,
    archived: habit.archived,
    display_order: habit.displayOrder,
    created_at: habit.createdAt,
    updated_at: habit.updatedAt,
  };
}

function mapCheckinToInsert(checkin: HabitCheckin, remoteUserId: string): CheckinInsert {
  return {
    id: checkin.id,
    user_id: remoteUserId,
    habit_id: checkin.habitId,
    date: checkin.date,
    completed_at: checkin.completedAt,
    note: checkin.note ?? null,
    created_at: checkin.createdAt,
  };
}

export function buildLocalToSupabaseSyncPayload(input: {
  habits: Habit[];
  checkins: HabitCheckin[];
  localUserId?: string;
  remoteUserId: string;
}) {
  const localUserId = input.localUserId ?? LOCAL_USER_ID;
  const localHabitIds = new Set(
    input.habits.filter((habit) => habit.userId === localUserId).map((habit) => habit.id),
  );
  const seenCheckins = new Set<string>();

  return {
    habits: input.habits
      .filter((habit) => habit.userId === localUserId)
      .map((habit) => mapHabitToInsert(habit, input.remoteUserId)),
    checkins: input.checkins
      .filter((checkin) => checkin.userId === localUserId && localHabitIds.has(checkin.habitId))
      .filter((checkin) => {
        const key = getCheckinUniqueKey({
          userId: input.remoteUserId,
          habitId: checkin.habitId,
          date: checkin.date,
        });

        if (seenCheckins.has(key)) {
          return false;
        }

        seenCheckins.add(key);
        return true;
      })
      .map((checkin) => mapCheckinToInsert(checkin, input.remoteUserId)),
  };
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `remote-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function assertData<T>(data: T | null, error: { message: string } | null): T {
  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Supabase returned no data");
  }

  return data;
}

function habitPatchToRow(patch: Partial<HabitDraft>): HabitUpdate {
  const row: HabitUpdate = { updated_at: new Date().toISOString() };

  if (patch.name !== undefined) row.name = patch.name;
  if (patch.category !== undefined) row.category = patch.category;
  if (patch.color !== undefined) row.color = patch.color;
  if (patch.icon !== undefined) row.icon = patch.icon;
  if (patch.frequency !== undefined) row.frequency = patch.frequency;
  if (patch.startDate !== undefined) row.start_date = patch.startDate;

  return row;
}

export function createSupabaseHabitRepository(supabase: Supabase): HabitRepository {
  return {
    async listHabits(userId) {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId)
        .eq("archived", false)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw new Error(error.message);
      return (data ?? []).map(mapHabitRowToHabit);
    },

    async createHabit(userId, draft) {
      if (!userId) {
        throw new Error("Supabase habit creation requires a user id");
      }

      const { count, error: countError } = await supabase
        .from("habits")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

      if (countError) throw new Error(countError.message);

      const timestamp = new Date().toISOString();
      const payload: HabitInsert = {
        id: createId(),
        user_id: userId,
        name: draft.name,
        category: draft.category,
        color: draft.color,
        icon: draft.icon,
        frequency: draft.frequency,
        start_date: draft.startDate,
        archived: false,
        display_order: count ?? 0,
        created_at: timestamp,
        updated_at: timestamp,
      };

      const { data, error } = await supabase.from("habits").insert(payload).select("*").single();
      return mapHabitRowToHabit(assertData(data, error));
    },

    async updateHabit(habitId, patch) {
      const { data, error } = await supabase
        .from("habits")
        .update(habitPatchToRow(patch))
        .eq("id", habitId)
        .select("*")
        .single();

      return mapHabitRowToHabit(assertData(data, error));
    },

    async archiveHabit(habitId) {
      const { data, error } = await supabase
        .from("habits")
        .update({ archived: true, updated_at: new Date().toISOString() })
        .eq("id", habitId)
        .select("*")
        .single();

      return mapHabitRowToHabit(assertData(data, error));
    },
  };
}

export function createSupabaseCheckinRepository(supabase: Supabase): CheckinRepository {
  return {
    async listCheckins(userId) {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("checkins")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: true });

      if (error) throw new Error(error.message);
      return (data ?? []).map(mapCheckinRowToCheckin);
    },

    async listCheckinsForHabit(habitId) {
      const { data, error } = await supabase
        .from("checkins")
        .select("*")
        .eq("habit_id", habitId)
        .order("date", { ascending: true });

      if (error) throw new Error(error.message);
      return (data ?? []).map(mapCheckinRowToCheckin);
    },

    async completeHabit(input) {
      const userId = input.userId;
      if (!userId) {
        throw new Error("Supabase check-in requires a user id");
      }

      const { data: existing, error: existingError } = await supabase
        .from("checkins")
        .select("*")
        .eq("user_id", userId)
        .eq("habit_id", input.habitId)
        .eq("date", input.date)
        .maybeSingle();

      if (existingError) throw new Error(existingError.message);
      if (existing) return mapCheckinRowToCheckin(existing);

      const payload: CheckinInsert = {
        id: createId(),
        user_id: userId,
        habit_id: input.habitId,
        date: input.date,
        completed_at: input.completedAt,
        note: input.note ?? null,
        created_at: input.completedAt,
      };

      const { data, error } = await supabase.from("checkins").insert(payload).select("*").single();
      return mapCheckinRowToCheckin(assertData(data, error));
    },
  };
}


export async function ensureSupabaseProfile(input: {
  supabase: Supabase;
  userId: string;
  email?: string | null;
  timezone: string;
}) {
  const timestamp = new Date().toISOString();
  const { error } = await input.supabase.from("profiles").upsert(
    {
      id: input.userId,
      email: input.email ?? null,
      timezone: input.timezone,
      updated_at: timestamp,
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function syncLocalDataToSupabase(input: {
  storage: StorageLike;
  supabase: Supabase;
  remoteUserId: string;
  localUserId?: string;
  timezone: string;
}) {
  const state: BloomStreakStorage = readLocalStorage(input.storage, { timezone: input.timezone });
  const payload = buildLocalToSupabaseSyncPayload({
    habits: state.habits,
    checkins: state.checkins,
    localUserId: input.localUserId ?? LOCAL_USER_ID,
    remoteUserId: input.remoteUserId,
  });

  if (payload.habits.length > 0) {
    const { error } = await input.supabase.from("habits").upsert(payload.habits, { onConflict: "id" });
    if (error) throw new Error(error.message);
  }

  if (payload.checkins.length > 0) {
    const { error } = await input.supabase
      .from("checkins")
      .upsert(payload.checkins, { onConflict: "user_id,habit_id,date", ignoreDuplicates: true });

    if (error) throw new Error(error.message);
  }

  return { habitCount: payload.habits.length, checkinCount: payload.checkins.length };
}
