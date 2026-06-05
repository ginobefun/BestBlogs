---
name: bestblogs-topic
description: Use this skill when the user asks about a specific topic, subject area, or wants to explore curated topic pages on BestBlogs. Triggers include "BestBlogs 有什么主题 / 查一下 AI 编程主题 / 给我看 Claude 主题页 / 大模型相关主题", "BestBlogs topic list", "show me topics about AI", "what topics does BestBlogs have", "topic details for vibe-coding", "browse topic pages". Invokes the `bestblogs` CLI.
---

# bestblogs-topic — 主题探索

## 何时使用

- 用户想了解 BestBlogs 有哪些主题专页。
- 用户想深入某个特定主题（如 "AI 编程"、"Vibe Coding"）。
- 用户想按类型筛选主题（事件型 / 领域型 / 人物组织型 / 对比型）。

## 原语

| 原语 | CLI | 说明 |
|---|---|---|
| `bestblogs.topic.list` | `bestblogs topics list --json` | 浏览全部主题（默认中文） |
| `bestblogs.topic.list.en` | `bestblogs topics list --lang en --json` | 英文主题列表 |
| `bestblogs.topic.list.filter` | `bestblogs topics list --type DOMAIN --json` | 按类型筛选主题 |
| `bestblogs.topic.get` | `bestblogs topics get <slug> --json` | 查看主题详情 |
| `bestblogs.topic.get.en` | `bestblogs topics get <slug> --lang en --json` | 英文版主题详情 |

## 核心动作：浏览主题列表

```bash
bestblogs topics list --lang zh --json
```

返回：

```json
{
  "success": true,
  "data": {
    "topics": [
      {
        "slug": "vibe-coding",
        "type": "DOMAIN",
        "title": "Vibe Coding",
        "summary": "AI 辅助编程的全新范式……",
        "tagCodes": ["AI_CODING", "LLM"],
        "publishedAt": "2026-04-20T00:00:00Z",
        "pinnedOrder": 1
      }
    ],
    "totalCount": 12
  }
}
```

**展示建议**：
- `pinnedOrder` 非 null → 置顶主题，优先展示（数字越小越靠前）。
- `type` 枚举含义：
  - `EVENT` — 事件型（某次具体事件的深度解读）
  - `DOMAIN` — 领域型（某技术/方向的系统梳理）
  - `PERSON_ORG` — 人物/组织型（人物或公司的全面解读）
  - `COMPARISON` — 对比型（多个选项/方案的对比分析）
- `tagCodes` 帮助用户了解主题覆盖的技术领域。

## 查看主题详情

```bash
bestblogs topics get vibe-coding --lang zh --json
```

返回的 `topic` 对象包含：
- `title` / `summary` / `type` / `language`
- `hasZhVersion` / `hasEnVersion` — 是否有双语版本
- `eventContent` / `domainContent` / `personOrgContent` / `comparisonContent` — 对应类型的详细内容体（仅对应类型非 null）
- `references` — 脚注引用列表（含站内资源标题）
- `furtherReadingResources` — 延伸阅读资源快照（resourceId → resource 元信息）

```bash
# 查看英文版
bestblogs topics get vibe-coding --lang en --json
```

## 主题类型过滤

```bash
# 只看领域型主题
bestblogs topics list --type DOMAIN --json

# 只看事件型主题（英文）
bestblogs topics list --type EVENT --lang en --json
```

## 错误处理

- `404 / NOT_FOUND` on `topics get <slug>` → 主题不存在或未发布；建议改用 `topics list` 查看可用 slug。
- `404` 且有 `language` 参数 → 该语言版本尚未发布；尝试另一语言（`hasZhVersion` / `hasEnVersion` 字段预告可用版本）。
- 空列表 → 该类型/语言暂无已发布主题。

## 组合建议

- 发现感兴趣的 topic 后，从 `furtherReadingResources` 中挑选 resourceId，链式调用 `bestblogs-read` skill 深读
- `bestblogs-trending` 给热门横切面，`bestblogs-topic` 给纵深主题视角 — 配合使用
- `references` 中包含站内资源引用，可从中选取高相关内容继续探索
