import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import manifest from "@/app/manifest";
import { getPwaInstallCopy, isStandaloneMode } from "@/features/pwa/pwa-install";
import { PwaInstallCard } from "@/features/pwa/components/pwa-install-card";

describe("PWA install experience", () => {
  it("declares a mobile-first installable manifest", () => {
    const appManifest = manifest();

    expect(appManifest.name).toBe("BloomStreak 习惯花园");
    expect(appManifest.short_name).toBe("BloomStreak");
    expect(appManifest.start_url).toBe("/");
    expect(appManifest.display).toBe("standalone");
    expect(appManifest.icons?.some((icon) => icon.src === "/icons/bloom-streak-icon-192.png")).toBe(true);
    expect(appManifest.icons?.some((icon) => icon.purpose?.includes("maskable"))).toBe(true);
  });

  it("uses reassuring install copy for unsupported, ready, and installed states", () => {
    expect(getPwaInstallCopy("ready").buttonLabel).toBe("安装到桌面");
    expect(getPwaInstallCopy("installed").title).toContain("已经住进桌面");
    expect(getPwaInstallCopy("unsupported").description).toContain("浏览器菜单");
  });

  it("detects standalone display mode from browser-like inputs", () => {
    expect(isStandaloneMode({ matches: true })).toBe(true);
    expect(isStandaloneMode({ standalone: true })).toBe(true);
    expect(isStandaloneMode({ matches: false, standalone: false })).toBe(false);
  });

  it("renders the install card with app-like benefits", () => {
    const markup = renderToStaticMarkup(<PwaInstallCard />);

    expect(markup).toContain("安装 BloomStreak");
    expect(markup).toContain("像打开 App 一样回到今天的花园");
    expect(markup).toContain("data-pwa-install-card");
  });
});
