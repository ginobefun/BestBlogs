# @bestblogs/cli

BestBlogs 命令行界面 — agent-friendly 阅读工作流（intake → discover → read → capture）。

构建在 BestBlogs OpenAPI v2 之上，所有命令都有 `--json` 模式，便于被智能体（Claude Code、Cursor、OpenClaw 等）或 shell 管道消费。

## 安装

```bash
npm install -g @bestblogs/cli
# 或免安装试用
npx @bestblogs/cli --help
```

装好后同时提供两个命令别名：

- `bestblogs ...`（主命令）
- `bbcli ...`（短别名，与 [GitHub Issue #108](https://github.com/ginobefun/bestblogs-monorepo/issues/108) 提案的命名对齐）

## 三分钟上手

```bash
# 1. 登录（首次使用）— 打开 https://bestblogs.dev/settings/api-keys 复制 API Key 粘贴回来
bestblogs auth login

# 2. 冷启动设置（交互式，挑 3-8 个兴趣主题）
bestblogs intake setup

# 3. 看今天值得读什么
bestblogs discover today --limit 20

# 4. 挑一条深读（会自动回传已读行为）
bestblogs read deep <resourceId>

# 5. 收藏、加笔记
bestblogs capture bookmark add <resourceId> --note "值得反复读"
bestblogs capture highlight add -r <resourceId> -t "精彩段落原文" -n "我的思考"

# 6. 回看
bestblogs capture notes list
bestblogs capture history list
```

## 命令速查

| 命令 | 说明 |
|---|---|
| `bestblogs auth login / status / logout` | API Key 登录与切换环境 |
| `bestblogs intake setup` | 引导完成 onboarding（兴趣标签 → 推荐源 → 完成） |
| `bestblogs intake show` | 查看当前画像 |
| `bestblogs discover today` | 今天最值得读的内容（Pro → my_brief, 非 Pro → public_brief，带回退链） |
| `bestblogs discover for-you` | 个性化推荐流（Pro only） |
| `bestblogs discover following` | 关注源内容流 |
| `bestblogs discover search "<q>"` | 关键词搜索 |
| `bestblogs discover trending [--period week]` | 热趋内容 |
| `bestblogs discover newsletters [id]` | 浏览 / 查看周刊 |
| `bestblogs read deep <id>` | 本地深读：meta + markdown + 自动回传 read |
| `bestblogs capture bookmark add/list/update/remove` | 收藏 CRUD（add 幂等） |
| `bestblogs capture highlight add/update/remove` | 划线 / 笔记 CRUD |
| `bestblogs capture highlights` | 列出划线（`entryType=highlight`） |
| `bestblogs capture notes` | 列出笔记（`entryType=note`，note 非空） |
| `bestblogs capture history list/remove/clear` | 阅读历史 |
| `bestblogs explain profile` | 画像摘要 |
| `bestblogs explain sources --days 7` | 近 7 天关注源对早报的贡献 |
| `bestblogs explain score <id>` | 资源评分摘要 |

## 解释字段（Agent Native）

`discover today / for-you / following`、`briefs/today / briefs/public/today` 返回的每条候选都带 4 个**解释字段**：

| 字段 | 含义 |
|---|---|
| `candidateSource` | `my_brief` / `public_brief` / `for_you` / `following` / `public_brief_fallback` |
| `selectionReason` | 一句话自然语言（≤50 字），如 "匹配兴趣: AI Coding" |
| `fallbackApplied` | 是否走了降级回退路径 |
| `personalized` | 是否经过个性化处理 |

Skills / Agents 据此回答 "这些内容从哪里来、为什么出现在这里"。CLI 的 pretty 模式会以彩色徽标展示来源，JSON 模式原样透传。

## 配置

配置存在 `~/.bestblogs/config.json`（由 [`conf`](https://github.com/sindresorhus/conf) 管理），包含：

```json
{
  "baseUrl": "https://api.bestblogs.dev",
  "apiKey": "bbk_xxx",
  "outputFormat": "pretty"
}
```

环境变量覆盖优先级更高：

- `BESTBLOGS_API_KEY`
- `BESTBLOGS_BASE_URL`
- `BESTBLOGS_OUTPUT=pretty|json`

## 错误契约

所有命令在失败时：

- **pretty**：stderr 输出 `✗ CODE [httpStatus] 中文提示`
- **`--json`**：stderr 输出 `{success:false,error:{code,httpStatus,message,retryable}}`
- **退出码**：`1` 通用、`2` 认证、`3` 权限、`4` not-found、`5` 限流、`6` 5xx

## 管道与自动化

所有命令支持 `--json`，可以直接喂给脚本：

```bash
# 拿到今天的候选 id 列表
bestblogs discover today --json | jq -r '.data.candidates[].resourceId'

# 批量收藏
bestblogs discover today --limit 5 --json \
  | jq -r '.data.candidates[].resourceId' \
  | xargs -I {} bestblogs capture bookmark add {}

# 深读并把 Markdown 喂给 llm（示例用 anthropic CLI）
bestblogs read deep <id> --markdown-only | anthropic "summarize in 5 bullets"
```

## 给 Agent 用

参考 `bestblogs-skills/` 下的 `SKILL.md` 文件。每个 skill 通过 shell out 到本 CLI 实现原语封装，Agent 直接消费 CLI 的 `--json` 输出即可。

## 开发

```bash
npm install
npm run dev -- discover today --help    # ts-node dev 模式
npm run build                            # 产 dist/bestblogs.js
npm run typecheck                        # tsc --noEmit
```

## License

MIT
