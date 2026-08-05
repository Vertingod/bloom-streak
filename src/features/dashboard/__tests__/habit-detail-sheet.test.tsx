import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { DashboardHabit } from "@/features/dashboard/dashboard-model";
import { HabitDetailSheet } from "../components/habit-detail-sheet";

const habit: DashboardHabit = {
  id: "habit-1",
  userId: "local-user",
  name: "Morning water",
  category: "health",
  color: "sage",
  icon: "droplet",
  frequency: "daily",
  startDate: "2026-07-07",
  archived: false,
  displayOrder: 0,
  createdAt: "2026-07-07T00:00:00.000Z",
  updatedAt: "2026-07-07T00:00:00.000Z",
  completedToday: true,
  currentStreak: 3,
  longestStreak: 6,
  totalCheckins: 12,
  last7Days: [],
  last30Days: Array.from({ length: 30 }, (_, index) => ({
    date: `2026-07-${String(index + 7).padStart(2, "0")}`,
    completed: index < 12,
  })),
};

describe("HabitDetailSheet", () => {
  it("renders habit history and achievement state", () => {
    const markup = renderToStaticMarkup(
      <HabitDetailSheet
        open
        habit={habit}
        habits={[habit]}
        todayAllDone
        onOpenChange={() => undefined}
      />,
    );

    expect(markup).toContain("Morning water");
    expect(markup).toContain("30 \u5929\u5b8c\u6210\u7387");
    expect(markup).toContain("40%");
    expect(markup.match(/data-history-cell=/g)).toHaveLength(30);
    expect(markup).toContain("\u7b2c\u4e00\u9897\u5c0f\u82bd");
    expect(markup).toContain("\u4e03\u65e5\u7efd\u653e");
    expect(markup).toContain("\u672a\u89e3\u9501");
  });
});
