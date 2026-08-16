import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DashboardClient } from "../components/dashboard-client";

function indexOfAny(markup: string, values: string[]) {
  return values.map((value) => markup.indexOf(value)).find((index) => index >= 0) ?? -1;
}

describe("Dashboard mobile content priority", () => {
  it("places today's actionable habits before overview and setup cards", () => {
    const markup = renderToStaticMarkup(<DashboardClient />);
    const habitsIndex = markup.indexOf("\u4eca\u65e5\u4e60\u60ef");
    const gardenIndex = markup.indexOf("\u4eca\u65e5\u82b1\u56ed");
    const accountIndex = indexOfAny(markup, ["\u7528 Email Magic Link \u767b\u5f55", "\u672c\u5730\u6a21\u5f0f"]);
    const pwaIndex = markup.indexOf("data-pwa-install-card");

    expect(habitsIndex).toBeGreaterThan(-1);
    expect(gardenIndex).toBeGreaterThan(habitsIndex);
    expect(accountIndex).toBeGreaterThan(gardenIndex);
    expect(pwaIndex).toBeGreaterThan(gardenIndex);
  });
});