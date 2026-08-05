import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { DashboardHabit } from "@/features/dashboard/dashboard-model";
import { HabitCard } from "../components/habit-card";

const habit: DashboardHabit = {
  id: "habit-1",
  userId: "local-user",
  name: "Morning water",
  category: "health",
  color: "sage",
  icon: "droplet",
  frequency: "daily",
  startDate: "2026-08-01",
  archived: false,
  displayOrder: 0,
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-01T00:00:00.000Z",
  completedToday: false,
  currentStreak: 2,
  longestStreak: 4,
  totalCheckins: 6,
  last7Days: [
    { date: "2026-07-30", completed: false },
    { date: "2026-07-31", completed: false },
    { date: "2026-08-01", completed: true },
    { date: "2026-08-02", completed: false },
    { date: "2026-08-03", completed: true },
    { date: "2026-08-04", completed: true },
    { date: "2026-08-05", completed: false },
  ],
  last30Days: [],
};

describe("HabitCard accessibility text", () => {
  it("renders localized aria labels instead of unicode escape text", () => {
    const markup = renderToStaticMarkup(
      <HabitCard habit={habit} onComplete={() => undefined} onEdit={() => undefined} />,
    );

    expect(markup).toContain('aria-label="\u7f16\u8f91\u4e60\u60ef"');
    expect(markup).not.toContain("\\u7f16\\u8f91\\u4e60\\u60ef");
  });
});
