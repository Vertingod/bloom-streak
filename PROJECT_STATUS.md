# BloomStreak / 习惯花园 项目交接总结

> 新会话请先读本文件。它总结截至 2026-08-05 当天本项目的真实进度、关键决策、已完成功能、验证状态和下一步建议。

## 1. 项目定位

- 项目中文名：习惯花园
- 产品名：BloomStreak
- package / repo name：`bloom-streak`
- 项目路径：`.`
- 一句话定位：一个移动端优先、花园隐喻、有情绪价值的习惯打卡 App；用户每天完成小习惯，就像浇灌植物，让连续坚持变得可见。
- 当前阶段：核心 MVP 功能闭环已完成，进入上线前真实链路验证与视觉 polish 阶段；首页已改为“可交互 Dashboard 优先 + 下方项目介绍”的结构。

## 2. 当前技术栈

- Next.js：`16.3.0`
- React：`19.2.8`
- TypeScript
- Tailwind CSS v4
- shadcn/ui 风格组件
- Supabase Auth + Database sync
- LocalStorage fallback / offline-first MVP 数据层
- Vitest 测试
- PWA 基础能力：manifest、icons、service worker、安装卡片

常用命令：

```powershell
npm run dev
npm run check-types
npm run lint
npm run test
npm run build
```

当前本地验证主要使用：

```text
http://localhost:3001/dashboard
```

注意：此前 `3000` 被其他服务占用或返回 404；若后续要固定 `3000`，先清理端口占用。

## 3. 重要项目规则

- 根目录有 `AGENTS.md`，要求：写 Next.js 代码前先读相关文档：`node_modules/next/dist/docs/`。
- 本项目有中文乱码历史风险：
  - 写文件必须使用 UTF-8。
  - PowerShell 输出中文前建议设置：`$env:PYTHONIOENCODING='utf-8'`。
  - 复杂脚本写中文时先做编码预览和乱码扫描。
- 不要打印或泄露 `.env.local` 中的 Supabase key。
- 不要为了视觉酷炫引入重依赖；目前没有必要新增复杂动画库或图形库。
- Supabase 是可选增强：未配置/未登录时，LocalStorage 模式仍应可用。

## 4. 已完成功能总览

### 4.1 基础工程

已完成：Next.js App Router 项目、TypeScript、Tailwind CSS v4、shadcn 风格组件、可交互首页（Dashboard 优先 + 项目介绍）、Dashboard page、README、Supabase setup 文档。

关键文件：

```text
src/app/page.tsx
src/app/dashboard/page.tsx
src/app/layout.tsx
src/app/globals.css
README.md
docs/supabase-setup.md
```

### 4.2 数据模型与仓储层

已完成：Habit / HabitCheckin 类型、LocalStorage repository、Supabase repository、checkin repository、streak / today progress / habit stats 纯函数、Dashboard model 聚合层。

关键文件：

```text
src/features/habits/types.ts
src/features/habits/local-storage-repository.ts
src/features/habits/supabase-repository.ts
src/features/checkins/checkin-repository.ts
src/lib/habit-stats.ts
src/features/dashboard/dashboard-model.ts
src/features/dashboard/use-dashboard-data.ts
```

### 4.3 Dashboard MVP

已完成：今日进度 Hero、今日花园视觉区、习惯卡片、7 天完成状态、今日打卡、防重复打卡、打卡反馈、空状态。

关键文件：

```text
src/features/dashboard/components/today-hero.tsx
src/features/dashboard/components/garden-overview.tsx
src/features/dashboard/components/habit-card.tsx
src/features/dashboard/components/seven-day-strip.tsx
src/features/dashboard/components/dashboard-client.tsx
```

### 4.4 创建 / 编辑 / 归档习惯

已完成：新建习惯 Sheet、编辑习惯 Sheet、分类、颜色、图标、频率字段、归档习惯、更新时保留已有 streak/checkins。

关键文件：

```text
src/features/dashboard/components/create-habit-sheet.tsx
src/features/habits/habit-config.ts
```

### 4.5 Supabase Auth + 云同步

已完成：Email Magic Link 登录 UI、Supabase browser/server client、`/auth/callback` route、Supabase migration、LocalStorage 数据登录后同步到 Supabase、登录后打卡写入 Supabase。

关键文件：

```text
src/features/auth/components/auth-panel.tsx
src/app/auth/callback/route.ts
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/config.ts
src/features/habits/supabase-repository.ts
supabase/migrations/202608050001_bloom_streak_auth_sync.sql
```

Supabase 配置说明：`docs/supabase-setup.md`。

### 4.6 习惯详情与历史

已完成：习惯详情 Sheet、当前 streak、最长 streak、总打卡次数、30 天完成率、30 天小格子历史、单习惯成就展示。

关键文件：

```text
src/features/dashboard/habit-detail-model.ts
src/features/dashboard/components/habit-detail-sheet.tsx
```

### 4.7 成就系统

已完成两层成就：单个习惯成就 + 花园/用户全局成就。

已包含：连续 3 天、连续 7 天、连续 21 天、创建第一个习惯、拥有多个活跃习惯、累计打卡 10/50 次、第一个 21 天习惯、第一次全盛开、成就收藏家。

重要设计决策：

- 花园级成就基于 `model.allHabits`，不是只看今日 due habits。
- `perfect-day` 被设计成持久里程碑：`第一次全盛开`，使用 `perfectDayCount`。
- 新成就弹窗用 localStorage 记录 seen ids，避免重复弹出。
- 成就图片采用内联 SVG，不依赖外部图片服务。

关键文件：

```text
src/features/achievements/achievement-rules.ts
src/features/achievements/achievement-notifications.ts
src/features/achievements/components/achievement-illustration.tsx
src/features/achievements/components/garden-achievement-panel.tsx
src/features/achievements/components/achievement-celebration-dialog.tsx
```

### 4.8 PWA 安装体验

已完成：Next.js manifest route、App icon、service worker、Dashboard PWA 安装卡片、本地可访问 `/manifest.webmanifest`、`/sw.js`、icons。

关键文件：

```text
src/app/manifest.ts
public/sw.js
public/icons/bloom-streak-icon.svg
public/icons/bloom-streak-icon-192.png
public/icons/bloom-streak-icon-512.png
src/features/pwa/pwa-install.ts
src/features/pwa/components/pwa-install-card.tsx
```

### 4.9 今日花园回响

已完成：根据当前用户状态生成温暖的今日反馈，覆盖空花园、未开始、进行中、全部完成四类状态；会突出当前最强 streak 的习惯，并结合 21 天里程碑和 perfect day 次数。

关键文件：

```text
src/features/dashboard/garden-reflection.ts
src/features/dashboard/components/garden-reflection-card.tsx
```

## 5. 当前验证状态

最近一次完整验证已通过：

```powershell
npm run check-types
npm run lint
npm run test
npm run build
git diff --check
```

最近测试结果：

```text
11 test files passed
26 tests passed
```

最近构建结果：

```text
Next.js 16.3.0 Turbopack build passed
Routes:
/                      static
/_not-found            static
/auth/callback         dynamic
/dashboard             static
/manifest.webmanifest  static
```

编码扫描结果：

```text
bad []
```

浏览器验证结果：

```text
http://localhost:3001/dashboard
hasReflectionText: true
hasReflectionCard: true
hasMojibake: false
```

## 6. 当前 Git 进度

截至本总结，最新关键提交：

```text
f0d9f48 Add daily garden reflection
253184d Add PWA install experience
f2f6caa Add garden achievement system
4e7dfaa Add habit detail history sheet
5eed9e8 Add Supabase auth and cloud sync
01c0841 Build local dashboard MVP
```

完整最近提交可用：

```powershell
git log --oneline --decorate --max-count=12
```

## 7. 最早项目提示词完成度

已完成：

- 项目理解和重设计方案
- Next.js + Supabase 真实项目落地
- LocalStorage MVP
- Supabase Email Magic Link 登录与云同步
- 花园化 Dashboard
- 创建 / 编辑 / 归档习惯
- 今日打卡与 streak
- 7 天状态
- 30 天历史
- 单习惯成就
- 用户级花园成就
- 21 天习惯徽章
- 成就图片
- 成就弹窗
- PWA 基础安装体验
- 今日情绪反馈 / 回响

未完成 / 待上线前处理：

- 固定 `localhost:3000` 开发入口，当前主要验证在 `3001`
- 真实邮箱 Magic Link 从发送到 callback 的端到端复测
- Supabase 后台数据表真实写入 / 读取复测
- Vercel 部署
- 生产域名的 Supabase Redirect URL 配置
- 真机移动端视觉 polish
- Settings / Profile 页面
- 更完整 onboarding
- 更完整离线同步冲突处理

不建议现在做：复杂提醒系统、AI 教练、社交/排行榜、付费系统、重粒子动画或大型图形依赖。

## 8. 推荐下一阶段

建议下一阶段命名为：

```text
Phase 8: 上线前真实链路验证与移动端 polish
```

建议顺序：

1. 清理/确认端口，让 `http://localhost:3000/dashboard` 稳定指向当前项目。
2. 用真实邮箱完整测试 Magic Link 登录。
3. 检查 Supabase 数据表是否真实写入 habits/checkins。
4. 检查登录后刷新、退出、重新登录的数据一致性。
5. 真机或移动视口 polish：Dashboard 首屏密度、PWA 卡片占位、成就弹窗质感、打卡反馈。
6. 准备 Vercel 部署。
7. 配置生产环境 Supabase redirect URL。
8. HTTPS 下复测 PWA 安装。

## 9. 新会话建议启动 Prompt

可以在新会话直接粘贴：

```text
请先阅读 PROJECT_STATUS.md、AGENTS.md、README.md 和 docs/supabase-setup.md，然后接手 BloomStreak / 习惯花园项目。当前项目已完成核心 MVP、Supabase 登录同步、成就系统、PWA 和今日花园回响。下一步请从 Phase 8：上线前真实链路验证与移动端 polish 开始，先检查 git status、端口 3000/3001、Supabase Magic Link 真实链路，再提出并执行小步验证计划。注意全程使用 UTF-8，避免中文乱码，不要泄露 .env.local 的 key。
```

## 10. 关键提醒

- 当前项目根目录：`.`
- 当前本地可用地址：`http://localhost:3001/dashboard`
- 不要误以为 `3000` 一定是本项目；之前 `3000` 返回过 404/被其他项目占用。
- 修改 Next.js 相关代码前遵守 `AGENTS.md`，先读对应 Next docs。
- 中文乱码是本项目已遇到过的问题，所有写入必须显式 UTF-8。
- `.env.local` 存在但不要打印/提交任何敏感值。