export type HabitCategory =
  | "health"
  | "focus"
  | "study"
  | "mindful"
  | "creative"
  | "home";

export type HabitFrequency = "daily" | "weekdays";

export type HabitColor =
  | "sage"
  | "sunrise"
  | "clover"
  | "sky"
  | "lavender"
  | "berry";

export type HabitIcon =
  | "leaf"
  | "droplet"
  | "book-open"
  | "dumbbell"
  | "sparkles"
  | "moon"
  | "pen-line"
  | "heart";

export type Habit = {
  id: string;
  userId: string | null;
  name: string;
  category: HabitCategory;
  color: HabitColor;
  icon: HabitIcon;
  frequency: HabitFrequency;
  startDate: string;
  archived: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type HabitCheckin = {
  id: string;
  habitId: string;
  userId: string | null;
  date: string;
  completedAt: string;
  note?: string | null;
  createdAt: string;
};

export type HabitDraft = Pick<
  Habit,
  "name" | "category" | "color" | "icon" | "frequency" | "startDate"
>;

export type HabitWithStats = Habit & {
  completedToday: boolean;
  currentStreak: number;
  longestStreak: number;
  totalCheckins: number;
};
