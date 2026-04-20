---
name: bestblogs-explain
description: Use this skill when the user wants to understand the "why" behind BestBlogs recommendations — view their interest profile summary, see which followed sources are driving their daily brief, or inspect the score breakdown of a specific resource. Triggers include "BestBlogs 为什么推这条 / 看我的画像 / 我关注的源哪些最有价值 / 这篇文章评分多少", "why did BestBlogs recommend this", "which of my followed sources contribute most", "show score for this resource". Invokes the `bestblogs` CLI.
---

# bestblogs-explain — 解释层（画像 / 来源贡献 / 评分）

## 何时使用

- 用户问 "BestBlogs 为什么推这条？"
- 用户想看自己的**兴趣画像摘要**。
- 用户想知道**哪些订阅源对我的早报贡献最大**，作为决定是否继续关注的依据。
- 用户想知道某条资源的**评分**。

## 原语

| 原语 | CLI | 说明 |
|---|---|---|
| `bestblogs.interest_profile.get` | `bestblogs explain profile --json` | 画像摘要 |
| `bestblogs.source.contribution.list` | `bestblogs explain sources --days 7 --json` | 近 N 天关注源对早报的贡献 |
| `bestblogs.resource.score.get` | `bestblogs explain score <id> --json` | 资源评分 |

## 相关字段（发现类响应内联）

**注意**：发现类接口的每条候选已内联 `candidateSource` / `selectionReason` / `fallbackApplied` / `personalized`。想解释 "为什么推这条"，首先看这些字段——不一定要单独调解释接口。只在需要更深入（画像维度 / 源级别 / 评分维度）时才走 explain 原语。

## 动作

### 画像摘要

```bash
bestblogs explain profile --json
```

关心字段：
- `onboardingCompleted`
- `languagePreference`
- `driftDetected` — 漂移检测（true 时建议提醒用户重设兴趣）
- `explicitInterests[]` — 用户主动选择的标签
- `implicitInterests[]` — 行为推断
- `recentActiveTopics[]` — 近 7 天活跃主题

### 来源贡献

```bash
bestblogs explain sources --days 7 --json
```

返回按 `count` 倒序的来源列表：

```json
{
  "success": true,
  "data": {
    "days": 7,
    "contributions": [
      { "sourceId": "SRC_xxx", "sourceName": "阮一峰的网络日志", "count": 4 },
      ...
    ]
  }
}
```

### 资源评分

```bash
bestblogs explain score RAW_xxx --json
```

返回包括 `score / resourceType / language / qualified / sourceName`。

## 错误处理

- `401` → 未登录（`profile` 和 `sources` 需要登录；`score` 对公共资源可匿名）
- 空列表（贡献为 0）→ 告知用户 "近 N 天没有被推荐的来源"，建议调整 `--days` 或关注更多高质量源

## 组合建议

- 用户抱怨 "最近推荐很一般" → 依次调 `profile`（看 drift）+ `sources`（看哪些源在拖后腿）+ 建议用户去 `bestblogs-subscription` 取关贡献少的源（本期无此 skill，提示用户到网站操作）
- Agent 给用户输出候选时：把 `candidateSource + selectionReason` 显示在每条旁边；当用户追问 "为什么这条分高"时才调 `explain score`
