import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CreateHabitSheet } from "../components/create-habit-sheet";

describe("CreateHabitSheet mobile ergonomics", () => {
  it("provides a named 44px close target and safe mobile viewport spacing", () => {
    const markup = renderToStaticMarkup(
      <CreateHabitSheet
        open
        onOpenChange={() => undefined}
        onCreate={async () => undefined}
      />,
    );

    expect(markup).toContain('aria-label="\u5173\u95ed\u65b0\u5efa\u4e60\u60ef\u9762\u677f"');
    expect(markup).toContain("size-11");
    expect(markup).toContain("max-h-[calc(100dvh-1rem)]");
    expect(markup).toContain("env(safe-area-inset-bottom)");
  });
});