---
name: bestblogs-trending
description: Use this skill when the user asks about trending, popular, or hot content on BestBlogs. Triggers include "BestBlogs 本周热门 / 本周流行什么 / 最近热门文章 / 今日热门 / 本月 BestBlogs 精选", "BestBlogs trending", "what's trending on BestBlogs", "popular this week", "hot articles this month", "trending tech content". Invokes the `bestblogs` CLI.
---

# bestblogs-trending — 热门精选

## 何时使用

- 用户想了解某时段（今日 / 本周 / 本月）最受关注的内容。
- 用户没有具体主题，只想发现高质量热门内容。
- 用户指定语言过滤（中文 / 英文内容）。

## 原语

| 原语 | CLI | 说明 |
|---|---|---|
| `bestblogs.trending.week` | `bestblogs trending --period week --json` | 本周热门（默认） |
| `bestblogs.trending.today` | `bestblogs trending --period today --json` | 今日热门 |
| `bestblogs.trending.month` | `bestblogs trending --period month --json` | 本月热门 |
| `bestblogs.trending.week.en` | `bestblogs trending --period week --lang en_US --json` | 英文热门 |
| `bestblogs.trending.week.zh` | `bestblogs trending --period week --lang zh_CN --json` | 中文热门 |

## 核心动作：本周热门

```bash
bestblogs trending --period week --limit 20 --json
```

返回：

```json
{
  "success": true,
  "data": {
    "period": "week",
    "candidates": [
      {
        "resourceId": "RAW_xxx",
        "title": "Vibe Coding 实战指南",
        "url": "https://...",
        "resourceType": "ARTICLE",
        "language": "zh_CN",
        "score": 95,
        "sourceName": "InfoQ",
        "summary": "…"
      }
    ]
  }
}
```

**展示建议**：
- 按 `score` 降序排列（CLI 已排好），高分内容排前。
- `sourceName` 帮助用户判断来源可信度。
- 有 `language` 时用语言标记区分中英文内容。

## 时段选择建议

| 场景 | 推荐时段 |
|---|---|
| 用户问"今天有什么热" | `today` |
| 用户问"最近/这周" | `week`（默认） |
| 用户想做月度回顾 | `month` |

## 语言过滤

```bash
# 只看英文内容
bestblogs trending --lang en_US --json

# 只看中文内容
bestblogs trending --lang zh_CN --json
```

## 错误处理

- `429 / RATE_LIMITED` → 稍后重试。
- 空列表 → 返回 "暂无热门内容"，提示换个时段或取消语言过滤。

## 组合建议

- 看到感兴趣条目，链式调用 `bestblogs-read` skill 深读
- 想从主题角度探索？用 `bestblogs-topic` skill 查看 Topic 详情（主题维度更聚焦）
- 配合 `bestblogs-brief` 使用：trending 给宏观热度，brief 给今日精选
