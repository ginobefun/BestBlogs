# BestBlogs OpenAPI v2 — 兴趣画像建立（Intake）

Intake 是使用 BestBlogs 个性化功能的起点。通过以下接口，可以完成"冷启动"流程：选择兴趣标签 → 关注推荐源 → 完成引导，之后即可享受个性化的 For You 信息流和每日简报。

**典型流程**：
```
获取标签库 → 设置兴趣 → 获取推荐订阅源 → 批量关注 → 完成引导
```

---

## 接口列表

### 获取兴趣标签库

- **接口地址**：`GET /openapi/v2/interests/tags`
- **接口描述**：获取全量兴趣标签，按领域分组展示。可用于冷启动标签选择页面或标签库浏览。
- **鉴权**：需要 API Key
- **请求参数**（Query）：

  | 参数 | 类型 | 必填 | 默认值 | 说明 |
  |------|------|------|--------|------|
  | category | String | 否 | - | 按分类筛选，如 `Programming` |
  | keyword | String | 否 | - | 标签名称关键词搜索 |
  | limit | Integer | 否 | 100 | 最大返回数量 |

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
    "data": {
      "groups": [
        {
          "category": "AI & Machine Learning",
          "tags": [
            {
              "id": "tag_001",
              "code": "ai-coding",
              "zhName": "AI 编程",
              "enName": "AI Coding",
              "type": "topic",
              "category": "AI & Machine Learning",
              "parentCode": "artificial-intelligence",
              "exposedToUser": true,
              "usedInColdStart": true,
              "enabled": true,
              "referenceCount": 1234
            }
          ]
        }
      ],
      "total": 86
    }
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | groups | Array | 按分类分组的标签列表 |
  | └ category | String | 分类名称（如 `AI & Machine Learning`、`Programming`） |
  | └ tags | Array | 该分类下的标签列表 |
  |   └ id | String | 标签唯一 ID（MongoDB _id） |
  |   └ code | String | 标签编码，全局唯一（如 `ai-coding`） |
  |   └ zhName | String | 标签中文名称 |
  |   └ enName | String | 标签英文名称 |
  |   └ type | String | 标签类型：`domain`（领域）/ `topic`（主题）/ `entity`（实体）/ `format`（形式） |
  |   └ category | String | 所属分类 |
  |   └ parentCode | String | 父级标签编码 |
  |   └ usedInColdStart | Boolean | 是否用于冷启动选择 |
  |   └ referenceCount | Integer | 选择该标签的用户数，可用于排序展示热度 |
  | total | Integer | 标签总数（所有分类之和） |

---

### 获取我的兴趣画像

- **接口地址**：`GET /openapi/v2/me/interests`
- **接口描述**：获取当前用户的完整兴趣画像，包含主动选择的显式兴趣和行为推断的隐式兴趣
- **鉴权**：需要 API Key

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
    "data": {
      "userId": "USER_abc123",
      "onboardingCompleted": true,
      "languagePreference": "both",
      "driftDetected": false,
      "explicitInterests": [
        {
          "tagId": "tag_001",
          "code": "ai-coding",
          "zhName": "AI 编程",
          "enName": "AI Coding",
          "category": "AI & Machine Learning",
          "weight": 1.0,
          "selectedTime": "2026-02-22T08:00:00.000Z"
        }
      ],
      "implicitInterests": [
        {
          "tagId": "tag_002",
          "code": "llm-application",
          "zhName": "LLM 应用",
          "enName": "LLM Application",
          "weight": 0.85
        }
      ],
      "recentActiveTopics": ["AI 编程", "LLM 应用", "开源工具"]
    }
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | userId | String | 用户 ID |
  | onboardingCompleted | Boolean | 是否已完成冷启动引导 |
  | languagePreference | String | 内容语言偏好：`zh_first` / `en_first` / `both` |
  | driftDetected | Boolean | 是否检测到兴趣漂移（隐式兴趣 Top 标签发生显著变化） |
  | explicitInterests | Array | 用户主动选择的兴趣标签列表 |
  | └ tagId | String | 标签 ID |
  | └ code | String | 标签编码 |
  | └ zhName | String | 标签中文名 |
  | └ enName | String | 标签英文名 |
  | └ category | String | 所属分类 |
  | └ weight | Double | 用户设置的权重（0.1 ~ 2.0，默认 1.0） |
  | └ selectedTime | String | 选择时间（ISO 8601，UTC） |
  | implicitInterests | Array | 系统根据阅读行为推断的兴趣标签（按权重降序） |
  | └ tagId | String | 标签 ID |
  | └ code | String | 标签编码 |
  | └ weight | Double | 推断权重（基于行为频次计算） |
  | recentActiveTopics | Array&lt;String&gt; | 近 7 天权重最高的隐式标签名列表 |

---

### 更新我的兴趣

- **接口地址**：`PUT /openapi/v2/me/interests`
- **接口描述**：更新用户的显式兴趣标签。支持全量替换（REPLACE）或增量合并（MERGE）两种模式。
- **鉴权**：需要 API Key
- **请求体**（JSON）：

  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | mode | String | 是 | 更新模式：`REPLACE`（清空后重建）/ `MERGE`（追加不存在的标签） |
  | interests | Array | 是 | 兴趣标签列表 |
  | └ tagId | String | 是 | 标签 ID（来自标签库接口） |
  | └ weight | Double | 否 | 权重（0.1 ~ 2.0，默认 1.0） |
  | languagePreference | String | 否 | 内容语言偏好：`zh_first` / `en_first` / `both` |

- **请求示例**：

  ```json
  {
    "mode": "REPLACE",
    "interests": [
      { "tagId": "tag_001", "weight": 1.5 },
      { "tagId": "tag_002", "weight": 1.0 }
    ],
    "languagePreference": "both"
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | savedCount | Integer | 成功保存的兴趣标签数量 |
  | languagePreference | String | 生效的语言偏好 |

---

### 获取 Onboarding 状态

- **接口地址**：`GET /openapi/v2/me/onboarding/status`
- **接口描述**：查询当前用户的冷启动引导完成状态
- **鉴权**：需要 API Key

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
    "data": {
      "onboardingCompleted": false,
      "autoInitialized": false,
      "explicitInterestCount": 0,
      "subscribedSourceCount": 2,
      "shouldShowOnboarding": true
    }
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | onboardingCompleted | Boolean | 是否已完成引导 |
  | autoInitialized | Boolean | 是否为存量用户自动初始化（无需再次引导） |
  | explicitInterestCount | Integer | 已选择的显式兴趣标签数量 |
  | subscribedSourceCount | Integer | 当前订阅的内容源数量 |
  | shouldShowOnboarding | Boolean | 是否应向用户展示引导流程 |

---

### 获取推荐订阅源

- **接口地址**：`GET /openapi/v2/me/onboarding/recommended-sources`
- **接口描述**：根据用户已设置的兴趣标签，推荐匹配的内容订阅源。通常在完成兴趣选择后调用。
- **鉴权**：需要 API Key
- **请求参数**（Query）：

  | 参数 | 类型 | 必填 | 默认值 | 说明 |
  |------|------|------|--------|------|
  | limit | Integer | 否 | 10 | 返回数量上限，最大 20 |
  | language | String | 否 | - | 语言过滤：`zh_CN` / `en_US` |

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
    "data": [
      {
        "id": "SOURCE_e24314",
        "name": "机器之心",
        "description": "专注 AI 技术的中文媒体",
        "image": "https://cdn.bestblogs.dev/source/jiqizhixin.png",
        "url": "https://www.jiqizhixin.com/",
        "resourceType": "ARTICLE",
        "resourceTypeDesc": "文章",
        "category": "Artificial_Intelligence",
        "categoryDesc": "人工智能",
        "language": "zh_CN",
        "languageDesc": "中文",
        "subscriberCount": 3456,
        "subscribed": false,
        "countInPast3Months": 120,
        "qualifiedCountInPast3Months": 45,
        "readCountInPast3Months": 8900,
        "priority": "HIGH",
        "visibility": "SYSTEM",
        "lastLiveTime": "2026-04-19T12:00:00Z"
      }
    ]
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | id | String | 订阅源 ID |
  | name | String | 订阅源名称 |
  | description | String | 描述 |
  | image | String | 图标/封面图 URL |
  | url | String | 网站地址 |
  | resourceType | String | 内容类型：`ARTICLE` / `PODCAST` / `VIDEO` / `TWEET` |
  | category | String | 主分类编码 |
  | language | String | 内容语言：`zh_CN` / `en_US` |
  | subscriberCount | Integer | 订阅人数（用于热度排序） |
  | subscribed | Boolean | 当前用户是否已订阅 |
  | countInPast3Months | Integer | 近 3 个月内容总数 |
  | qualifiedCountInPast3Months | Integer | 近 3 个月精选内容数 |
  | priority | String | 运营优先级：`HIGHEST` / `HIGH` / `MEDIUM` / `LOW` / `LOWEST` |
  | visibility | String | 可见性：`SYSTEM`（平台内置）/ `PUBLIC`（用户公开）/ `PRIVATE`（用户私有） |
  | lastLiveTime | String | 最后一次产生新内容的时间（ISO 8601，UTC）。null 表示尚无内容。 |

---

### 批量关注订阅源

- **接口地址**：`POST /openapi/v2/me/onboarding/follow`
- **接口描述**：批量关注指定订阅源，通常在推荐源步骤完成后调用
- **鉴权**：需要 API Key
- **请求体**（JSON）：

  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | sourceIds | Array&lt;String&gt; | 是 | 要关注的订阅源 ID 列表 |

- **请求示例**：

  ```json
  {
    "sourceIds": ["SOURCE_e24314", "SOURCE_f38521", "SOURCE_a19832"]
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | followedCount | Integer | 成功关注的数量 |
  | skippedCount | Integer | 跳过的数量（已关注或不存在） |

---

### 完成 Onboarding 引导

- **接口地址**：`POST /openapi/v2/me/onboarding/complete`
- **接口描述**：标记用户已完成冷启动引导。完成后 `shouldShowOnboarding` 将变为 `false`，For You 信息流开始基于兴趣画像个性化推荐。
- **鉴权**：需要 API Key
- **请求体**：无

- **响应**：返回更新后的 `OnboardingStatusDTO`，同"获取 Onboarding 状态"响应格式。

---

## 典型 Intake 流程示例

```bash
# 1. 查看兴趣标签库
GET /openapi/v2/interests/tags?limit=60

# 2. 设置兴趣（选取 ai-coding、llm-application 两个标签）
PUT /openapi/v2/me/interests
Body: {"mode": "REPLACE", "interests": [{"tagId": "tag_001"}, {"tagId": "tag_002"}], "languagePreference": "both"}

# 3. 获取推荐订阅源
GET /openapi/v2/me/onboarding/recommended-sources?limit=10

# 4. 关注推荐的源
POST /openapi/v2/me/onboarding/follow
Body: {"sourceIds": ["SOURCE_e24314", "SOURCE_f38521"]}

# 5. 完成引导
POST /openapi/v2/me/onboarding/complete
```
