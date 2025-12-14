# BestBlogs.dev RSS 订阅指南

BestBlogs.dev 提供了灵活的 RSS 订阅功能，让您可以根据自己的需求订阅感兴趣的技术文章。

## RSS 订阅地址

基础订阅地址：

- 中文：`https://www.bestblogs.dev/zh/feeds/rss`
- 英文：`https://www.bestblogs.dev/en/feeds/rss`

## 支持的过滤参数

您可以使用以下参数来自定义您的 RSS 订阅内容：

### 1. 分类过滤 (category)

按文章分类进行过滤

- 参数名：`category`
- 可选值：
  - `programming`：编程开发
  - `ai`：人工智能
  - `product`：产品设计
  - `business`：商业科技

- 示例：`/feeds/rss?category=programming`

### 2. 精选文章 (featured)

只看精选文章

- 参数名：`featured`
- 可选值：`y`
- 示例：`/feeds/rss?featured=y`

### 3. 语言过滤 (language)

按文章语言进行过滤

- 参数名：`language`
- 可选值：
  - `all`：所有语言（默认）
  - `zh`：中文
  - `en`：英文
- 示例：`/feeds/rss?language=zh`

### 4. 时间范围 (timeFilter)

按发布时间进行过滤

- 参数名：`timeFilter`
- 可选值：
  - `1d`：最近一天
  - `3d`：最近三天
  - `1w`：最近一周（默认）
  - `1m`：最近一月
  - `3m`：最近三月
- 示例：`/feeds/rss?timeFilter=1d`

### 5. 最低评分 (minScore)

按文章评分进行过滤

- 参数名：`minScore`
- 取值范围：0-100
- 示例：`/feeds/rss?minScore=85`

### 6. 关键词搜索 (keyword)

按关键词搜索文章

- 参数名：`keyword`
- 示例：`/feeds/rss?keyword=ChatGPT`

### 7. 资源类型 (type)

按资源类型进行过滤

- 参数名：`type`
- 可选值：
  - `article`：文章
  - `podcast`：播客
  - `video`：视频
  - `twitter`：推文

- 示例：`/feeds/rss?type=article`


## 参数组合示例

您可以组合使用多个参数来精确定制您的订阅内容：

1. 订阅高质量编程内容：

```url
https://www.bestblogs.dev/zh/feeds/rss?category=programming&minScore=85
```

2. 订阅最近一天的 AI 精选文章：

```url
https://www.bestblogs.dev/zh/feeds/rss?category=ai&featured=y&timeFilter=1d&type=article
```

3. 订阅包含特定关键词的高分内容：

```url
https://www.bestblogs.dev/zh/feeds/rss?keyword=Agent&minScore=85
```

4. 订阅英文精选内容：

```url
https://www.bestblogs.dev/en/feeds/rss?featured=y&language=en
```

5、订阅视频内容：

```url
https://www.bestblogs.dev/zh/feeds/rss?type=video
```

6、订阅订阅推文内容：

```url
https://www.bestblogs.dev/zh/feeds/rss?type=twitter
```

## 更新频率

- RSS 内容每小时更新一次
- 每个 feed 最多返回 100 篇文章
- 文章按发布时间倒序排列

## 注意事项

1. 建议根据您的具体需求选择合适的过滤参数，避免获取过多不相关的内容
2. 如果您使用多个过滤参数，它们之间是"与"的关系
3. 时间范围建议选择合适的区间，过长的时间范围可能会影响加载速度
4. 评分过滤建议从 85 分开始，这样可以确保文章质量

## 反馈与支持

如果您在使用 RSS 订阅时遇到任何问题，或有任何建议，请通过以下方式联系我们：

- GitHub Issues: <https://github.com/ginobefun/bestblogs/issues>
- 电子邮件: <gino@bestblogs.dev>
