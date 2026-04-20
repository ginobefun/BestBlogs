# CLAUDE.md

本仓库（`ginobefun/BestBlogs`）是 `ginobefun/bestblogs-monorepo` 的**对外内容镜像**。

## 重要说明

- 所有内容由 monorepo 根目录的 `scripts/sync-to-public.sh` 单向同步而来，**请勿直接在本仓库编辑同步产物**。
- 如需修改文档、API 文档、CLI 源码或 Skills，请到 monorepo 对应目录修改，然后重新运行同步脚本。

## 本仓库内容来源

| 目录 | 来源（monorepo） | 说明 |
|---|---|---|
| `README.md` | `bestblogs-docs/PUBLIC-README.md` | 项目主入口（普通用户 → 开发者 → Agent） |
| `docs/` | `bestblogs-docs/1~12-*.md` | 12 份核心文档（产品/架构/设计/运维等） |
| `openapi/` | `bestblogs-docs/openapi/` | OpenAPI v2 文档（5 模块） |
| `flows/` | `bestblogs-docs/flows/` | Dify Workflow DSL + 实践文档 |
| `cli/` | `bestblogs-cli/` | @bestblogs/cli TypeScript 源码与文档 |
| `skills/` | `bestblogs-skills/` | BestBlogs Agent Skills（25 个原语） |
| `changelog/` | `bestblogs-app/content/changelog/v2.*.md` | 双语 Changelog（v2.0.x 起） |

## 手动维护的内容（不通过同步脚本）

- `BestBlogs_RSS_*.opml` / `BestBlogs_RSS_Doc.md` — RSS 订阅源列表
- `images/` — README 截图资产
- `archive/` — 历史归档，只读

## 同步操作

```bash
# 在 monorepo 根目录运行
./scripts/sync-to-public.sh [/path/to/BestBlogs]

# 仅预览不写入
./scripts/sync-to-public.sh --dry-run

# 仅同步特定阶段
./scripts/sync-to-public.sh --only=docs,openapi,cli
```

每次 BestBlogs 版本发布后，通过 `./scripts/sync-to-public.sh` 同步，然后在本仓库提交并 push。
