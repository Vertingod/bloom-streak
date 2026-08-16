import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BloomStreak 习惯花园",
    short_name: "BloomStreak",
    description: "每天一点点，连续绽放。把小习惯养成一座会发光的花园。",
    lang: "zh-CN",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#fbf7df",
    theme_color: "#7fb069",
    categories: ["productivity", "health", "lifestyle"],
    icons: [
      {
        src: "/icons/bloom-streak-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/bloom-streak-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/bloom-streak-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "打开今日花园",
        short_name: "今日花园",
        description: "直接回到今天的习惯打卡面板。",
        url: "/dashboard",
        icons: [{ src: "/icons/bloom-streak-icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
