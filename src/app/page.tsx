import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Cloud,
  GitBranch,
  Leaf,
  LineChart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardClient } from "@/features/dashboard/components/dashboard-client";

const features = [
  {
    icon: <Leaf className="size-5" />,
    title: "花园成长反馈",
    description: "每天完成一个小习惯，就像浇灌一株植物，让坚持变得可见。",
  },
  {
    icon: <LineChart className="size-5" />,
    title: "清晰 Streak",
    description: "当前连续天数、最长连续天数和累计打卡次数一目了然。",
  },
  {
    icon: <BadgeCheck className="size-5" />,
    title: "防重复打卡",
    description: "同一天同一个习惯只记录一次，保持数据干净可靠。",
  },
  {
    icon: <BookOpen className="size-5" />,
    title: "30 天历史",
    description: "最近 7 天状态和 30 天完成率，帮助你看见长期变化。",
  },
  {
    icon: <Sparkles className="size-5" />,
    title: "成就与回响",
    description: "单习惯成就、花园级成就和今日回响，给坚持一点温柔反馈。",
  },
  {
    icon: <Cloud className="size-5" />,
    title: "可选云同步",
    description: "默认 LocalStorage 即开即用，也可接入 Supabase Magic Link 同步。",
  },
];

export default function Home() {
  return (
    <>
      <DashboardClient />

      <section id="about" aria-label="项目介绍" className="border-t bg-background/60 px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            <Badge className="rounded-full border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary shadow-sm">
              BloomStreak · 习惯花园
            </Badge>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
              把每天的小习惯，养成一座会发光的花园。
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              BloomStreak 是一个移动端优先、花园隐喻的习惯打卡 Web 应用。它希望把每日打卡从“完成任务”
              变成轻量、温暖且可持续的反馈：记录习惯、观察连续天数与历史完成情况，并让花园随进度逐步生长。
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="#top"
                className={buttonVariants({
                  size: "lg",
                  className: "h-12 rounded-full px-6 text-base shadow-lg shadow-primary/20",
                })}
              >
                回到上方开始使用
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/dashboard"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className: "h-12 rounded-full bg-background/70 px-6 text-base",
                })}
              >
                打开完整 Dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-white/70 bg-card/75 shadow-sm backdrop-blur">
                <CardContent className="space-y-3 p-5">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/8 text-primary shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="leading-7 text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mx-auto max-w-3xl rounded-[2rem] border bg-card/75 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="size-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">本地优先，数据由你掌控</h3>
                <p className="leading-7 text-muted-foreground">
                  未配置或未登录时，习惯和打卡记录保存在当前浏览器的 LocalStorage，无需注册即可完整体验核心功能。
                  配置 Supabase 后，可以通过 Email Magic Link 登录，并把本地数据同步到自己的云端项目。
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  注意：纯 LocalStorage 数据不会跨浏览器或跨设备同步；清除站点数据会导致本地记录丢失。
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 border-t pt-8 text-center sm:flex-row">
            <GitBranch className="size-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              本项目是开源的，采用 MIT License。你可以在
              <Link
                href="https://github.com/Vertingod/bloom-streak"
                className="mx-1 font-medium text-primary underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                GitHub 仓库
              </Link>
              查看完整文档、参与贡献或自行部署。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
