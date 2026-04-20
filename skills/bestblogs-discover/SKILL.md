---
name: bestblogs-discover
description: Use this skill when the user wants to find today's most worth-reading content from BestBlogs, browse personalized feeds, check trending items, search specific topics, or explore curated newsletters. Triggers include "今天有什么值得读的 / BestBlogs 推荐 / 本周 BestBlogs 热趋 / 搜一下 AI coding / 看关注源的最新 / 最近有什么好周刊", "what's worth reading today", "bestblogs trending this week", "bestblogs discover", "search BestBlogs". Invokes the `bestblogs` CLI.
---

# bestblogs-discover — 发现（今日 / 个性化 / 关注流 / 热趋 / 搜索 / 周刊）

## 何时使用

- 用户想快速了解 "今天最值得读的内容"（最重要触发）。
- 用户想找某个主题、作者、内容类型的 BestBlogs 精选。
- 用户想浏览周刊。

## 原语

| 原语 | CLI | 说明 |
|---|---|---|
| `bestblogs.discover.today` | `bestblogs discover today --json` | 带多源回退链的今日候选 |
| `bestblogs.discover.for_you` | `bestblogs discover for-you --json` | 个性化推荐（需 Pro） |
| `bestblogs.discover.following` | `bestblogs discover following --json` | 关注源流 |
| `bestblogs.discover.trending` | `bestblogs discover trending --period week --json` | 热趋内容（today / week / month） |
| `bestblogs.discover.search` | `bestblogs discover search "<q>" --json` | 关键词搜索 |
| `bestblogs.discover.newsletter.list` | `bestblogs discover newsletters --json` | 周刊列表 |
| `bestblogs.discover.newsletter.get` | `bestblogs discover newsletter <id> --json` | 单期周刊 |

## 前置检查

```bash
bestblogs auth status --json
```

多数命令需要 API Key；`search`、`newsletters` 在某些配置下也可匿名消费。若未登录，提示先 `bestblogs auth login`。

## 核心动作：discover today

```bash
bestblogs discover today --limit 20 --json
```

返回：

```json
{
  "success": true,
  "data": {
    "candidates": [
      {
        "resourceId": "RAW_xxx",
        "title": "...",
        "url": "...",
        "resourceType": "ARTICLE",
        "language": "en_US",
        "score": 92,
        "sourceName": "...",
        "candidateSource": "my_brief",
        "selectionReason": "今日个性化精选",
        "fallbackApplied": false,
        "personalized": true
      }
    ],
    "primarySource": "my_brief",
    "fallbackApplied": false,
    "details": { "triedSources": ["my_brief", "for_you"] }
  }
}
```

**candidateSource 枚举**：
- `my_brief` — Pro 个性化早报
- `public_brief` — 公共精选（非 Pro 或未生成个性化时）
- `public_brief_fallback` — 公共早报降级兜底
- `for_you` — For You 推荐
- `following` — 关注源

展示给用户时应按 candidateSource 打徽标，并显式标注降级状态（`fallbackApplied=true` 时）。

## 其它动作

```bash
# 个性化流
bestblogs discover for-you --limit 15 --lang en_US --json

# 热趋（今日 / 本周 / 本月）
bestblogs discover trending --period week --limit 20 --json
bestblogs discover trending --period today --lang zh_CN --json

# 搜索
bestblogs discover search "AI coding" --type ARTICLE --sort score --limit 10 --json

# 周刊
bestblogs discover newsletters --limit 10 --json
bestblogs discover newsletter <id> --json
```

## 错误处理

- `403 / FORBIDDEN` on `for-you` → 用户非 Pro，降级到 `following` 或 `today`
- `404 / NOT_FOUND` on brief 相关 → 当日早报尚未生成，尝试 `public_brief` 或 `following`
- `429 / RATE_LIMITED` → CLI 已退避一次；仍失败时退出并告诉用户稍后重试
- 空 `candidates` → 向用户报告 "今日无推荐"，建议做 `bestblogs intake setup` 建立/修正画像

## 组合建议

- 拿到候选后，对感兴趣的条目链式调用 `bestblogs-read` skill 做深读
- 高价值条目链式调用 `bestblogs-capture` skill 收藏/加笔记
- 想知道 "为什么推这条"？把 `candidateSource` / `selectionReason` 直接展示；更深层的解释（如贡献来源的评分）用 `bestblogs-explain` skill
