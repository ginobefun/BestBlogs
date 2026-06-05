# 12-WORKFLOW.md

> **日常 agent 入口请优先读 `CLAUDE.md`**（monorepo 根目录 + 各组件目录）—— 它包含发布分支策略、Worktree、Commit 规范、Hooks、Skills 速查表、开发流程规范等执行规则，是 agent 默认读入的事实来源。
>
> **本文件聚焦 CLAUDE.md 不展开的内容**：流程图全景、`/feat` × `/fix` 两条路径对比、`/dev` 编码闭环 6 步细则、`/deepreview` 评审矩阵详表、`/release` changelog 格式、Issue 6 段模板、典型会话三例、反模式与升级信号。承接 PRODUCT v2 北极星切换与两端 4+4 入口结构。

更新时间：2026-05-25
状态：v2.4.0 薄壳化（去与 CLAUDE.md 双源维护）+ Project 状态自动化

## 设计理念

- **流程就是工具**：不靠文档靠自律，靠可执行的 skill / 阻塞门禁 hook 让规范成为默认路径。
- **以日为单位发布**：每天一条 `vX.Y.Z` 发布分支，所有当日改动合入其中，日终统一审查 + 双语 changelog + PR 合入 main。
- **两条路径，对应两种节奏**：大需求走规划密集的 `/feat`，小改动/Bug 走轻量的 `/fix`，共享编码与评审环节。
- **Plan 驱动执行，Spec 沉淀已实现**：大需求由 gstack `/autoplan` 产出 plan 指导开发；合并后 `/spec-doc` 回写归档。不再用重型 Spec 文档驱动执行。
- **多角度评审 + 三方一致性守护**：代码 / 文档 / ConfigKey 三处必须对齐，阻塞门禁。
- **GitHub Project 状态随工作流自动流转**：Issue 状态由 skill 自动更新，无需手动维护；PR 与 Issue Review 保留人工决策。
- **版本发布后自动归档**：release 合入 main 后，关联 Issue 一键置 Done，Project 保持聚焦。
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

## GitHub Project 状态生命周期

所有 Issue 通过固定的状态序列流转，自动与开发流程绑定，**PR/Issue 的 Review 与合并保留人工决策**。

### 状态序列

```
Backlog ──► Ready ──► In progress ──► In review ──► Done
              ↑                            │
          (手动归入              (PR 合入 release 后
           Project 时默认)        等待 release 合 main)
```

| 状态 | 含义 | 触发方式 |
|---|---|---|
| **Backlog** | 待评估，暂不排期 | 手动设置 |
| **Ready** | 已排期，可随时开发 | Issue 加入 Project 时自动设为 Ready；或手动 |
| **In progress** | 开发中 | `/worktree` 创建 worktree 后**自动**更新 |
| **In review** | PR 已创建，等待 Review | `/commit-pr pr` 创建 PR 后**自动**更新 |
| **Done** | 已合入 release 并通过验证 | release PR 合入 main 后，`/release` 提示运行**归档命令**批量更新 |

### 自动化边界

- **自动**（无需人工干预）：`/worktree` → In progress；`/commit-pr pr` → In review
- **人工**（需人工决定）：PR Code Review、PR 合并到 release 分支、release PR 合并到 main
- **半自动**（人工触发命令）：release 合入 main 后，执行归档命令批量置 Done（详见 §4）

### 辅助脚本

`.claude/scripts/update-issue-project-status.sh <issue_number> <status_name>` 是底层工具，可单独调用手动修正状态：

```bash
# 手动修正：把 Issue #970 回退到 Ready
.claude/scripts/update-issue-project-status.sh 970 "Ready"
```

---

## 1. 两个入口：`/feat` 和 `/fix`

> 发布分支命名、Feature 分支命名正则、Hotfix 规则等 → 见 `CLAUDE.md §开发流程规范`。本节聚焦两条路径对比。

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

### 入口与两端 4+4 scope 对照（v2.4.0 起）

新需求落到 Issue 时的 `area:*` Label 应对照 PRODUCT §3 的两端 8 个入口：

| 端 | 入口 | 推荐 Label / scope |
|---|---|---|
| 公共策展层 | 每日早报 | `area:public-briefing` / scope `briefing` |
| 公共策展层 | 精选周刊 | `area:newsletter` / scope `weekly` |
| 公共策展层 | 主题解读 | `area:topic` / scope `topic` |
| 公共策展层 | 内容广场 | `area:explore` / scope `explore` |
| 我的空间 | 我的早报 | `area:my-brief` / scope `my-brief` |
| 我的空间 | 我的关注 | `area:follow` / scope `follow` |
| 我的空间 | 我的阅读 | `area:my-reading` / scope `reading` |
| 我的空间 | 我的回顾 | `area:daily-review` / scope `review` |
| 跨入口 | AI 伴读 / 翻译 / Domain 篇数 / 自定义视图 | scope `copilot` / `translate` / `interest` / `view` |

阶段提示：当前 PRODUCT 处于 **Phase 1 个性化阅读工作流**（PRODUCT §8.2），北极星 = 每天打开「我的早报」的 Pro 用户数。`/feat` 立项时如果北极星预期影响为正，需在 Issue 「现象 / 期望行为」段显式标注。

---

## 2. `/dev` 编码闭环

一次性把「开发 + 测试 + 文档 + 自测」做完，降低 `/deepreview` 反复次数。

### 6 步流程

| Step | 动作 | 必输出 |
|---|---|---|
| 1 | 制定细化计划 | 子任务 3-8 个、关键决策、影响面、风险点、测试策略 |
| 2 | 设计文档（仅 /feat 复杂场景） | Issue 评论中的简短草稿 |
| 3 | 编码（按子任务推进） | 实现 + 单测 + 本地跑通 |
| 4 | 更新文档（逐项核对） | 对照 bestblogs-docs/1-13 + 子模块 CLAUDE.md |
| 5 | 自测 | /verify 通过 + golden path + 响应式 + 深色模式 |
| 6 | 汇总输出 | 子任务/变更/测试/文档/verify 结果 |

### 编码过程中的三条一致性

- 改 `ConfigKey.java` → 立即同步 `ParameterConfigAdminController` + `bestblogs-admin` 参数配置页（三处齐）
- 改 `*Controller.java` → 立即想是否更新 `4-ARCHITECTURE.md` 或对应 spec
- 跨模块变更 → 同步评估 `bestblogs-app` + `bestblogs-admin`

---

## 3. `/deepreview` 多角度评审

**6 个视角 + 2 个一致性守护 + /verify 硬门禁**，并行调度，目标 < 5 分钟出报告。

### 6 角色评审

| Agent | 视角 | 参考文档 | 覆盖前端改动 |
|---|---|---|---|
| pm-review | 需求完整性、边界、用户体验 | `2-PRODUCT.md` / `8-CURRENT_STATE.md` | — |
| arch-review | 分层、依赖、契约、ConfigKey 治理 | `4-ARCHITECTURE.md` / `7-CONVENTIONS.md` | — |
| code-reviewer | 代码质量、规范、潜在 Bug | `7-CONVENTIONS.md` | — |
| qa-review | 测试覆盖、Mock 质量、回归风险 | `9-TESTING.md` | — |
| ops-review | Feature Flag、灰度、监控、回滚、**VISION §8 五条红线** | `11-OPERATIONS.md` | — |
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

## 4. `/release` 日终关闭发布分支

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
     ↓
告知 Claude "release merged" → 执行 Issue 归档（批量置 Done）
```

### Post-merge Issue 归档

release PR **人工合并到 main 后**，告知 Claude 执行归档。Claude 会运行：

```bash
# 从所有已合入本 release 的 PR body 中提取 Closes #N，批量置 Done
RELEASE_BRANCH="v<version>"
REPO="ginobefun/bestblogs-monorepo"
REPO_ROOT=$(git rev-parse --show-toplevel)

gh pr list --repo "$REPO" --base "$RELEASE_BRANCH" --state merged --json body \
  | python3 -c "
import sys, json, re
prs = json.load(sys.stdin)
issues = set()
for pr in prs:
    matches = re.findall(r'(?:Closes?|Fixes?|Resolves?)\s+#(\d+)', pr.get('body',''), re.IGNORECASE)
    issues.update(matches)
for i in sorted(issues, key=int): print(i)
" | while read issue; do
  "$REPO_ROOT/.claude/scripts/update-issue-project-status.sh" "$issue" "Done"
done
```

归档完成后 Project 视图中本次 release 所有 Issue 自动移入 Done，Board 聚焦于进行中的工作。

### Changelog 格式

参考最近的 changelog 入口（`bestblogs-app/content/changelog/v2.4.0.md`）：

```yaml
---
version: "2.4.0"
date: "2026-05-19"
title:
  zh: "..."
  en: "..."
summary:
  zh: "..."
  en: "..."
tags: [...]
---

## 中文
### 新功能
### 体验优化
### 修复

## English
### New Features
### Improvements
### Fixes
```

分组映射：`feat` → 新功能，`perf/refactor` → 体验优化，`fix` → 修复；`docs/test/ops/chore/style` 默认不进 changelog（除非用户可见）。

---

## 5. Issue 模板（6 段结构）

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

**「待人工验证」是关键**：`/release` 会把它聚合到 release PR，作为人工验证清单。

---

## 6. `/evolve` 流程演进

开发流程不是一次成型。`/evolve` 基于本次会话痕迹提议 skill / agent / hook / 文档的优化：

触发条件：
- 用户显式 `/evolve`
- 同一命令组合重复 ≥ 3 次
- 同一评审必修项类别出现 ≥ 3 次
- 用户明确纠正 Claude 的流程步骤

产出：具体到 diff 级别的建议清单，等用户逐项 pick。**不擅自批量应用**。

---

## 7. 常见问题与反模式

### 反模式

- 直接在发布分支（`vX.Y.Z`）上编辑代码并 commit（应 `/worktree` 拉 feature 分支；例外：doc / 小 bugfix 允许直接 commit，见根目录 CLAUDE.md 协作风格）
- Feature 分支从 `main` 拉（应从当前发布分支拉）
- PR base = main（仅 `/release` 的 release PR 允许）
- 建 Issue 时「待人工验证」留空（`/release` 无法汇总到 release PR）
- 新增 ConfigKey 只改 `ConfigKey.java`（必须三处齐）
- 改 Controller 不更新 `4-ARCHITECTURE.md`（doc-consistency 会阻塞）
- 绕过 `/deepreview` 直接提交（一致性守护不过）
- 跳过 `/dev` Step 4（文档更新）和 Step 5（自测）
- **触犯 VISION §8 五条红线为了拉北极星**（详见 `11-OPERATIONS.md §运维规约 价值红线 read-only 副本`）

### 最佳实践

- 每个 Issue 一个专注目标，大 Issue 拆开
- 原子提交，便于回溯与 changelog 生成
- 待人工验证写具体复现步骤 + 账号 + 前置条件
- `/evolve` 反馈使用感受，持续优化工作流

### 升级信号

| 场景 | 建议升级到 |
|---|---|
| `/fix` 发现改动量远超预期 | `/feat` |
| 同类评审必修项反复出现 | 在 agent 检查清单补充 → `/evolve` |
| 某类 Bug 反复出现 | 在 `9-TESTING.md` 补测试约定，补回归用例 |
| ConfigKey 三处同步成本高 | 推动通用式架构（枚举遍历 + UI 通用渲染） |

---

## 8. 与现有文档的关系

| 文档 | 职责 | 本流程文档的关系 |
|---|---|---|
| `CLAUDE.md`（根目录） | 协作风格 + 分支策略 + Commit / Worktree / Hooks / Skills 速查 | **日常 agent 默认入口**；本文件不重复其内容 |
| `1-VISION.md` ~ `13-INFRA-DEPS.md` | 各专题事实来源 | `/deepreview` 6 视角分别引用 |
| `specs/` | 已交付能力快照 | `/spec-doc` 产出目标 |
| `reviews/` | 每个 minor 版本的全局组织 review 归档（v2.4.0 起） | `/release` 阶段沉淀 |

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
  → /commit-pr pr（PR base = v2.4.0）
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
  → PR 合入 v2.4.0
  → /spec-doc 生成 bestblogs-docs/specs/newsletter-template.md
```

### 场景 C：日终关闭

```
用户：/release
Claude：
  → 当前 v2.4.0，合入 N 个 PR
  → /deepreview 全量
  → /verify all 通过
  → 生成 bestblogs-app/content/changelog/v2.4.0.md（双语）
  → 聚合 N 个 Issue 的「待人工验证」
  → gh pr create --base main
  → 输出：release PR URL + 人工验证清单
用户：人工验证通过 → GitHub 界面 Merge → 生产部署
```

---

## 变更历史

| 日期 | 版本 | 说明 |
|---|---|---|
| 2026-04-17 | v1.0 | 初始版本，对应 Issue #225 工作流重组 |
| 2026-05-19 | v1.1 | 薄壳化（Issue #840）：去与 `CLAUDE.md` 重复内容，承接 PRODUCT v2 北极星切换与两端 4+4 入口 scope 对照；示例版本号统一为 v2.4.0 |
| 2026-05-25 | v1.2 | GitHub Project 状态自动化：新增状态生命周期章节、/worktree → In progress、/commit-pr pr → In review、release post-merge 批量归档 → Done |
