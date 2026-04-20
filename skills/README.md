# bestblogs-skills

一组给智能体（Claude Code、Cursor 等支持 SKILL.md 约定的客户端）使用的 BestBlogs 技能包。

每个 skill 都是一份 `SKILL.md` 文件，描述触发词、原语清单、动作示例与错误处理。内部实现统一 shell out 到 `bestblogs` CLI（见 `../bestblogs-cli/`）并消费其 `--json` 输出。

## 包含的 Skills

| Skill | 触发场景 | 原语数 |
|---|---|---|
| [`bestblogs-profile`](skills/bestblogs-profile/SKILL.md) | 冷启动 / 查看画像 | 2 |
| [`bestblogs-discover`](skills/bestblogs-discover/SKILL.md) | 今日 / 个性化 / 关注流 / 热趋 / 搜索 / 周刊 | 7 |
| [`bestblogs-read`](skills/bestblogs-read/SKILL.md) | 深读一条内容（meta + markdown + read 回传） | 1（编排级） |
| [`bestblogs-capture`](skills/bestblogs-capture/SKILL.md) | 收藏 / 划线 / 笔记 / 历史 | 12 |
| [`bestblogs-explain`](skills/bestblogs-explain/SKILL.md) | 画像 / 来源贡献 / 评分 | 3 |

合计 **25 个稳定原语**，覆盖 v2.0.7 首发范围。

## 前置

先全局安装 CLI：

```bash
npm install -g @bestblogs/cli
bestblogs auth login
```

## 安装到 Claude Code

```bash
./install.sh
```

脚本会把 `skills/*` 软链到 `~/.claude/skills/bestblogs/*`，Claude Code 重启后即可按 description 主动触发。

也可以手动 clone + 指定 skill dir：

```bash
git clone https://github.com/ginobefun/bestblogs-monorepo.git
ln -s $(pwd)/bestblogs-monorepo/bestblogs-skills/skills/* ~/.claude/skills/
```

## 给其他 agent 生态用

skills 不依赖 MCP。任何能 shell out 到 CLI 的 agent（OpenClaw、Cursor 的 custom tool、自研 agent）都可直接用：

```
TOOL_SCHEMA:
  name: bestblogs_discover_today
  invocation: bestblogs discover today --limit 20 --json
  output_schema: see ../bestblogs-cli/src/api/types.ts CandidateExplainSchema
```

## 约定

所有 SKILL.md 遵循同一结构：

1. Frontmatter：`name` + `description`（包含丰富触发关键词）
2. 何时使用
3. 原语清单（与 CLI 一一对应）
4. 前置检查
5. 动作示例（所有示例都带 `--json`）
6. 错误处理
7. 组合建议（指向其他 skill）

## 解释字段（跨 skill 共享契约）

`discover today / for-you / following` 以及 brief 类返回的每条候选都带：

| 字段 | 含义 |
|---|---|
| `candidateSource` | `my_brief` / `public_brief` / `for_you` / `following` / `public_brief_fallback` |
| `selectionReason` | 一句话自然语言，≤50 字 |
| `fallbackApplied` | 是否降级回退 |
| `personalized` | 是否个性化 |

Agent 展示候选时应尊重这些字段——既是 UX 的透明度，也是 Skill 层与后端 v2.0.7 的稳定契约。

## Release

tag 形式 `skills-vX.Y.Z`。版本与 CLI major 对齐但可独立发布。

## License

MIT
