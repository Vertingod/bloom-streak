"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { buildDashboardModel, type DashboardModel } from "@/features/dashboard/dashboard-model";
import { createLocalCheckinRepository, createLocalHabitRepository } from "@/features/habits/local-storage-repository";
import type { HabitDraft } from "@/features/habits/types";
import { getTodayDateKey, getUserTimezone } from "@/lib/date";
import { LOCAL_USER_ID } from "@/lib/storage";

export type DashboardDataState = {
  model: DashboardModel;
  loading: boolean;
  createHabit: (draft: HabitDraft) => Promise<void>;
  completeHabit: (habitId: string) => Promise<void>;
};

const emptyModel: DashboardModel = {
  todayDateKey: "",
  habits: [],
  progress: {
    completed: 0,
    total: 0,
    percentage: 0,
    allDone: false,
  },
};

export function useDashboardData(): DashboardDataState {
  const [model, setModel] = useState<DashboardModel>(emptyModel);
  const [loading, setLoading] = useState(true);
  const timezone = useMemo(() => getUserTimezone(), []);

  const repositories = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return {
      habits: createLocalHabitRepository(window.localStorage, { timezone }),
      checkins: createLocalCheckinRepository(window.localStorage, { timezone }),
    };
  }, [timezone]);

  const loadDashboard = useCallback(async () => {
    if (!repositories) {
      return emptyModel;
    }

    const [habits, checkins] = await Promise.all([
      repositories.habits.listHabits(LOCAL_USER_ID),
      repositories.checkins.listCheckins(LOCAL_USER_ID),
    ]);

    return buildDashboardModel({
      habits,
      checkins,
      todayDateKey: getTodayDateKey(timezone),
    });
  }, [repositories, timezone]);

  const refresh = useCallback(async () => {
    const nextModel = await loadDashboard();
    setModel(nextModel);
    setLoading(false);
  }, [loadDashboard]);

  useEffect(() => {
    let cancelled = false;

    void loadDashboard().then((nextModel) => {
      if (!cancelled) {
        setModel(nextModel);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [loadDashboard]);

  const createHabit = useCallback(
    async (draft: HabitDraft) => {
      if (!repositories) {
        return;
      }

      await repositories.habits.createHabit(LOCAL_USER_ID, draft);
      await refresh();
    },
    [refresh, repositories],
  );

  const completeHabit = useCallback(
    async (habitId: string) => {
      if (!repositories) {
        return;
      }

      await repositories.checkins.completeHabit({
        userId: LOCAL_USER_ID,
        habitId,
        date: getTodayDateKey(timezone),
        completedAt: new Date().toISOString(),
      });
      await refresh();
    },
    [refresh, repositories, timezone],
  );

  return {
    model,
    loading,
    createHabit,
    completeHabit,
  };
}
