# BestBlogs OpenAPI 文档

## 介绍

本文档描述 BestBlogs 服务的开放接口。所有接口都需要通过 API Key 进行鉴权。

## 授权方式

- **请求头**：`X-API-KEY`
- **描述**：有效的 API Key（请提 issue 申请或联系作者申请，包括申请人姓名、邮箱、申请理由）
- **错误响应**：
  - `401 Unauthorized`：缺少 API Key 或 API Key 无效

## 公共响应格式

所有接口都遵循统一的响应格式：

```json
{
  "success": true,
  "code": null,
  "message": null,
  "requestId": "唯一请求 ID",
  "data": {
    // 具体业务数据
  }
}
```

### 响应字段说明

| 字段名    | 类型    | 说明                           |
|-----------|---------|--------------------------------|
| success   | Boolean | 请求是否成功                   |
| code      | String  | 错误代码（成功时为 null）      |
| message   | String  | 错误消息（成功时为 null）      |
| requestId | String  | 唯一请求 ID，用于追踪问题      |
| data      | Object  | 业务数据（失败时可能为 null）  |

### 分页响应格式

列表类接口统一使用以下分页格式：

```json
{
  "success": true,
  "code": null,
  "message": null,
  "requestId": "唯一请求 ID",
  "data": {
    "currentPage": 1,
    "pageSize": 10,
    "totalCount": 100,
    "pageCount": 10,
    "dataList": [
      // 具体数据项
    ]
  }
}
```

### 常见错误代码

| 错误代码 | HTTP 状态码 | 描述             | 示例响应 |
|----------|------------|------------------|----------|
| AUTH_001 | 401        | API Key 缺失     | `{"success": false, "code": "AUTH_001", "message": "Missing API Key"}` |
| AUTH_002 | 401        | API Key 无效     | `{"success": false, "code": "AUTH_002", "message": "Invalid API Key"}` |
| AUTH_003 | 403        | API Key 权限不足 | `{"success": false, "code": "AUTH_003", "message": "Insufficient permissions"}` |
| PARAM_001| 400        | 参数错误         | `{"success": false, "code": "PARAM_001", "message": "Invalid parameter: id"}` |
| NOT_FOUND| 404        | 资源不存在       | `{"success": false, "code": "NOT_FOUND", "message": "Resource not found"}` |
| SYS_ERROR| 500        | 系统内部错误     | `{"success": false, "code": "SYS_ERROR", "message": "Internal server error"}` |

---

## 订阅源管理模块

管理内容来源（如 RSS 订阅源）

### 查询订阅源列表

- **接口地址**：`POST https://api.bestblogs.dev/openapi/v1/source/list`
- **接口描述**：获取分页的订阅源列表，支持多种过滤条件
- **请求体**（JSON 格式）：

  | 字段名         | 类型    | 是否必填 | 默认值 | 描述                     | 可选值/枚举                                                                                      |
  |--------------|---------|----------|---------|---------------------------------|---------------------------------------------------------------------------------------------|
  | currentPage  | Integer | 否       | 1       | 当前页码，从 1 开始              |                                                                                             |
  | pageSize     | Integer | 否       | 10      | 每页记录数                    |                                                                                             |
  | keyword      | String  | 否       |         | 搜索关键词                    |                                                                                             |
  | language     | String  | 否       |         | 语言过滤                     | `zh_CN`, `en_US`                                                                            |
  | category     | String  | 否       |         | 资源分类                     | `Artificial_Intelligence`, `Business_Tech`, `Programming_Technology`, `Product_Development` |
  | resourceType | String  | 否       |         | 资源类型                     | `ARTICLE`, `PODCAST`, `VIDEO`, `TWITTER`                                                    |
  | priority     | String  | 否       |         | 优先级                      | `HIGHEST`, `HIGH`, `MEDIUM`, `LOW`, `LOWEST`                                                | |
  | userLanguage | String  | 否       |         | 用户语言偏好                  | `zh_CN`, `en_US`                                                                            |

- **响应体**（JSON 格式）：
  
  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "唯一请求 ID",
    "data": {
      "currentPage": 1,
      "pageSize": 10,
      "totalCount": 100,
      "pageCount": 10,
      "dataList": [
        {
          "id": "订阅源 ID",
          "name": "订阅源名称",
          "url": "订阅源网站 URL",
          "author": "作者",
          "description": "描述",
          "image": "图标 URL",
          "language": "语言代码",
          "languageDesc": "语言描述",
          "category": "分类代码",
          "categoryDesc": "分类描述",
          "subCategory": "子分类代码",
          "subCategoryDesc": "子分类描述",
          "priority": "优先级代码",
          "priorityDesc": "优先级描述",
          "sourceType": "来源类型代码",
          "sourceTypeDesc": "来源类型描述",
          "resourceType": "资源类型代码",
          "resourceTypeDesc": "资源类型描述",
          "rssUrl": "RSS 订阅地址",
          "countInPast3Months": 495,
          "qualifiedCountInPast3Months": 31,
          "readCountInPast3Months": 8879
        }
      ]
    }
  }
  ```

- **响应字段说明**：
  
  | 字段                          | 类型    | 说明            | 枚举值（如果有）                                                                                    |
  |-------------------------------|---------|---------------|---------------------------------------------------------------------------------------------|
  | success                       | Boolean | 请求是否成功        |                                                                                             |
  | code                          | String  | 错误代码（成功时为 null） |                                                                                             |
  | message                       | String  | 错误消息（成功时为 null） |                                                                                             |
  | requestId                     | String  | 唯一请求 ID，用于追踪问题 |                                                                                             |
  | data                          | Object  | 分页数据容器        |                                                                                             |
  | └ currentPage                 | Integer | 当前页码          |                                                                                             |
  | └ pageSize                    | Integer | 每页记录数         |                                                                                             |
  | └ totalCount                  | Integer | 总记录数          |                                                                                             |
  | └ pageCount                   | Integer | 总页数           |                                                                                             |
  | └ dataList                    | Array   | 订阅源列表         |                                                                                             |
  |   └ id                        | String  | 订阅源唯一 ID      |                                                                                             |
  |   └ name                      | String  | 订阅源名称         |                                                                                             |
  |   └ url                       | String  | 订阅源网站 URL     |                                                                                             |
  |   └ author                    | String  | 作者/发布者        |                                                                                             |
  |   └ description               | String  | 订阅源描述           |                                                                                             |
  |   └ image                     | String  | 图标/封面图 URL    |                                                                                             |
  |   └ language                  | String  | 语言代码          | `zh_CN`, `en_US`                                                                            |
  |   └ languageDesc              | String  | 语言描述          | 中文，英文                                                                                       |
  |   └ category                  | String  | 主分类           | `Artificial_Intelligence`, `Business_Tech`, `Programming_Technology`, `Product_Development` |
  |   └ categoryDesc              | String  | 分类描述          | 人工智能，商业科技，软件编程，产品设计                                                                         |
  |   └ subCategory               | String  | 子分类           |                                                                                             |
  |   └ subCategoryDesc           | String  | 子分类描述         |                                                                                             |
  |   └ priority                  | String  | 优先级           | `HIGHEST`, `HIGH`, `MEDIUM`, `LOW` , `LOWEST`                                                  |
  |   └ priorityDesc              | String  | 优先级描述         | 最高，高，中，低，最低                                                                                 |
  |   └ sourceType                | String  | 来源类型          | `RSS`                                                                        |
  |   └ sourceTypeDesc            | String  | 来源类型描述        | RSS                                                                              |
  |   └ resourceType              | String  | 资源类型          | `ARTICLE`, `PODCAST`, `VIDEO`, `TWITTER`                                                               |
  |   └ resourceTypeDesc          | String  | 资源类型描述        | 文章，播客，视频，推特                                                                                    |
  |   └ rssUrl                    | String  | RSS 订阅地址      |                                                                                             | |
  |   └ countInPast3Months        | Integer | 近 3 个月内容总数    |                                                                                             |
  |   └ qualifiedCountInPast3Months | Integer | 近 3 个月合格内容数   |                                                                                             |
  |   └ readCountInPast3Months    | Integer | 近 3 个月阅读量     |                                                                                             |

- **枚举值详细说明**：
  - **语言**：
    - `zh_CN`：中文
    - `en_US`：英文
  
  - **主分类**：
    - `Artificial_Intelligence`：人工智能
    - `Business_Tech`：商业科技
    - `Programming_Technology`：软件编程
    - `Product_Development`：产品设计
  
  - **优先级**：
    - `HIGHEST`：最高优先级
    - `HIGH`：高优先级
    - `MEDIUM`：中等优先级
    - `LOW`：低优先级
    - `LOWEST`：最低优先级
  
  - **来源类型**：
    - `RSS`：RSS 订阅源
  
  - **资源类型**：
    - `ARTICLE`：文章
    - `PODCAST`：播客
    - `VIDEO`：视频
    - `TWITTER`：推特

- **请求示例**：
  
  ```json
  {
    "currentPage": 1,
    "pageSize": 10,
    "language": "zh_CN",
    "category": "Artificial_Intelligence"
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
      "totalCount": 214,
      "pageCount": 22,
      "dataList": [
        {
          "id": "SOURCE_e24314",
          "name": "机器之心",
          "url": "https://www.jiqizhixin.com/",
          "author": null,
          "description": "机器之心",
          "image": "http://wx.qlogo.cn/mmhead/Q3auHgzwzM75UiawQgcdqOcmtYS7Jibug9J7dskxkNicGiadtdKl7mLyiaw/0",
          "language": "zh_CN",
          "languageDesc": "中文",
          "category": "Artificial_Intelligence",
          "categoryDesc": "人工智能",
          "subCategory": null,
          "subCategoryDesc": null,
          "priority": "HIGHEST",
          "priorityDesc": "最高优先级",
          "sourceType": "RSS",
          "sourceTypeDesc": "RSS",
          "resourceType": "ARTICLE",
          "resourceTypeDesc": "文章",
          "rssUrl": "https://www.jiqizhixin.com/rss",
          "countInPast3Months": 495,
          "qualifiedCountInPast3Months": 31,
          "readCountInPast3Months": 8879
        },
        // 其他 9 条记录...
      ]
    }
  }
  ```

---

## 资讯期刊管理模块

管理和获取 BestBlogs 精选期刊内容

### 查询期刊列表

- **接口地址**：`POST https://api.bestblogs.dev/openapi/v1/newsletter/list`
- **接口描述**：获取分页的期刊列表，支持语言过滤
- **请求体**（JSON 格式）：

  | 字段名       | 类型    | 是否必填 | 默认值 | 描述                     | 可选值/枚举 |
  |-------------|---------|----------|---------|--------------------------|-------------|
  | currentPage | Integer | 否       | 1       | 当前页码，从 1 开始       |             |
  | pageSize    | Integer | 否       | 10      | 每页记录数               |             |
  | userLanguage| String  | 否       |         | 用户语言偏好             | `zh_CN`, `en_US` |

- **响应体**（JSON 格式）：
  
  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "唯一请求 ID",
    "data": {
      "currentPage": 1,
      "pageSize": 10,
      "totalCount": 55,
      "pageCount": 6,
      "dataList": [
        {
          "id": "期刊唯一 ID",
          "title": "期刊标题",
          "summary": "期刊摘要内容",
          "articleCount": 24,
          "published": true,
          "createdTimeStr": "创建时间字符串",
          "createdTimestamp": 1752214268908,
          "updatedTimeStr": "更新时间字符串"
        }
      ]
    }
  }
  ```

- **响应字段说明**：
  
  | 字段                    | 类型    | 说明                                     | 枚举值（如果有） |
  |-------------------------|---------|------------------------------------------|------------------|
  | success                 | Boolean | 请求是否成功                             |                  |
  | code                    | String  | 错误代码（成功时为 null）                |                  |
  | message                 | String  | 错误消息（成功时为 null）                |                  |
  | requestId               | String  | 唯一请求 ID，用于追踪问题                |                  |
  | data                    | Object  | 分页数据容器                             |                  |
  | └ currentPage           | Integer | 当前页码                                 |                  |
  | └ pageSize              | Integer | 每页记录数                               |                  |
  | └ totalCount            | Integer | 总记录数                                 |                  |
  | └ pageCount             | Integer | 总页数                                   |                  |
  | └ dataList              | Array   | 期刊列表                                 |                  |
  |   └ id                  | String  | 期刊唯一 ID                              |                  |
  |   └ title               | String  | 期刊标题                                 |                  |
  |   └ summary             | String  | 期刊摘要，包含本期精选内容的详细介绍     |                  |
  |   └ articleCount        | Integer | 本期收录的文章数量                       |                  |
  |   └ createdTimeStr      | String  | 创建时间（格式化字符串，如"07-11"）      |                  |
  |   └ createdTimestamp    | Long    | 创建时间戳（毫秒）                       |                  |
  |   └ updatedTimeStr      | String  | 更新时间（格式化字符串，如"07-11"）      |                  |

- **枚举值详细说明**：
  - **用户语言**：
    - `zh_CN`：中文
    - `en_US`：英文

- **请求示例**：
  
  ```json
  {
    "currentPage": 1,
    "pageSize": 10,
    "userLanguage": "zh_CN"
  }
  ```

- **响应示例**：
  
  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "Ta95df83ae50c4538b907d7d6bb48089d",
    "data": {
      "currentPage": 1,
      "pageSize": 10,
      "totalCount": 55,
      "pageCount": 6,
      "dataList": [
        {
          "id": "issue55",
          "title": "BestBlogs.dev 精选文章 第 55 期",
          "summary": "大家好，欢迎阅读 BestBlogs.dev 第 55 期 AI 精选。\n\n本周，xAI 携新一代大模型 **Grok 4** 高调入场，再次点燃了前沿模型的竞争。与此同时，AI 的实用化趋势也在加速，从专攻 3D 生成的行业模型，到各类提升开发者效率的工具与框架，技术正加速融入生产流程。行业也并未停止深思，一份关于 AI 编程工具真实效率的研究报告，引发了对 AI 应用价值与人机协作模式的广泛探讨。",
          "articleCount": 24,
          "createdTimeStr": "07-11",
          "createdTimestamp": 1752214268908,
          "updatedTimeStr": "07-11"
        },
        {
          "id": "issue54",
          "title": "BestBlogs.dev 精选文章 第 54 期",
          "summary": "大家好，欢迎阅读 BestBlogs.dev 第 54 期 AI 精选。\n\n本周，国内大厂在多模态模型领域展开了密集的技术发布与开源行动，从图像编辑到音视频同步生成，展现了强大的创新实力。",
          "articleCount": 24,
          "createdTimeStr": "06-27",
          "createdTimestamp": 1751024897083,
          "updatedTimeStr": "07-04"
        }
      ]
    }
  }
  ```


### 获取期刊详情

- **接口地址**：`GET https://api.bestblogs.dev/openapi/v1/newsletter/get`
- **接口描述**：根据期刊 ID 获取期刊的详细信息，包括完整内容和包含的文章列表
- **请求参数**（Query 参数）：

  | 参数名   | 类型   | 是否必填 | 描述                     | 可选值/枚举 |
    |----------|--------|----------|--------------------------|-------------|
  | id       | String | 是       | 期刊唯一 ID               |             |
  | language | String | 否       | 返回内容的语言偏好        | `zh_CN`, `en_US` |

- **响应体**（JSON 格式）：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "唯一请求 ID",
    "data": {
      "id": "期刊唯一 ID",
      "title": "期刊标题",
      "summary": "期刊完整摘要内容",
      "enTitle": "英文标题",
      "enSummary": "英文摘要内容",
      "zhTitle": "中文标题",
      "zhSummary": "中文摘要内容",
      "articles": [
        {
          "id": "文章 ID",
          "title": "文章标题",
          "cover": "封面图片 URL",
          "summary": "文章摘要",
          "sourceId": "来源 ID",
          "sourceName": "来源名称",
          "url": "文章原始 URL",
          "domain": "域名",
          "score": 94,
          "wordCount": 2076,
          "readTime": 9,
          "publishDateStr": "发布日期字符串",
          "category": "分类",
          "aiCategory": "AI 分类",
          "resourceType": "资源类型",
          "originLanguage": "原始语言",
          "language": "语言",
          "sort": 10
        }
      ],
      "published": true,
      "createdTimeStr": "创建时间字符串",
      "updatedTimeStr": "更新时间字符串"
    }
  }
  ```

- **响应字段说明**：

  | 字段                      | 类型    | 说明                                         | 枚举值（如果有）                                                                     |
    |---------------------------|---------|----------------------------------------------|------------------------------------------------------------------------------|
  | success                   | Boolean | 请求是否成功                                 |                                                                              |
  | code                      | String  | 错误代码（成功时为 null）                    |                                                                              |
  | message                   | String  | 错误消息（成功时为 null）                    |                                                                              |
  | requestId                 | String  | 唯一请求 ID，用于追踪问题                    |                                                                              |
  | data                      | Object  | 期刊详情数据                                 |                                                                              |
  | └ id                      | String  | 期刊唯一 ID                                  |                                                                              |
  | └ title                   | String  | 期刊标题（根据 language 参数返回对应语言）   |                                                                              |
  | └ summary                 | String  | 期刊摘要（根据 language 参数返回对应语言）   |                                                                              |
  | └ enTitle                 | String  | 英文标题                                     |                                                                              |
  | └ enSummary               | String  | 英文摘要                                     |                                                                              |
  | └ zhTitle                 | String  | 中文标题                                     |                                                                              |
  | └ zhSummary               | String  | 中文摘要                                     |                                                                              |
  | └ articles                | Array   | 期刊包含的文章列表                           |                                                                              |
  |   └ id                    | String  | 文章唯一 ID                                  |                                                                              |
  |   └ title                 | String  | 文章标题                                     |                                                                              |
  |   └ cover                 | String  | 文章封面图片 URL                             |                                                                              |
  |   └ summary               | String  | 文章摘要                                     |                                                                              |
  |   └ sourceId              | String  | 文章来源 ID                                  |                                                                              |
  |   └ sourceName            | String  | 文章来源名称                                 |                                                                              |
  |   └ url                   | String  | 文章原始链接                                 |                                                                              |
  |   └ domain                | String  | 文章域名                                     |                                                                              |
  |   └ score                 | Integer | 文章评分（0-100）                            |                                                                              |
  |   └ wordCount             | Integer | 文章字数                                     |                                                                              |
  |   └ readTime              | Integer | 预估阅读时间（分钟）                         |                                                                              |
  |   └ publishDateStr        | String  | 发布日期字符串                               |                                                                              |
  |   └ category              | String  | 文章主分类                                   | `Artificial_Intelligence`, `Business_Tech`, `Programming_Technology`, `Product_Development` |
  |   └ aiCategory            | String  | AI 细分类别                                  | `MODELS`, `DEV`, `PRODUCT`, `NEWS`                                           |
  |   └ resourceType          | String  | 资源类型                                     | `ARTICLE`, `PODCAST`, `VIDEO`                                                |
  |   └ originLanguage        | String  | 文章原始语言                                 | `zh_CN`, `en_US`                                                             |
  |   └ language              | String  | 适用语言                                     | `zh_CN`, `en_US`, `ALL`                                                      |
  |   └ sort                  | Integer | 文章在期刊中的排序                           |                                                                              |
  | └ published               | Boolean | 是否已发布                                   | `true`, `false`                                                              |
  | └ createdTimeStr          | String  | 创建时间字符串                               |                                                                              |
  | └ updatedTimeStr          | String  | 更新时间字符串                               |                                                                              |

- **枚举值详细说明**：
  - **语言参数**：
    - `zh_CN`：返回中文内容
    - `en_US`：返回英文内容

  - **主分类**：
    - `Artificial_Intelligence`：人工智能
    - `Business_Tech`：商业科技
    - `Programming_Technology`：软件编程
    - `Product_Development`：产品设计

  - **AI 细分类别**：
    - `MODELS`：模型与研究
    - `DEV`：开发与工具
    - `PRODUCT`：产品与设计
    - `NEWS`：资讯与报告

  - **资源类型**：
    - `ARTICLE`：文章
    - `PODCAST`：播客
    - `VIDEO`：视频
    - `TWITTER`：推特

- **请求示例**：

  ```
  GET https://api.bestblogs.dev/openapi/v1/newsletter/get?id=issue55&language=zh_CN
  ```

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "Tdb6b4ee161f74009a0958aef84e47d56",
    "data": {
      "id": "issue55",
      "title": "BestBlogs.dev 精选文章 第 55 期",
      "summary": "大家好，欢迎阅读 BestBlogs.dev 第 55 期 AI 精选。\n\n本周，xAI 携新一代大模型 **Grok 4** 高调入场，再次点燃了前沿模型的竞争...",
      "enTitle": "BestBlogs.dev Highlights Issue #55",
      "enSummary": "Hello and welcome to Issue #55 of BestBlogs.dev AI Highlights...",
      "zhTitle": "BestBlogs.dev 精选文章 第 55 期",
      "zhSummary": "大家好，欢迎阅读 BestBlogs.dev 第 55 期 AI 精选...",
      "articles": [
        {
          "id": "RAW_50231a",
          "title": "刚刚，马斯克发布 Grok 4！全榜第一，年费飚到 2 万 + ｜ 机器之心",
          "cover": "https://image.jiqizhixin.com/uploads/editor/847cba8a-0995-4dc4-bcb3-3606a8938935/640.png",
          "summary": "文章详细报道了 xAI 新一代大模型 Grok 4 的发布及其宣称的强大能力...",
          "sourceId": "SOURCE_e24314",
          "sourceName": "机器之心",
          "url": "https://www.jiqizhixin.com/articles/2025-07-10-10",
          "domain": "jiqizhixin.com",
          "score": 94,
          "wordCount": 2076,
          "readTime": 9,
          "publishDateStr": "07-10",
          "category": "Artificial_Intelligence",
          "aiCategory": "MODELS",
          "resourceType": "ARTICLE",
          "originLanguage": "zh_CN",
          "language": "ALL",
          "sort": 10
        }
      ],
      "published": true,
      "createdTimeStr": "07-11",
      "updatedTimeStr": "07-11"
    }
  }
  ```

---

## 资源内容管理模块

管理和获取 BestBlogs 的文章、播客、视频、推特等各类资源内容

### 查询资源列表

- **接口地址**：`POST https://api.bestblogs.dev/openapi/v1/resource/list`
- **接口描述**：获取分页的资源内容列表，支持语言过滤，返回包含详细分析和分类的高质量内容
- **请求体**（JSON 格式）：

  | 字段名       | 类型    | 是否必填 | 默认值 | 描述          | 可选值/枚举                                                                                      |
  |-------------|---------|----------|---------|-------------|---------------------------------------------------------------------------------------------|
  | currentPage | Integer | 否       | 1       | 当前页码，从 1 开始 |                                                                                             |
  | pageSize    | Integer | 否       | 10      | 每页记录数       |                                                                                             |
  | userLanguage| String  | 否       |         | 用户语言偏好      | `zh_CN`, `en_US`                                                                            |
  | keyword     | String  | 否       |         | 搜索关键词       |                                                                                             |
  | sourceId    | String  | 否       |         | 订阅源 ID 过滤   |                                                                                             |
  | category    | String  | 否       |         | 分类过滤        | `Artificial_Intelligence`, `Business_Tech`, `Programming_Technology`, `Product_Development` |
  | language    | String  | 否       |         | 内容语言过滤      | `zh_CN`, `en_US`                                                                            |
  | type        | String  | 否       |         | 资源类型过滤      | `ARTICLE`, `PODCAST`, `VIDEO`, `TWITTER`                                                    |
- | priority        | String  | 否       |         | 资源类型过滤      | `HIGHEST`, `HIGH`, `MEDIUM`, `LOW`, `LOWEST`                                                |
  | qualifiedFilter | String | 否    |         | 是否精选过滤      | `true`, `false`, `ALL`                                                                      |
  | timeFilter | String | 否    |         | 时间范围过滤      | `1d`, `3d`, `1w`, `1m`, `3m`, `1y`                                                          |
  | sortType | String | 否    |         | 排序方式        | `default`, `time_desc`, `score_desc`, `read_desc`                                                  |
- 
- **响应体**（JSON 格式）：
  
  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "唯一请求 ID",
    "data": {
      "currentPage": 1,
      "pageSize": 10,
      "totalCount": 11842,
      "pageCount": 1185,
      "dataList": [
        {
          "id": "资源唯一 ID",
          "originalTitle": "原始标题",
          "title": "优化后标题",
          "oneSentenceSummary": "一句话摘要",
          "summary": "详细摘要",
          "tags": ["标签 1", "标签 2"],
          "mainPoints": [
            {
              "point": "要点标题",
              "explanation": "要点详细解释"
            }
          ],
          "keyQuotes": ["关键引用 1", "关键引用 2"],
          "url": "原文链接",
          "domain": "域名",
          "cover": "封面图片 URL",
          "language": "内容语言",
          "languageDesc": "语言描述",
          "sourceId": "来源 ID",
          "sourceName": "来源名称",
          "sourceImage": "来源头像 URL",
          "category": "分类",
          "categoryDesc": "分类描述",
          "aiSubCategory": "AI 子分类",
          "aiSubCategoryDesc": "AI 子分类描述",
          "mainDomain": "主领域",
          "mainDomainDesc": "主领域描述",
          "resourceType": "资源类型",
          "resourceTypeDesc": "资源类型描述",
          "score": 96,
          "readCount": 847,
          "wordCount": 6835,
          "readTime": 28,
          "mediaDuration": null,
          "authors": ["作者 1", "作者 2"],
          "publishTimeStamp": 1744848000000,
          "publishDateStr": "04-17",
          "publishDateTimeStr": "2025-04-17 08:00:00",
          "qualified": true
        }
      ]
    }
  }
  ```

- **响应字段说明**：
  
  | 字段                      | 类型     | 说明                    | 枚举值（如果有）                                                                                    |
  |---------------------------|----------|-----------------------|---------------------------------------------------------------------------------------------|
  | success                   | Boolean  | 请求是否成功                |                                                                                             |
  | code                      | String   | 错误代码（成功时为 null）       |                                                                                             |
  | message                   | String   | 错误消息（成功时为 null）       |                                                                                             |
  | requestId                 | String   | 唯一请求 ID，用于追踪问题        |                                                                                             |
  | data                      | Object   | 分页数据容器                |                                                                                             |
  | └ currentPage             | Integer  | 当前页码                  |                                                                                             |
  | └ pageSize                | Integer  | 每页记录数                 |                                                                                             |
  | └ totalCount              | Integer  | 总记录数                  |                                                                                             |
  | └ pageCount               | Integer  | 总页数                   |                                                                                             |
  | └ dataList                | Array    | 资源列表                  |                                                                                             |
  |   └ id                    | String   | 资源唯一 ID               |                                                                                             |
  |   └ originalTitle         | String   | 原始标题                  |                                                                                             |
  |   └ title                 | String   | 经过优化的标题               |                                                                                             |
  |   └ oneSentenceSummary    | String   | 一句话摘要，快速了解核心内容        |                                                                                             |
  |   └ summary               | String   | 详细摘要，包含深度分析           |                                                                                             |
  |   └ tags                  | Array    | 内容标签列表                |                                                                                             |
  |   └ mainPoints            | Array    | 主要观点列表                |                                                                                             |
  |     └ point               | String   | 观点标题                  |                                                                                             |
  |     └ explanation         | String   | 观点详细解释                |                                                                                             |
  |   └ keyQuotes             | Array    | 关键引用语句列表              |                                                                                             |
  |   └ url                   | String   | 原文链接                  |                                                                                             |
  |   └ domain                | String   | 文章域名                  |                                                                                             |
  |   └ cover                 | String   | 封面图片 URL              |                                                                                             |
  |   └ language              | String   | 内容语言                  | `zh_CN`, `en_US`                                                                            |
  |   └ languageDesc          | String   | 语言描述                  | 中文，英文                                                                                       |
  |   └ sourceId              | String   | 来源 ID                 |                                                                                             |
  |   └ sourceName            | String   | 来源名称                  |                                                                                             |
  |   └ sourceImage           | String   | 来源头像 URL              |                                                                                             |
  |   └ category              | String   | 内容分类，是根据根据订阅源事先定义的    | `Artificial_Intelligence`, `Business_Tech`, `Programming_Technology`                        |
  |   └ categoryDesc          | String   | 分类描述                  | 人工智能，商业科技，软件编程                                                                              |
  |   └ aiSubCategory         | String   | AI 细分类别               | `MODELS`, `DEV`, `PRODUCT`, `NEWS`                                                          |
  |   └ aiSubCategoryDesc     | String   | AI 细分类别描述             | AI 模型，AI 开发，AI 产品，AI 资讯                                                                     |
- |   └ mainDomain            | String   | 主领域分类，是 AI 根据文章内容识别的    | `Artificial_Intelligence`, `Business_Tech`, `Programming_Technology`, `Product_Development` |
  |   └ mainDomainDesc        | String   | 主领域描述                 | 人工智能，商业科技，软件编程，产品设计                                                                         |
  |   └ resourceType          | String   | 资源类型                  | `ARTICLE`, `PODCAST`, `VIDEO`, `TWITTER`                                                    |
  |   └ resourceTypeDesc      | String   | 资源类型描述                | 文章，播客，视频，推特                                                            |
  |   └ score                 | Integer  | 内容质量评分（0-100）         |                                                                                             |
  |   └ readCount             | Integer  | 阅读次数                  |                                                                                             |
  |   └ wordCount             | Integer  | 文章字数                  |                                                                                             |
  |   └ readTime              | Integer  | 预估阅读时间（分钟）            |                                                                                             |
  |   └ mediaDuration         | Integer  | 媒体时长（秒，视频/播客适用，可为 null） |                                                                                             |
  |   └ authors               | Array    | 作者列表                  |                                                                                             |
  |   └ publishTimeStamp      | Long     | 发布时间戳（毫秒）             |                                                                                             |
  |   └ publishDateStr        | String   | 发布日期字符串（MM-dd 格式）     |                                                                                             |
  |   └ publishDateTimeStr    | String   | 发布时间字符串               |                                                                                             |
  |   └ qualified             | Boolean  | 是否为精选文件               | `true`, `false`                                                               |

- **枚举值详细说明**：
  - **用户语言**：
    - `zh_CN`：中文
    - `en_US`：英文
  
  - **主领域分类**：
    - `Artificial_Intelligence`：人工智能
    - `Business_Tech`：商业科技
    - `Programming_Technology`：软件编程
    - `Product_Development`：产品设计
  
  - **AI 细分类别**：
    - `MODELS`：AI 模型（模型发布、技术研究等）
    - `DEV`：AI 开发（开发工具、技术教程等）
    - `PRODUCT`：AI 产品（产品分析、用户体验等）
    - `NEWS`：AI 资讯（行业动态、投资融资等）
  
  - **资源类型**：
    - `ARTICLE`：文章
    - `PODCAST`：播客
    - `VIDEO`：视频
    - `TWITTER`：推特
  
  - **精选文章过滤**：
    - `true`：仅精选内容
    - `false`：仅非精选内容

- **请求示例**：
  
  ```json
  {
    "currentPage": 1,
    "pageSize": 10,
    "userLanguage": "zh_CN"
  }
  ```

- **响应示例**：
  
  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T411b31856ac34dc3a164ad389609590b",
    "data": {
      "currentPage": 1,
      "pageSize": 10,
      "totalCount": 11842,
      "pageCount": 1185,
      "dataList": [
        {
          "id": "RAW_4e45fa",
          "originalTitle": "The Second Half：一位 OpenAI 科学家的 AI 下半场启示录",
          "title": "The Second Half：一位 OpenAI 科学家的 AI 下半场启示录",
          "oneSentenceSummary": "OpenAI 科学家姚顺雨对 AI 下半场发展趋势进行解读，强调问题定义、模型评估及现实世界效用的重要性，并提出 AI 发展的新方向。",
          "summary": "本文是 OpenAI 科学家姚顺雨对 AI 发展下半场的解读，核心观点是 AI 的发展正从解决问题转向定义问题，Evaluation (模型评估) 会比 Training (模型训练) 更重要...",
          "tags": ["AI 下半场", "AI Agent", "强化学习", "评估方法", "OpenAI"],
          "mainPoints": [
            {
              "point": "AI 发展进入下半场，问题定义和评估比问题解决更重要",
              "explanation": "AI 的上半场专注于训练方法和模型，而下半场需要关注应该训练模型来做什么，以及如何衡量真正的进展。"
            }
          ],
          "keyQuotes": [
            "要想赢得 AI 的下半场，我们必须及时转变心态和技能，也许要更像产品经理。"
          ],
          "url": "https://mp.weixin.qq.com/s/iBVj-bcEtVbOGWEqwWp6EA",
          "domain": "mp.weixin.qq.com",
          "cover": "https://imagedelivery.net/qGOFcc1O8XwTZW3W1JAHHg/cbcdf9f4-9736-4b24-9f84-1f832af12e00/cover",
          "language": "zh_CN",
          "languageDesc": "中文",
          "sourceId": "SOURCE_736d69",
          "sourceName": "海外独角兽",
          "sourceImage": "http://wx.qlogo.cn/mmhead/Q3auHgzwzM5kSCU0EU4khT3icBc0y5ibokcz9Xw6iaY7SZNz3ibvKJNT3w/0",
          "category": "Business_Tech",
          "categoryDesc": "商业科技",
          "aiSubCategory": "NEWS",
          "aiSubCategoryDesc": "AI 资讯",
          "mainDomain": "Artificial_Intelligence",
          "mainDomainDesc": "人工智能",
          "resourceType": "ARTICLE",
          "resourceTypeDesc": "文章",
          "score": 96,
          "readCount": 847,
          "wordCount": 6835,
          "readTime": 28,
          "mediaDuration": null,
          "authors": ["Shunyu Yao"],
          "publishTimeStamp": 1744848000000,
          "publishDateStr": "04-17",
          "publishDateTimeStr": "2025-04-17 08:00:00",
          "qualified": true
        }
      ]
    }
  }
  ```

### 查询资源元数据

- **接口地址**：`GET https://api.bestblogs.dev/openapi/v1/resource/meta`
- **接口描述**：根据资源 ID 获取单个资源的详细元数据信息，包含完整的分析结果和分类信息
- **请求参数**（Query 参数）：

  | 参数名   | 类型   | 是否必填 | 描述                     | 可选值/枚举 |
  |----------|--------|----------|--------------------------|-------------|
  | id       | String | 是       | 资源唯一 ID               |             |
  | language | String | 否       | 返回内容的语言偏好        | `zh_CN`, `en_US` |

- **响应体**（JSON 格式）：
  
  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "唯一请求 ID",
    "data": {
      "id": "资源唯一 ID",
      "notExist": null,
      "originalTitle": "原始标题",
      "title": "优化后标题",
      "oneSentenceSummary": "一句话摘要",
      "summary": "详细摘要",
      "tags": ["标签 1", "标签 2"],
      "mainPoints": [
        {
          "point": "要点标题",
          "explanation": "要点详细解释"
        }
      ],
      "keyQuotes": ["关键引用 1", "关键引用 2"],
      "url": "原文链接",
      "enclosureUrl": null,
      "domain": "域名",
      "cover": "封面图片 URL",
      "language": "内容语言",
      "languageDesc": "语言描述",
      "sourceId": "来源 ID",
      "sourceName": "来源名称",
      "sourceImage": "来源头像 URL",
      "category": "分类",
      "categoryDesc": "分类描述",
      "aiSubCategory": "AI 子分类",
      "aiSubCategoryDesc": "AI 子分类描述",
      "mainDomain": "主领域",
      "mainDomainDesc": "主领域描述",
      "resourceType": "资源类型",
      "resourceTypeDesc": "资源类型描述",
      "score": 96,
      "readCount": 847,
      "wordCount": 6835,
      "readTime": 28,
      "mediaDuration": null,
      "authors": ["作者 1", "作者 2"],
      "publishTimeStamp": 1744848000000,
      "publishDateStr": "04-17",
      "publishDateTimeStr": "2025-04-17 08:00:00",
      "qualified": true
    }
  }
  ```

- **响应字段说明**：
  
  | 字段                      | 类型     | 说明                                          | 枚举值（如果有） |
  |---------------------------|----------|-----------------------------------------------|------------------|
  | success                   | Boolean  | 请求是否成功                                  |                  |
  | code                      | String   | 错误代码（成功时为 null）                     |                  |
  | message                   | String   | 错误消息（成功时为 null）                     |                  |
  | requestId                 | String   | 唯一请求 ID，用于追踪问题                     |                  |
  | data                      | Object   | 资源元数据                                    |                  |
  | └ id                      | String   | 资源唯一 ID                                   |                  |
  | └ notExist                | String   | 资源不存在标识（正常情况为 null）              |                  |
  | └ originalTitle           | String   | 原始标题                                      |                  |
  | └ title                   | String   | 经过优化的标题                                |                  |
  | └ oneSentenceSummary      | String   | 一句话摘要，快速了解核心内容                   |                  |
  | └ summary                 | String   | 详细摘要，包含深度分析                         |                  |
  | └ tags                    | Array    | 内容标签列表                                  |                  |
  | └ mainPoints              | Array    | 主要观点列表                                  |                  |
  |   └ point                 | String   | 观点标题                                      |                  |
  |   └ explanation           | String   | 观点详细解释                                  |                  |
  | └ keyQuotes               | Array    | 关键引用语句列表                              |                  |
  | └ url                     | String   | 原文链接                                      |                  |
  | └ enclosureUrl            | String   | 附件链接（如音频、视频文件，可为 null）        |                  |
  | └ domain                  | String   | 文章域名                                      |                  |
  | └ cover                   | String   | 封面图片 URL                                  |                  |
  | └ language                | String   | 内容语言                                      | `zh_CN`, `en_US` |
  | └ languageDesc            | String   | 语言描述                                      | 中文，英文       |
  | └ sourceId                | String   | 来源 ID                                       |                  |
  | └ sourceName              | String   | 来源名称                                      |                  |
  | └ sourceImage             | String   | 来源头像 URL                                  |                  |
  | └ category                | String   | 内容分类                                      | `Artificial_Intelligence`, `Business_Tech`, `Programming_Technology` |
  | └ categoryDesc            | String   | 分类描述                                      | 人工智能，商业科技，软件编程 |
- | └ aiSubCategory           | String   | AI 细分类别                                   | `MODELS`, `DEV`, `PRODUCT`, `NEWS` |
  | └ aiSubCategoryDesc       | String   | AI 细分类别描述                               | AI 模型，AI 开发，AI 产品，AI 资讯 |
- | └ mainDomain              | String   | 主领域分类                                    | `Artificial_Intelligence`, `Business_Tech`, `Programming_Technology`, `Product_Development` |
  | └ mainDomainDesc          | String   | 主领域描述                                    | 人工智能，商业科技，软件编程，产品设计 |
  | └ resourceType            | String   | 资源类型                                      | `ARTICLE`, `PODCAST`, `VIDEO` |
  | └ resourceTypeDesc        | String   | 资源类型描述                                  | 文章，播客，视频 |
  | └ score                   | Integer  | 内容质量评分（0-100）                         |                  |
  | └ readCount               | Integer  | 阅读次数                                      |                  |
  | └ wordCount               | Integer  | 文章字数                                      |                  |
  | └ readTime                | Integer  | 预估阅读时间（分钟）                          |                  |
  | └ mediaDuration           | Integer  | 媒体时长（秒，视频/播客适用，可为 null）       |                  |
  | └ authors                 | Array    | 作者列表                                      |                  |
  | └ publishTimeStamp        | Long     | 发布时间戳（毫秒）                            |                  |
  | └ publishDateStr          | String   | 发布日期字符串（MM-dd 格式）                  |                  |
  | └ publishDateTimeStr      | String   | 完整发布时间字符串                            |                  |
  | └ qualified               | Boolean  | 是否为高质量内容                              | `true`, `false`  |

- **请求示例**：
  
  ```
  GET https://api.bestblogs.dev/openapi/v1/resource/meta?id=RAW_4e45fa&language=zh_CN
  ```

- **响应示例**：
  
  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T99ca66891331408aa05b3fa91176e0ec",
    "data": {
      "id": "RAW_4e45fa",
      "notExist": null,
      "originalTitle": "The Second Half：一位 OpenAI 科学家的 AI 下半场启示录",
      "title": "The Second Half：一位 OpenAI 科学家的 AI 下半场启示录",
      "oneSentenceSummary": "OpenAI 科学家姚顺雨对 AI 下半场发展趋势进行解读，强调问题定义、模型评估及现实世界效用的重要性，并提出 AI 发展的新方向。",
      "summary": "本文是 OpenAI 科学家姚顺雨对 AI 发展下半场的解读，核心观点是 AI 的发展正从解决问题转向定义问题...",
      "tags": ["AI 下半场", "AI Agent", "强化学习", "评估方法", "OpenAI"],
      "mainPoints": [
        {
          "point": "AI 发展进入下半场，问题定义和评估比问题解决更重要",
          "explanation": "AI 的上半场专注于训练方法和模型，而下半场需要关注应该训练模型来做什么，以及如何衡量真正的进展。"
        },
        {
          "point": "强化学习是 AI 的终极形态，先验知识至关重要",
          "explanation": "RL 的关键在于算法、环境和先验知识，而先验知识的获取方式与 RL 本身无关，但对 agent 的泛化能力至关重要。"
        }
      ],
      "keyQuotes": [
        "要想赢得 AI 的下半场，我们必须及时转变心态和技能，也许要更像产品经理。",
        "RL 中最重要的部分可能甚至不是 RL 算法或环境，而是先验知识，而这些先验知识的获取方式与 RL 完全无关。"
      ],
      "url": "https://mp.weixin.qq.com/s/iBVj-bcEtVbOGWEqwWp6EA",
      "enclosureUrl": null,
      "domain": "mp.weixin.qq.com",
      "cover": "https://imagedelivery.net/qGOFcc1O8XwTZW3W1JAHHg/cbcdf9f4-9736-4b24-9f84-1f832af12e00/cover",
      "language": "zh_CN",
      "languageDesc": "中文",
      "sourceId": "SOURCE_736d69",
      "sourceName": "海外独角兽",
      "sourceImage": "http://wx.qlogo.cn/mmhead/Q3auHgzwzM5kSCU0EU4khT3icBc0y5ibokcz9Xw6iaY7SZNz3ibvKJNT3w/0",
      "category": "Business_Tech",
      "categoryDesc": "商业科技",
      "aiSubCategory": "NEWS",
      "aiSubCategoryDesc": "AI 资讯",
      "mainDomain": "Artificial_Intelligence",
      "mainDomainDesc": "人工智能",
      "resourceType": "ARTICLE",
      "resourceTypeDesc": "文章",
      "score": 96,
      "readCount": 847,
      "wordCount": 6835,
      "readTime": 28,
      "mediaDuration": null,
      "authors": ["Shunyu Yao"],
      "publishTimeStamp": 1744848000000,
      "publishDateStr": "04-17",
      "publishDateTimeStr": "2025-04-17 08:00:00",
      "qualified": true
    }
  }
  ```

### 查询资源网页内容

- **接口地址**：`GET https://api.bestblogs.dev/openapi/v1/resource/content`
- **接口描述**：根据资源 ID 获取资源的完整网页内容，返回经过处理和优化的 HTML 格式内容
- **请求参数**（Query 参数）：

  | 参数名 | 类型   | 是否必填 | 描述                  | 可选值/枚举 |
  |--------|--------|----------|----------------------|-------------|
  | id     | String | 是       | 资源唯一 ID           |             |

- **响应体**（JSON 格式）：
  
  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "唯一请求 ID",
    "data": {
      "id": "资源唯一 ID",
      "displayDocument": "经过处理的完整 HTML 内容",
      "edited": true,
      "updateTime": "2025-04-17T14:55:08.178+00:00"
    }
  }
  ```

- **响应字段说明**：

  | 字段名         | 类型    | 描述                           |
  |---------------|---------|--------------------------------|
  | id            | String  | 资源唯一标识符                  |
  | displayDocument| String | 经过 AI 处理和优化的完整 HTML 内容，包含样式和图片 |
  | edited        | Boolean | 内容是否经过编辑处理            |
  | updateTime    | String  | 内容最后更新时间（ISO 8601 格式） |

### 查询播客资源内容

- **接口地址**：`GET https://api.bestblogs.dev/openapi/v1/resource/podcast/content`
- **接口描述**：根据资源 ID 获取播客资源内容，返回完整的播客分析结果，包括音频转录、章节划分、摘要分析等
- **请求参数**（Query 参数）：

  | 参数名 | 类型   | 是否必填 | 描述                  | 可选值/枚举 |
  |--------|--------|----------|----------------------|-------------|
  | id     | String | 是       | 播客资源唯一 ID        |             |

- **响应体**（JSON 格式）：
  
  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "唯一请求 ID",
    "data": {
      "id": "播客资源唯一 ID",
      "transcriptionSegments": [
        {
          "id": "片段 ID",
          "speakerId": "说话人 ID",
          "beginTime": 3050,
          "endTime": 5200,
          "text": "转录文本内容"
        }
      ],
      "autoChapters": [
        {
          "id": 1,
          "headLine": "章节标题",
          "summary": "章节摘要",
          "beginTime": 0,
          "endTime": 300500
        }
      ],
      "podCastSummary": "播客全文摘要",
      "speakerSummaries": [
        {
          "speakerId": "说话人 ID",
          "speakerName": "说话人",
          "summary": "发言人总结"
        }
      ],
      "questionsAnswers": [
        {
          "question": "问题",
          "answer": "回答"
        }
      ],
      "keywords": ["关键词 1", "关键词 2"],
      "keySentences": [
        {
          "sentence": "关键句子",
          "beginTime": 1000,
          "endTime": 3000
        }
      ]
    }
  }
  ```

- **响应字段说明**：

  | 字段名                     | 类型     | 描述                                       |
  |-------------------------|----------|--------------------------------------------|
  | success                 | Boolean  | 请求是否成功                                  |
  | code                    | String   | 错误代码（成功时为 null）                     |
  | message                 | String   | 错误消息（成功时为 null）                     |
  | requestId               | String   | 唯一请求 ID，用于追踪问题                     |
  | data                    | Object   | 播客内容数据                                  |
  | └ id                    | String   | 播客资源唯一标识符                            |
  | └ transcriptionSegments | Array    | 音频转录分段列表                              |
  | └ id                    | String   | 片段唯一标识                                  |
  | └ speakerId             | String   | 说话人唯一标识 ID                             |
  | └ beginTime             | Long     | 分段开始时间（毫秒）                          |
  | └ endTime               | Long     | 分段结束时间（毫秒）                          |
  | └ text                  | String   | 该时间段的转录文本内容                        |
  | └ autoChapters          | Array    | 自动生成的章节列表                            |
  | └ id                    | Integer  | 章节 ID                                    |
  | └ headLine              | String   | 章节标题                                    |
  | └ summary               | String   | 章节内容摘要                                  |
  | └ beginTime             | Long     | 章节开始时间（毫秒）                          |
  | └ endTime               | Long     | 章节结束时间（毫秒）                          |
  | └ podCastSummary        | String   | 播客全文摘要                                  |
  | └ speakerSummaries      | Array    | 发言人总结列表                                |
  | └ speakerId             | String   | 说话人 ID                                  |
- | └ speakerName           | String   | 说话人                                     |
  | └ summary               | String   | 该说话人的发言总结                            |
  | └ questionsAnswers      | Array    | 问答回顾列表                                  |
  | └ question              | String   | 问题                                       |
  | └ answer                | String   | 回答                                       |
  | └ keywords              | Array    | 关键词提取结果                                |
  | └ keySentences          | Array    | 关键句子提取结果                              |
  | └ sentence              | String   | 关键句子内容                                  |
  | └ beginTime             | Long     | 句子开始时间（毫秒）                          |
  | └ endTime               | Long     | 句子结束时间（毫秒）                          |

- **请求示例**：
  
  ```
  GET https://api.bestblogs.dev/openapi/v1/resource/podcast/content?id=PODCAST_abc123
  ```

- **响应示例**：
  
  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T02704df777364a49963a4eab70d6da96",
    "data": {
      "id": "PODCAST_abc123",
      "transcriptionSegments": [
        {
          "id": "segment_001",
          "speakerId": "1",
          "beginTime": 0,
          "endTime": 5200,
          "text": "大家好，欢迎收听本期播客。今天我们将讨论人工智能的最新发展。"
        },
        {
          "id": "segment_002",
          "speakerId": "2",
          "beginTime": 5200,
          "endTime": 12800,
          "text": "是的，最近 AI 领域确实有很多令人兴奋的突破，特别是在大语言模型方面。"
        },
        {
          "id": "segment_003",
          "speakerId": "1",
          "beginTime": 12800,
          "endTime": 25500,
          "text": "没错，让我们从最新发布的 GPT-4 开始谈起。这个模型在多个基准测试中都表现出了惊人的能力。"
        }
      ],
      "autoChapters": [
        {
          "id": 1,
          "headLine": "开场介绍与话题概述",
          "summary": "主持人介绍播客主题，嘉宾简要概述当前 AI 发展现状，为后续深入讨论做铺垫。",
          "beginTime": 0,
          "endTime": 180500
        },
        {
          "id": 2,
          "headLine": "大语言模型技术突破分析",
          "summary": "深入分析 GPT-4 等最新大语言模型的技术创新点，讨论其在各种任务上的表现和突破。",
          "beginTime": 180500,
          "endTime": 420800
        },
        {
          "id": 3,
          "headLine": "AI 应用场景与商业化前景",
          "summary": "探讨人工智能在不同行业的应用案例，分析商业化机会和挑战，展望未来发展趋势。",
          "beginTime": 420800,
          "endTime": 720000
        }
      ],
      "podCastSummary": "本期播客深入探讨了人工智能的最新发展趋势，重点分析了 GPT-4 等大语言模型的技术突破和应用前景。主持人与嘉宾围绕 AI 技术创新、商业化应用和未来发展方向进行了全面讨论，为听众提供了 AI 行业的最新洞察。",
      "speakerSummaries": [
        {
          "speakerId": "1",
          "summary": "作为主持人，主要负责引导话题讨论，提出关键问题，并对 AI 技术发展趋势进行总结。"
        },
        {
          "speakerId": "2",
          "summary": "技术专家嘉宾，深入分析了大语言模型的技术原理和创新点，分享了 AI 应用的实践经验。"
        }
      ],
      "questionsAnswers": [
        {
          "question": "GPT-4 相比之前的版本有哪些突破？",
          "answer": "GPT-4 在多模态理解、推理能力和安全性方面都有显著提升，能够处理更复杂的任务。"
        },
        {
          "question": "AI 技术在商业化应用中面临哪些挑战？",
          "answer": "主要挑战包括数据隐私、算法透明度、成本控制和监管合规等方面。"
        }
      ],
      "mindMap": {
        "title": "AI 发展趋势讨论",
        "children": [
          {
            "title": "技术突破",
            "children": [
              {"title": "大语言模型", "children": []},
              {"title": "多模态理解", "children": []}
            ]
          },
          {
            "title": "商业应用",
            "children": [
              {"title": "应用场景", "children": []},
              {"title": "商业化挑战", "children": []}
            ]
          }
        ]
      },
      "keywords": ["人工智能", "GPT-4", "大语言模型", "商业化", "技术突破"],
      "keySentences": [
        {
          "sentence": "GPT-4 在多个基准测试中都表现出了惊人的能力",
          "beginTime": 20000,
          "endTime": 25500
        },
        {
          "sentence": "AI 技术正在加速融入各行各业的生产流程",
          "beginTime": 380000,
          "endTime": 385000
        }
      ]
    }
  }
  ```
  
---

## 推文内容管理模块

管理和获取 BestBlogs 的推文内容，包括 Twitter/X 平台的推文及其分析数据

### 查询推文列表

- **接口地址**：`POST https://api.bestblogs.dev/openapi/v1/tweet/list`
- **接口描述**：获取分页的推文内容列表，支持多种过滤条件，返回包含推文原始数据和分析结果的高质量内容
- **请求体**（JSON 格式）：

  | 字段名             | 类型    | 是否必填 | 默认值 | 描述                     | 可选值/枚举                                                                                      |
  |-------------------|---------|----------|---------|------------------------|---------------------------------------------------------------------------------------------|
  | currentPage       | Integer | 否       | 1       | 当前页码，从 1 开始              |                                                                                             |
  | pageSize          | Integer | 否       | 10      | 每页记录数                    |                                                                                             |
  | userLanguage      | String  | 否       |         | 用户语言偏好，影响翻译显示          | `zh_CN`, `en_US`                                                                            |
  | keyword           | String  | 否       |         | 搜索关键词                    |                                                                                             |
  | sourceId          | String  | 否       |         | 推文来源账号 ID 过滤            |                                                                                             |
  | category          | String  | 否       |         | 分类过滤                     | `Artificial_Intelligence`, `Business_Tech`, `Programming_Technology`, `Product_Development` |
  | language          | String  | 否       |         | 推文语言过滤                   | `zh_CN`, `en_US`, `all`                                                                     |
  | qualifiedFilter   | String  | 否       |         | 是否精选过滤                   | `true`, `false`, `ALL`                                                                      |
  | timeFilter        | String  | 否       |         | 时间范围过滤                   | `1d`, `3d`, `1w`, `1m`, `3m`, `1y`                                                          |
  | sortType          | String  | 否       |         | 排序方式                     | `default`, `time_desc`, `score_desc`, `read_desc`                                          |
  | lowerTotalScore   | Integer | 否       |         | 最低总分过滤                   |                                                                                             |
  | upperTotalScore   | Integer | 否       |         | 最高总分过滤                   |                                                                                             |
  | mainDomainFilter  | String  | 否       |         | 主领域过滤                    | `Artificial_Intelligence`, `Business_Tech`, `Programming_Technology`, `Product_Development` |

- **响应体**（JSON 格式）：
  
  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "唯一请求 ID",
    "data": {
      "currentPage": 1,
      "pageSize": 10,
      "totalCount": 337,
      "pageCount": 34,
      "dataList": [
        {
          "resourceMeta": {
            "id": "资源唯一 ID",
            "originalTitle": "原始标题",
            "title": "优化后标题",
            "oneSentenceSummary": "一句话摘要",
            "summary": "详细摘要",
            "translateContent": "翻译后的推文内容（当用户语言与原文不符时）",
            "tags": ["标签 1", "标签 2"],
            "url": "推文链接",
            "domain": "域名",
            "language": "内容语言",
            "languageDesc": "语言描述",
            "sourceId": "来源 ID",
            "sourceName": "来源名称",
            "sourceImage": "来源头像 URL",
            "mainDomain": "主领域",
            "mainDomainDesc": "主领域描述",
            "aiSubCategory": "AI 子分类",
            "aiSubCategoryDesc": "AI 子分类描述",
            "category": "分类",
            "categoryDesc": "分类描述",
            "resourceType": "TWITTER",
            "resourceTypeDesc": "推特",
            "score": 91,
            "readCount": 6,
            "wordCount": 2997,
            "readTime": 12,
            "authors": ["作者名称"],
            "publishTimeStamp": 1755533392000,
            "publishDateStr": "08-18",
            "publishDateTimeStr": "2025-08-18 16:09:52",
            "qualified": false,
            "processFlowStatus": "COMPLETED",
            "processFlowStatusDesc": "已完成"
          },
          "tweet": {
            "id": "推文唯一 ID",
            "url": "推文链接",
            "text": "推文文本内容（可能是翻译后的）",
            "retweetCount": 134,
            "replyCount": 36,
            "likeCount": 446,
            "quoteCount": 4,
            "bookmarkCount": 28,
            "viewCount": 45090,
            "influenceScore": 90,
            "createdAt": "2025-08-18T16:09:52.000+00:00",
            "lang": "推文原始语言",
            "isReply": false,
            "inReplyToId": null,
            "conversationId": "会话 ID",
            "author": {
              "id": "作者 ID",
              "name": "作者显示名",
              "userName": "作者用户名",
              "profileImageUrl": "作者头像 URL"
            },
            "quotedTweetId": "引用推文 ID（如有）",
            "quotedTweet": null,
            "retweetedTweetId": "转推推文 ID（如有）",
            "retweetedTweet": null,
            "mediaList": [
              {
                "type": "photo",
                "mediaUrlHttps": "媒体文件 URL",
                "url": "短链接"
              }
            ],
            "urlInfos": [
              {
                "url": "短链接",
                "expandedUrl": "完整链接",
                "displayUrl": "显示链接"
              }
            ],
            "userMentions": [
              {
                "userId": "用户 ID",
                "name": "用户名",
                "userName": "用户名"
              }
            ]
          }
        }
      ]
    }
  }
  ```

- **响应字段说明**：
  
  | 字段名                           | 类型     | 说明                                               | 枚举值（如果有）                                                                                    |
  |----------------------------------|----------|-------------------------------------------------|---------------------------------------------------------------------------------------------|
  | success                          | Boolean  | 请求是否成功                                           |                                                                                             |
  | code                             | String   | 错误代码（成功时为 null）                                |                                                                                             |
  | message                          | String   | 错误消息（成功时为 null）                                |                                                                                             |
  | requestId                        | String   | 唯一请求 ID，用于追踪问题                                 |                                                                                             |
  | data                             | Object   | 分页数据容器                                           |                                                                                             |
  | └ currentPage                    | Integer  | 当前页码                                             |                                                                                             |
  | └ pageSize                       | Integer  | 每页记录数                                            |                                                                                             |
  | └ totalCount                     | Integer  | 总记录数                                             |                                                                                             |
  | └ pageCount                      | Integer  | 总页数                                              |                                                                                             |
  | └ dataList                       | Array    | 推文列表                                             |                                                                                             |
  | └ resourceMeta                   | Object   | 推文的资源元数据和分析结果                                  |                                                                                             |
  |   └ id                           | String   | 资源唯一 ID                                          |                                                                                             |
  |   └ originalTitle                | String   | 原始标题                                             |                                                                                             |
  |   └ title                        | String   | 经过优化的标题                                          |                                                                                             |
  |   └ oneSentenceSummary           | String   | 一句话摘要，快速了解核心内容                                 |                                                                                             |
  |   └ summary                      | String   | 详细摘要，包含深度分析                                    |                                                                                             |
  |   └ translateContent             | String   | 翻译后的推文内容（当用户语言偏好与原文不符时显示）                    |                                                                                             |
  |   └ tags                         | Array    | 内容标签列表                                           |                                                                                             |
  |   └ url                          | String   | 推文链接                                             |                                                                                             |
  |   └ domain                       | String   | 推文域名                                             |                                                                                             |
  |   └ language                     | String   | 内容语言                                             | `zh_CN`, `en_US`                                                                            |
  |   └ languageDesc                 | String   | 语言描述                                             | 中文，英文                                                                                       |
  |   └ sourceId                     | String   | 来源 ID                                            |                                                                                             |
  |   └ sourceName                   | String   | 来源名称                                             |                                                                                             |
  |   └ sourceImage                  | String   | 来源头像 URL                                         |                                                                                             |
  |   └ mainDomain                   | String   | 主领域分类                                            | `Artificial_Intelligence`, `Business_Tech`, `Programming_Technology`, `Product_Development` |
  |   └ mainDomainDesc               | String   | 主领域描述                                            | 人工智能，商业科技，软件编程，产品设计                                                                         |
  |   └ aiSubCategory                | String   | AI 细分类别                                          | `MODELS`, `DEV`, `PRODUCT`, `NEWS`                                                          |
  |   └ aiSubCategoryDesc            | String   | AI 细分类别描述                                        | AI 模型，AI 开发，AI 产品，AI 资讯                                                                     |
  |   └ category                     | String   | 内容分类                                             | `Artificial_Intelligence`, `Business_Tech`, `Programming_Technology`, `Product_Development` |
  |   └ categoryDesc                 | String   | 分类描述                                             | 人工智能，商业科技，软件编程，产品设计                                                                         |
  |   └ resourceType                 | String   | 资源类型                                             | `TWITTER`                                                                                   |
  |   └ resourceTypeDesc             | String   | 资源类型描述                                           | 推特                                                                                          |
  |   └ score                        | Integer  | 内容质量评分（0-100）                                   |                                                                                             |
  |   └ readCount                    | Integer  | 阅读次数                                             |                                                                                             |
  |   └ wordCount                    | Integer  | 字数统计                                             |                                                                                             |
  |   └ readTime                     | Integer  | 预估阅读时间（分钟）                                      |                                                                                             |
  |   └ authors                      | Array    | 作者列表                                             |                                                                                             |
  |   └ publishTimeStamp             | Long     | 发布时间戳（毫秒）                                        |                                                                                             |
  |   └ publishDateStr               | String   | 发布日期字符串（MM-dd 格式）                               |                                                                                             |
  |   └ publishDateTimeStr           | String   | 发布时间字符串                                          |                                                                                             |
  |   └ qualified                    | Boolean  | 是否为精选内容                                          | `true`, `false`                                                                             |
  |   └ processFlowStatus            | String   | 处理流程状态                                           | `COMPLETED`                                                                                 |
  |   └ processFlowStatusDesc        | String   | 处理流程状态描述                                         | 已完成                                                                                         |
  | └ tweet                          | Object   | 推文原始数据                                           |                                                                                             |
  |   └ id                           | String   | 推文 ID                                            |                                                                                             |
  |   └ url                          | String   | 推文链接                                             |                                                                                             |
  |   └ text                         | String   | 推文文本内容（可能经过翻译处理）                               |                                                                                             |
  |   └ retweetCount                 | Integer  | 转推数                                              |                                                                                             |
  |   └ replyCount                   | Integer  | 回复数                                              |                                                                                             |
  |   └ likeCount                    | Integer  | 点赞数                                              |                                                                                             |
  |   └ quoteCount                   | Integer  | 引用数                                              |                                                                                             |
  |   └ bookmarkCount                | Integer  | 收藏数                                              |                                                                                             |
  |   └ viewCount                    | Integer  | 查看数                                              |                                                                                             |
  |   └ influenceScore               | Integer  | 影响力评分                                            |                                                                                             |
  |   └ createdAt                    | String   | 创建时间（ISO 8601 格式）                               |                                                                                             |
  |   └ lang                         | String   | 推文原始语言                                           | `zh`, `en`                                                                                  |
  |   └ isReply                      | Boolean  | 是否为回复                                            | `true`, `false`                                                                             |
  |   └ conversationId               | String   | 会话 ID                                            |                                                                                             |
  |   └ author                       | Object   | 推文作者信息                                           |                                                                                             |
  |     └ id                         | String   | 作者 ID                                            |                                                                                             |
  |     └ name                       | String   | 作者显示名                                            |                                                                                             |
  |     └ userName                   | String   | 作者用户名                                            |                                                                                             |
  |     └ profileImageUrl            | String   | 作者头像 URL                                         |                                                                                             |
  |   └ quotedTweetId                | String   | 引用的推文 ID（如有）                                    |                                                                                             |
  |   └ quotedTweet                  | Object   | 引用的推文对象（如有）                                     |                                                                                             |
  |   └ mediaList                    | Array    | 媒体文件列表                                           |                                                                                             |
  |     └ type                       | String   | 媒体类型                                             | `photo`, `video`                                                                            |
  |     └ mediaUrlHttps              | String   | 媒体文件 URL                                         |                                                                                             |
  |     └ url                        | String   | 媒体短链接                                            |                                                                                             |
  |   └ urlInfos                     | Array    | 链接信息列表                                           |                                                                                             |
  |     └ url                        | String   | 短链接                                              |                                                                                             |
  |     └ expandedUrl                | String   | 完整链接                                             |                                                                                             |
  |     └ displayUrl                 | String   | 显示链接                                             |                                                                                             |
  |   └ userMentions                 | Array    | 提及的用户列表                                          |                                                                                             |
  |     └ userId                     | String   | 用户 ID                                            |                                                                                             |
  |     └ name                       | String   | 用户显示名                                            |                                                                                             |
  |     └ userName                   | String   | 用户名                                              |                                                                                             |

- **枚举值详细说明**：
  - **用户语言**：
    - `zh_CN`：中文
    - `en_US`：英文
  
  - **主领域分类**：
    - `Artificial_Intelligence`：人工智能
    - `Business_Tech`：商业科技
    - `Programming_Technology`：软件编程
    - `Product_Development`：产品设计
  
  - **AI 细分类别**：
    - `MODELS`：AI 模型（模型发布、技术研究等）
    - `DEV`：AI 开发（开发工具、技术教程等）
    - `PRODUCT`：AI 产品（产品分析、用户体验等）
    - `NEWS`：AI 资讯（行业动态、投资融资等）
  
  - **精选内容过滤**：
    - `true`：仅精选内容
    - `false`：仅非精选内容
    - `ALL`：全部内容
  
  - **时间范围过滤**：
    - `1d`：最近 1 天
    - `3d`：最近 3 天
    - `1w`：最近 1 周
    - `1m`：最近 1 个月
    - `3m`：最近 3 个月
    - `1y`：最近 1 年
  
  - **排序方式**：
    - `default`：默认排序
    - `time_desc`：按时间倒序
    - `score_desc`：按评分倒序
    - `read_desc`：按阅读量倒序

- **请求示例**：
  
  ```json
  {
    "timeFilter": "3d",
    "language": "all",
    "sortType": "default",
    "userLanguage": "zh",
    "currentPage": 1,
    "pageSize": 10
  }
  ```

- **响应示例**：
  
  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T1c91a7cc2b0a4982978c82f292a30638",
    "data": {
      "currentPage": 1,
      "pageSize": 10,
      "totalCount": 337,
      "pageCount": 34,
      "dataList": [
        {
          "resourceMeta": {
            "id": "RAW_1957475040523644936",
            "originalTitle": "Andrew Ng Advocates for Universities to Embrace AI Across All Fields",
            "title": "吴恩达：大学也应拥抱人工智能转型",
            "oneSentenceSummary": "吴恩达强调了埃克塞特大学在环境、科学与经济学院中整合人工智能的前瞻性做法，并强调所有大学都必须成为"人工智能大学"，不仅要教授人工智能，还要利用它来推进每个研究领域。",
            "summary": "吴恩达分享了他访问埃克塞特大学的见解，并在那里获得了荣誉博士学位...",
            "translateContent": "正如许多企业正在转型通过使用人工智能变得更有能力一样，大学也是如此...",
            "tags": ["Andrew Ng", "埃克塞特大学", "教育中的人工智能"],
            "url": "https://x.com/AndrewYNg/status/1957475040523644936",
            "domain": "x.com",
            "language": "en_US",
            "languageDesc": "英文",
            "sourceId": "SOURCE_ef9dba",
            "sourceName": "Andrew Ng(@AndrewYNg)",
            "sourceImage": "https://pbs.twimg.com/profile_images/733174243714682880/oyG30NEH_normal.jpg",
            "mainDomain": "Artificial_Intelligence",
            "mainDomainDesc": "人工智能",
            "aiSubCategory": "NEWS",
            "aiSubCategoryDesc": "AI 资讯",
            "category": "Artificial_Intelligence",
            "categoryDesc": "人工智能",
            "resourceType": "TWITTER",
            "resourceTypeDesc": "推特",
            "score": 91,
            "readCount": 6,
            "wordCount": 2997,
            "readTime": 12,
            "authors": ["Andrew Ng"],
            "publishTimeStamp": 1755533392000,
            "publishDateStr": "08-18",
            "publishDateTimeStr": "2025-08-18 16:09:52",
            "qualified": false,
            "processFlowStatus": "COMPLETED",
            "processFlowStatusDesc": "已完成"
          },
          "tweet": {
            "id": "1957475040523644936",
            "url": "https://x.com/AndrewYNg/status/1957475040523644936",
            "text": "正如许多企业正在转型通过使用人工智能变得更有能力一样，大学也是如此...",
            "retweetCount": 134,
            "replyCount": 36,
            "likeCount": 446,
            "quoteCount": 4,
            "bookmarkCount": 28,
            "viewCount": 45090,
            "influenceScore": 90,
            "createdAt": "2025-08-18T16:09:52.000+00:00",
            "lang": "en",
            "isReply": false,
            "conversationId": "1957475040523644936",
            "author": {
              "id": "216939636",
              "name": "Andrew Ng",
              "userName": "AndrewYNg",
              "profileImageUrl": "https://pbs.twimg.com/profile_images/733174243714682880/oyG30NEH_normal.jpg"
            },
            "mediaList": [
              {
                "type": "photo",
                "mediaUrlHttps": "https://pbs.twimg.com/media/GypY0xxbEAA_waR.jpg",
                "url": "https://t.co/0ZY1B35xXQ"
              }
            ]
          }
        }
      ]
    }
  }
  ```

### 获取推文详情

- **接口地址**：`GET https://api.bestblogs.dev/openapi/v1/tweet/detail`
- **接口描述**：根据推文资源 ID 获取单个推文的详细信息，包括推文原始数据和 AI 分析结果
- **请求参数**（Query 参数）：

  | 参数名   | 类型   | 是否必填 | 描述                     | 可选值/枚举 |
  |----------|--------|----------|--------------------------|-------------|
  | id       | String | 是       | 推文资源唯一 ID           |             |
  | language | String | 否       | 返回内容的语言偏好        | `zh_CN`, `en_US` |

- **响应体**（JSON 格式）：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "唯一请求 ID",
    "data": {
      "resourceMeta": {
        "id": "推文资源唯一 ID",
        "originalTitle": "原始标题",
        "title": "优化后标题",
        "oneSentenceSummary": "一句话摘要",
        "summary": "详细摘要",
        "translateContent": "翻译后的推文内容（当语言偏好与原文不符时）",
        "tags": ["标签 1", "标签 2"],
        "url": "推文链接",
        "domain": "域名",
        "language": "内容语言",
        "languageDesc": "语言描述",
        "sourceId": "来源 ID",
        "sourceName": "来源名称",
        "sourceImage": "来源头像 URL",
        "mainDomain": "主领域",
        "mainDomainDesc": "主领域描述",
        "aiSubCategory": "AI 子分类",
        "aiSubCategoryDesc": "AI 子分类描述",
        "category": "分类",
        "categoryDesc": "分类描述",
        "resourceType": "TWITTER",
        "resourceTypeDesc": "推特",
        "score": 91,
        "readCount": 6,
        "wordCount": 2997,
        "readTime": 12,
        "authors": ["作者名称"],
        "publishTimeStamp": 1755533392000,
        "publishDateStr": "08-18",
        "publishDateTimeStr": "2025-08-18 16:09:52",
        "qualified": false,
        "processFlowStatus": "COMPLETED",
        "processFlowStatusDesc": "已完成"
      },
      "tweet": {
        "id": "推文唯一 ID",
        "url": "推文链接",
        "text": "推文文本内容（可能是翻译后的）",
        "retweetCount": 134,
        "replyCount": 36,
        "likeCount": 446,
        "quoteCount": 4,
        "bookmarkCount": 28,
        "viewCount": 45090,
        "influenceScore": 90,
        "createdAt": "2025-08-18T16:09:52.000+00:00",
        "lang": "推文原始语言",
        "isReply": false,
        "conversationId": "会话 ID",
        "author": {
          "id": "作者 ID",
          "name": "作者显示名",
          "userName": "作者用户名",
          "profileImageUrl": "作者头像 URL"
        },
        "quotedTweetId": "引用推文 ID（如有）",
        "quotedTweet": "引用的推文对象（如有，结构与tweet相同）",
        "mediaList": [
          {
            "type": "photo",
            "mediaUrlHttps": "媒体文件 URL",
            "url": "短链接"
          }
        ],
        "urlInfos": [
          {
            "url": "短链接",
            "expandedUrl": "完整链接",
            "displayUrl": "显示链接"
          }
        ],
        "userMentions": [
          {
            "userId": "用户 ID",
            "name": "用户名",
            "userName": "用户名"
          }
        ]
      }
    }
  }
  ```

- **响应字段说明**：

  字段说明与推文列表查询接口相同，但返回单个 TwitterResource 对象而不是列表。

- **特殊功能说明**：
  - **智能翻译**：当用户语言偏好设置为中文，而推文原文为其他语言时，系统会自动返回翻译后的内容
  - **引用推文处理**：如果推文包含引用内容，同样支持翻译功能
  - **数据完整性**：确保返回的推文数据与原始推文保持一致性

- **请求示例**：

  ```
  GET https://api.bestblogs.dev/openapi/v1/tweet/detail?id=RAW_1957475040523644936&language=zh_CN
  ```

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "Tbd7f1e8a2c4e4db29a8e1b3f4567891a",
    "data": {
      "resourceMeta": {
        "id": "RAW_1957475040523644936",
        "originalTitle": "Andrew Ng Advocates for Universities to Embrace AI Across All Fields",
        "title": "吴恩达：大学也应拥抱人工智能转型",
        "oneSentenceSummary": "吴恩达强调了埃克塞特大学在环境、科学与经济学院中整合人工智能的前瞻性做法，并强调所有大学都必须成为"人工智能大学"，不仅要教授人工智能，还要利用它来推进每个研究领域。",
        "summary": "吴恩达分享了他访问埃克塞特大学的见解，并在那里获得了荣誉博士学位。他赞扬了埃克塞特大学独特的学院结构（环境、科学与经济），因为它促进了与人工智能的跨学科合作...",
        "translateContent": "正如许多企业正在转型通过使用人工智能变得更有能力一样，大学也是如此。我最近访问英国，在埃克塞特大学环境、科学与经济学院接受了荣誉博士学位...",
        "tags": ["Andrew Ng", "埃克塞特大学", "教育中的人工智能", "跨学科人工智能", "气候人工智能"],
        "url": "https://x.com/AndrewYNg/status/1957475040523644936",
        "domain": "x.com",
        "language": "en_US",
        "languageDesc": "英文",
        "sourceId": "SOURCE_ef9dba",
        "sourceName": "Andrew Ng(@AndrewYNg)",
        "sourceImage": "https://pbs.twimg.com/profile_images/733174243714682880/oyG30NEH_normal.jpg",
        "mainDomain": "Artificial_Intelligence",
        "mainDomainDesc": "人工智能",
        "aiSubCategory": "NEWS",
        "aiSubCategoryDesc": "AI 资讯",
        "category": "Artificial_Intelligence",
        "categoryDesc": "人工智能",
        "resourceType": "TWITTER",
        "resourceTypeDesc": "推特",
        "score": 91,
        "readCount": 6,
        "wordCount": 2997,
        "readTime": 12,
        "authors": ["Andrew Ng"],
        "publishTimeStamp": 1755533392000,
        "publishDateStr": "08-18",
        "publishDateTimeStr": "2025-08-18 16:09:52",
        "qualified": false,
        "processFlowStatus": "COMPLETED",
        "processFlowStatusDesc": "已完成"
      },
      "tweet": {
        "id": "1957475040523644936",
        "url": "https://x.com/AndrewYNg/status/1957475040523644936",
        "text": "正如许多企业正在转型通过使用人工智能变得更有能力一样，大学也是如此。我最近访问英国，在埃克塞特大学环境、科学与经济学院接受了荣誉博士学位...",
        "retweetCount": 134,
        "replyCount": 36,
        "likeCount": 446,
        "quoteCount": 4,
        "bookmarkCount": 28,
        "viewCount": 45090,
        "influenceScore": 90,
        "createdAt": "2025-08-18T16:09:52.000+00:00",
        "lang": "en",
        "isReply": false,
        "conversationId": "1957475040523644936",
        "author": {
          "id": "216939636",
          "name": "Andrew Ng",
          "userName": "AndrewYNg",
          "profileImageUrl": "https://pbs.twimg.com/profile_images/733174243714682880/oyG30NEH_normal.jpg"
        },
        "quotedTweetId": null,
        "quotedTweet": null,
        "mediaList": [
          {
            "displayUrl": "pic.x.com/0ZY1B35xXQ",
            "expandedUrl": "https://x.com/AndrewYNg/status/1957475040523644936/photo/1",
            "idStr": "1957474651782975488",
            "mediaUrlHttps": "https://pbs.twimg.com/media/GypY0xxbEAA_waR.jpg",
            "type": "photo",
            "url": "https://t.co/0ZY1B35xXQ"
          }
        ],
        "urlInfos": [
          {
            "displayUrl": "deeplearning.ai/the-batch/issu…",
            "expandedUrl": "https://www.deeplearning.ai/the-batch/issue-314/",
            "indices": [2972, 2995],
            "url": "https://t.co/Y1PyN17Qzs"
          }
        ],
        "userMentions": [
          {
            "userId": "60642183",
            "name": "University of Exeter",
            "userName": "UniofExeter"
          }
        ]
      }
    }
  }
  ```

---
