import { ArrowRight, BadgeCheck, Leaf, LineChart, Sparkles } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const previewHabits = [
  { name: "晨间喝水", streak: 8, completed: true, tone: "bg-emerald-100" },
  { name: "阅读 20 分钟", streak: 5, completed: true, tone: "bg-amber-100" },
  { name: "睡前放下手机", streak: 2, completed: false, tone: "bg-sky-100" },
];

export default function Home() {
  return (
    <main className="min-h-[100dvh] overflow-hidden px-5 py-6 text-foreground sm:px-8 lg:px-12">
      <section className="mx-auto grid min-h-[calc(100dvh-3rem)] w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-8">
          <Badge className="rounded-full border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary shadow-sm">
            BloomStreak · 每天一点点，连续绽放
          </Badge>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-balance sm:text-6xl lg:text-7xl">
              把每天的小习惯，养成一座会发光的花园。
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              BloomStreak 是一个移动端优先的习惯打卡 App：完成一次，就浇灌一株植物；坚持越久，花园越茂盛。
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className={buttonVariants({
                size: "lg",
                className: "h-12 rounded-full px-6 text-base shadow-lg shadow-primary/20",
              })}
            >
              种下第一个习惯
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#mvp"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className: "h-12 rounded-full bg-background/70 px-6 text-base",
              })}
            >
              查看 MVP 范围
            </Link>
          </div>

          <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
            <FeaturePill icon={<Leaf className="size-4" />} label="花园成长反馈" />
            <FeaturePill icon={<LineChart className="size-4" />} label="清晰 streak" />
            <FeaturePill icon={<BadgeCheck className="size-4" />} label="防重复打卡" />
          </div>
        </div>

        <Card className="relative border-white/70 bg-card/80 shadow-2xl shadow-emerald-900/10 backdrop-blur">
          <CardContent className="space-y-6 p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">今日花园</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">3 / 5 已浇灌</h2>
              </div>
              <Badge className="rounded-full bg-accent text-accent-foreground">最长 8 天</Badge>
            </div>

            <Progress value={60} className="h-3" />

            <div className="relative overflow-hidden rounded-[2rem] border bg-gradient-to-br from-emerald-50 via-amber-50 to-lime-50 p-5">
              <div className="absolute -right-10 -top-10 size-32 rounded-full bg-amber-200/50 blur-2xl" />
              <div className="absolute -bottom-12 -left-10 size-36 rounded-full bg-emerald-200/60 blur-2xl" />
              <div className="relative grid grid-cols-3 gap-3">
                {previewHabits.map((habit, index) => (
                  <div
                    key={habit.name}
                    className="rounded-[1.5rem] border border-white/70 bg-white/65 p-3 shadow-sm backdrop-blur"
                  >
                    <div className={`mx-auto flex size-16 items-end justify-center rounded-full ${habit.tone}`}>
                      <div
                        className={`mb-3 rounded-full bg-primary/80 ${
                          habit.completed ? "h-10 w-7 shadow-lg shadow-primary/25" : "h-5 w-5 opacity-70"
                        }`}
                      />
                    </div>
                    <p className="mt-3 text-center text-xs font-medium">{habit.name}</p>
                    <p className="text-center text-xs text-muted-foreground">{habit.streak} 天</p>
                    <div className="mt-3 flex justify-center gap-1">
                      {Array.from({ length: 7 }, (_, day) => (
                        <span
                          key={`${habit.name}-${day}`}
                          className={`size-1.5 rounded-full ${
                            day <= index + 3 ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border bg-background/75 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <p className="font-medium">今天已经很棒了</p>
                  <p className="text-sm text-muted-foreground">再完成 2 个习惯，今日花园就会全部盛开。</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="mvp" className="mx-auto grid max-w-7xl gap-4 py-14 md:grid-cols-3">
        <InfoCard title="MVP 聚焦" text="Landing、Dashboard、创建习惯、今日打卡、详情和历史，不做社交、AI、付费和复杂提醒。" />
        <InfoCard title="技术路线" text="先做 Supabase-ready LocalStorage 数据层，体验跑通后再接 Supabase Auth、RLS 和云同步。" />
        <InfoCard title="设计原则" text="晨光温室 Garden：温柔、有生长感、移动端优先，不靠满屏 emoji 或复杂 3D。" />
      </section>
    </main>
  );
}

function FeaturePill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border bg-card/70 px-4 py-2 text-sm shadow-sm backdrop-blur">
      <span className="text-primary">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <Card className="border-white/70 bg-card/75 shadow-sm backdrop-blur">
      <CardContent className="space-y-3 p-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="leading-7 text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}
