# 12-WORKFLOW.md

本文件是 BestBlogs monorepo 的**开发流程**事实来源，描述从需求进入到上线的完整链路、所涉及的 Claude Code skills / agents / hooks、以及相关规范。适合新人入门、团队对齐、外部分享。

## 设计理念

- **流程就是工具**：不靠文档靠自律，靠可执行的 skill / 阻塞门禁 hook 让规范成为默认路径。
- **以日为单位发布**：每天一条 `vX.Y.Z` 发布分支，所有当日改动合入其中，日终统一审查 + 双语 changelog + PR 合入 main。
- **两条路径，对应两种节奏**：大需求走规划密集的 `/feat`，小改动/Bug 走轻量的 `/fix`，共享编码与评审环节。
- **Plan 驱动执行，Spec 沉淀已实现**：大需求由 gstack `/autoplan` 产出 plan 指导开发；合并后 `/spec-doc` 回写归档。不再用重型 Spec 文档驱动执行。
- **多角度评审 + 三方一致性守护**：代码 / 文档 / ConfigKey 三处必须对齐，阻塞门禁。
- **流程本身可演进**：`/evolve` 基于会话痕迹提议 skill / agent / hook 迭代。

---

## 总体流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                        需求进入                                  │
└──────────────┬──────────────────────────────────┬───────────────┘
               │                                  │
            大需求                             小需求 / Bug
          /feat (入口)                       /fix (入口)
               │                                  │
  ┌────────────▼────────────┐                    │
  │  Phase 1 规划            │                    │
  │  office-hours  → autoplan│                    │
  │  （CEO+Eng+Design review）│                    │
  └────────────┬────────────┘                    │
               │ plan 确认                        │
  ┌────────────▼────────────┐      ┌─────────────▼─────────────┐
  │  Phase 2 立项            │      │  Phase 1 立项              │
  │  /issue-open             │      │  /issue-open（先建）       │
  │  （从 plan 摘取）         │      │                            │
  └────────────┬────────────┘      └─────────────┬─────────────┘
               │                                  │
               └────────┬─────────────────────────┘
                        │
               ┌────────▼─────────┐
               │  /worktree       │
               │  从当前 release  │
               │  分支拉出隔离环境 │
               └────────┬─────────┘
                        │
               ┌────────▼─────────┐
               │  /dev 编码闭环   │
               │  细化计划 → 编码 │
               │  → 单测 → 文档   │
               │  → 自测          │
               └────────┬─────────┘
                        │
               ┌────────▼─────────┐
               │  /deepreview     │
               │  6 角度 + 2 守护  │
               │  + /verify 门禁  │
               └────────┬─────────┘
                        │ 必修项全修
               ┌────────▼─────────┐
               │  /commit-pr pr   │
               │  PR base = 当前   │
               │  release 分支    │
               └────────┬─────────┘
                        │ 合入 release
              ┌─────────▼──────────┐
              │ 大需求额外跑        │
              │ /spec-doc 归档      │
              └─────────┬──────────┘
                        │
              ────────────────────────
                        │ 日终
               ┌────────▼─────────┐
               │  /release        │
               │  再次 deepreview │
               │  → verify all    │
               │  → 双语 changelog│
               │  → 合 main PR     │
               └────────┬─────────┘
                        │ 人工验证
                        ▼
                     Merge to main
                   生产部署 / 回滚
```

---

## 1. 发布分支策略

### 命名与节奏

- **发布分支**：`v<major>.<minor>.<patch>`，例 `v2.0.6`
- **粒度**：以日为单位，每天由主开发者开一条
- **合并方向**：feature 分支 → 发布分支 → main（日终 `/release` 创建 PR，人工验证通过后合并）

### 分支一览

| 类型 | 命名 | 拉自 | 合入 |
|---|---|---|---|
| 发布分支 | `vX.Y.Z` | main | main（/release 的 PR） |
| Feature 分支 | `<type>/<issue>-<slug>` | 当前发布分支 | 当前发布分支 |
| Hotfix | `hotfix/<issue>-<slug>` | main | main + 回填发布分支 |

### Feature 分支命名

正则：`^(feat|fix|refactor|perf|docs|test|ops|chore)/\d+-[a-z0-9-]+$`

示例：
- `feat/123-daily-brief-email`
- `fix/456-youtube-video-404`
- `ops/225-dev-workflow-redesign`

---

## 2. 两个入口：`/feat` 和 `/fix`

### `/feat` — 大需求（跨模块 / 产品决策 / 架构变更）

```
Phase 1 规划 → Phase 2 立项 → Phase 3 开发 → Phase 4 评审提交 → Phase 5 归档
```

| Phase | Skill | 产出 |
|---|---|---|
| 1 规划 | `/office-hours` → `/autoplan` | plan（含 CEO + Eng + Design review 结论） |
| 2 立项 | `/issue-open` | GitHub Issue（6 段模板，方案从 plan 填充） |
| 3 开发 | `/worktree` → `/dev` | 代码 + 测试 + 文档更新 + 自测通过 |
| 4 评审提交 | `/deepreview` → `/commit-pr pr` | PR 到当前发布分支 |
| 5 归档 | `/spec-doc` | `bestblogs-docs/specs/<topic>.md` 快照 |

每个 Phase 之间是 **Checkpoint**，等用户确认再推进。

### `/fix` — 小需求 / Bug / 单模块改动

```
Phase 1 立项 → Phase 2 开发 → Phase 3 评审提交
```

| Phase | Skill | 产出 |
|---|---|---|
| 1 立项 | `/issue-open` | Issue（原因/方案未知时标 `TBD，开发阶段补齐`） |
| 2 开发 | `/worktree` → `/dev` | 含内联调查、编码、单测、文档更新、自测 |
| 3 评审提交 | `/deepreview` → `/commit-pr pr` | PR 到当前发布分支 |

升级规则：若调查中发现问题远比预期大 → **立刻升级到 `/feat`** 重走规划。

### 两条路径对比

| 维度 | `/feat` | `/fix` |
|---|---|---|
| 规划强度 | 强（office-hours + autoplan） | 无 / 轻量 |
| Issue 建在 | plan 确认后 | 入口即建 |
| 设计文档 | `/dev` Step 2 简短评论 | 通常不需要 |
| Spec 归档 | 需要 `/spec-doc` | 不需要 |
| 预计耗时 | 半天 - 多天 | 10 分钟 - 半天 |

---

## 3. `/dev` 编码闭环

一次性把"开发 + 测试 + 文档 + 自测"做完，降低 `/deepreview` 反复次数。

### 6 步流程

| Step | 动作 | 必输出 |
|---|---|---|
| 1 | 制定细化计划 | 子任务 3-8 个、关键决策、影响面、风险点、测试策略 |
| 2 | 设计文档（仅 /feat 复杂场景） | Issue 评论中的简短草稿 |
| 3 | 编码（按子任务推进） | 实现 + 单测 + 本地跑通 |
| 4 | 更新文档（逐项核对） | 对照 bestblogs-docs/1-11 + 子模块 CLAUDE.md |
| 5 | 自测 | /verify 通过 + golden path + 响应式 + 深色模式 |
| 6 | 汇总输出 | 子任务/变更/测试/文档/verify 结果 |

### 编码过程中的三条一致性

- 改 `ConfigKey.java` → 立即同步 `ParameterConfigAdminController` + `bestblogs-admin` 参数配置页（三处齐）
- 改 `*Controller.java` → 立即想是否更新 `4-ARCHITECTURE.md` 或对应 spec
- 跨模块变更 → 同步评估 `bestblogs-app` + `bestblogs-admin`

---

## 4. `/deepreview` 多角度评审

**6 个视角 + 2 个一致性守护 + /verify 硬门禁**，并行调度，目标 < 5 分钟出报告。

### 6 角色评审

| Agent | 视角 | 参考文档 | 覆盖前端改动 |
|---|---|---|---|
| pm-review | 需求完整性、边界、用户体验 | `2-PRODUCT.md` / `8-CURRENT_STATE.md` | — |
| arch-review | 分层、依赖、契约、ConfigKey 治理 | `4-ARCHITECTURE.md` / `7-CONVENTIONS.md` | — |
| code-reviewer | 代码质量、规范、潜在 Bug | `7-CONVENTIONS.md` | — |
| qa-review | 测试覆盖、Mock 质量、回归风险 | `9-TESTING.md` | — |
| ops-review | Feature Flag、灰度、监控、回滚 | `11-OPERATIONS.md` | — |
| designer-review | 视觉 / **响应式 / 暗黑模式 / 交互体验** / 可达性 | `5-DESIGN.md` / `6-UI-SPEC.md` / `3-BRAND.md` | ✅（仅前端） |

### 2 个一致性守护（**阻塞门禁**）

| Agent | 守护 |
|---|---|
| doc-consistency | 代码 diff ↔ `bestblogs-docs/**` / 各 `CLAUDE.md` 是否同步 |
| config-consistency | `ConfigKey.java` ↔ `ParameterConfigAdminController` ↔ `bestblogs-admin` UI 三处对齐 |

任一 consistency 报 CRITICAL → **停止评审流程**，必须先修复。

### 条件触发 security-auditor

变更命中关键词 `auth / cookie / token / proxy / filter / session / oauth / jwt` 时额外调用。

### 输出

```
## Deep Review 报告 — <branch>
### 角色评审（聚合 6 个 agent 输出）
### 一致性守护（阻塞状态）
### /verify 结果
### 必修项（进入 PR 前）
### 建议项（可 PR 后跟进）
```

循环修复 → 再次 `/deepreview`，直到无必修项。

---

## 5. `/release` 日终关闭发布分支

当日所有 feature PR 合入发布分支后执行。

```
再次 /deepreview（全量视角）
     ↓
/verify all（硬门禁）
     ↓
生成双语 changelog → bestblogs-app/content/changelog/v<version>.md
     ↓
汇总人工验证清单（从各 Issue 的"待人工验证"段）
     ↓
gh pr create --base main
     ↓
人工验证 → 手动 merge to main → 生产部署
```

### Changelog 格式

参考 `bestblogs-app/content/changelog/v2.0.5.md`：

```yaml
---
version: "2.0.6"
date: "2026-04-17"
title:
  zh: "..."
  en: "..."
summary:
  zh: "..."
  en: "..."
tags: [...]
---

## 中文
### ✨ 新功能
### 🔧 体验优化
### 🐛 修复

## English
### ✨ New Features
### 🔧 Improvements
### 🐛 Fixes
```

分组映射：`feat` → 新功能，`perf/refactor` → 体验优化，`fix` → 修复；`docs/test/ops/chore/style` 默认不进 changelog（除非用户可见）。

---

## 6. Issue 模板（6 段结构）

`/issue-open` 使用固定模板：

```markdown
## 背景
{为什么做、来源}

## 现象 / 期望行为
{Bug 复现 + 当前错误 + 期望正确}
{Feature 期望行为 + 成功标准}

## 原因（分析结论）
{root cause 或技术方案依据；TBD 允许}

## 解决方案
{概要；TBD 允许}

## 已自动验证
- [ ] 单元测试
- [ ] 集成测试
- [ ] /verify 对应范围通过

## 待人工验证
- [ ] 具体步骤 1
- [ ] 具体步骤 2
- [ ] 回归测试
```

**"待人工验证"是关键**：`/release` 会把它聚合到 release PR，作为人工验证清单。

---

## 7. Commit Message 规范

遵循 **Conventional Commits**：

```
<type>(<scope>): <subject>

<body 可选>

Closes #<issue>

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

- **type**：`feat` / `fix` / `refactor` / `perf` / `docs` / `test` / `style` / `ops` / `chore`
- **scope**（可选）：`app` / `admin` / `service` / `worker` / `common` / `docs` / `workflow`
- **subject**：≤ 70 字符，中英文均可
- **Closes #N** 自动关联 Issue
- 原子提交：一个 commit 一件事

---

## 8. Worktree（隔离开发）

`.claude/worktrees/<issue>-<slug>/` 放独立 worktree，避免干扰主 working tree，也支持多 Issue 并行。

```bash
# /worktree skill 自动执行
git worktree add -b <branch> .claude/worktrees/<issue>-<slug> <release-branch>

# 合并后回收
git worktree remove .claude/worktrees/<issue>-<slug>
git branch -d <branch>
```

`.claude/worktrees/` 已在 `.gitignore` 中。

---

## 9. Hooks 自动守护

| 触发 | 行为 | 作用 |
|---|---|---|
| SessionStart | 打印当前发布分支与 feature 分支提示 | 会话开始即知道默认 PR base |
| PreToolUse Write\|Edit | 扫描 secret 模式（AKIA / ghp_ / sk- / PRIVATE KEY） | 防止提交密钥 |
| PreToolUse Bash | 拦 `git checkout main` / `git push origin main` / `gh pr create --base main` | 防绕过发布分支流程 |
| PostToolUse Edit\|Write | eslint --fix（TS/TSX） | 自动修小风格问题 |
| PostToolUse Edit\|Write | bestblogs-common 改动提示 `mvn install` | 避免下游用旧 JAR |
| PostToolUse Edit\|Write | ConfigKey.java 改动提示三处同步 | 配合 config-consistency agent |
| PostToolUse Edit\|Write | Controller.java 改动提示更新 architecture/spec 文档 | 配合 doc-consistency agent |
| Stop | 会话结束提醒：如有流程痛点考虑 `/evolve`，重要决策同步 memory/CLAUDE.md | 促进持续迭代 |

---

## 10. `/evolve` 流程演进

开发流程不是一次成型。`/evolve` 基于本次会话痕迹提议 skill / agent / hook / 文档的优化：

触发条件：
- 用户显式 `/evolve`
- 同一命令组合重复 ≥ 3 次
- 同一评审必修项类别出现 ≥ 3 次
- 用户明确纠正 Claude 的流程步骤

产出：具体到 diff 级别的建议清单，等用户逐项 pick。**不擅自批量应用**。

---

## 11. Skills 速查表

### 顶层入口（4）

| Skill | 用途 |
|---|---|
| `/feat` | 大需求全链路编排 |
| `/fix` | 小需求 / Bug 编排 |
| `/deepreview` | 多角度评审 |
| `/release` | 日终关闭发布分支 |

### 编码阶段（1）

| Skill | 用途 |
|---|---|
| `/dev` | 统一编码闭环（计划 / 编码 / 测试 / 文档 / 自测） |

### 工具（3）

| Skill | 用途 |
|---|---|
| `/issue-open` | 结构化 Issue 模板 |
| `/worktree` | 规范化 git worktree |
| `/spec-doc` | 大需求合入后回写 spec |

### 提交与验证（2）

| Skill | 用途 |
|---|---|
| `/commit-pr [push\|pr]` | 提交 / 推送 / 创建 PR（base 默认 release 分支） |
| `/verify <scope>` | lint + build + test 硬门禁 |

### 演进（1）

| Skill | 用途 |
|---|---|
| `/evolve` | 基于会话痕迹迭代 skills / agents / hooks |

### 保留的 gstack 全局 skill

- `/office-hours`、`/autoplan`、`/plan-ceo-review`、`/plan-eng-review`、`/plan-design-review` — 规划评审
- `/land-and-deploy`、`/retro` — 部署与复盘

---

## 12. 与现有文档的关系

| 文档 | 职责 | 本流程文档的关系 |
|---|---|---|
| `1-VISION.md` | 愿景 | 不变 |
| `2-PRODUCT.md` | 产品策略 | `pm-review` 参考 |
| `3-BRAND.md` | 品牌表达 | `pm-review` / `designer-review` 参考 |
| `4-ARCHITECTURE.md` | 架构 | `arch-review` / `doc-consistency` 参考 |
| `5-DESIGN.md` | 视觉设计 | `designer-review` 参考 |
| `6-UI-SPEC.md` | UI 细则 | `designer-review` 参考 |
| `7-CONVENTIONS.md` | 代码规范 | `code-reviewer` / `arch-review` 参考 |
| `8-CURRENT_STATE.md` | 当前状态 | `pm-review` 参考 |
| `9-TESTING.md` | 测试约定 | `qa-review` 参考 |
| `10-TERMINOLOGY.md` | 术语 | `pm-review` 参考 |
| `11-OPERATIONS.md` | 运维 | `ops-review` 参考 |
| **`12-WORKFLOW.md`（本文件）** | 开发流程 | 总入口：整合前 11 份 |
| `specs/` | 已交付能力快照 | `/spec-doc` 产出目标 |

---

## 13. 常见问题与反模式

### ❌ 反模式

- 直接在发布分支（`vX.Y.Z`）上编辑代码并 commit（应 `/worktree` 拉 feature 分支）
- Feature 分支从 `main` 拉（应从当前发布分支拉）
- PR base = main（仅 `/release` 的 release PR 允许）
- 建 Issue 时"待人工验证"留空（`/release` 无法汇总到 release PR）
- 新增 ConfigKey 只改 `ConfigKey.java`（必须三处齐）
- 改 Controller 不更新 `4-ARCHITECTURE.md`（doc-consistency 会阻塞）
- 绕过 `/deepreview` 直接提交（一致性守护不过）
- 跳过 `/dev` Step 4（文档更新）和 Step 5（自测）

### ✅ 最佳实践

- 每个 Issue 一个专注目标，大 Issue 拆开
- 原子提交，便于回溯与 changelog 生成
- 待人工验证写具体复现步骤 + 账号 + 前置条件
- `/evolve` 反馈使用感受，持续优化工作流

### 💡 升级信号

| 场景 | 建议升级到 |
|---|---|
| `/fix` 发现改动量远超预期 | `/feat` |
| 同类评审必修项反复出现 | 在 agent 检查清单补充 → `/evolve` |
| 某类 Bug 反复出现 | 在 `9-TESTING.md` 补测试约定，补回归用例 |
| ConfigKey 三处同步成本高 | 推动通用式架构（枚举遍历 + UI 通用渲染） |

---

## 附：典型会话示例

### 场景 A：小 Bug 修复

```
用户：/fix 移动端文章页面下方播放器遮挡底部导航
Claude：
  → /issue-open type=fix, subject="修复移动端播放器遮挡底部导航"
  → 创建 Issue #456
  → /worktree fix/456-mobile-player-overlap
  → /dev（调查 + 修复 + 单测 + 自测）
  → /deepreview（designer-review 必修 + 其它通过）
  → 修复 → 再 /deepreview 通过
  → /commit-pr pr（PR base = v2.0.6）
```

### 场景 B：大需求

```
用户：/feat 支持 Pro 用户邮件早报个性化模板
Claude：
  → /office-hours 澄清（受众 / 成功标准 / 最窄切入）
  → /autoplan（CEO + Eng + Design review 迭代）
  → 用户确认 plan
  → /issue-open type=feat → Issue #460
  → /worktree feat/460-newsletter-template
  → /dev（细化 → 设计评论 → 编码 → 测试 → 文档 → 自测）
  → /deepreview 6 角度（含 designer-review 响应式/深色/交互）
  → 修复 → /commit-pr pr
  → PR 合入 v2.0.6
  → /spec-doc 生成 bestblogs-docs/specs/newsletter-template.md
```

### 场景 C：日终关闭

```
用户：/release
Claude：
  → 当前 v2.0.6，合入 N 个 PR
  → /deepreview 全量
  → /verify all 通过
  → 生成 bestblogs-app/content/changelog/v2.0.6.md（双语）
  → 聚合 N 个 Issue 的"待人工验证"
  → gh pr create --base main
  → 输出：release PR URL + 人工验证清单
用户：人工验证通过 → GitHub 界面 Merge → 生产部署
```

---

## 变更历史

| 日期 | 版本 | 说明 |
|---|---|---|
| 2026-04-17 | v1.0 | 初始版本，对应 Issue #225 工作流重组 |
