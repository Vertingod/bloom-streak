"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AuthPanel } from "@/features/auth/components/auth-panel";
import {
  buildNewAchievementCelebrations,
  readSeenAchievementIds,
  writeSeenAchievementIds,
  type AchievementCelebration,
} from "@/features/achievements/achievement-notifications";
import { getGardenAchievementBadges, getHabitAchievementBadges } from "@/features/achievements/achievement-rules";
import { AchievementCelebrationDialog } from "@/features/achievements/components/achievement-celebration-dialog";
import { GardenAchievementPanel } from "@/features/achievements/components/garden-achievement-panel";
import type { DashboardHabit } from "@/features/dashboard/dashboard-model";
import { useDashboardData } from "@/features/dashboard/use-dashboard-data";
import type { HabitDraft } from "@/features/habits/types";
import { PwaInstallCard } from "@/features/pwa/components/pwa-install-card";
import { CreateHabitSheet } from "./create-habit-sheet";
import { GardenOverview } from "./garden-overview";
import { GardenReflectionCard } from "./garden-reflection-card";
import { HabitCard } from "./habit-card";
import { HabitDetailSheet } from "./habit-detail-sheet";
import { TodayHero } from "./today-hero";

export function DashboardClient() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<DashboardHabit | null>(null);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [achievementQueue, setAchievementQueue] = useState<AchievementCelebration[]>([]);
  const { model, loading, cloud, createHabit, updateHabit, archiveHabit, completeHabit } = useDashboardData();
  const selectedHabit = selectedHabitId
    ? model.habits.find((habit) => habit.id === selectedHabitId) ?? null
    : null;
  const gardenAchievements = useMemo(
    () => getGardenAchievementBadges({ habits: model.allHabits, perfectDayCount: model.perfectDayCount }),
    [model.allHabits, model.perfectDayCount],
  );
  const habitAchievementGroups = useMemo(
    () =>
      model.allHabits.map((habit) => ({
        habit,
        achievements: getHabitAchievementBadges({ stats: habit }),
      })),
    [model.allHabits],
  );

  useEffect(() => {
    if (loading || typeof window === "undefined") {
      return;
    }

    const seenAchievementIds = readSeenAchievementIds(window.localStorage);
    const celebrations = buildNewAchievementCelebrations({
      habitAchievements: habitAchievementGroups,
      gardenAchievements,
      seenAchievementIds,
    });

    if (celebrations.length === 0) {
      return;
    }

    const nextSeenAchievementIds = new Set(seenAchievementIds);
    for (const celebration of celebrations) {
      nextSeenAchievementIds.add(celebration.instanceId);
    }
    const celebrationTimer = window.setTimeout(() => {
      setAchievementQueue((queue) => [...queue, ...celebrations]);
      writeSeenAchievementIds(window.localStorage, nextSeenAchievementIds);
    }, 0);

    return () => window.clearTimeout(celebrationTimer);
  }, [gardenAchievements, habitAchievementGroups, loading]);

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 2200);
  }

  async function handleCreate(draft: HabitDraft) {
    await createHabit(draft);
    showFeedback("\u4e60\u60ef\u5df2\u79cd\u4e0b\uff0c\u4eca\u5929\u5c31\u53ef\u4ee5\u6d47\u704c\u3002");
  }

  async function handleUpdate(habitId: string, patch: Partial<HabitDraft>) {
    await updateHabit(habitId, patch);
    setEditingHabit(null);
    showFeedback("\u4e60\u60ef\u5df2\u66f4\u65b0\uff0c\u539f\u6709 streak \u5df2\u4fdd\u7559\u3002");
  }

  async function handleArchive(habitId: string) {
    await archiveHabit(habitId);
    setEditingHabit(null);
    showFeedback("\u4e60\u60ef\u5df2\u5f52\u6863\uff0c\u5386\u53f2\u8bb0\u5f55\u4ecd\u4fdd\u7559\u5728\u672c\u5730\u3002");
  }

  async function handleComplete(habitId: string) {
    await completeHabit(habitId);
    showFeedback("\u6d47\u704c\u6210\u529f\uff0c\u4eca\u5929\u7684\u82b1\u56ed\u53c8\u4eae\u4e86\u4e00\u70b9\u3002");
  }

  return (
    <main className="min-h-[100dvh] px-4 py-5 text-foreground sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <TodayHero model={model} onCreateHabit={() => setCreateOpen(true)} />
        <AuthPanel cloud={cloud} />
        <PwaInstallCard />

        {feedback && (
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm">
            <CheckCircle2 className="size-4" />
            {feedback}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-5">
            <GardenOverview habits={model.habits} />
            <GardenAchievementPanel habits={model.allHabits} perfectDayCount={model.perfectDayCount} />
          </div>

          <section className="space-y-3">
            <div className="flex items-end justify-between gap-3 px-1">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{"\u4eca\u65e5\u4e60\u60ef"}</h2>
                <p className="text-sm text-muted-foreground">{cloud.authenticated ? "\u6253\u5361\u540e\u4f1a\u5199\u5165 Supabase\uff0c\u5e76\u4fdd\u7559\u672c\u5730\u6570\u636e\u4f5c\u4e3a\u5148\u884c\u4f53\u9a8c\u3002" : "\u6253\u5361\u540e\u4f1a\u5148\u5199\u5165 LocalStorage\uff0c\u767b\u5f55\u540e\u53ef\u540c\u6b65\u5230 Supabase\u3002"}</p>
              </div>
            </div>

            {!loading && <GardenReflectionCard model={model} />}

            {loading ? (
              <div className="rounded-[1.75rem] border bg-card/75 p-6 text-muted-foreground shadow-sm">{"\u6b63\u5728\u6574\u7406\u4eca\u5929\u7684\u82b1\u56ed..."}</div>
            ) : model.habits.length === 0 ? (
              <div className="rounded-[1.75rem] border bg-card/75 p-6 shadow-sm">
                <p className="font-medium">{"\u8fd8\u6ca1\u6709\u4e60\u60ef"}</p>
                <p className="mt-1 text-sm text-muted-foreground">{"\u70b9\u51fb\u53f3\u4e0a\u65b9\u7684\u65b0\u5efa\u4e60\u60ef\uff0c\u5efa\u7acb\u4f60\u7684\u7b2c\u4e00\u4e2a\u8fde\u7eed\u3002"}</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {model.habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onEdit={setEditingHabit}
                    onViewDetails={(item) => setSelectedHabitId(item.id)}
                    onComplete={(habitId) => void handleComplete(habitId)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <HabitDetailSheet
        open={Boolean(selectedHabit)}
        habit={selectedHabit}
        habits={model.habits}
        todayAllDone={model.progress.allDone}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedHabitId(null);
          }
        }}
      />

      {createOpen && (
        <CreateHabitSheet
          key="create"
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreate={handleCreate}
        />
      )}

      {editingHabit && (
        <CreateHabitSheet
          key={editingHabit.id}
          open={Boolean(editingHabit)}
          habit={editingHabit}
          onOpenChange={(open) => {
            if (!open) {
              setEditingHabit(null);
            }
          }}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onArchive={handleArchive}
        />
      )}

      <AchievementCelebrationDialog
        celebration={achievementQueue[0] ?? null}
        newCount={achievementQueue.length}
        onClose={() => setAchievementQueue((queue) => queue.slice(1))}
      />
    </main>
  );
}
