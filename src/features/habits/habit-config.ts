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
  { id: "health", label: "健康", description: "喝水、运动、早睡、拉伸" },
  { id: "focus", label: "专注", description: "少刷手机、深度工作、整理计划" },
  { id: "study", label: "学习", description: "阅读、语言、课程、复盘" },
  { id: "mindful", label: "身心", description: "冥想、日记、情绪照顾" },
  { id: "creative", label: "创作", description: "写作、绘画、内容输出" },
  { id: "home", label: "生活", description: "收纳、家务、财务整理" },
];

export const habitColors: HabitColorConfig[] = [
  {
    id: "sage",
    label: "鼠尾草绿",
    className: "bg-emerald-100 text-emerald-950 border-emerald-200",
    glowClassName: "shadow-emerald-200/70",
  },
  {
    id: "sunrise",
    label: "晨光黄",
    className: "bg-amber-100 text-amber-950 border-amber-200",
    glowClassName: "shadow-amber-200/70",
  },
  {
    id: "clover",
    label: "四叶草",
    className: "bg-lime-100 text-lime-950 border-lime-200",
    glowClassName: "shadow-lime-200/70",
  },
  {
    id: "sky",
    label: "晴空蓝",
    className: "bg-sky-100 text-sky-950 border-sky-200",
    glowClassName: "shadow-sky-200/70",
  },
  {
    id: "lavender",
    label: "薰衣草",
    className: "bg-violet-100 text-violet-950 border-violet-200",
    glowClassName: "shadow-violet-200/70",
  },
  {
    id: "berry",
    label: "浆果粉",
    className: "bg-rose-100 text-rose-950 border-rose-200",
    glowClassName: "shadow-rose-200/70",
  },
];

export const habitIcons: HabitIconConfig[] = [
  { id: "leaf", label: "叶片" },
  { id: "droplet", label: "水滴" },
  { id: "book-open", label: "阅读" },
  { id: "dumbbell", label: "运动" },
  { id: "sparkles", label: "微光" },
  { id: "moon", label: "睡眠" },
  { id: "pen-line", label: "书写" },
  { id: "heart", label: "身心" },
];

export const defaultHabitConfig = {
  category: "health" satisfies HabitCategory,
  color: "sage" satisfies HabitColor,
  icon: "leaf" satisfies HabitIcon,
};
