"use client";

import { Plus, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultHabitConfig, habitCategories, habitColors, habitIcons } from "@/features/habits/habit-config";
import type { HabitCategory, HabitColor, HabitDraft, HabitFrequency, HabitIcon } from "@/features/habits/types";
import { getTodayDateKey, getUserTimezone } from "@/lib/date";

const fieldClassName = "h-11 w-full rounded-2xl border border-input bg-background/85 px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20";

export function CreateHabitSheet({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (open: boolean) => void; onCreate: (draft: HabitDraft) => Promise<void> }) {
  const today = useMemo(() => getTodayDateKey(getUserTimezone()), []);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<HabitCategory>(defaultHabitConfig.category as HabitCategory);
  const [color, setColor] = useState<HabitColor>(defaultHabitConfig.color as HabitColor);
  const [icon, setIcon] = useState<HabitIcon>(defaultHabitConfig.icon as HabitIcon);
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName || saving) {
      return;
    }

    setSaving(true);
    await onCreate({
      name: trimmedName,
      category,
      color,
      icon,
      frequency,
      startDate: today,
    });
    setSaving(false);
    setName("");
    onOpenChange(false);
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="\u5173\u95ed\u65b0\u5efa\u4e60\u60ef\u9762\u677f"
        className="absolute inset-0 bg-emerald-950/20 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <aside className="absolute inset-x-3 bottom-3 mx-auto max-h-[88dvh] max-w-xl overflow-y-auto rounded-[2rem] border bg-popover p-5 text-popover-foreground shadow-2xl md:inset-y-3 md:right-3 md:left-auto md:w-[28rem]">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">New habit</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">{"\u79cd\u4e0b\u4e00\u4e2a\u5c0f\u4e60\u60ef"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{"\u5148\u4fdd\u5b58\u5728\u672c\u5730\uff0c\u4e4b\u540e\u53ef\u4ee5\u65e0\u7f1d\u63a5 Supabase \u540c\u6b65\u3002"}</p>
          </div>
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => onOpenChange(false)}>
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
              placeholder="\u4f8b\u5982\uff1a\u6668\u95f4\u559d\u6c34"
              className="h-11 rounded-2xl bg-background/85"
              autoFocus
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="habit-category">{"\u5206\u7c7b"}</Label>
              <select id="habit-category" className={fieldClassName} value={category} onChange={(event) => setCategory(event.target.value as HabitCategory)}>
                {habitCategories.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="habit-frequency">{"\u9891\u7387"}</Label>
              <select id="habit-frequency" className={fieldClassName} value={frequency} onChange={(event) => setFrequency(event.target.value as HabitFrequency)}>
                <option value="daily">{"\u6bcf\u5929"}</option>
                <option value="weekdays">{"\u5de5\u4f5c\u65e5"}</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="habit-color">{"\u989c\u8272"}</Label>
              <select id="habit-color" className={fieldClassName} value={color} onChange={(event) => setColor(event.target.value as HabitColor)}>
                {habitColors.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="habit-icon">{"\u56fe\u6807"}</Label>
              <select id="habit-icon" className={fieldClassName} value={icon} onChange={(event) => setIcon(event.target.value as HabitIcon)}>
                {habitIcons.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Button type="submit" className="h-12 w-full rounded-full" disabled={!name.trim() || saving}>
            <Plus className="size-4" />
            {saving ? "\u4fdd\u5b58\u4e2d..." : "\u4fdd\u5b58\u5e76\u5f00\u59cb\u4eca\u5929"}
          </Button>
        </form>
      </aside>
    </div>
  );
}

