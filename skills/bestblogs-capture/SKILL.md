---
name: bestblogs-capture
description: Use this skill when the user wants to save, annotate, or review their BestBlogs reading — create/list/update/remove bookmarks, add highlights with optional notes, view highlight-only vs. note-only lists, and manage reading history. Triggers include "收藏这篇 / 给这段划线 / 加个笔记 / 看我的收藏 / 我的笔记 / 我的阅读历史 / 删掉这条历史", "bookmark this on BestBlogs", "highlight this quote", "show my notes", "clear my BestBlogs reading history". Invokes the `bestblogs` CLI.
---

# bestblogs-capture — 收藏 / 划线 / 笔记 / 历史

## 何时使用

- 用户想收藏一篇内容（可选附备注 / tag / folder）。
- 用户想对某段原文做划线；若传了 `note`，就等价于 "笔记"。
- 用户想回看自己的划线列表、笔记列表（两者共享底层实体 `UserHighlightEntity`，靠 `entryType` 区分）。
- 用户想管理阅读历史（查看 / 删除单条 / 清空）。

## 数据模型要点（务必理解）

**`note` 和 `highlight` 同表不同 entryType**：
- `entryType=highlight`：`note` 为空
- `entryType=note`：`note` 非空

**不是两个独立接口。** 走 `GET /me/highlights?entryType=highlight` 或 `?entryType=note` 做服务端过滤（v2.0.7 起支持）。

## 原语

| 原语 | CLI | 说明 |
|---|---|---|
| `bestblogs.bookmark.create` | `bestblogs capture bookmark add <id> --note ...` | 幂等 |
| `bestblogs.bookmark.list` | `bestblogs capture bookmark list --json` | 分页 |
| `bestblogs.bookmark.update` | `bestblogs capture bookmark update <id> --note ...` | |
| `bestblogs.bookmark.delete` | `bestblogs capture bookmark remove <id>` | |
| `bestblogs.highlight.create` | `bestblogs capture highlight add -r <id> -t "..." -n "..."` | 有 `-n` 即为 note |
| `bestblogs.highlight.list` | `bestblogs capture highlights --json` | `entryType=highlight` |
| `bestblogs.note.list` | `bestblogs capture notes --json` | `entryType=note` |
| `bestblogs.highlight.update` | `bestblogs capture highlight update <highlightId> -n ...` | |
| `bestblogs.highlight.delete` | `bestblogs capture highlight remove <highlightId>` | |
| `bestblogs.history.list` | `bestblogs capture history list --json` | 分页 |
| `bestblogs.history.delete` | `bestblogs capture history remove <resourceId>` | |
| `bestblogs.history.clear` | `bestblogs capture history clear --yes` | 危险，需确认 |

## 动作示例

### 收藏（幂等）

```bash
bestblogs capture bookmark add RAW_xxx --note "值得反复读" --json
```

已收藏的资源重复 add 不会报错，返回已有记录。

### 划线 + 笔记

```bash
# 纯划线（entryType=highlight）
bestblogs capture highlight add -r RAW_xxx -t "精彩段落原文" --json

# 划线 + 笔记（entryType=note）
bestblogs capture highlight add -r RAW_xxx -t "精彩段落原文" -n "我的思考" --color "#FFEB3B" --json
```

### 分开查看

```bash
bestblogs capture highlights --resource RAW_xxx --json   # 只看该资源的划线
bestblogs capture notes --limit 20 --json                # 全部笔记（note 非空）
```

### 历史

```bash
bestblogs capture history list --limit 30 --json
bestblogs capture history remove RAW_xxx --json          # 删一条
bestblogs capture history clear --yes --json             # 清空（危险）
```

## 错误处理

- `409 / CONFLICT` on highlight create 重复 → 告知用户该段已划线
- `404 / NOT_FOUND` on remove/delete → 幂等对待，告诉用户 "已不存在"，不视为流程失败
- `401` → 未登录，提示 `bestblogs auth login`

## 组合建议

深读完一条内容（`bestblogs-read`）后：
1. 如果整体有价值 → `bookmark.create`
2. 有具体金句 → `highlight.create`（可选 note）
3. 隔天回顾 → `note.list` / `bookmark.list`
4. 不想再看到已读内容 → `history.delete`
