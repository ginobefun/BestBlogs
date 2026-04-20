# BestBlogs OpenAPI v2 — 内容发现（Discover）

内容发现模块提供多种方式获取 BestBlogs 精选内容：每日简报、个性化信息流、热门内容、全文搜索和期刊。

**接口权限总览**：

| 接口 | 鉴权要求 |
|------|----------|
| 公开今日简报 | 需要 API Key |
| 最新简报（无日期参数） | 需要 API Key |
| 我的今日简报 | 需要 API Key（Pro） |
| 我的简报历史 | 需要 API Key |
| For You 信息流 | 需要 API Key（Pro） |
| 订阅信息流 | 需要 API Key |
| 热门内容 | 需要 API Key |
| 全文搜索 | 需要 API Key |
| 期刊列表 | 需要 API Key |
| 期刊详情 | 需要 API Key |

---

## 每日简报

### 公开今日简报

- **接口地址**：`GET /openapi/v2/briefs/public/today`
- **接口描述**：获取当日公开版每日简报，内容为平台精选，非个性化。CDN 缓存，实时性延迟约 1 小时。
- **鉴权**：需要 API Key
- **请求参数**（Query）：

  | 参数 | 类型 | 必填 | 默认值 | 说明 |
  |------|------|------|--------|------|
  | locale | String | 否 | `zh` | 内容语言：`zh`（中文）/ `en`（英文） |

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
    "data": {
      "briefDate": "2026-04-20",
      "status": "PUBLISHED",
      "editorIntro": "今日聚焦：大模型推理效率与开源生态的新进展",
      "keywords": ["大模型", "推理优化", "开源生态"],
      "streakCount": 5,
      "streakUpdated": false,
      "podcastTitle": "BestBlogs 每日早报 · 2026-04-20",
      "audioUrl": "https://cdn.bestblogs.dev/audio/brief_20260420_zh.mp3",
      "durationInSeconds": 720,
      "digestPosterUrl": "https://cdn.bestblogs.dev/poster/brief_20260420.jpg",
      "podcastMarkdown": "# 今日早报\n\n...",
      "contentItems": [
        {
          "resourceId": "RES_abc123",
          "title": "DeepSeek-V3 推理优化实践",
          "summary": "本文详细介绍了 DeepSeek-V3 在推理阶段的优化策略...",
          "url": "https://example.com/article",
          "readUrl": "https://bestblogs.dev/read/RES_abc123",
          "cover": "https://cdn.bestblogs.dev/cover/RES_abc123.jpg",
          "sourceName": "机器之心",
          "language": "zh_CN",
          "category": "Artificial_Intelligence",
          "score": 92,
          "publishDateStr": "2026-04-19",
          "readTime": 8
        }
      ]
    }
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | briefDate | String | 简报日期（YYYY-MM-DD） |
  | status | String | 简报状态：`PUBLISHED`（已发布）/ `DRAFT`（草稿） |
  | editorIntro | String | 编辑导语（"今日主题"价值概括）。为空时前端展示通用文案 |
  | keywords | Array&lt;String&gt; | 今日关键词标签 |
  | streakCount | Integer | 用户连续阅读天数（未登录时为 0） |
  | streakUpdated | Boolean | 今日是否更新了连续阅读记录 |
  | podcastTitle | String | 音频版标题 |
  | audioUrl | String | 音频文件 URL（MP3） |
  | durationInSeconds | Long | 音频总时长（秒） |
  | digestPosterUrl | String | 图文海报 URL |
  | podcastMarkdown | String | 图文版内容（Markdown 格式）。为空时不展示图文入口 |
  | contentItems | Array | 精选内容条目列表 |
  | └ resourceId | String | 内容资源 ID |
  | └ title | String | 标题 |
  | └ summary | String | AI 摘要 |
  | └ url | String | 原文 URL |
  | └ readUrl | String | BestBlogs 站内阅读链接 |
  | └ cover | String | 封面图 URL |
  | └ sourceName | String | 来源名称 |
  | └ language | String | 内容语言：`zh_CN` / `en_US` |
  | └ category | String | 分类编码 |
  | └ score | Integer | AI 质量评分（0~100） |
  | └ publishDateStr | String | 发布日期（YYYY-MM-DD） |
  | └ readTime | Integer | 预计阅读时长（分钟） |

---

### 最新简报

- **接口地址**：`GET /openapi/v2/briefs/latest`
- **接口描述**：获取最新一期公开简报，无需指定日期。适用于 Agent/CLI 获取"今日或最近"简报。
- **鉴权**：需要 API Key
- **请求参数**：无
- **响应格式**：同"公开今日简报"

---

### 我的今日简报（Pro）

- **接口地址**：`GET /openapi/v2/me/briefs/today`
- **接口描述**：获取当日个性化简报。基于用户兴趣画像和关注源定制，内容比公开版更精准。
- **鉴权**：需要 API Key（Pro 用户专属）

> **注意**：非 Pro 用户访问此接口将返回 403 错误。可先用"公开今日简报"接口获取通用内容。

- **响应格式**：同"公开今日简报"，个性化版本的 `contentItems` 会根据用户画像排序。

---

### 我的简报历史

- **接口地址**：`GET /openapi/v2/me/briefs/history`
- **接口描述**：获取当前用户的历史简报列表（按日期降序）
- **鉴权**：需要 API Key
- **请求参数**（Query）：

  | 参数 | 类型 | 必填 | 默认值 | 说明 |
  |------|------|------|--------|------|
  | page | Integer | 否 | 1 | 当前页码 |
  | pageSize | Integer | 否 | 10 | 每页数量，最大 30 |

- **响应格式**：返回简报列表，每项同"公开今日简报"格式（`contentItems` 可能为空数组以节省流量）。

---

## 信息流

### For You 信息流（Pro）

- **接口地址**：`GET /openapi/v2/me/feeds/for-you`
- **接口描述**：基于用户兴趣画像的个性化推荐内容流。结果包含推荐理由和召回来源，便于 Agent/CLI 解释推荐逻辑。
- **鉴权**：需要 API Key（Pro 用户专属）
- **请求参数**（Query）：

  | 参数 | 类型 | 必填 | 默认值 | 说明 |
  |------|------|------|--------|------|
  | page | Integer | 否 | 1 | 当前页码 |
  | pageSize | Integer | 否 | 20 | 每页数量，最大 50 |
  | language | String | 否 | - | 内容语言过滤：`zh_CN` / `en_US` |
  | uiLang | String | 否 | `zh_CN` | 界面语言（影响摘要语言） |
  | category | String | 否 | - | 分类过滤 |
  | timeFilter | String | 否 | - | 时间范围：`today` / `week` / `month` |

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
    "data": {
      "currentPage": 1,
      "pageSize": 20,
      "totalCount": 80,
      "pageCount": 4,
      "dataList": [
        {
          "id": "RES_abc123",
          "title": "DeepSeek-V3 推理优化实践",
          "oneSentenceSummary": "系统介绍了 DeepSeek-V3 在推理阶段的显存优化和并行策略",
          "summary": "本文详细介绍了...",
          "url": "https://example.com/article",
          "readUrl": "https://bestblogs.dev/read/RES_abc123",
          "cover": "https://cdn.bestblogs.dev/cover/RES_abc123.jpg",
          "sourceId": "SOURCE_e24314",
          "sourceName": "机器之心",
          "language": "zh_CN",
          "category": "Artificial_Intelligence",
          "resourceType": "ARTICLE",
          "score": 92,
          "readTime": 8,
          "publishTimeStamp": 1745020800000,
          "publishDateStr": "2026-04-19",
          "candidateSource": "for_you",
          "selectionReason": "匹配兴趣: AI 编程",
          "personalized": true,
          "fallbackApplied": false
        }
      ]
    }
  }
  ```

- **响应字段说明（ResourceMeta）**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | id | String | 资源 ID |
  | title | String | 展示标题（AI 优化后） |
  | originalTitle | String | 原始标题 |
  | oneSentenceSummary | String | 一句话摘要（≤50 字） |
  | summary | String | 详细摘要（AI 生成） |
  | url | String | 原文链接 |
  | readUrl | String | BestBlogs 站内阅读链接 |
  | cover | String | 封面图 URL |
  | sourceId | String | 来源 ID |
  | sourceName | String | 来源名称 |
  | language | String | 内容语言：`zh_CN` / `en_US` |
  | category | String | 分类编码 |
  | resourceType | String | 内容类型：`ARTICLE` / `PODCAST` / `VIDEO` / `TWEET` |
  | score | Integer | AI 质量评分（0~100） |
  | readTime | Integer | 预计阅读时长（分钟） |
  | publishTimeStamp | Long | 发布时间戳（毫秒） |
  | publishDateStr | String | 发布日期（YYYY-MM-DD） |
  | tags | Array&lt;String&gt; | AI 生成的主题标签 |
  | authors | Array&lt;String&gt; | 作者列表 |
  | wordCount | Integer | 字数 |
  | candidateSource | String | 召回来源：`my_brief` / `public_brief` / `for_you` / `following` / `public_brief_fallback` |
  | selectionReason | String | 选择原因（一句话，≤50 字），如"匹配兴趣: AI Coding" |
  | personalized | Boolean | 是否经过个性化处理 |
  | fallbackApplied | Boolean | 是否触发了降级回退 |

---

### 订阅信息流

- **接口地址**：`GET /openapi/v2/me/feeds/subscriptions`
- **接口描述**：获取用户已订阅内容源的最新内容
- **鉴权**：需要 API Key
- **请求参数**（Query）：

  | 参数 | 类型 | 必填 | 默认值 | 说明 |
  |------|------|------|--------|------|
  | page | Integer | 否 | 1 | 当前页码 |
  | pageSize | Integer | 否 | 20 | 每页数量 |
  | language | String | 否 | - | 语言过滤 |
  | uiLang | String | 否 | `zh_CN` | 界面语言 |
  | sourceId | String | 否 | - | 筛选特定来源 |
  | timeFilter | String | 否 | - | 时间范围：`today` / `week` / `month` |

- **响应格式**：同"For You 信息流"，`candidateSource` 为 `following`

---

## 内容搜索

### 全文搜索

- **接口地址**：
  - `GET /openapi/v2/search?q={keyword}&...`
  - `POST /openapi/v2/search`（Body 传参，同 GET 参数名）
  - 别名：`/openapi/v2/resources/search`（同上两种方式）
- **接口描述**：对 BestBlogs 收录的全量内容进行混合检索（语义向量 + BM25 关键词融合），返回按相关度排序的结果。
- **鉴权**：需要 API Key
- **请求参数**（GET Query 或 POST Body）：

  | 参数 | 类型 | 必填 | 默认值 | 说明 |
  |------|------|------|--------|------|
  | q（GET）/ query（POST） | String | 是 | - | 搜索关键词，支持中英文自然语言 |
  | language | String | 否 | - | 语言过滤：`zh_CN` / `en_US` |
  | categories | Array&lt;String&gt; | 否 | - | 分类过滤（可多选） |
  | publishFrom | String | 否 | - | 发布时间起（YYYY-MM-DD） |
  | publishTo | String | 否 | - | 发布时间止（YYYY-MM-DD） |
  | page | Integer | 否 | 1 | 当前页码 |
  | pageSize | Integer | 否 | 10 | 每页数量，最大 50 |

- **请求示例**（GET）：

  ```
  GET /openapi/v2/search?q=大模型推理优化&language=zh_CN&page=1&pageSize=10
  ```

- **请求示例**（POST）：

  ```json
  {
    "query": "大模型推理优化",
    "language": "zh_CN",
    "page": 1,
    "pageSize": 10
  }
  ```

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
    "data": {
      "currentPage": 1,
      "pageSize": 10,
      "totalCount": 42,
      "pageCount": 5,
      "dataList": [
        {
          "resourceId": "RES_abc123",
          "title": "DeepSeek-V3 推理优化实践",
          "summary": "本文详细介绍了 DeepSeek-V3 在推理阶段的优化策略...",
          "url": "https://example.com/article",
          "readUrl": "https://bestblogs.dev/read/RES_abc123",
          "resourceType": "ARTICLE",
          "sourceId": "SOURCE_e24314",
          "sourceName": "机器之心",
          "language": "zh_CN",
          "categories": ["Artificial_Intelligence"],
          "publishDate": "2026-04-19T00:00:00Z",
          "score": 92,
          "relevanceScore": 0.876,
          "coverImageUrl": "https://cdn.bestblogs.dev/cover/RES_abc123.jpg"
        }
      ]
    }
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | resourceId | String | 资源 ID |
  | title | String | 标题 |
  | summary | String | 摘要 |
  | url | String | 原文链接 |
  | readUrl | String | BestBlogs 站内阅读链接 |
  | resourceType | String | 内容类型 |
  | sourceId | String | 来源 ID |
  | sourceName | String | 来源名称 |
  | language | String | 内容语言 |
  | categories | Array&lt;String&gt; | 分类列表 |
  | publishDate | String | 发布时间（ISO 8601，UTC） |
  | score | Float | AI 质量评分（0~100） |
  | relevanceScore | Float | 搜索相关度分数（ES BM25 + kNN 融合分，值域 0~1，越高越相关） |
  | coverImageUrl | String | 封面图 URL |

---

## 热门内容

### 获取热门内容

- **接口地址**：`GET /openapi/v2/resources/trending`
- **接口描述**：获取指定时间段内的热门精选内容列表，按质量评分和热度综合排序
- **鉴权**：需要 API Key
- **请求参数**（Query）：

  | 参数 | 类型 | 必填 | 默认值 | 说明 |
  |------|------|------|--------|------|
  | period | String | 否 | `today` | 时间范围：`today`（今日）/ `week`（本周）/ `month`（本月） |
  | limit | Integer | 否 | 10 | 返回数量，最大 50 |
  | language | String | 否 | - | 内容语言过滤 |
  | category | String | 否 | - | 分类过滤 |
  | type | String | 否 | - | 内容类型过滤（resourceType） |
  | userLanguage | String | 否 | `zh_CN` | 界面语言（影响摘要展示语言） |

- **请求示例**：

  ```
  GET /openapi/v2/resources/trending?period=week&limit=10&language=zh_CN
  ```

- **响应格式**：`data` 为 `ResourceMeta` 数组，字段说明参见"For You 信息流"响应字段（不含个性化字段）。

---

## 期刊

### 获取期刊列表

- **接口地址**：`GET /openapi/v2/newsletters`
- **接口描述**：获取 BestBlogs 定期发布的精选期刊列表，按发布时间降序排列
- **鉴权**：需要 API Key
- **请求参数**（Query）：

  | 参数 | 类型 | 必填 | 默认值 | 说明 |
  |------|------|------|--------|------|
  | page | Integer | 否 | 1 | 当前页码 |
  | pageSize | Integer | 否 | 10 | 每页数量 |

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
    "data": {
      "currentPage": 1,
      "pageSize": 10,
      "totalCount": 55,
      "pageCount": 6,
      "dataList": [
        {
          "id": "issue55",
          "title": "BestBlogs.dev 精选文章 第 55 期",
          "summary": "大家好，欢迎阅读 BestBlogs.dev 第 55 期 AI 精选...",
          "articleCount": 24,
          "createdTimeStr": "07-11",
          "createdTimestamp": 1752214268908,
          "updatedTimeStr": "07-11"
        }
      ]
    }
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | id | String | 期刊唯一 ID（如 `issue55`） |
  | title | String | 期刊标题 |
  | summary | String | 本期摘要，含精选内容介绍 |
  | articleCount | Integer | 本期收录文章数量 |
  | createdTimeStr | String | 发布时间（格式化，如 `07-11`） |
  | createdTimestamp | Long | 发布时间戳（毫秒） |
  | updatedTimeStr | String | 更新时间（格式化） |

---

### 获取期刊详情

- **接口地址**：`GET /openapi/v2/newsletters/{id}`
- **接口描述**：根据期刊 ID 获取期刊详情，包含完整正文和收录的文章列表
- **鉴权**：需要 API Key
- **路径参数**：

  | 参数 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | id | String | 是 | 期刊 ID（如 `issue55`） |

- **请求参数**（Query）：

  | 参数 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | language | String | 否 | 内容语言：`zh_CN` / `en_US` |

- **响应格式**：在期刊基础信息之上，`data` 中额外包含：
  - `content`（String）：完整正文（Markdown 格式）
  - `articles`（Array）：收录的文章列表，每项为 `ResourceMeta` 精简结构
