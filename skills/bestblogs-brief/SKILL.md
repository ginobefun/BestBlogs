---
name: bestblogs-brief
description: Use this skill when the user asks about today's daily brief, morning digest, or BestBlogs highlights. Triggers include "今天早报 / 今日早报 / BestBlogs 早报 / 今天有啥好文 / 今日精选 / 给我看早报", "today's brief", "today's digest", "BestBlogs morning brief", "today's highlights on BestBlogs", "what's in today's brief". Invokes the `bestblogs` CLI.
---

# bestblogs-brief — 每日早报

## 何时使用

- 用户询问当日 BestBlogs 早报内容。
- 用户想了解今天有哪些值得读的精选文章。
- 用户需要最新一期公开早报摘要。

## 原语

| 原语 | CLI | 说明 |
|---|---|---|
| `bestblogs.brief.today` | `bestblogs brief today --json` | 今日早报（Pro = 个性化，默认 = 公共版）|
| `bestblogs.brief.today.en` | `bestblogs brief today --locale en --json` | 英文版今日早报 |
| `bestblogs.brief.latest` | `bestblogs brief latest --json` | 最新公开早报 |

## 核心动作：今日早报

```bash
bestblogs brief today --json
```

返回：

```json
{
  "success": true,
  "data": {
    "brief": {
      "briefDate": "2026-05-01",
      "podcastTitle": "AI 工具爆发，开发效率革命……",
      "editorIntro": "今天早报重点关注 AI 工具链……",
      "contentItems": [
        {
          "resourceId": "RAW_xxx",
          "title": "Claude 4 Benchmark 分析",
          "sourceName": "Anthropic Blog",
          "featured": true,
          "matchReason": "AI 基础模型精选",
          "contentType": "ARTICLE"
        }
      ]
    }
  }
}
```

**展示建议**：
- 用 `podcastTitle` 作为早报主题句（若有）。
- `editorIntro` 是编辑导语，直接呈现给用户。
- `contentItems` 按 `featured=true` 优先展示；`matchReason` 说明推荐理由。
- Pro 用户获得个性化版（个性化 contentItems + 个性化 matchReason）；否则展示公共版。

## 英文早报

```bash
bestblogs brief today --locale en --json
```

## 获取最新早报（日期不确定时兜底）

```bash
bestblogs brief latest --json
```

## 错误处理

- `404 / NOT_FOUND` → 当日早报尚未生成（通常早上 7:00 前），改用 `latest` 命令。
- `401 / UNAUTHORIZED` → API Key 未配置，降级为 `latest`（公共版无需鉴权）。
- `429 / RATE_LIMITED` → 稍后重试；日频率通常不触发，除非 Agent 高频循环。

## 组合建议

- 找到感兴趣条目后，链式调用 `bestblogs-read` skill 做深读：`bestblogs read <resourceId> --json`
- 想保存摘要/笔记？链式调用 `bestblogs-capture` skill
- 想知道 "早报里为什么有这篇"？用 `bestblogs-explain` skill 解释推荐逻辑
- 想要周维度视角？用 `bestblogs-trending` skill（`--period week`）
