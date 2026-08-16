# BloomStreak

**A warm, garden-themed habit tracker for gentle, visible progress.**

BloomStreak 是一个以花园成长为视觉隐喻的习惯追踪 Web 应用。它希望把每日打卡从“完成任务”变成轻量、温暖且可持续的反馈：记录习惯、观察连续天数与历史完成情况，并让花园随进度逐步生长。

> 🚀 **在线体验**：[https://bloom-streak.vercel.app](https://bloom-streak.vercel.app)
>
> 无需注册，打开即可创建习惯并打卡。演示默认使用 LocalStorage，数据只保存在当前浏览器。

<!-- TODO: Vercel 部署后如地址不是 bloom-streak.vercel.app，请同步替换上面的在线体验链接。 -->
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FVertingod%2Fbloom-streak)

## 主要功能

- 创建、编辑和归档习惯
- 支持“每天”和“工作日”两种频率
- 今日打卡与重复打卡保护
- 当前连续天数、最长连续天数和累计打卡次数
- 最近 7 天状态，以及 30 天历史与完成率
- 单习惯成就和花园级成就
- “今日花园回响”等轻量情绪反馈
- 默认 LocalStorage 数据模式
- 可选的 Supabase Magic Link 登录与云端同步
- PWA manifest、图标、service worker 和浏览器安装提示基础

## 数据保存模式

BloomStreak 可以在不配置后端的情况下使用，也可以选择接入 Supabase。两种模式的边界如下：

| 场景 | 实际使用的数据源 | 说明 |
| --- | --- | --- |
| 未配置 Supabase | 当前浏览器的 LocalStorage | 无需账号；数据不会自动跨浏览器或跨设备同步。 |
| 已配置 Supabase，但用户未登录 | 当前浏览器的 LocalStorage | 配置环境变量本身不会自动把匿名数据上传到云端。 |
| 已配置 Supabase，且用户通过 Magic Link 登录 | Supabase | 登录后会将本地习惯和打卡记录推送到 Supabase，随后使用 Supabase 数据仓库；界面也提供手动同步能力。 |

请注意：

- 清除浏览器站点数据、使用隐私模式或更换浏览器，可能导致仅保存在 LocalStorage 中的数据不可用。
- 当前同步实现不应被理解为已经具备成熟的离线同步、复杂冲突解决或生产级灾难恢复能力。
- Magic Link 的真实邮箱全链路、生产环境回调配置和更多异常场景仍在发布前验证与打磨中。

## 快速开始

### 环境要求

- Node.js >= 20.9.0（推荐使用与 CI 一致的 Node.js 22.x）
- npm（随受支持的 Node.js 版本安装）

### 安装与运行

```bash
npm install
npm run dev
```

默认开发地址：

```text
http://localhost:3000
```

首页 `/` 已经是可交互的 Dashboard，并在下方附带项目介绍；纯 Dashboard 地址为：

```text
http://localhost:3000/dashboard
```

如果 3000 端口已被占用，可以显式使用其他端口，例如：

```bash
npm run dev -- -p 3001
```

然后访问 `http://localhost:3001` 或 `http://localhost:3001/dashboard`。

## 可选：启用 Supabase 登录与同步

不配置 Supabase 时，BloomStreak 会继续使用 LocalStorage，不影响本地核心功能。

如需启用 Email Magic Link 登录与云端同步：

1. 将 `.env.example` 复制为 `.env.local`。
2. 填写浏览器端可公开使用的 Supabase Project URL 和 Publishable Key（旧项目可能称为 anon key）。
3. 按照 [`docs/supabase-setup.md`](docs/supabase-setup.md) 创建数据库结构、配置 RLS 和认证回调地址。
4. 重启开发服务器。

```bash
cp .env.example .env.local
```

Windows PowerShell 可使用：

```powershell
Copy-Item .env.example .env.local
```

不要把 `.env.local`、service role key 或其他私密凭据提交到版本库。前端环境变量不能替代数据库侧的 RLS 安全策略。

## 部署到线上（推荐 Vercel）

本项目是 Next.js 应用，推荐部署到 Vercel；不配置任何 Supabase 环境变量也能直接运行，因为应用会自动使用 LocalStorage 模式。

1. 把仓库推送到 GitHub。
2. 在 [Vercel](https://vercel.com) 中导入该仓库。
3. 保持环境变量为空即可得到一个可交互的在线 Demo。
4. 如需启用 Supabase 登录与同步，再添加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`（旧项目可继续使用 `NEXT_PUBLIC_SUPABASE_ANON_KEY`）
5. 在 Supabase 后台把生产环境的 Auth Redirect URL 配置为 `https://你的域名/auth/callback`。

> GitHub Pages 目前不适合直接托管本项目：应用包含动态认证回调和 Node.js 服务端能力，GitHub Pages 只能托管纯静态文件。

## PWA 边界

BloomStreak 已包含轻量 PWA 基础，可在支持安装提示的浏览器中作为 Web App 安装。安装入口是否出现取决于浏览器、操作系统、HTTPS、安全上下文和站点访问条件。

- PWA 是可安装的 Web 应用，**不是 App Store、Google Play 或其他应用商店中的原生应用**。
- 当前 service worker 主要提供基础应用壳与静态资源缓存，不代表完整离线数据同步已经实现。
- 本地开发可验证 manifest、图标和基本安装条件；正式安装体验通常需要 HTTPS 部署环境。

## 项目状态与路线

### 已完成

- Landing page 与 Dashboard 基础体验
- 习惯创建、编辑、归档和今日打卡主流程
- 连续天数、历史记录、完成率和成就反馈
- LocalStorage 数据仓库
- 可选 Supabase 认证与同步代码路径
- PWA manifest、图标、service worker 与安装提示基础
- Vitest 测试、ESLint、TypeScript 检查和生产构建脚本

### 正在打磨

- Magic Link 真实邮箱全链路与生产回调验证
- Supabase 同步失败、重试、状态反馈和边界场景
- PWA 在不同浏览器中的安装与有限离线体验
- 移动端细节、可访问性和交互一致性
- 发布前安全、文档与回归检查

### 未来考虑

以下方向尚未承诺具体版本或时间：

- 更丰富的重复计划、提醒和统计视图
- 数据导入、导出与更成熟的同步冲突处理
- 更完整的离线策略
- 多语言与更多无障碍改进
- 是否单独开发原生移动端应用

## 关于“21 天”

项目中的 21 天仅作为产品内的成长里程碑、成就反馈或视觉叙事节点，**不是医学、心理学或行为科学结论**，也不表示任何习惯都能在固定 21 天内形成。请根据个人情况合理设定目标；涉及健康、治疗或专业行为干预时，应咨询合格专业人士。

## 技术栈

- Next.js 16.3.0
- React 19.2.8
- TypeScript
- Tailwind CSS v4
- Motion 与 Lucide React
- 可选 Supabase Auth / Database
- Vitest、ESLint、TypeScript Compiler

## 项目结构

```text
src/app/          页面、路由、manifest 与认证回调
src/components/   通用界面组件
src/features/     习惯、Dashboard、成就、认证与 PWA 等功能模块
src/lib/          通用工具与基础设施
public/           图标、service worker 等静态资源
supabase/         数据库迁移
docs/            配置与项目文档
```

## 开发质量检查

```bash
npm run lint
npm run check-types
npm run test
npm run build
```

仓库已包含 `.github/workflows/ci.yml`，会在 GitHub 的 push 和 Pull Request 上运行这些检查；在仓库实际上传前，该工作流尚未在 GitHub 托管环境中执行。

## 参与贡献

请先阅读 [`CONTRIBUTING.md`](CONTRIBUTING.md) 和 [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)。仓库公开后，如需提出功能建议或报告普通缺陷，可使用该仓库的 GitHub Issues。

安全漏洞请勿发布到公开 Issue、Discussion 或 Pull Request；请遵循 [`SECURITY.md`](SECURITY.md) 中的私密报告说明。

## 许可证

本项目采用 [MIT License](LICENSE)，Copyright (c) 2026 BloomStreak contributors。
