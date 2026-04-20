---
name: bestblogs-read
description: Use this skill when the user wants to deep-read a specific BestBlogs resource (article / podcast / video / tweet) — fetch its metadata + markdown so a local LLM or reader can consume it, and automatically report the read behavior back to BestBlogs. Triggers include "深度阅读这篇 / 拉这篇内容的 markdown / bestblogs read / 给我看看 RAW_xxx 的正文", "deep read this BestBlogs article", "pull markdown for resource RAW_...". Invokes the `bestblogs` CLI.
---

# bestblogs-read — 资源深度阅读（Local）

## 何时使用

- 用户想让本地 LLM / reading UI 消费某篇 BestBlogs 内容的正文。
- 用户想看某条资源的元信息 + 全文 Markdown。
- 用户想在阅读的同时把 "read" 行为回传，让 BestBlogs 的个性化飞轮跟得上。

## 原语

| 原语 | CLI | 说明 |
|---|---|---|
| `bestblogs.resource.meta.get` | 内部调用 `/resources/{id}/meta` | meta |
| `bestblogs.resource.markdown.get` | 内部调用 `/resources/{id}/markdown` | 正文 markdown |
| `bestblogs.resource.read.mark` | 内部调用 `POST /resources/{id}/read` | 回传已读 |
| `bestblogs.resource.deep_read.prepare` | `bestblogs read deep <id>` | 一次完成 meta + markdown + mark read |

**只暴露 `deep_read.prepare` 作为主原语**——它是 CLI `bestblogs read deep` 的 wrap，并行拉 meta+markdown，串行 mark read。

## 动作

### 完整深读（默认，包含 mark read）

```bash
bestblogs read deep RAW_xxx --json
```

返回：

```json
{
  "success": true,
  "data": {
    "meta": {
      "resourceId": "RAW_xxx",
      "title": "...",
      "url": "...",
      "resourceType": "ARTICLE",
      "language": "en_US",
      "score": 88,
      "sourceName": "..."
    },
    "markdown": "# Title\n\n...",
    "readMarked": true,
    "markError": null
  }
}
```

### 只要正文 Markdown（喂给本地 LLM）

```bash
bestblogs read deep RAW_xxx --markdown-only
```

输出纯 Markdown（stdout），适合 `| anthropic` / `| llm` 等管道。

### 不回传 read 行为（如只是预览）

```bash
bestblogs read deep RAW_xxx --no-mark-read --json
```

## 错误处理

- `404 / NOT_FOUND` → 资源不存在或已下架；告诉用户
- 资源为私有源（`sourceVisibility=PRIVATE`）且当前用户未订阅 → meta 可能返回 null；提示用户订阅对应源
- mark read 失败时 CLI 返回 `readMarked=false, markError="..."` 而不是整体失败，skill 应保留正文给用户并告知 "已读回传失败，不影响阅读"

## 组合建议

- **常用链**：`bestblogs-discover today` → 从 `candidates[]` 挑一条 → `bestblogs-read deep <id> --json` → 把 `markdown` 喂给本地 LLM 做总结/提问 → `bestblogs-capture` 做笔记保存
- 不要重复回传：默认就会 mark read，除非用户明确只是预览再决定是否读
