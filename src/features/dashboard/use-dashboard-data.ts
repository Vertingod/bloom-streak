"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { buildDashboardModel, type DashboardModel } from "@/features/dashboard/dashboard-model";
import { createLocalCheckinRepository, createLocalHabitRepository } from "@/features/habits/local-storage-repository";
import { createSupabaseCheckinRepository, createSupabaseHabitRepository, ensureSupabaseProfile, syncLocalDataToSupabase } from "@/features/habits/supabase-repository";
import type { HabitDraft } from "@/features/habits/types";
import { getTodayDateKey, getUserTimezone } from "@/lib/date";
import { LOCAL_USER_ID } from "@/lib/storage";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export type DashboardCloudState = {
  configured: boolean;
  authenticated: boolean;
  email: string | null;
  syncing: boolean;
  syncMessage: string | null;
  sendMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  syncNow: () => Promise<void>;
};

export type DashboardDataState = {
  model: DashboardModel;
  loading: boolean;
  cloud: DashboardCloudState;
  createHabit: (draft: HabitDraft) => Promise<void>;
  updateHabit: (habitId: string, patch: Partial<HabitDraft>) => Promise<void>;
  archiveHabit: (habitId: string) => Promise<void>;
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
  const [email, setEmail] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const timezone = useMemo(() => getUserTimezone(), []);
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const syncedUsersRef = useRef(new Set<string>());

  const localRepositories = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return {
      habits: createLocalHabitRepository(window.localStorage, { timezone }),
      checkins: createLocalCheckinRepository(window.localStorage, { timezone }),
    };
  }, [timezone]);

  const supabaseRepositories = useMemo(() => {
    if (!supabase) {
      return null;
    }

    return {
      habits: createSupabaseHabitRepository(supabase),
      checkins: createSupabaseCheckinRepository(supabase),
    };
  }, [supabase]);

  const repositories = authenticated && supabaseRepositories ? supabaseRepositories : localRepositories;

  const buildModelFromRepositories = useCallback(
    async (input: {
      habits: NonNullable<typeof localRepositories>["habits"];
      checkins: NonNullable<typeof localRepositories>["checkins"];
      userId: string | null;
    }) => {
      const [habits, checkins] = await Promise.all([
        input.habits.listHabits(input.userId),
        input.checkins.listCheckins(input.userId),
      ]);

      return buildDashboardModel({
        habits,
        checkins,
        todayDateKey: getTodayDateKey(timezone),
      });
    },
    [timezone],
  );

  const loadLocalDashboard = useCallback(async () => {
    if (!localRepositories) {
      return emptyModel;
    }

    return buildModelFromRepositories({
      habits: localRepositories.habits,
      checkins: localRepositories.checkins,
      userId: LOCAL_USER_ID,
    });
  }, [buildModelFromRepositories, localRepositories]);

  const loadSupabaseDashboard = useCallback(
    async (userId: string) => {
      if (!supabaseRepositories) {
        return emptyModel;
      }

      return buildModelFromRepositories({
        habits: supabaseRepositories.habits,
        checkins: supabaseRepositories.checkins,
        userId,
      });
    },
    [buildModelFromRepositories, supabaseRepositories],
  );

  const syncUserLocalData = useCallback(
    async (session: Session) => {
      if (!supabase || !localRepositories) {
        return null;
      }

      await ensureSupabaseProfile({
        supabase,
        userId: session.user.id,
        email: session.user.email ?? null,
        timezone,
      });

      if (syncedUsersRef.current.has(session.user.id)) {
        return null;
      }

      setSyncing(true);
      try {
        const result = await syncLocalDataToSupabase({
          storage: window.localStorage,
          supabase,
          remoteUserId: session.user.id,
          localUserId: LOCAL_USER_ID,
          timezone,
        });
        syncedUsersRef.current.add(session.user.id);
        return result.habitCount + result.checkinCount > 0
          ? "本地数据已同步到 Supabase。"
          : "云端已在线。";
      } finally {
        setSyncing(false);
      }
    },
    [localRepositories, supabase, timezone],
  );

  const loadDashboardForSession = useCallback(
    async (session: Session | null) => {
      if (!session) {
        setAuthenticated(false);
        setEmail(null);
        setSyncMessage(null);
        return loadLocalDashboard();
      }

      setAuthenticated(true);
      setEmail(session.user.email ?? null);
      const message = await syncUserLocalData(session);
      if (message) {
        setSyncMessage(message);
      }
      return loadSupabaseDashboard(session.user.id);
    },
    [loadLocalDashboard, loadSupabaseDashboard, syncUserLocalData],
  );

  const refresh = useCallback(async () => {
    if (authenticated && supabase) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const nextModel = await loadSupabaseDashboard(data.user.id);
        setModel(nextModel);
        setLoading(false);
        return;
      }
    }

    const nextModel = await loadLocalDashboard();
    setModel(nextModel);
    setLoading(false);
  }, [authenticated, loadLocalDashboard, loadSupabaseDashboard, supabase]);

  useEffect(() => {
    let cancelled = false;

    async function setDashboardForSession(session: Session | null) {
      const nextModel = await loadDashboardForSession(session);
      if (cancelled) return;
      setModel(nextModel);
      setLoading(false);
    }

    if (!supabase) {
      void setDashboardForSession(null);
      return () => {
        cancelled = true;
      };
    }

    void supabase.auth.getSession().then(({ data }) => setDashboardForSession(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      void setDashboardForSession(session);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadDashboardForSession, supabase]);

  const createHabit = useCallback(
    async (draft: HabitDraft) => {
      if (!repositories) {
        return;
      }

      const userId = authenticated && supabase ? (await supabase.auth.getUser()).data.user?.id ?? null : LOCAL_USER_ID;
      await repositories.habits.createHabit(userId, draft);
      await refresh();
    },
    [authenticated, refresh, repositories, supabase],
  );

  const updateHabit = useCallback(
    async (habitId: string, patch: Partial<HabitDraft>) => {
      if (!repositories) {
        return;
      }

      await repositories.habits.updateHabit(habitId, patch);
      await refresh();
    },
    [refresh, repositories],
  );

  const archiveHabit = useCallback(
    async (habitId: string) => {
      if (!repositories) {
        return;
      }

      await repositories.habits.archiveHabit(habitId);
      await refresh();
    },
    [refresh, repositories],
  );

  const completeHabit = useCallback(
    async (habitId: string) => {
      if (!repositories) {
        return;
      }

      const userId = authenticated && supabase ? (await supabase.auth.getUser()).data.user?.id ?? null : LOCAL_USER_ID;
      await repositories.checkins.completeHabit({
        userId,
        habitId,
        date: getTodayDateKey(timezone),
        completedAt: new Date().toISOString(),
      });
      await refresh();
    },
    [authenticated, refresh, repositories, supabase, timezone],
  );

  const cloud = useMemo<DashboardCloudState>(() => {
    return {
      configured: Boolean(supabase),
      authenticated,
      email,
      syncing,
      syncMessage,
      sendMagicLink: async (magicEmail: string) => {
        if (!supabase) {
          throw new Error("Supabase 未配置");
        }

        const redirectTo = `${window.location.origin}/auth/callback`;
        const { error } = await supabase.auth.signInWithOtp({
          email: magicEmail,
          options: { emailRedirectTo: redirectTo },
        });

        if (error) {
          throw new Error(error.message);
        }
      },
      signOut: async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
      },
      syncNow: async () => {
        if (!supabase) return;
        const { data } = await supabase.auth.getUser();
        const user = data.user;
        if (!user) return;

        setSyncing(true);
        try {
          await ensureSupabaseProfile({ supabase, userId: user.id, email: user.email ?? null, timezone });
          const result = await syncLocalDataToSupabase({
            storage: window.localStorage,
            supabase,
            remoteUserId: user.id,
            localUserId: LOCAL_USER_ID,
            timezone,
          });
          syncedUsersRef.current.add(user.id);
          setSyncMessage(result.habitCount + result.checkinCount > 0 ? "同步完成。" : "已是最新状态。");
          await refresh();
        } finally {
          setSyncing(false);
        }
      },
    };
  }, [authenticated, email, refresh, supabase, syncing, syncMessage, timezone]);

  return {
    model,
    loading,
    cloud,
    createHabit,
    updateHabit,
    archiveHabit,
    completeHabit,
  };
}
