# Contributing to BloomStreak

感谢你愿意为 BloomStreak 做出贡献。本项目希望保持温暖、克制、易维护的产品方向：让习惯记录更有情绪反馈，但不把应用扩展成沉重的社交、AI 或复杂游戏系统。

## 开始之前

- 阅读 [`README.md`](README.md)，了解当前功能、数据模式和项目边界。
- 遵守 [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)。
- 安全漏洞不要提交到公开 Issue、Discussion 或 Pull Request；请按照 [`SECURITY.md`](SECURITY.md) 私密报告。
- 仓库公开后，较大的功能或行为变更建议先通过 GitHub Issue 讨论，避免投入与维护方向不一致。

## 本地开发

环境要求：Node.js >= 20.9.0（推荐使用与 CI 一致的 Node.js 22.x）以及随受支持 Node.js 版本安装的 npm。

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

默认地址为 `http://localhost:3000`。如果端口冲突：

```bash
npm run dev -- -p 3001
```

### 3. 可选 Supabase 环境

核心功能可以只使用 LocalStorage，无需 Supabase。

如需测试登录和同步，请复制 `.env.example` 为 `.env.local`，并按照 [`docs/supabase-setup.md`](docs/supabase-setup.md) 配置自己的测试项目。不得提交 `.env.local`、service role key、用户数据或其他秘密信息。

## 变更原则

### 保持范围小而清晰

- 一个变更尽量解决一个问题。
- 不要顺手重写无关代码、批量格式化整个仓库或修改不相关文件。
- 优先修复根因，并为行为变化补充或更新测试。
- 保持现有视觉方向：温暖、梦幻但不幼稚，精致但不过度复杂。

### 尊重数据边界

- 未登录用户的数据位于当前浏览器的 LocalStorage。
- 已配置 Supabase 但未登录时，应用仍使用 LocalStorage。
- 登录后的本地数据迁移、云端写入和手动同步都可能影响真实用户数据；修改这些路径时必须考虑重复写入、失败恢复和兼容性。
- 修改数据库结构时，应提交可审查的迁移，并同步检查 RLS。不要依赖前端隐藏按钮或浏览器端密钥保护数据。
- 修改 LocalStorage 数据结构时，应考虑已有浏览器数据的向后兼容或迁移策略。

### 遵循当前技术版本

本项目当前使用 Next.js 16.3.0 和 React 19.2.8。涉及 Next.js API、约定或文件结构的改动前，请以当前安装包中的 `node_modules/next/dist/docs/` 为准，不要假设旧版本用法仍然适用。

## 质量检查

提交变更前，请根据改动范围运行以下检查：

```bash
npm run lint
npm run check-types
npm run test
npm run build
```

至少应保证与改动直接相关的检查通过。若某项无法运行或失败，请在 Pull Request 中明确说明命令、结果和原因，不要把未验证描述为已通过。

## 测试建议

- 纯逻辑优先使用小而明确的单元测试。
- UI 变更应覆盖关键交互、禁用状态和可访问名称。
- LocalStorage 与 Supabase repository 的行为应分别测试。
- 同步相关测试应覆盖空数据、重复操作、网络失败和部分成功等边界。
- PWA 变更应区分 manifest/service worker 静态检查与真实浏览器安装验证。

## Pull Request 清单

仓库公开并接受 Pull Request 后，请在提交前确认：

- [ ] 变更目的和用户影响已说明
- [ ] 只包含与本次工作相关的文件
- [ ] 没有提交凭据、个人数据或本地环境文件
- [ ] 已补充或更新必要测试
- [ ] 已记录实际运行的检查及结果
- [ ] 文档与真实实现保持一致
- [ ] 数据迁移、RLS、LocalStorage 兼容性或回滚风险已说明（如适用）
- [ ] UI 变更已考虑键盘操作、可读文本和移动端体验（如适用）

## 许可证

提交代码或文档即表示你同意你的贡献可按照本项目的 [MIT License](LICENSE) 分发。
