# BestBlogs OpenAPI v2 文档

BestBlogs OpenAPI v2 面向开发者开放，提供内容发现、阅读和个人数据管理能力。随 `@bestblogs/cli` v2.0.8 一同发布（2026-04-20，v2.0.8）。

## 快速开始

1. 在 BestBlogs 设置页面获取 API Key，或运行 `bestblogs auth login`
2. 所有请求在 Header 中携带 `X-API-KEY: <your_api_key>`
3. Base URL：`https://api.bestblogs.dev/openapi/v2`

## 文档目录（按功能模块）

| 文件 | 功能 | 说明 |
|------|------|------|
| [01-auth.md](./01-auth.md) | 认证与身份 | 公共规范、响应格式、用户信息、Pro 状态 |
| [02-intake.md](./02-intake.md) | 兴趣画像建立 | 标签库、兴趣设置、冷启动引导（Onboarding） |
| [03-discover.md](./03-discover.md) | 内容发现 | 每日简报、For You / 订阅信息流、热门内容、搜索、期刊 |
| [04-read.md](./04-read.md) | 内容阅读 | 资源元信息、全文内容、Markdown 导出、AI 边注、相似推荐 |
| [05-capture.md](./05-capture.md) | 内容收藏 | 书签、划线笔记、阅读历史 |

## 典型使用路径

```
[认证] → [Intake 建立画像] → [Discover 发现内容] → [Read 深度阅读] → [Capture 留存笔记]
```

对应 CLI 命令：`bestblogs auth` → `bestblogs intake` → `bestblogs discover` → `bestblogs read` → `bestblogs capture`

## 鉴权一览

所有接口均需在请求头携带有效的 `X-API-KEY`。仅部分接口额外要求 Pro 订阅状态。

| 标注 | 说明 |
|------|------|
| 需要 API Key | Header 携带有效 `X-API-KEY` |
| 需要 Pro | API Key + Pro 订阅状态 |

## 反馈与申请

如需申请 API Key 或提交接口问题，请访问 [GitHub Issues](https://github.com/ginobefun/bestblogs-monorepo/issues)。
