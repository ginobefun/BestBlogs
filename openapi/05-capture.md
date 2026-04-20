# BestBlogs OpenAPI v2 — 内容收藏（Capture）

Capture 模块提供对阅读内容的留存与组织能力，包括书签（Bookmarks）、划线笔记（Highlights）和阅读历史（History）。所有 Capture 接口均需要 API Key 鉴权。

---

## 书签（Bookmarks）

书签用于保存感兴趣的内容，支持添加备注，方便后续查阅。

### 获取书签列表

- **接口地址**：`GET /openapi/v2/me/bookmarks`
- **接口描述**：获取当前用户的书签列表，支持多维度过滤和分页
- **鉴权**：需要 API Key
- **请求参数**（Query）：

  | 参数 | 类型 | 必填 | 默认值 | 说明 |
  |------|------|------|--------|------|
  | page | Integer | 否 | 1 | 当前页码 |
  | pageSize | Integer | 否 | 20 | 每页数量，最大 50 |
  | tagId | String | 否 | - | 按标签 ID 过滤 |
  | folderId | String | 否 | - | 按文件夹 ID 过滤 |
  | keyword | String | 否 | - | 按标题/备注关键词搜索 |
  | sortBy | String | 否 | `createdTime` | 排序字段：`createdTime`（收藏时间）/ `publishDate`（发布时间） |
  | sortDirection | String | 否 | `DESC` | 排序方向：`ASC` / `DESC` |
  | startDate | String | 否 | - | 收藏时间起（YYYY-MM-DD） |
  | endDate | String | 否 | - | 收藏时间止（YYYY-MM-DD） |

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
      "totalCount": 42,
      "pageCount": 3,
      "dataList": [
        {
          "id": "BM_abc123",
          "resourceId": "RES_xyz789",
          "resourceType": "ARTICLE",
          "title": "DeepSeek-V3 推理优化实践",
          "summary": "本文详细介绍了 DeepSeek-V3 在推理阶段的优化策略...",
          "cover": "https://cdn.bestblogs.dev/cover/RES_xyz789.jpg",
          "sourceName": "机器之心",
          "resourceUrl": "https://example.com/article",
          "publishDate": "2026-04-19T00:00:00.000Z",
          "note": "重点看第三节的量化策略",
          "tagIds": ["TAG_001", "TAG_002"],
          "folderId": "FOLDER_001",
          "createdTime": "2026-04-20T08:30:00.000Z"
        }
      ]
    }
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | id | String | 书签唯一 ID |
  | resourceId | String | 资源 ID |
  | resourceType | String | 内容类型：`ARTICLE` / `PODCAST` / `VIDEO` / `TWEET` |
  | title | String | 内容标题 |
  | summary | String | 内容摘要 |
  | cover | String | 封面图 URL |
  | sourceName | String | 来源名称 |
  | resourceUrl | String | 原文链接 |
  | publishDate | String | 发布时间 |
  | note | String | 用户备注（可为空） |
  | tagIds | Array&lt;String&gt; | 关联的标签 ID 列表 |
  | folderId | String | 所在文件夹 ID（可为空） |
  | createdTime | String | 收藏时间 |

---

### 添加书签

- **接口地址**：`POST /openapi/v2/me/bookmarks`
- **接口描述**：将指定内容添加到书签
- **鉴权**：需要 API Key
- **请求体**（JSON）：

  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | resourceId | String | 是 | 资源 ID |
  | note | String | 否 | 用户备注 |
  | tagIds | Array&lt;String&gt; | 否 | 关联的书签标签 ID 列表 |

- **请求示例**：

  ```json
  {
    "resourceId": "RES_xyz789",
    "note": "重点看第三节的量化策略"
  }
  ```

- **响应格式**：返回创建的 `BookmarkDTO`，格式同"获取书签列表"中的单项。

---

### 更新书签

- **接口地址**：`PUT /openapi/v2/me/bookmarks/{resourceId}`
- **接口描述**：更新书签的备注或标签
- **鉴权**：需要 API Key
- **路径参数**：

  | 参数 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | resourceId | String | 是 | 资源 ID |

- **请求体**（JSON）：

  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | note | String | 否 | 新备注内容（传空字符串可清空） |
  | tagIds | Array&lt;String&gt; | 否 | 新的标签 ID 列表（全量替换） |

---

### 删除书签

- **接口地址**：`DELETE /openapi/v2/me/bookmarks/{resourceId}`
- **接口描述**：删除指定内容的书签
- **鉴权**：需要 API Key
- **路径参数**：同"更新书签"
- **响应**：`data` 为 null，`success` 为 true 即成功。

---

### 检查收藏状态

- **接口地址**：`GET /openapi/v2/me/bookmarks/{resourceId}/check`
- **接口描述**：检查指定内容是否已被收藏，适用于内容列表中的按钮状态初始化
- **鉴权**：需要 API Key
- **路径参数**：同"更新书签"

- **响应示例**：

  ```json
  {
    "success": true,
    "code": null,
    "message": null,
    "requestId": "T2f24f1e7328f4e3a80bf82bd452c0192",
    "data": {
      "bookmarked": true,
      "bookmark": {
        "id": "BM_abc123",
        "resourceId": "RES_xyz789",
        "note": "重点看第三节",
        "tagIds": [],
        "createdTime": "2026-04-20T08:30:00.000Z"
      }
    }
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | bookmarked | Boolean | 是否已收藏 |
  | bookmark | Object | 收藏详情（`bookmarked` 为 false 时为 null） |

---

## 划线笔记（Highlights）

划线笔记用于保存阅读时标记的重要文字段落，支持添加个人批注。

### 获取划线列表

- **接口地址**：`GET /openapi/v2/me/highlights`
- **接口描述**：获取当前用户的所有划线笔记，支持按内容和类型过滤
- **鉴权**：需要 API Key
- **请求参数**（Query）：

  | 参数 | 类型 | 必填 | 默认值 | 说明 |
  |------|------|------|--------|------|
  | page | Integer | 否 | 1 | 当前页码 |
  | pageSize | Integer | 否 | 20 | 每页数量 |
  | entryType | String | 否 | `all` | 类型过滤：`all`（全部）/ `highlight`（仅划线）/ `note`（仅有批注的划线） |
  | resourceId | String | 否 | - | 按内容 ID 过滤 |
  | tagId | String | 否 | - | 按标签 ID 过滤 |
  | keyword | String | 否 | - | 按划线文字或批注关键词搜索 |

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
      "totalCount": 15,
      "pageCount": 1,
      "dataList": [
        {
          "id": "HL_abc123",
          "resourceId": "RES_xyz789",
          "resourceTitle": "DeepSeek-V3 推理优化实践",
          "resourceUrl": "https://bestblogs.dev/read/RES_xyz789",
          "resourceType": "ARTICLE",
          "highlightedText": "使用 FP8 量化可将 KV Cache 显存减少约 40%",
          "note": "这个优化思路可以应用到我们自己的项目中",
          "color": "yellow",
          "tagIds": ["TAG_001"],
          "folderId": null,
          "position": {
            "startOffset": 1240,
            "endOffset": 1282,
            "paragraphIndex": 5
          },
          "createdTime": "2026-04-20T09:15:00.000Z"
        }
      ]
    }
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | id | String | 划线唯一 ID |
  | resourceId | String | 所属内容 ID |
  | resourceTitle | String | 内容标题 |
  | resourceUrl | String | 内容链接 |
  | resourceType | String | 内容类型 |
  | highlightedText | String | 划线的原文文字 |
  | note | String | 用户批注（可为空） |
  | color | String | 划线颜色：`yellow` / `green` / `blue` / `pink` / `purple` |
  | tagIds | Array&lt;String&gt; | 关联的标签 ID 列表 |
  | folderId | String | 所在文件夹 ID（可为空） |
  | position | Object | 划线位置信息（用于页面精确定位） |
  | └ startOffset | Integer | 起始字符偏移量 |
  | └ endOffset | Integer | 结束字符偏移量 |
  | └ paragraphIndex | Integer | 所在段落索引（从 0 开始） |
  | createdTime | String | 创建时间 |

---

### 获取指定内容的全部划线

- **接口地址**：`GET /openapi/v2/me/highlights/resource/{resourceId}`
- **接口描述**：获取用户在某篇内容上的全部划线笔记，用于在阅读页面恢复划线状态
- **鉴权**：需要 API Key
- **路径参数**：

  | 参数 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | resourceId | String | 是 | 资源 ID |

- **响应格式**：`data` 为 `HighlightDTO` 数组（非分页），格式同划线列表中的单项。

---

### 添加划线

- **接口地址**：`POST /openapi/v2/me/highlights`
- **接口描述**：保存阅读时选取的文字段落，可附加个人批注和颜色
- **鉴权**：需要 API Key
- **请求体**（JSON）：

  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | resourceId | String | 是 | 资源 ID |
  | highlightedText | String | 是 | 划线文字内容 |
  | note | String | 否 | 用户批注 |
  | color | String | 否 | 颜色：`yellow`（默认）/ `green` / `blue` / `pink` / `purple` |

- **请求示例**：

  ```json
  {
    "resourceId": "RES_xyz789",
    "highlightedText": "使用 FP8 量化可将 KV Cache 显存减少约 40%",
    "note": "这个优化思路可以应用到我们自己的项目中",
    "color": "yellow"
  }
  ```

- **响应格式**：返回创建的 `HighlightDTO`，格式同划线列表中的单项。

---

### 更新划线

- **接口地址**：`PUT /openapi/v2/me/highlights/{highlightId}`
- **接口描述**：更新划线的批注内容或颜色
- **鉴权**：需要 API Key
- **路径参数**：

  | 参数 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | highlightId | String | 是 | 划线 ID |

- **请求体**（JSON）：

  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | note | String | 否 | 新批注内容 |
  | color | String | 否 | 新颜色 |

---

### 删除划线

- **接口地址**：`DELETE /openapi/v2/me/highlights/{highlightId}`
- **接口描述**：删除指定划线笔记
- **鉴权**：需要 API Key
- **路径参数**：同"更新划线"
- **响应**：`data` 为 null，`success` 为 true 即成功。

---

## 阅读历史（History）

阅读历史自动记录用户浏览过的内容，支持查询和清理。

### 获取阅读历史

- **接口地址**：`GET /openapi/v2/me/history`
- **接口描述**：获取当前用户的阅读历史记录，按阅读时间降序排列
- **鉴权**：需要 API Key
- **请求参数**（Query）：

  | 参数 | 类型 | 必填 | 默认值 | 说明 |
  |------|------|------|--------|------|
  | page | Integer | 否 | 1 | 当前页码 |
  | pageSize | Integer | 否 | 20 | 每页数量，最大 50 |

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
      "totalCount": 128,
      "pageCount": 7,
      "dataList": [
        {
          "resourceId": "RES_xyz789",
          "resourceType": "ARTICLE",
          "title": "DeepSeek-V3 推理优化实践",
          "summary": "本文详细介绍了 DeepSeek-V3...",
          "cover": "https://cdn.bestblogs.dev/cover/RES_xyz789.jpg",
          "sourceName": "机器之心",
          "resourceUrl": "https://bestblogs.dev/read/RES_xyz789",
          "publishDate": "2026-04-19T00:00:00.000Z",
          "readTime": "2026-04-20T09:00:00.000Z"
        }
      ]
    }
  }
  ```

- **响应字段说明**：

  | 字段 | 类型 | 说明 |
  |------|------|------|
  | resourceId | String | 资源 ID |
  | resourceType | String | 内容类型 |
  | title | String | 内容标题 |
  | summary | String | 摘要 |
  | cover | String | 封面图 URL |
  | sourceName | String | 来源名称 |
  | resourceUrl | String | 内容链接 |
  | publishDate | String | 发布时间 |
  | readTime | String | 阅读时间 |

---

### 删除历史记录

- **接口地址**：`DELETE /openapi/v2/me/history/{resourceId}`
- **接口描述**：删除特定内容的阅读历史记录
- **鉴权**：需要 API Key
- **路径参数**：

  | 参数 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | resourceId | String | 是 | 资源 ID |

- **响应**：`data` 为 null，`success` 为 true 即成功。

---

### 清空全部历史

- **接口地址**：`DELETE /openapi/v2/me/history`
- **接口描述**：清空当前用户的全部阅读历史记录（**不可恢复**）
- **鉴权**：需要 API Key
- **请求体**：无
- **响应**：`data` 为 null，`success` 为 true 即成功。

---

## 典型 Capture 流程示例

```bash
# 阅读时保存书签（可附备注）
POST /openapi/v2/me/bookmarks
Body: {"resourceId": "RES_xyz789", "note": "重点看量化策略一节"}

# 保存划线段落
POST /openapi/v2/me/highlights
Body: {"resourceId": "RES_xyz789", "highlightedText": "FP8量化降低40%显存", "color": "yellow"}

# 查看全部书签（按收藏时间倒序）
GET /openapi/v2/me/bookmarks?sortBy=createdTime&sortDirection=DESC

# 查看某篇内容的划线（阅读页面恢复状态）
GET /openapi/v2/me/highlights/resource/RES_xyz789

# 检查某内容是否已收藏（用于更新 UI 状态）
GET /openapi/v2/me/bookmarks/RES_xyz789/check
```
