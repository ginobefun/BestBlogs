# BestBlogs OpenAPI v2 — 内容阅读（Read）

内容阅读模块提供对单篇内容的深度访问能力：元信息查询、全文内容、Markdown 格式导出、AI 边注（Margin Notes）和相似内容推荐。

**接口权限总览**：

| 接口 | 鉴权要求 |
|------|----------|
| 获取资源元信息 | 需要 API Key |
| 获取资源内容 | 需要 API Key |
| 获取 Markdown 内容 | 需要 API Key |
| 获取相似内容 | 需要 API Key |
| 获取 AI 边注 | 需要 API Key |
| 标记已读 | 需要 API Key |

---

## 接口列表

### 获取资源元信息

- **接口地址**：`GET /openapi/v2/resources/{id}/meta`
- **接口描述**：获取单篇内容的元信息（标题、摘要、来源、评分等），不含正文。适用于列表展示或快速预览场景。
- **鉴权**：需要 API Key
- **路径参数**：

  | 参数 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | id | String | 是 | 资源 ID（如 `RES_abc123`） |

- **请求参数**（Query）：

  | 参数 | 类型 | 必填 | 默认值 | 说明 |
  |------|------|------|--------|------|
  | language | String | 否 | `zh_CN` | 界面语言（影响 AI 摘要展示语言） |

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
    "data": {
      "id": "RES_abc123",
      "title": "DeepSeek-V3 推理优化实践",
      "originalTitle": "DeepSeek-V3 Inference Optimization",
      "oneSentenceSummary": "系统介绍 DeepSeek-V3 在推理阶段的显存优化和并行策略",
      "summary": "本文详细介绍了 DeepSeek-V3 在推理阶段的优化策略，包括显存管理、批处理策略和分布式推理框架...",
      "featuredReason": "深入解析了当前最领先的开源大模型推理优化方案",
      "url": "https://example.com/article",
      "readUrl": "https://bestblogs.dev/read/RES_abc123",
      "cover": "https://cdn.bestblogs.dev/cover/RES_abc123.jpg",
      "sourceId": "SOURCE_e24314",
      "sourceName": "机器之心",
      "sourceImage": "https://cdn.bestblogs.dev/source/jiqizhixin.png",
      "language": "zh_CN",
      "languageDesc": "中文",
      "category": "Artificial_Intelligence",
      "categoryDesc": "人工智能",
      "aiSubCategory": "model_inference",
      "resourceType": "ARTICLE",
      "resourceTypeDesc": "文章",
      "score": 92,
      "readCount": 1234,
      "wordCount": 3500,
      "readTime": 8,
      "authors": ["张三"],
      "tags": ["大模型", "推理优化", "DeepSeek", "GPU"],
      "mainPoints": [
        {
          "title": "显存优化",
          "content": "通过量化技术将显存占用降低 40%"
        }
      ],
      "keyQuotes": ["推理效率是大模型商业化落地的关键瓶颈"],
      "publishTimeStamp": 1745020800000,
      "publishDateStr": "2026-04-19",
      "publishDateTimeStr": "2026-04-19 10:00:00",
      "qualified": true,
      "priority": "HIGH",
      "sourceVisibility": "SYSTEM"
    }
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | id | String | 资源唯一 ID |
  | title | String | 展示标题（AI 优化后） |
  | originalTitle | String | 原始标题 |
  | oneSentenceSummary | String | 一句话摘要（≤50 字，AI 生成） |
  | summary | String | 详细摘要（AI 生成，支持 Markdown） |
  | featuredReason | String | 精选推荐理由（AI 生成） |
  | url | String | 原文链接 |
  | readUrl | String | BestBlogs 站内阅读链接 |
  | cover | String | 封面图 URL |
  | sourceId | String | 来源 ID |
  | sourceName | String | 来源名称 |
  | sourceImage | String | 来源图标 URL |
  | language | String | 内容语言：`zh_CN` / `en_US` |
  | category | String | 主分类编码（参见公共枚举） |
  | aiSubCategory | String | AI 推断的细分类目 |
  | resourceType | String | 内容类型：`ARTICLE` / `PODCAST` / `VIDEO` / `TWEET` |
  | score | Integer | AI 质量评分（0~100） |
  | readCount | Integer | 阅读次数 |
  | wordCount | Integer | 字数 |
  | readTime | Integer | 预计阅读时长（分钟） |
  | mediaDuration | Long | 音视频时长（秒），仅 PODCAST / VIDEO 有值 |
  | authors | Array&lt;String&gt; | 作者列表 |
  | tags | Array&lt;String&gt; | AI 生成的主题标签 |
  | mainPoints | Array | 内容要点列表，每项含 `title`（String）和 `content`（String） |
  | keyQuotes | Array&lt;String&gt; | 关键引用语录 |
  | publishTimeStamp | Long | 发布时间戳（毫秒） |
  | publishDateStr | String | 发布日期（YYYY-MM-DD） |
  | qualified | Boolean | 是否通过 AI 质量过滤（`true` 表示精选内容） |
  | priority | String | 来源优先级：`HIGHEST` / `HIGH` / `MEDIUM` / `LOW` / `LOWEST` |
  | sourceVisibility | String | 来源可见性：`SYSTEM`（平台内置）/ `PUBLIC`（用户公开）/ `PRIVATE`（私有） |

---

### 获取资源内容

- **接口地址**：`GET /openapi/v2/resources/{id}/content`
- **接口描述**：获取资源的正文内容（HTML 格式），适用于网页渲染场景
- **鉴权**：需要 API Key
- **路径参数**：同上

- **响应格式**：`data` 为文章内容对象，包含：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | content | String | 原文正文（HTML） |
  | translateContent | String | AI 翻译内容（HTML，原文为英文时提供中文翻译） |

---

### 获取资源 Markdown

- **接口地址**：`GET /openapi/v2/resources/{id}/markdown`
- **接口描述**：获取资源的纯文本 Markdown 格式内容，适用于 CLI、笔记工具集成、LLM 上下文注入等场景
- **鉴权**：需要 API Key
- **路径参数**：同上

- **响应说明**：`data` 为 Markdown 字符串（String 类型，非对象），包含标题、摘要、要点和正文。

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
    "data": "# DeepSeek-V3 推理优化实践\n\n**来源**：机器之心 · 2026-04-19\n\n## 摘要\n\n本文详细介绍了 DeepSeek-V3...\n\n## 要点\n\n- 显存优化：通过量化技术将显存占用降低 40%\n\n## 正文\n\n..."
  }
  ```

---

### 获取相似内容

- **接口地址**：`GET /openapi/v2/resources/{id}/similar`
- **接口描述**：基于语义向量，获取与当前内容主题相近的推荐列表
- **鉴权**：需要 API Key
- **路径参数**：同上
- **请求参数**（Query）：

  | 参数 | 类型 | 必填 | 默认值 | 说明 |
  |------|------|------|--------|------|
  | limit | Integer | 否 | 6 | 返回数量，最大 20 |

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
    "data": [
      {
        "id": "RES_xyz789",
        "title": "LLaMA-3 推理部署指南",
        "summary": "介绍如何在消费级显卡上部署 LLaMA-3 模型...",
        "url": "https://example.com/llama3-deploy",
        "readUrl": "https://bestblogs.dev/read/RES_xyz789",
        "cover": "https://cdn.bestblogs.dev/cover/RES_xyz789.jpg",
        "sourceName": "机器之心",
        "score": 88,
        "publishDateStr": "2026-04-15",
        "readTime": 6
      }
    ]
  }
  ```

- **响应格式**：`data` 为 `ResourceMeta` 精简数组（含 `id`、`title`、`summary`、`url`、`readUrl`、`cover`、`sourceName`、`score`、`publishDateStr`、`readTime`）。

---

### 获取 AI 边注

- **接口地址**：`GET /openapi/v2/resources/{id}/margin-notes`
- **接口描述**：获取 AI 对内容关键段落生成的解释性批注（Margin Notes）。此功能需启用 AI 伴读 Feature Flag。
- **鉴权**：需要 API Key

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
    "data": {
      "notes": [
        {
          "paragraphIndex": 3,
          "originalText": "使用 FP8 量化可将 KV Cache 显存减少约 40%",
          "note": "FP8（8-bit 浮点）量化是一种精度-效率权衡策略，在大多数推理场景下对模型质量影响可忽略不计。"
        }
      ],
      "totalNotes": 5
    }
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | notes | Array | AI 边注列表 |
  | └ paragraphIndex | Integer | 段落索引（从 0 开始） |
  | └ originalText | String | 被注释的原文片段 |
  | └ note | String | AI 生成的解释性注释 |
  | totalNotes | Integer | 边注总数 |

---

### 标记已读

- **接口地址**：`POST /openapi/v2/resources/{id}/read`
- **接口描述**：标记当前内容为已读，更新阅读计数。用于通知平台用户已消费该内容。
- **鉴权**：需要 API Key
- **路径参数**：同上
- **请求体**：无
- **响应**：`data` 为 null，`success` 为 true 即成功。

---

## 使用建议

### CLI / Agent 场景

对于 CLI 和 Agent 消费，推荐使用 `/markdown` 接口代替 `/content`，原因：

1. Markdown 格式对 LLM 更友好，无 HTML 标签干扰
2. 文本体积更小，节省 Token 消耗
3. 包含结构化元信息（标题、摘要、要点）

```bash
# 典型阅读流程
GET /openapi/v2/resources/{id}/meta        # 1. 先获取元信息决定是否值得阅读
GET /openapi/v2/resources/{id}/markdown    # 2. 获取正文（Markdown 格式）
POST /openapi/v2/resources/{id}/read       # 3. 标记已读
```

### 两段式加载（网页场景）

网页场景推荐先加载元信息渲染页面框架，再异步加载正文：

```
GET /resources/{id}/meta   →  渲染标题/摘要/元数据
GET /resources/{id}/content →  异步加载正文（较慢）
```
