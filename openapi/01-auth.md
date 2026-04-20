# BestBlogs OpenAPI v2 — 认证与身份

## 概览

BestBlogs OpenAPI v2 是面向开发者和 CLI/Agent 工具的开放接口，当前版本随 `@bestblogs/cli` v2.0.8 一同发布。

- **Base URL**：`https://api.bestblogs.dev/openapi/v2`
- **开发环境**：`http://localhost:8090/openapi/v2`

---

## 鉴权方式

在 Request Header 中携带 `X-API-KEY`：

```http
X-API-KEY: your_api_key_here
```

API Key 可在 BestBlogs 设置页面获取，或通过 `bestblogs auth login` 命令配置。

**标注说明**：

所有接口均需在请求头携带有效的 `X-API-KEY`。仅部分接口额外要求 Pro 订阅状态。

| 标注 | 含义 |
|------|------|
| 需要 API Key | 请求头必须包含有效的 X-API-KEY |
| 需要 Pro | 需要 API Key 且用户为 Pro 订阅状态 |

---

## 公共响应格式

所有接口均遵循以下统一响应结构：

```json
{
  "success": true,
  "code": null,
  "message": null,
  "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
  "data": {}
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| success | Boolean | 请求是否成功 |
| code | String | 错误代码（成功时为 null） |
| message | String | 错误消息（成功时为 null） |
| requestId | String | 唯一请求 ID，排查问题时提供此值 |
| data | Object | 业务数据（失败时可能为 null） |

### 分页响应格式

列表类接口的 `data` 字段为分页结构：

```json
{
  "currentPage": 1,
  "pageSize": 20,
  "totalCount": 100,
  "pageCount": 5,
  "dataList": []
}
```

---

## 常见错误代码

| HTTP 状态码 | 错误代码 | 说明 |
|------------|----------|------|
| 401 | AUTH_001 | API Key 缺失 |
| 401 | AUTH_002 | API Key 无效 |
| 403 | AUTH_003 | 权限不足（如访问 Pro 专属接口） |
| 400 | PARAM_001 | 请求参数错误 |
| 404 | NOT_FOUND | 资源不存在 |
| 429 | RATE_LIMIT | 触发限流，请稍后重试 |
| 500 | SYS_ERROR | 服务内部错误 |

---

## 公共枚举值

以下枚举在多个接口中复用，此处统一说明。

### 语言（language）

| 值 | 说明 |
|----|------|
| `zh_CN` | 中文内容 |
| `en_US` | 英文内容 |

### 语言偏好（languagePreference）

| 值 | 说明 |
|----|------|
| `zh_first` | 优先推荐中文内容 |
| `en_first` | 优先推荐英文内容 |
| `both` | 中英文均可（默认） |

### 内容类型（resourceType）

| 值 | 说明 |
|----|------|
| `ARTICLE` | 文章 |
| `PODCAST` | 播客 |
| `VIDEO` | 视频 |
| `TWEET` | 推文 |

### 内容分类（category）

| 值 | 说明 |
|----|------|
| `Artificial_Intelligence` | 人工智能 |
| `Programming_Technology` | 软件编程 |
| `Business_Tech` | 商业科技 |
| `Product_Development` | 产品设计 |

### 用户层级（userTier）

| 值 | 说明 |
|----|------|
| `FREE` | 免费用户 |
| `PRO` | Pro 订阅用户 |

---

## 接口列表

### 获取当前用户信息

- **接口地址**：`GET /openapi/v2/me`
- **接口描述**：获取当前 API Key 对应的用户基础信息、Pro 状态和配置偏好
- **鉴权**：需要 API Key
- **请求参数**：无

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
    "data": {
      "userId": "USER_abc123",
      "email": "user@example.com",
      "userName": "johndoe",
      "displayName": "John Doe",
      "avatarUrl": "https://cdn.bestblogs.dev/avatar/abc123.jpg",
      "userTier": "PRO",
      "language": "zh_CN",
      "onboardingCompleted": true,
      "interestTags": ["ai-coding", "llm-application"],
      "briefEmailEnabled": true,
      "notificationTimezone": "Asia/Shanghai",
      "notificationDeliveryTime": "08:00",
      "oauthProvider": "GOOGLE",
      "hasPassword": false,
      "adminFlag": false
    }
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | userId | String | 用户唯一 ID |
  | email | String | 登录邮箱 |
  | userName | String | 用户名（来自 OAuth 或邮箱前缀） |
  | displayName | String | 显示名称 |
  | avatarUrl | String | 头像 URL |
  | userTier | String | 用户层级：`FREE` / `PRO` |
  | language | String | 界面语言偏好：`zh_CN` / `en_US` |
  | onboardingCompleted | Boolean | 是否已完成冷启动引导 |
  | interestTags | Array&lt;String&gt; | 用户选择的兴趣标签 ID 列表（轻量化） |
  | briefEmailEnabled | Boolean | 是否启用每日早报邮件推送 |
  | notificationTimezone | String | 通知时区（IANA 格式，如 `Asia/Shanghai`） |
  | notificationDeliveryTime | String | 通知发送时间（HH:mm 格式） |
  | oauthProvider | String | OAuth 登录提供商：`GOOGLE` / `GITHUB` / null（本地账号） |
  | hasPassword | Boolean | 是否已设置密码 |

---

### 获取 Pro 订阅状态

- **接口地址**：`GET /openapi/v2/me/pro/status`
- **接口描述**：获取当前用户的 Pro 订阅状态、有效期和剩余天数
- **鉴权**：需要 API Key

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
    "data": {
      "tier": "PRO",
      "active": true,
      "proStartTime": "2026-01-01T00:00:00Z",
      "proEndTime": "2027-01-01T00:00:00Z",
      "daysRemaining": 255
    }
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | tier | String | 当前层级：`FREE` / `PRO` |
  | active | Boolean | Pro 订阅是否处于有效期内 |
  | proStartTime | String | Pro 订阅开始时间（ISO 8601，UTC） |
  | proEndTime | String | Pro 订阅到期时间（ISO 8601，UTC） |
  | daysRemaining | Integer | Pro 有效期剩余天数（已过期则为 0） |
