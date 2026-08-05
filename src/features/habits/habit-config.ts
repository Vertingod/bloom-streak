import type { HabitCategory, HabitColor, HabitIcon } from "@/features/habits/types";

export type HabitCategoryConfig = {
  id: HabitCategory;
  label: string;
  description: string;
};

export type HabitColorConfig = {
  id: HabitColor;
  label: string;
  className: string;
  glowClassName: string;
};

export type HabitIconConfig = {
  id: HabitIcon;
  label: string;
};

export const habitCategories: HabitCategoryConfig[] = [
  { id: "health", label: "??", description: "???????????" },
  { id: "focus", label: "??", description: "??????????????" },
  { id: "study", label: "??", description: "???????????" },
  { id: "mindful", label: "??", description: "??????????" },
  { id: "creative", label: "??", description: "??????????" },
  { id: "home", label: "??", description: "??????????" },
];

export const habitColors: HabitColorConfig[] = [
  {
    id: "sage",
    label: "????",
    className: "bg-emerald-100 text-emerald-950 border-emerald-200",
    glowClassName: "shadow-emerald-200/70",
  },
  {
    id: "sunrise",
    label: "???",
    className: "bg-amber-100 text-amber-950 border-amber-200",
    glowClassName: "shadow-amber-200/70",
  },
  {
    id: "clover",
    label: "???",
    className: "bg-lime-100 text-lime-950 border-lime-200",
    glowClassName: "shadow-lime-200/70",
  },
  {
    id: "sky",
    label: "???",
    className: "bg-sky-100 text-sky-950 border-sky-200",
    glowClassName: "shadow-sky-200/70",
  },
  {
    id: "lavender",
    label: "???",
    className: "bg-violet-100 text-violet-950 border-violet-200",
    glowClassName: "shadow-violet-200/70",
  },
  {
    id: "berry",
    label: "???",
    className: "bg-rose-100 text-rose-950 border-rose-200",
    glowClassName: "shadow-rose-200/70",
  },
];

export const habitIcons: HabitIconConfig[] = [
  { id: "leaf", label: "??" },
  { id: "droplet", label: "??" },
  { id: "book-open", label: "??" },
  { id: "dumbbell", label: "??" },
  { id: "sparkles", label: "??" },
  { id: "moon", label: "??" },
  { id: "pen-line", label: "??" },
  { id: "heart", label: "??" },
];

export const defaultHabitConfig = {
  category: "health" satisfies HabitCategory,
  color: "sage" satisfies HabitColor,
  icon: "leaf" satisfies HabitIcon,
};
