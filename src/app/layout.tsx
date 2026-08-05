import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BloomStreak | 每天一点点，连续绽放",
  description: "一个移动端优先的高颜值习惯打卡 App，让每一次坚持都有生长感。",
  applicationName: "BloomStreak",
};

export const viewport: Viewport = {
  themeColor: "#7fb069",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-[100dvh] flex-col">{children}</body>
    </html>
  );
}
