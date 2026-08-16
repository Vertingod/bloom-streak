"use client";

import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultHabitConfig, habitCategories, habitColors, habitIcons } from "@/features/habits/habit-config";
import type { HabitCategory, HabitColor, HabitDraft, HabitFrequency, HabitIcon, Habit } from "@/features/habits/types";
import { lockDocumentScroll } from "@/features/dashboard/sheet-scroll-lock";
import { getTodayDateKey, getUserTimezone } from "@/lib/date";
import { cn } from "@/lib/utils";

export function CreateHabitSheet({
  open,
  habit,
  onOpenChange,
  onCreate,
  onUpdate,
  onArchive,
}: {
  open: boolean;
  habit?: Habit;
  onOpenChange: (open: boolean) => void;
  onCreate: (draft: HabitDraft) => Promise<void>;
  onUpdate?: (habitId: string, patch: Partial<HabitDraft>) => Promise<void>;
  onArchive?: (habitId: string) => Promise<void>;
}) {
  const today = useMemo(() => getTodayDateKey(getUserTimezone()), []);
  const isEditing = Boolean(habit);

  useEffect(() => {
    if (!open) {
      return;
    }

    return lockDocumentScroll(document);
  }, [open]);
  const [name, setName] = useState(habit?.name ?? "");
  const [category, setCategory] = useState<HabitCategory>(habit?.category ?? (defaultHabitConfig.category as HabitCategory));
  const [color, setColor] = useState<HabitColor>(habit?.color ?? (defaultHabitConfig.color as HabitColor));
  const [icon, setIcon] = useState<HabitIcon>(habit?.icon ?? (defaultHabitConfig.icon as HabitIcon));
  const [frequency, setFrequency] = useState<HabitFrequency>(habit?.frequency ?? "daily");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName || saving) {
      return;
    }

    setSaving(true);
    try {
      const draft: HabitDraft = {
        name: trimmedName,
        category,
        color,
        icon,
        frequency,
        startDate: habit?.startDate ?? today,
      };

      if (habit && onUpdate) {
        await onUpdate(habit.id, draft);
      } else {
        await onCreate(draft);
      }

      setName("");
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive() {
    if (!habit || !onArchive || saving) {
      return;
    }

    setSaving(true);
    try {
      await onArchive(habit.id);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label={"\u5173\u95ed\u4e60\u60ef\u9762\u677f"}
        className="absolute inset-0 bg-emerald-950/20 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <aside className="absolute inset-x-2 bottom-2 mx-auto max-h-[calc(100dvh-1rem)] max-w-xl overflow-y-auto overscroll-contain rounded-[1.75rem] border bg-popover p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-popover-foreground shadow-2xl sm:inset-x-3 sm:bottom-3 sm:p-5 md:inset-y-3 md:right-3 md:left-auto md:w-[30rem]">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">{isEditing ? "Edit habit" : "New habit"}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">{isEditing ? "\u8c03\u6574\u8fd9\u4e2a\u4e60\u60ef" : "\u79cd\u4e0b\u4e00\u4e2a\u5c0f\u4e60\u60ef"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{isEditing ? "\u4fee\u6539\u540e\u4f1a\u4fdd\u7559\u539f\u6709\u6253\u5361\u548c streak\u3002" : "\u5148\u4fdd\u5b58\u5728\u672c\u5730\uff0c\u4e4b\u540e\u53ef\u4ee5\u65e0\u7f1d\u63a5 Supabase \u540c\u6b65\u3002"}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="关闭新建习惯面板"
            className="size-11 shrink-0 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="habit-name">{"\u4e60\u60ef\u540d\u79f0"}</Label>
            <Input
              id="habit-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={"\u4f8b\u5982\uff1a\u6668\u95f4\u559d\u6c34"}
              className="h-11 rounded-2xl bg-background/85"
              autoFocus
            />
            {!name.trim() && <p className="text-xs text-muted-foreground">{"\u8f93\u5165\u4e00\u4e2a\u5177\u4f53\u5230\u4eca\u5929\u80fd\u5b8c\u6210\u7684\u5c0f\u52a8\u4f5c\u3002"}</p>}
          </div>

          <FieldGroup label={"\u5206\u7c7b"}>
            {habitCategories.map((item) => (
              <ChoiceButton key={item.id} active={category === item.id} onClick={() => setCategory(item.id)}>
                <span className="font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </ChoiceButton>
            ))}
          </FieldGroup>

          <FieldGroup label={"\u989c\u8272"}>
            {habitColors.map((item) => (
              <ChoiceButton key={item.id} active={color === item.id} onClick={() => setColor(item.id)} compact>
                <span className={cn("size-4 rounded-full border", item.className)} />
                {item.label}
              </ChoiceButton>
            ))}
          </FieldGroup>

          <FieldGroup label={"\u56fe\u6807"}>
            {habitIcons.map((item) => (
              <ChoiceButton key={item.id} active={icon === item.id} onClick={() => setIcon(item.id)} compact>
                {item.label}
              </ChoiceButton>
            ))}
          </FieldGroup>

          <div className="space-y-2">
            <Label>{"\u9891\u7387"}</Label>
            <div className="grid grid-cols-2 gap-2">
              <ChoiceButton active={frequency === "daily"} onClick={() => setFrequency("daily")} compact>
                {"\u6bcf\u5929"}
              </ChoiceButton>
              <ChoiceButton active={frequency === "weekdays"} onClick={() => setFrequency("weekdays")} compact>
                {"\u5de5\u4f5c\u65e5"}
              </ChoiceButton>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1 sm:flex-row">
            {isEditing && (
              <Button type="button" variant="destructive" className="h-12 rounded-full sm:w-36" disabled={saving} onClick={handleArchive}>
                <Trash2 className="size-4" />
                {"\u5f52\u6863"}
              </Button>
            )}
            <Button type="submit" className="h-12 flex-1 rounded-full" disabled={!name.trim() || saving}>
              <Plus className="size-4" />
              {saving ? "\u4fdd\u5b58\u4e2d..." : isEditing ? "\u4fdd\u5b58\u4fee\u6539" : "\u4fdd\u5b58\u5e76\u5f00\u59cb\u4eca\u5929"}
            </Button>
          </div>
        </form>
      </aside>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </div>
  );
}

function ChoiceButton({ active, compact, children, onClick }: { active: boolean; compact?: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        "flex rounded-2xl border bg-background/70 text-left text-sm transition hover:border-primary/45 hover:bg-primary/5",
        compact ? "items-center gap-2 px-3 py-2.5" : "min-h-16 flex-col justify-center gap-0.5 px-3 py-2",
        active && "border-primary bg-primary/10 ring-2 ring-primary/15",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

