import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { Achievement, AchievementHabit } from "@/features/achievements/achievement-rules";
import { AchievementCelebrationDialog } from "@/features/achievements/components/achievement-celebration-dialog";
import { AchievementIllustration } from "@/features/achievements/components/achievement-illustration";
import { GardenAchievementPanel } from "@/features/achievements/components/garden-achievement-panel";

function habit(overrides: Partial<AchievementHabit> = {}): AchievementHabit {
  return {
    id: "habit-1",
    userId: "local-user",
    name: "Read English",
    category: "study",
    color: "sky",
    icon: "book-open",
    frequency: "daily",
    startDate: "2026-07-01",
    archived: false,
    displayOrder: 0,
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
    completedToday: true,
    currentStreak: 21,
    longestStreak: 21,
    totalCheckins: 21,
    last7Days: [],
    last30Days: [],
    ...overrides,
  };
}

const achievement: Achievement = {
  id: "garden-first-21-day-habit",
  scope: "garden",
  label: "\u7b2c\u4e00\u682a\u6210\u6811",
  description: "\u81f3\u5c11\u6709 1 \u4e2a\u4e60\u60ef\u8fbe\u5230 21 \u5929\u91cc\u7a0b\u7891\u3002",
  unlocked: true,
  illustration: "tree",
};

describe("achievement components", () => {
  it("renders a non-text SVG illustration for a badge", () => {
    const markup = renderToStaticMarkup(<AchievementIllustration illustration="tree" title="Tree badge" />);

    expect(markup).toContain("<svg");
    expect(markup).toContain('data-achievement-illustration="tree"');
    expect(markup).toContain("Tree badge");
  });

  it("renders garden-wide achievement progress", () => {
    const markup = renderToStaticMarkup(
      <GardenAchievementPanel habits={[habit(), habit({ id: "habit-2", totalCheckins: 3 })]} perfectDayCount={1} />,
    );

    expect(markup).toContain("\u82b1\u56ed\u6210\u5c31");
    expect(markup).toContain("\u7b2c\u4e00\u682a\u6210\u6811");
    expect(markup).toContain("\u6210\u5c31\u6536\u85cf\u5bb6");
    expect(markup).toContain("data-achievement-illustration");
  });

  it("renders a celebratory popup with image and count context", () => {
    const markup = renderToStaticMarkup(
      <AchievementCelebrationDialog
        celebration={{
          instanceId: "garden:garden-first-21-day-habit",
          title: achievement.label,
          subtitle: "\u5168\u5c40\u6210\u5c31",
          achievement,
        }}
        newCount={2}
        onClose={() => undefined}
      />,
    );

    expect(markup).toContain("\u89e3\u9501\u65b0\u6210\u5c31");
    expect(markup).toContain("\u7b2c\u4e00\u682a\u6210\u6811");
    expect(markup).toContain("\u672c\u6b21\u65b0\u589e 2 \u679a");
    expect(markup).toContain('data-achievement-illustration="tree"');
  });
});
