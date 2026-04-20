# CURRENT_STATE.md — 当前状态与路线图

更新时间：2026-04-12（v2.0 生产上线；内测期启动（4/12–4/30）；GitHub Issues 工作流建立）

> 产品蓝图见 `2-PRODUCT.md`，架构细节见 `4-ARCHITECTURE.md`。

## 当前阶段：Phase 1（个性化阅读工作流）

**阶段目标：**

- 稳定 Daily Brief（文本/音频/邮件）全链路可用性
- 优化 Pro 升级路径与订阅留存
- 完成 Landing 2.0 改版，强化价值传达路径
- Pro 付费验证三阶段：
  - **邀请内测**（→ 2026-05-01）：赞赏用户 + 资深用户定向邀请，≤50 人，修复与完善核心功能
  - **早鸟开放**（2026-05-01 → 2026-09-01）：开放注册，早鸟价 $10/月
  - **正式定价**（2026-09-01 起）：恢复原价 $20/月，首次开通 Pro 享 8 折优惠（$16/月）

**关注指标：** Pro 转化率、Brief 使用率、7/30 日留存。

**进入 Phase 2 的信号：**

| 信号类型 | 判断逻辑 |
|---------|---------|
| 留存验证 | Pro 用户 30 日留存稳定，且留存主要由工作流使用驱动 |
| 付费验证 | Free → Pro 转化率稳定，Pro 续订率表明用户认可持续价值 |
| 工作流闭环 | 早报 + 为你推荐成为主要入口，发现到阅读链路稳定覆盖 |
| 质量池规模 | 公共质量池日均新增与质量判断准确率达到自运转水平 |

---

## 内测期任务跟踪（2026-04-12 → 04-30）

> 所有任务通过 GitHub Issues 跟踪：https://github.com/ginobefun/bestblogs-monorepo/issues
> 每次提交需关联 Issue，规范见 `7-CONVENTIONS.md §6`。

### 用户放量计划

| 时间 | 目标人数 | 来源 |
|------|---------|------|
| 第1周（4/12–4/18） | 10 人 | 赞赏用户 + 核心关注者 |
| 第2周（4/19–4/25） | 20 人 | 扩大邀请 |
| 第3周（4/26–4/30） | 50 人 | 定向推广，准备 5/1 早鸟开放 |

### P0 本周必做（4/12–4/18）

| Issue | 任务 | 状态 |
|-------|------|------|
| [#96](https://github.com/ginobefun/bestblogs-monorepo/issues/96) | 部署 ElasticSearch + 向量搜索 | ⬜ 待开始 |
| [#97](https://github.com/ginobefun/bestblogs-monorepo/issues/97) | 解决 fish.audio 限流，接入备用 TTS | ⬜ 待开始 |
| [#98](https://github.com/ginobefun/bestblogs-monorepo/issues/98) | 每日早报：skills 手动验证启动 | ⬜ 待开始 |
| [#99](https://github.com/ginobefun/bestblogs-monorepo/issues/99) | 设计邀请内测问卷与用户引导 | ⬜ 待开始 |

### P1 第二周重点（4/19–4/25）

| Issue | 任务 | 状态 |
|-------|------|------|
| [#100](https://github.com/ginobefun/bestblogs-monorepo/issues/100) | 每日回顾：Phase C 观测 → Phase D 决策（4/22 节点） | 🔄 Phase C 进行中 |
| [#101](https://github.com/ginobefun/bestblogs-monorepo/issues/101) | 早报个性化定制：Settings 连通后端 | ⬜ 待开始 |
| [#102](https://github.com/ginobefun/bestblogs-monorepo/issues/102) | 视频 Job 开关：skills 质检 → 自动化 | ⬜ 待开始 |
| [#103](https://github.com/ginobefun/bestblogs-monorepo/issues/103) | 30天宣传基础：文案 + SEO + 操作指南 | ⬜ 待开始 |

### P2 第三周收尾（4/26–4/30）

| Issue | 任务 | 状态 |
|-------|------|------|
| [#98](https://github.com/ginobefun/bestblogs-monorepo/issues/98) | 打开 UserBriefJob 自动化（质量验证通过后） | ⬜ 待开始 |
| [#104](https://github.com/ginobefun/bestblogs-monorepo/issues/104) | 沉浸式翻译：替换 wenrun.ai，Pro 权益 | ⬜ 待开始 |
| [#105](https://github.com/ginobefun/bestblogs-monorepo/issues/105) | 主题页面：先完成 5 个热门主题 | ⬜ 待开始 |
| [#106](https://github.com/ginobefun/bestblogs-monorepo/issues/106) | 兴趣标签整理 skill + 手动打标 | ⬜ 待开始 |
| [#107](https://github.com/ginobefun/bestblogs-monorepo/issues/107) | 更新 BestBlogs 对外 README | ⬜ 待开始 |

### P3 早鸟期后（5/1+）

| Issue | 任务 | 状态 |
|-------|------|------|
| [#108](https://github.com/ginobefun/bestblogs-monorepo/issues/108) | bestblogs-cli 开发（OpenAPI + Skills 封装） | ⬜ 待开始 |

---

## 里程碑状态（按飞轮层级）

> 图例：✅ 开发完成（待 QA） ／ 🔄 开发中 ／ ⬜ 待开始

### 第一层：公共策展质量池

#### M3 核心内容平台 ⬜ 待验证

- 多源内容采集（RSS 等），自动同步与去重
- AI 初评评分体系：质量/相关性/新颖度等结构化评分
- 专家精审闭环：人工审核确认，双层质量把关
- 内容状态机：WAIT_PREPARE → WAIT_ANALYSIS → WAIT_REVIEW → COMPLETED 完整流转
- 元数据自动提取：标题/摘要/作者/来源/实体标签
- 多语言翻译：内容自动翻译，支持中英文消费

#### M4 每日早报 Daily Brief ✅ 开发完成（待 QA）

- 公共早报：每日定时策展摘要，展示 BestBlogs 判断力（06:30 发布）
- 我的早报（Pro）：基于用户兴趣个性化生成（07:00 发布）
- 音频早报：文本转语音，支持移动端收听（07:30 完成）
- 邮件推送：早报邮件递送（08:30），**v2.0.5 升级为 MJML Newsletter 模板**：Top 3 头条级（摘要+关键洞察+扩展阅读）+ 7 条摘要级内容，或精简版一屏扫读。设置页可选 `NEWSLETTER` / `NEWSLETTER_COMPACT` / `PODCAST`，邮件通过 `BriefDeliveryService` 统一编排 cron + Skills 导入双触发（分布式锁 + bb_user_op_log 幂等）
- AI 摘要：内容要点提炼与优先级排序
- 微信群推送：公共早报文本版推送至微信群（WeChatBriefPushJob）
- 失败自动重试：GlobalBriefRetryJob 在生成失败时自动恢复
- 质量监控：BriefQualityMonitor 追踪生成成功率与质量指标
- **播客化内容结构**：早报数据模型支持完整播客结构（podcastScript、transcriptionSegments、autoChapters、podcastShowNotes、keywords、deepReadItems 多条），前端复用播客类型，`DailyBriefDomainService` 拆分为 `GlobalBriefDomainService` + `UserBriefDomainService`（详见 `specs/briefing-podcast-structure.md`）
- **每日回顾 Daily Review（Pro）**：Pro 专属晚间回顾（21:00 批量 + 按需生成），含阅读足迹回顾、AI 摘要、思考记录。**Phase C Measurement（2026-04-08 → 2026-04-22）进行中**：已接入 PostHog Cloud (US)，上线 10 个事件（spec §埋点事件 + 3 个漏斗补齐），两周观察期结束后按 `specs/daily-review-phase-d-decision-matrix.md` 判定是否进入 Phase D；看板配置见 `specs/daily-review-analytics-dashboard.md`
- **历史日期导航**：「查看昨日」入口内嵌至早报 Header，跳转至 `/explore/brief/[date]`（公共）或 `/reading/brief/[date]`（Pro），同一 `BriefContent` 组件复用，历史页含「返回今日」回退；历史 Tab 列表移除，改为直接 URL 访问；后端新增 `GET /api/briefs/public/{date}` 端点（无需登录，CDN 缓存 1h），与 `/api/briefs/{date}`（Pro 专属）独立分流

#### M10 管理后台 P0 ✅ 开发完成（待 QA）

- 内容审核台：对待审核内容进行质量确认与可见性操作
- 参数配置管理：动态修改 ConfigKey（推荐权重、AI 模型、特征开关），无需重启
- 运营内容编辑：编辑与发布公共早报、精选内容、推荐位
- 用户管理：用户数据查看、邀请码发放、订阅状态管理
- 系统监控：后台任务状态、内容流转进度、健康指标

---

### 第二层：个人 AI 阅读工作流

#### M1 IA v2 信息架构 ✅ 开发完成（待 QA）

- 统一导航体系：侧边栏重构，核心入口可达性优化
- 内容分类重组：品类分组与浏览层级优化，降低认知负荷
- 视图模式统一：列表/网格等多种展示模式统一支持
- 响应式布局：桌面/平板/移动端自适应
- Locale 自动检测：基于 IP/浏览器语言自动推断并设置偏好
- **2026-04-05 内容广场（Explore）页面优化**：
  - Header 层级精简：5 层结构压缩为 2 层（标题行 + 折叠面板），符合 5-DESIGN.md Content First 原则
  - FilterToolbar 重新设计：单行布局 = QuickPresets + SortShortcuts + FilterToggle + DensitySwitch
  - ResourceFilterPanel 统一为 label+dropdown 两列网格，AdvancedFilters 内嵌同一面板
  - QuickFilterBar 按钮降级（`text-xs py-1 rounded-full`），视觉从属于类型 pills
  - 排序快捷按钮：默认/最新两个快捷入口，`hidden sm:flex` 移动端隐藏
  - 紧凑模式优化：卡片使用 `oneSentenceSummary`（如有）替代完整摘要，`line-clamp-1`
  - 语言标记始终可见：移除 hover-only 交互，符合 6-UI-SPEC §12.1「不依赖 hover 展示关键信号」
  - 间距对齐设计 token：header `pt-element`、toolbar-to-cards `space-y-element`、底部 `pb-component`
  - 后端修复：`SourceService.filterSourceOptionByResourceType()` 对 `resourceType=ALL` 返回全部源
  - 已在 4 种视口（375/768/1280/1536）+ light/dark 双模式 + compact/standard 密度下验证通过
- **2026-04-05 订阅来源（Sources）页面优化**：
  - 中文文案统一为「订阅来源」（4 字对齐），sidebar/title/count 全局替换
  - 布局对齐内容广场：compact header + 类型 pills 右上角 + 分割线，去除子标题和"我的源管理"入口
  - 快捷筛选重构：🔥高优先级 + 最多关注 + 最近活跃 + 名称排序，统一 pill 按钮样式
  - 高级筛选面板：2 行 2 列网格（关键词 | 内容分类 / 语言 | 优先级），替代原 4 列布局
  - SourceCard 展示优化：移除关注按钮（纯展示模式），标准模式统计改为内联展示（关注人数 + 文章数 + 优质文章），宽松模式增加关注人数列
  - 三种密度模式：紧凑（compact）/ 标准（standard）/ 宽松（spacious），偏好持久化
  - SourceListClient 组件抽取：支持 resourceType 外部控制、mode 切换、sidebar/batchActions 插槽
  - 后端增强：SourceDiscoverController + SubscriptionController 新增 sortBy / priority 参数，SourceCondition.SortParam 支持动态字段排序
  - 管理页面（/sources/my）同步升级：类型 pills + 排序快捷 + 可折叠筛选面板 + 密度切换 + ContentPagination
- **2026-04-05 管理关注（/sources/my）页面重构**：
  - 页面从 893 行重写至 ~280 行，复用 SourceListClient 组件
  - 双 tab 架构：「我的关注」+「所有订阅源」，tab 状态持久化到 URL（`?tab=all`）
  - 「我的关注」tab：SourceListClient mode="manage" + fetchFn 适配器（UserSubscription → SourceDiscoverItem）
  - FolderSidebar 组件抽取：桌面端 aside + 移动端 Sheet，支持文件夹选择和新建
  - SubscriptionBatchActions 组件抽取：批量取消关注 + 批量移动文件夹，含确认弹窗
  - DiscoverBatchActions 新增：「所有订阅源」tab 支持批量关注
  - 行内操作：每行显示取消关注按钮 + 私有源标记（通过 SourceCard rowActions prop）
  - 信息保留：关注时间格式化显示、私有源 badge、空状态引导（跳转到所有订阅源 tab）
  - SourceListClient 增强：fetchFn 覆盖、externalFolderId、emptyState prop、clearFilters 使用动态 defaultSortBy
  - 去除「返回订阅源」链接，compact header 与全站一致
- **2026-04-05 精选周刊（Newsletter）页面优化**：
  - 三种密度模式（紧凑/标准/宽松），偏好持久化，紧凑模式支持快速浏览
- **2026-04-05 我的图书馆（Library）页面一致性优化**：
  - 阅读历史、我的收藏、我的笔记三个页面统一升级
  - 页面布局：`py-component` → `pt-element pb-component`，`<div>` → `<main id="main-content">`
  - 紧凑页头：移除副标题，启用 `compact` 模式，与内容广场/订阅来源/周刊保持一致
  - 类型筛选 pill 样式：`bg-ink text-white`（填充式）→ `bg-ink/10 text-ink`（柔和式），统一全站筛选交互语言
  - 间距语义化：列表组件 `space-y-4` → `space-y-element`，使用设计 token
  - 清理页面文件中未使用的 Library 翻译引用
- **2026-04-05 我的图书馆（Library）功能增强**：
  - 内容类型 pills 上移至页头右侧（阅读历史 + 我的收藏），与内容广场/订阅来源布局一致
  - 时间快捷筛选：全部时间/今天/最近一周/最近一月/最近三月，三个页面统一支持
  - 阅读历史新增关键词搜索（标题/来源名），三个页面均支持搜索
  - 后端增强：ReadingHistory API 新增 keyword/startDate/endDate 参数，Bookmark + Highlight API 新增 startDate/endDate 参数
  - 前端 API 层同步更新 Query 类型和请求函数
  - i18n 新增 timeFilter 命名空间（全部时间/今天/最近一周/最近一月/最近三月）
  - **统一标签/文件夹体系**（后端 + API + 前端 UI 全部完成）：
    - 新增 `UserTagEntity`（bb_user_tag）和 `UserFolderEntity`（bb_user_folder）统一模型，替代域专属的收藏标签/文件夹
    - 阅读历史、划线笔记、收藏实体均新增 `tagIds`/`folderId` 字段，支持统一标签/文件夹筛选
    - 统一 CRUD API：`/api/users/me/tags` + `/api/users/me/folders`（含树形返回）
    - 各资源归属更新 API：`PUT /api/users/me/{bookmarks|history|highlights}/{id}/organize`
    - 管理后台批量迁移：`POST /api/admin/organize/migrate`（幂等，将存量收藏标签/文件夹 + 订阅源文件夹同步到统一模型）
    - MongoDB Criteria 构建修复：extraCriteria + andOperator 模式解决 orOperator 覆盖 AND 条件的 bug
    - 前端类型和 API 函数已就绪（`UserOrganize.ts`、`api.ts`）
  - **统一页面模板与左侧 Sidebar**（已完成）：
    - `LibraryListShell` 通用模板：三个页面统一布局（左 sidebar + 右主内容区），对齐内容广场交互风格
    - `LibrarySidebar` 共享组件：桌面端垂直列表 + 移动端水平 pills 双形态，标签/文件夹互斥选择
    - 标签/文件夹内联 CRUD：侧栏标题旁「+」按钮展开创建表单（名称 + 8 色选择器），hover 显示删除按钮，confirm 确认后删除
    - 关联数量统计：后端 `UserOrganizeCountService` 通过 MongoDB 聚合（unwind + group）按 scope 统计各标签/文件夹的关联项数，API `GET /api/users/me/organize/counts?scope={bookmark|highlight|history}`
    - 收藏页使用收藏专用标签/文件夹 API（`bookmarkCount` 字段自带计数），阅读历史和笔记页使用统一标签 API + 独立计数端点
    - 排序切换：最新/最早，后端 ReadingHistory/Bookmark/Highlight 三个 Repo 均支持动态 sortBy + sortDirection
    - 卡片密度切换：紧凑/标准/宽松，偏好持久化至 localStorage
    - 搜索 + 时间范围 + 标签/文件夹筛选参数完整传递至后端
    - CRUD 操作含 try-catch + toast 成功/失败反馈，InlineCreateForm 防重复提交
    - 后端 scope 参数校验：非法值抛出 `BizException(INVALID_PARAMETER)`
    - 后端注意 `UserReadingHistoryEntity` 无 `deleted` 字段，聚合查询按 scope 条件化软删除过滤
    - 集成测试覆盖：`UserOrganizeControllerTest.CountTests`（4 case：未登录 401、三种有效 scope、无效 scope、缺少参数 400）
- **2026-04-07 我的图书馆（Library）三页体验升级**：
  - 基于设计师 Review 与 5-DESIGN.md / 6-UI-SPEC.md 对照分析，从「记录管理页」升级为「阅读工作流页面」
  - **卡片操作差异化**：三页操作按钮从统一的「查看原文/归类/删除」改为阅读工作流语言
    - 阅读历史：「继续阅读」+ 归类 + 删除
    - 收藏：「打开内容」+ 归类 + 删除（含确认弹窗）
    - 笔记：「查看上下文」+ 编辑笔记（有 note 时显示）+ 归类 + 删除
  - **删除按钮降权**：从红色文字按钮改为 muted icon button，hover 时变 destructive 色，符合 6-UI-SPEC §9.1「破坏性操作不用 Amber」
  - **笔记类型 badge**：HighlightCard 增加「摘录」/「摘录 + 想法」badge（根据 note 字段区分），建立笔记类型语义
  - **卡片去框化**：三个 Card 从 `bg-card rounded-lg border` 盒子样式改为 `border-b` 分隔线，减少「框中框」感，向 Editorial 阅读列表风格靠拢
  - **收藏卡片增加收藏时间**：元信息区展示 `createdTime`（收藏时间），与 `publishDate`（发布时间）区分
  - **页头副标题差异化**：Sidebar `_sub` 文案从通用描述改为场景化表达（「回看你最近真正读过的内容」/「值得反复回来的内容」/「阅读中留下的重点与想法」）
  - **筛选两层化**：LibraryListShell 从时间 pills 平铺改为搜索+排序+密度常驻（tier 1）+ 时间范围折叠/按需（tier 2），符合 6-UI-SPEC §9.6「默认轻量显示，高级项折叠」
  - **Sidebar 空态引导**：标签/文件夹均为空时显示引导文案（「添加标签和文件夹来组织你的…」），替代空白区域
  - **清空记录按钮降级**：从红色 outline 改为 ghost + muted 色，hover 时 destructive
  - ⬜ **TODO-042**（P1，需后端）：阅读历史卡片增加 hasBookmark/hasHighlight 轻信号，后端 ReadingHistory API 补充关联状态字段
  - ⬜ **TODO-043**（P2，需后端）：页头价值摘要区，需新建 `GET /api/users/me/library/stats` 聚合 API（时间维度统计、高频标签、未归类计数）
  - ⬜ **TODO-044**（P2，需后端）：笔记页按来源聚合视图，需后端 Highlight API 支持 `groupBy=resource` 参数
  - ⬜ **TODO-045**（P2，需推荐系统）：阅读历史「重访理由」智能信号，需推荐系统输出 revisit reason

- **2026-04-07 播客/视频详情页 + 公共早报 + 个人早报 设计师 Review 优化**：
  - 基于设计师对播客 2.0 详情页和公共早报页的 review，对照 `5-DESIGN.md` / `6-UI-SPEC.md` / `specs/podcast-video-2.0.md` 逐条评估合理性，分阶段实施
  - **播客/视频详情页（MediaHeader / MediaContentPage / TranscriptPanel / ChapterPanel / ArticleToolbar）**：
    - **MediaHeader 首屏理解态重建**：H1 从 `text-xl md:text-2xl` → `text-2xl md:text-3xl lg:text-[2.125rem] font-bold leading-[1.15] tracking-tight`，成为绝对第一视觉层；Amber 编辑荐语块（一句话摘要 + ⭐ 推荐理由）作为第二视觉锚点；元信息行退后到第三层。**不在 Header 放主动作 CTA**（AudioPlayer + ChapterPanel 紧邻其下已经是天然入口，设计师反馈冗余后移除）
    - **封面尺寸缩小**：播客左列从 `lg:grid-cols-[390px_1fr]` → `lg:grid-cols-[280px_1fr]`，封面 390×390 → 280×280，让中间章节面板获得 110px 呼吸。ChapterPanel 高度 `max-h-[480px]` → `max-h-[380px]` 对齐新封面高度
    - **ChapterPanel 默认 compact 模式**：`useState(false)` → `useState(true)`，首屏只显示 CH.N + 标题 + 时间，简洁扫读；通过右上角切换按钮按需展开为详细视图
    - **TranscriptPanel 改为"可持续阅读视图"**：行间距 `space-y-0.5` → `space-y-2.5`，字号 `text-sm` → `text-sm md:text-[15px]`，行高 `leading-relaxed` → `leading-[1.75]`，当前行高亮从 `bg-ink/5` 改为 `border-l-2 border-amber-500 + bg-amber-50/60`（语义统一到 amber = 当前焦点），时间戳颜色弱化
    - **ArticleToolbar 精简（mode="media"）**：新增 `mode?: 'article' | 'media'` prop。media 模式下右侧浮动栏只保留高频动作（Bookmark + Copilot + Source + Share），次级动作（Translate / QualityFeedback / ExportSync / ScrollTop / ScrollBottom）收入新增的 `MoreHorizontal` Popover 菜单。应用到播客/视频详情页 + 文章详情页 ArticlePage
    - **ExportSyncButton 视觉一致性**：新增 `variant` + `size` prop。More 菜单中用 `variant="ghost" size="sm-icon"` 去边框 + h-9 w-9，与其他按钮统一。icon 从 `Download` → `FileOutput`，避免与 `ArrowDownToLine`（滚动到底部）冲突
    - **CopilotPanel push 模式降权**：push 布局右列从 360px → 320px，容器从 `<DetailSection variant="card">`（完整边框 + 卡片背景）→ `<aside>` + 左细线 + paper/40 浅背景，避免与字幕区形成"两个并列主栏"的错觉。push 激活时 ArticleToolbar 完全隐藏（避免视觉打架）
    - **精选文章 → 精选内容**：`Article.featured` + `Article.side.featured` i18n 键文案更新，支持播客/视频/推文等更多内容类型
  - **公共早报页（BriefHomeShared / `/explore/brief`）**：
    - **ProGateCard 软提示化**：文案从"升级 Pro，开启我的早报..."改为"这是面向所有人的今日精选。如果你希望它基于你的兴趣和阅读习惯整理，可以体验我的早报。"；`dismissible={false}` → `dismissible={true}`；位置从 `mt-8` → `mt-12 pt-6 border-t border-border/50`（自然断点），关闭后 sessionStorage 记录本期不再打扰
    - **底部新增反馈区域**：`BriefProControls` 移除 `if (!isPro) return null` 限制，公共早报也显示"今天的选题对你有用吗？"反馈。Pro 用户走 `submitBriefFeedback` 后端 API，公共早报走 `localStorage` 占位（key: `brief_public_feedback_{briefDate}`），后端接口就绪后迁移
    - **编辑导语 fallback**：`editorIntro` 字段为空时显示通用 fallback 文案"今天的内容已经过 BestBlogs AI 初评和编辑精审，从近 3 天高质量内容池中挑出最值得先看的部分，按价值排序递交给你。"（中英双语）
  - **个人早报页（BriefHomeShared / `/reading/brief`）**：
    - **P0 渲染 bug 修复**：cover 缺失时左列被 ResizeObserver 测得高度过小（~60px），导致 ChapterPanel wrapper 被 inline style 压扁到 60px。修复：cover 缺失时显示虚线占位框（280×280 aspect-square with Headphones icon + audioGenerating 提示），ChapterPanel wrapper 高度兜底 `Math.max(测量值, 320)px`
    - **删除「今日深读」hero 折叠面板**（用户反馈与「今日主题」和精选内容列表重复）。deepReadItems 字段后端保留，前端暂不展示
    - **删除「连续 N 天」streak chip**（用户反馈冗余），`Flame` import 同步清理
    - **加大 Podcast title**：`text-xl font-semibold` → `text-2xl md:text-3xl lg:text-[2.125rem] font-bold leading-[1.15] tracking-tight`，与 MediaHeader H1 同等量级，成为当期早报真正的视觉主角
    - **个人早报 subtitle 个性化**：`每天为你整理值得深读的内容与回顾线索` → `AI 为你整理的今日精选 · 基于你的兴趣和阅读习惯`
    - **反馈文案优化**：`这期早报对你有帮助吗？` → `今天的选题对你有用吗？`；`有帮助 / 一般` → `很相关 / 不太相关`，与推荐系统 quality feedback 闭环对齐
    - **「阅读时间」控件从内容流移除**：`BriefProControls` 中的时间预算选择器（5/10/15/20/30 分钟）移到 settings 页统一管理，内容流只保留反馈控件
    - **分享按钮样式一致性修复**：从 `border text-sm` → `border border-border text-xs text-muted-foreground`，与其他 actions 按钮（窄屏模式/查看昨日）视觉统一
    - **`handleShare` 三级降级**：原实现把 `navigator.clipboard.writeText` 失败混在 try/catch 中导致"分享失败"误报。修复为：Clipboard API → `document.execCommand('copy')` fallback → `window.prompt(shareUrl)` 最后兜底。只有 shareToken 生成失败才算真正失败
  - **2026-04-07 早报分享页升级（Pro 试读体验）**（`BriefShareView` / `/brief/share/[token]`）：
    - **背景**：原分享页只展示标题 + 内容列表，"过于简陋"，错失把分享变成 Pro 裂变入口的机会。升级目标 = 让访客「沉浸式体验完整 Pro 早报」，从而被激励升级生成自己的版本。依据 `2-PRODUCT.md` §5 飞轮三层 / §12 个性化激活
    - **复用 BriefContent 组件**：分享页与 `/reading/brief` 共用同一个 `BriefContent`，保证结构一致（标题 / 编辑导语 / 封面 / AudioPlayer / ChapterPanel / TranscriptPanel / 内容卡片）。通过新增 props (`hideYesterdayNav` / `hideWideToggle` / `hideFeedback` / `ownerBadge` / `footerCta`) 支持分享场景定制。`isPro={false}` 自动隐藏：定制按钮、个性化 matchReason、设置入口
    - **顶部分享者署名条**（`ShareOwnerBadge`）：展示分享者头像 + 昵称 + Pro 皇冠徽章 + "分享自" label，体现 Pro 会员归属感。头像加载失败 fallback 为首字母圆形占位
    - **底部 Pro 升级 CTA**（`ShareCta`）：amber 渐变卡片 + "想生成属于你的专属早报？" 标题 + 详细 body + amber 主按钮，跳转 `/pro?ref=brief_share` 用于追踪转化来源。按钮配色 `bg-amber-600 text-white / dark:bg-amber-500 dark:text-ink-dark`，hover 状态在 light/dark 双向都保持高对比度（修复了 ink/ink-light pattern 在 dark mode hover 时白字+亮蓝背景对比不足的问题）
    - **沉浸式布局**：`/brief/share` 加入 `LayoutShell.PUBLIC_HEADER_PATHS`，不继承 workspace sidebar，使用 PublicHeader 单栏沉浸阅读。容器宽度 `max-w-4xl`（896px），底部 padding `pb-mobile-nav-with-toolbar lg:pb-32` 确保 CTA 不被 StickyPlayer 遮挡
    - **ChapterPanel 溢出修复**（影响所有窄容器场景，不仅是分享页）：原 `lg:grid-cols-[280px_1fr]` 第二列默认 min-content，导致章节标题（如 "精讲：与田渊栋的访谈：大模型的真问题、变局、AI 洪水与 the path not taken [播客]"）撑爆容器宽度。修复为 `lg:grid-cols-[280px_minmax(0,1fr)]` + ChapterPanel wrapper 加 `min-w-0`，强制第二列允许收缩到内容 min-content 之下，配合 `truncate` 实现优雅截断
    - **SEO 索引开启**：`page.tsx` 的 `generateMetadata` 返回完整 Metadata（title / description / canonical / openGraph type=article / twitter card），`robots: { index: true, follow: true }`。Brief 不可用时返回 `index: false`
    - **opengraph-image.tsx**：edge runtime 动态生成 1200×630 OG 图，左侧 ink→amber 渐变装饰条 + 右上角 amber 光晕 + "BESTBLOGS PRO" pill + briefDate badge + "Shared by {ownerName}" + 标题（52px）+ 摘要（22px）+ 关键词 chips + 底部 logo + slogan + curated picks count + listen duration。Twitter card 自动 fallback 到 og:image
    - **后端字段扩展**（`DailyBriefDTO` record）：新增 `ownerNickName` / `ownerAvatarUrl` 两个字段，仅 `/api/share/brief/{token}` 端点返回（其他场景置 null）
    - **后端服务层**（`OpenApiBriefService.getSharedBrief()`）：注入 `UserDomainService`，try/catch 查询分享者信息，失败时降级为匿名分享。`DailyBriefDtoAssembler.toShareDto()` 是新增的分享专属组装方法，stripMatchReason 创建副本剥离个性化签名（defense in depth，前端 isPro=false 已隐藏，这里二次防护），剥离 shareToken / streakCount / streakUpdated
    - **后端 CDN 缓存**（`ShareBriefController`）：注入 HttpServletResponse，分享端点写入 `Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=86400`，早报为天级不可变内容，缓存命中可有效抵御被动分享流量
    - **i18n 双语**：messages/zh.json + en.json 各新增 9 个 keys（`shareModeTitle` / `shareModeOwnerLabel` / `shareModeAnonymousOwner` / `shareModeMetaTitle` / `shareModeMetaTitleWithOwner` / `shareModeMetaDescriptionFallback` / `shareModeCtaTitle` / `shareModeCtaBody` / `shareModeCtaButton`）
    - **Preview 验证已通过**：desktop / tablet / mobile 三视口 + light/dark 双模式 + zh/en 双语全部验证，CTA 按钮在所有组合下颜色对比度合格，ChapterPanel 不再溢出
  - **Settings 页新增「我的早报」section**：
    - `sectionIds` 数组加入 `'brief'`（在 `subscription` 和 `integrations` 之间）
    - `navItems` 新增「我的早报」项（Newspaper icon），仅 Pro 用户可见
    - `briefPersonalization` Card 前插入 `<div id="settings-brief">` section header
    - 支持 URL `?section=brief` 自动滚动定位（复用已有 scrollToSection 机制）
    - 个人早报顶部 actions 区新增「定制我的早报」按钮，跳转 `/settings?section=brief`
    - 新增 i18n 键：`DailyBrief.customizeBrief` / `Settings.group.brief` / `DailyBrief.editorIntroLabel` / `DailyBrief.editorIntroFallback`
  - **后端：editorIntro 字段全链路补齐**（编辑导语）：
    - `GlobalBriefEntity` 新增 `private String editorIntro` 字段（位于 `podcastTitle` 之后）
    - `UserDailyBriefEntity` 新增相同字段
    - `DailyBriefDTO` record 新增 `editorIntro` 字段
    - `DailyBriefDtoAssembler.fromGlobalBrief()` + `.toDto()` 两个方法都加 `entity.getEditorIntro()` 映射
    - `UserBriefGeneratorService.generateSingleUserBrief()` 在 copy 阶段加 `brief.setEditorIntro(globalBrief.getEditorIntro())`（与 `podcastTitle` 同源继承）
    - 前端 `src/types/brief.ts` 对应字段已声明 `editorIntro?: string | null`
    - **Maven clean compile BUILD SUCCESS**（common + api + worker 三个模块）
  - ✅ **TODO-046**（2026-04-09 已完成）：`GlobalBriefGeneratorService.generateBrief()` 已写入 `editorIntro`（Dify workflow output + Adapter record + Generator setter 全链路打通，含单测）
  - ✅ **TODO-047**（2026-04-09 已完成）：`GlobalBriefGeneratorService` 已写入 `podcastCoverUrl`，并实现回退策略（优先 Dify 输出，fallback `digestPosterUrl`，含单测）
  - ⬜ **TODO-048**（P2）：Settings 页把「订阅通知」section 中的 `notificationDeliveryTime` + `briefEmailEnabled` 也拆到「我的早报」section，让早报相关设置（送达时间 / 邮件 / 音色 / 时长 / 风格 / 速度）真正统一
  - ⬜ **TODO-049**（P2）：个人早报顶部新增「✨ 与今日早报对话」Copilot 入口 — 需要 brief 级别的上下文桥接，把 brief.podcastTitle + editorIntro + contentItems 作为 Copilot session 初始 prompt
  - ✅ **TODO-050**（2026-04-09 已完成）：公共早报反馈已接入后端匿名接口 `POST /api/briefs/public/{date}/feedback`，前端从 localStorage 占位迁移为接口上报

- **2026-04-09 AI 伴读（Copilot）测试期体验优化**：
  - 基于用户 5 项反馈对 AI 伴读助手做一次集中打磨，目标是"测试期默认不打扰 + 内容类型差异化 + 通用 AI Chat 交互范式 + 全内容类型 UI 一致"
  - **测试期默认关闭策略**（`useCopilotMode.ts`）：移除 localStorage 持久化（删除 `USER_PREF_KEY`），`updateLayout()` 在所有断点无条件 `setIsActive(false)`。这样上线初期不会在用户首次进入文章/播客/视频/推特详情页自动弹出，避免在功能尚未稳定时造成"被打断"感，用户需要时自行点开。后续功能稳定后可恢复用户偏好持久化
  - **面板宽度统一到 460px**（`COPILOT_PUSH_WIDTH = 460`）：push / overlay-right 两种布局均使用同一常量，替代原先 3 个页面各自硬编码的 `w-[420px]`。宽度增加 40px 让 ChatGPT 风格的多行输入框和技能按钮栏有更舒服的呼吸空间。Article / Media / Tweet 三个详情页同步更新
  - **按内容类型差异化欢迎语与快捷问题**（`useSseChat.ts` + `WelcomeMindmap.tsx`）：新增 `CopilotResourceType = 'article' | 'podcast' | 'video' | 'tweet'`，通过 `DEFAULT_SUGGESTIONS` 字典给四种类型各自提供 4 条默认快捷问题；`emptyStateDescription_{type}` 提供差异化欢迎描述；`CopilotPanel` 新增 `resourceType` prop 由页面传入（ArticlePage="article"、MediaContentPage 按 isPodcast 选 "podcast"/"video"、TweetDetailPage="tweet"），切换资源时 `useEffect` 重置 suggestions 为对应类型
  - **ActionBar 重构为 Claude/ChatGPT 风格多行输入**（`ActionBar.tsx`）：
    - 移除"提问 / 技能" Tab 切换器（两步才能输入的割裂感），改为单一输入态
    - `rows={3}` + `minHeight=72px/maxHeight=200px` + `resizeTextarea` callback（auto-grow 到 200px 后出滚动条）
    - 引导问题改为输入框上方 `grid grid-cols-2 gap-1.5` 双列 chip（原先是单行横向 scroll，在 460px 宽度下可以容纳 4 条问题一次看完）
    - 技能按钮下沉到输入框底部工具栏的左侧（小图标 + hover title），发送按钮在底部工具栏右侧。触发技能不再需要切 Tab
    - 容器加 `px-3 pt-2 pb-4` 底部留白，避免输入框紧贴浏览器底栏
    - 中文 IME 保护：`e.nativeEvent.isComposing` 检查，输入法组合输入状态下 Enter 不触发发送
    - aria-label 补齐（`send` / `stopGenerating`）
  - **WelcomeMindmap 瘦身**（`WelcomeMindmap.tsx`）：title 图标 `BookOpen → Sparkles`（与 AI 伴读品牌语气一致），`emptyStateTitle` + `emptyStateDescription_{type}` 从 i18n 读取；移除自身渲染的快捷问题区（已迁至 ActionBar），保留 summary 预览卡 + 两个紧凑技能入口（摘要 / 思维导图）避免与 ActionBar 技能行重复
  - **推特详情页 Copilot 集成（此前完全缺失）**（`TweetDetailPage.tsx`）：补齐与 Article / Media 对等的 AI 伴读能力 — `useFeatureFlags` + `useCopilotMode` + `copilotPanelRef` 状态；主容器支持 push 模式（`marginRight: COPILOT_PUSH_WIDTH` + `maxWidth: calc(100vw - COPILOT_PUSH_WIDTH + 32px)`）；`ArticleToolbar` 改为 `mode="media"` + `copilotActive` / `onToggleCopilot` / `hidden` / `pushOffset`（与文章/播客/视频一致）；Sheet（overlay-right / overlay-bottom）+ fixed Push 面板双路径都就位；`resourceType="tweet"` 触发推特特化的欢迎语和快捷问题
  - **媒体页 Copilot 布局重构**（`MediaContentPage.tsx`）：移除内嵌的双栏 transcript+copilot grid（`lg:grid-cols-[1fr_320px]`），改为单栏 transcript + 页面级固定 Push 面板（与 Article / Tweet 完全一致），避免"两个并列主栏"的视觉混乱；`isPushActive` 触发容器动态 `marginRight` / `maxWidth`；`renderCopilot()` 按 `isPodcast` 传 `"podcast"` 或 `"video"`
  - **Mermaid 思维导图渲染修复**（`AssistantMessage.tsx` + `ResultCard.tsx`）：此前 assistant 消息里的 \`\`\`mermaid 代码块被按行解析当普通段落，导致思维导图显示为原文。新增 `parseSegments()` 基于正则 `/\`\`\`([a-zA-Z0-9_-]*)\n([\s\S]*?)(?:\`\`\`|$)/g` 把消息内容切成 `{kind:'text'|'code'}` 段：mermaid 语言走 `<MermaidRenderer>`，其他语言走 `<pre><code>`，文本段继续走原 citation + Markdown pipeline；支持流式渲染（未闭合的 fence 也会被识别）。同时 `ResultCard.tsx` 的 `skill_mindmap` 路径加防御性 fence 剥离，兼容两条传入路径
  - **容器高度适配**（`CopilotPanel.tsx`）：`sticky top-0 h-screen max-h-screen` → `h-full max-h-full min-h-0`，让面板既能在 page 级 Push 模式（父容器 `fixed h-full`）中正确填满，也能在 Sheet（Radix SheetContent）中自然撑开
  - **i18n 更新**：`AiReading` namespace 新增 16 个 `suggestQ_{type}_{1-4}` + 4 个 `emptyStateDescription_{type}` key（zh/en 各 20 条新键），移除废弃的 `suggestQ1/2/3` 和 `tabAsk/tabSkills`（ActionBar 不再使用 Tab）
  - **已完成验证**：`pnpm lint` 与改动前同级（18 pre-existing errors + 65 warnings，均在未修改的文件）；`pnpm build` 11.2s compiled successfully
- **2026-04-08 三页统一壳层 + 体验分化（Explore / For-You / Follow）**：
  - 设计师对「我的关注」「为你推荐」「内容广场」3 个内容列表页做了系统性 review，对照 `5-DESIGN.md` / `6-UI-SPEC.md` / `2-PRODUCT.md` 交叉验证后发现：表面"三页太像"是症状，**根因是三套独立代码路径**（Feed 自建 SWR 直渲染、Follow 走 ContentListShell、Explore 走 GenericResourceListClient + TweetListClient），共用一批原子组件勉强维持视觉一致。改动分两阶段：先收敛代码路径，再做体验分化
  - **Phase 1：结构收敛（P0 硬前置）**
    - **`ContentListShell` 抽象升级**：新增 3 个可选 prop —— `sidebar?: React.ReactNode`（可插拔右栏，传 `null` 显式抑制）、`resolveSignal?: (item) => Signal | undefined`（按页面意图映射 quality / personalization / relevance 信号）、`itemFilter?: (item) => boolean`（客户端过滤，给 Feed 的 dismissedIds 用）。Sidebar 渲染逻辑改为 explicit prop 优先 → fallback 到 `config.showSidebar` 默认 SourcesList，向后兼容 Follow 页
    - **`useContentList` hook 增强**：暴露 `errorCode?: string`（让 Feed 页能识别 `PRO_FEATURE_REQUIRED_CODE`）+ `refresh()` 方法（手动重取当前页）；修复一个 pre-existing 隐藏 bug —— 监听 `searchParams.get('resourceType')` 变化触发 refetch，之前 Follow 页切换类型 tab 不刷新数据靠的是组件偶然 re-mount
    - **Feed 页全改写**（`/reading/feed/page.tsx`）：从自建 `useSWR('for-you-feed')` 迁移到 `useContentList({ config: FEED_FOR_YOU_CONFIG })`；删除手写 `<SourcesList subscribedOnly>` 修复 `FEED_FOR_YOU_CONFIG.showSidebar=false` 与实现的漂移；删除自建骨架屏/错误态/空态/分页代码；保留 Pro 拦截逻辑通过 `errorCode === PRO_FEATURE_REQUIRED_CODE` 检测；`dismissedIds` 通过 shell `itemFilter` 透传
    - **Explore 页全改写**（`/explore/page.tsx`）：ALL/ARTICLE/PODCAST/VIDEO 4 种资源类型迁移到 `ContentListShell + useContentList`；Tweet 类型因为 `TweetResource` 数据形状不同保留独立 `TweetListClient` 路径；**修复类型切换丢 URL 参数 bug**（之前 `handleTypeChange` 新建 `URLSearchParams()` 只 set `type`，丢掉 keyword/category/sort）
    - **删除孤儿组件** `GenericResourceListClient.tsx`（grep 验证只有 explore 一个调用点，迁移后已无引用）
    - **`EXPLORE_*_CONFIG.showSidebar` 全部改为 false**（Explore 由 page 显式注入 `<ExploreSidebar/>`）
    - **顺手修复** `PodCastBody.tsx:205` 一个 pre-existing 的 TS narrowing bug（forEach 闭包内赋值导致 `closestSegment` 类型被收窄成 `never`，main 上 build 已经挂了），不修这个 build 跑不通无法验证我的改动
  - **Phase 2：体验分化（P0 体验目标）**
    - **三页 sidebar 按页面意图分化**：
      - **Explore** → 激活原本孤儿的 `<ExploreSidebar/>`（今日公共早报 + 精选周刊入口 + 发现订阅源入口），体现公共质量池的策展感而非用户来源
      - **Follow** → 沿用 `<SourcesList subscribedOnly>` 但底部 button 自动切换成 `manageSources`（"管理关注"）
      - **Feed** → 桌面端**显式不挂 sidebar**（`sidebar={null}`），主内容区铺满，符合 `6-UI-SPEC §14.4` "解释性优于神秘感" 原则
      - **TweetListClient** → 也改为 `<ExploreSidebar/>`，让整个 `/explore` 的 5 种类型 sidebar 语义一致
    - **三页统一接入 `ContentSignal` 信号系统**（之前只有 Feed 接了一次，Follow/Explore 都没 wire）：
      - Explore：`item.qualified → quality 信号 "精选"`（新增 `Explore.signal.featured` 中英 i18n）
      - Feed：`item.recommendReason + recallSource → personalization/relevance/quality`（按 recallSource 映射）
      - Follow：故意不接入 —— 来源归属已经通过 sidebar 选中态 + 卡片 meta 行 `sourceName` 表达，再加 personalization 信号反而噪音
    - **`ResourceCard` 移除标准卡的双重质量信号**：标准卡只保留 `Badge variant="score"`（数字），删掉 5 星 `StarRating`；Hero 卡保留 5 星（精选主编位是有意图的强调）。依据 `6-UI-SPEC §10.8` "同屏最多 1 个强信号"
    - **`WorkspacePageHeader` compact 模式移动端 subtitle 修复**：之前 `hidden lg:inline-flex` 在 <lg 屏幕完全吞掉副标题，三页失去任务声明。改为 <lg 独立成第二行 + ≥lg 保持内联斜杠分隔。**顺带修复** compact 模式 <sm 屏幕 header 的 flex-row 把 h1 挤成 1 字宽竖条的 pre-existing 布局问题（compact 模式现在 <sm 也 column-stack）
    - **Feed 页 NotInterestedButton 移动端降级**：之前是 `opacity-100 sm:opacity-0 sm:group-hover:opacity-100` + `min-h-[44px]` 一直压在卡片右上角覆盖式显示。改为 32×32 半透明 + 移到右下角 + 移动端 `opacity-70` 桌面端 hover 显示
  - **Phase 3：质感打磨（P1）**
    - **`FilterToolbar` 分层** —— 新增 `secondaryActions?: React.ReactNode` slot，渲染到右侧"更多"dropdown（`MoreHorizontal` icon trigger + `DropdownMenu`），让页面把次级动作折进菜单。Follow 页的"管理关注"从主行 `toolbarActions` 移到 `secondaryActions`（包装成 `DropdownMenuItem`）。MoreMenu trigger 移动端 44×44、桌面 32×32 响应式触控区域（符合 UI-SPEC §13.1）。新增 i18n key `ContentList.moreActions`
    - **客户端已读态**（不依赖后端的轻量方案）—— 新增 `bestblogs-app/src/lib/visited-store.ts`：localStorage 单例 store，500 条 FIFO 上限，提供 `isResourceVisited(id)` / `markResourceVisited(id)`。`ResourceCard` 5 处 `<a>` 链接（hero title + mobile/PC title + mobile/PC cover）的 onClick 全部统一调 `markVisited()`。视觉上用 `text-foreground/55 dark:text-foreground/50` 把已读标题降一档对比度 + 在 score badge 旁加小尺寸 "已读" 文字标签做语义补充。**Hero 卡始终 track 但不应用 dimmed 样式**（设计：精选主编位无论是否已读都应保持强调）。新增 i18n key `ContentList.readState.visited`
    - **Follow 右栏来源活跃度** —— 修复 `SourcesList` subscribedOnly 路径的数据丢失（之前 `countInPast3Months: 0` 硬编码），保留后按活跃度降序排列、产量大的源排在前面。silent 源（`countInPast3Months === 0`）显示 `近期无更新` 灰斜体替代数字。Cache key 升级到 v2 避免旧 cache 污染。新增 i18n key `Source.silent`
    - **Feed/Follow flags 加载首屏闪烁修复** —— `useFeatureFlags()` 首屏返回 `defaultFlags`（`forYouFeed: false` / `mySubscriptionsFeed: false`），导致 Feed 闪 ProGatedPreview、Follow 闪"功能暂未开放"。两个页面都暴露 `isLoading: flagsLoading`，gate 条件加 `!flagsLoading &&` 守卫；Feed 页特别地把 `errorCode === PRO_FEATURE_REQUIRED_CODE` 的判断**前置到 flagsLoading 守卫之前**，让非 Pro 用户的 Pro 错误立即触发 Pro 升级预览，避免短暂显示 ErrorState
  - **Phase 4：内容类型分化（P2 中可做的部分）**
    - **`formatHumanDuration(seconds, lang)` 新工具函数** —— 返回 "42 分钟" / "1 小时 23 分"（zh）或 "42 min" / "1h 23m"（en），用于卡片 meta 行帮助判断阅读成本，原 `formatDuration` 的 `HH:MM:SS` 仍用在封面 overlay 上做时间戳显示
    - **podcast/video 卡 meta 行强化时长** —— podcast 类型时长字号加 `font-medium` + `text-foreground/80` 让它在 meta 行里更显眼；video 类型也开始显示时长（之前 `showReadInfo = isPodcast || (wordCount && readTime)` 排除了 video，现在改为 `isPodcast || isVideo || hasArticleReadInfo`）；**去掉 `lang !== 'en'` 对时长显示的 gate**（时长是通用信号不应该按语言隐藏）
  - **Review 阶段发现的 5 个问题逐项修复**
    - 🔴 严重回归：FilterToolbar 的 `QuickFilterBar` 外层是 `shrink-0`，在移动端 375 宽度下占满左边把 MoreMenu 推到 `left=410` 完全越出视口。改为 `flex-1 min-w-0`（quick filter 占满剩余空间但允许 shrink，QuickFilterBar 内部已有 `overflow-x-auto scrollbar-hide` 让 chips 横向滚动），右侧控件始终可见。验证：mobile 375 → MoreMenu `l=315 r=359 w=44 h=44`，desktop 1440 → 无回归
    - Hero 卡 visited 跟踪逻辑错误（之前 `!hero && isResourceVisited(...)` 让 hero 永不记录），改为始终 track + `showVisited = visited && !hero` 只 gate 显示
    - 5 处 `<a>` 链接里只有 mobile/PC 的 title link 调了 `markVisited`，hero title link + 2 处 cover link 漏了，全部补齐
    - "已读" 标签的 `aria-label` 与可见文本重复，移除 aria-label 让可见文本本身做语义
    - MoreMenu trigger 桌面端 32×32 但移动端没有 a11y 触控放大，加 `min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px]`
  - **关键修改文件清单（Phase 1-4 合计）**：14 个文件 = 9 modified + 1 new (`lib/visited-store.ts`) + 2 i18n (zh/en) + 1 deleted (`GenericResourceListClient.tsx`) + 1 drive-by (`PodCastBody.tsx`)
  - **验证状态**：`pnpm build` EXIT: 0 ✓；preview 验证 4 维度 = 桌面 1440 × 移动 375 × light/dark 双模式 × Explore/Feed/Follow 三页全部通过；MoreMenu dropdown 展开后看到 "管理关注 → /sources/my" menu item；首卡点击后 reload 验证 visited 持久化 + 标题对比度降一档 + "已读" 小标签出现
  - **设计师评审覆盖率**：P0 4 条全部完成（任务边界 / sidebar 重构 / 推荐解释 / 信号视觉权重），P1 4 条全部完成（筛选分层 / 已读态 / 类型卡片分化 / 编辑感），P2 中 L1/L2 已做，L3/L5 因依赖后端 endpoint / 兴趣标签编辑入口跳过
- **2026-04-08 订阅源三页重构：Explore / Follow / Augment 角色分化**：
  - 设计师对订阅源三页（`/explore/sources`、`/me/sources`、`/me/sources?tab=all`）做了深度 review。独立判断后发现根因 = 三页共用同一个 `SourceListClient` 壳层、同一套卡片字段、同一个 tab state，导致 Template B（列表/工作台）与 Template D（设置/管理）两种不同的 JTBD 被同一外壳硬压，**卡片被平台指标绑架**（`countInPast3Months / qualifiedCountInPast3Months / subscriberCount` 三列冷数字占满视觉），**`5-DESIGN.md §11` 的质量/相关性/个性化三类信号没有任何落地**，**"我的关注 → 我的早报" 的因果闭环对用户完全不可见**。参见 `specs/sources-three-page-plan.md`（本次临时方案文档，已归档）
  - **四波交付全部完成（Wave 0 + Wave 1 + Wave 2 + Wave 3 + Wave 4）**
  - **Wave 0 — 测试脚手架（3 个新测试文件）**：
    - `src/__tests__/i18n-source-namespace.test.ts`：守护 zh/en.json 的 `Source` 命名空间 — 无重复 key、无违禁术语（`订阅来源` / `我的订阅源` / `订阅源管理`）、必需的 `pageHeader.*` key 存在。**首次运行时即捕获了 4 个重复 key 和 5 处违禁术语真 bug**
    - `src/components/source/__tests__/SourceCard.test.tsx`：锁定 SourceCard 的公共契约（name 渲染、description 展示、onSelect 回调、rowActions/metaChips slot、globe fallback）
    - `src/components/source/__tests__/SourceListClient.test.tsx`：锁定 SourceListClient 的公共契约（discover/manage 模式、parent-supplied fetchFn、emptyState prop）
  - **Wave 1 — 高 ROI 快速胜利（P0）**：
    - **i18n 术语统一 + 重复 key 修复**：zh.json 修复 4 个重复 key（`mySourcesPageSubtitle` / `selectAll` / `batchSubscribe` / `batchSubscribeSuccess`），en.json 同步；统一术语 `订阅来源 → 订阅源`，删除 `mySourcesTitle / mySourcesSubtitle`（框架错的"共 N 个私有订阅源"）；新增 `pageHeader.{discover,manage,augment}{Title,Subtitle}` 6 个 key；排序文案用户化（`高优先级 → 值得优先关注`、`最多关注 → 最受读者关注`、`最近活跃 → 最近值得看`、`名称排序 → 按名称查看`）
    - **三页 header 差异化**：`/explore/sources` = `内容广场 · 订阅源 / 浏览全平台值得信赖的优质来源`（Layer 1 公共策展，iconVariant=public）；`/me/sources` = `我的关注 / 整理你正在追踪的内容来源，决定每天会看到什么`（Layer 2 个人工作流，iconVariant=personal）；`/me/sources/add` = `我的关注 · 添加新来源 / 从公共来源中挑选，扩充你的阅读体系`（Layer 1→2 桥梁）
    - **Manage 页工具条精简**：`typeTabs` 从独立行合并进 `WorkspacePageHeader.actions` slot（和 `tabSwitcher` 并列，中间 `hidden md:inline-block` 分隔线），两行变一行，符合 5-DESIGN.md §5.1「内容优先」
  - **Wave 2 — 前端结构性改动（P0）**：
    - **路由拆分**：新建 `/me/sources/add` 独立路由（`page.tsx` + `layout.tsx`），`/me/sources/page.tsx` 和 `/me/sources/add/page.tsx` 都是极薄 wrapper，分别传 `intent="manage" | "augment"`；`src/navigation.ts` 注册新 pathname；**`src/proxy.ts` 新增 301 重定向** `/me/sources?tab=all → /me/sources/add`（同时兼容 `/sources/my?tab=all`），保留其他 query 参数
    - **修复 `tab=all` 的 subscribed 状态 bug**：原实现只传 `mode="manage"` 无 fetchFn 无 rowActions，回落到 `discoverSources`，`subscribed: boolean` 字段完全被忽略，用户看不到已关注项，批量关注时已关注的项被 `DiscoverBatchActions` catch-ignore 静默吞掉。修复：
      - 新建 `AugmentFollowButton` 组件（绿色 check pill = 已关注 / outline 按钮 = 关注），乐观更新
      - `DiscoverBatchActions` 新增 `alreadySubscribedIds` prop + `selectedCountWithNew` hint（`已选 5 个（3 个新）`），已全关注时按钮 disabled
      - `MySourcesPage` 维护 `augmentSubscribedIds` state，通过 `SourceListClient.onDataLoaded` 反向同步
    - **`SourceListClient` 新增 `semantics` prop**（`'discover' | 'manage-following' | 'manage-augment'`）驱动默认排序（`subscribed_time` vs `subscribers`）、排序选项集合、向 SourceCard 透传 `semanticHint`；新增 `onDataLoaded` 回调；checkbox 可见条件改为 `semantics !== 'discover'`（augment 视图也能批量）
    - **`SourceCard` 全面清理**：
      - 删除死代码：`Source` 类型 import（`SourceDiscoverDTO` 不含它）、`PriorityBadge` 组件（`priority` 字段被 DTO 故意屏蔽，`'priority' in source` 永远为 false）、`recommendedByUserDisplayName` 分支（legacy `Source` 专属）
      - 提取 `useResourceTypeMeta` hook 消除 3 个 variant 中 5 处的资源类型图标/标签重复
      - `SourceCardItem` 类型从 `Source | SourceDiscoverItem` 联合收敛到纯 `SourceDiscoverItem`
  - **Wave 3 — 后端字段暴露（P0/P1）**：
    - **`SourceDiscoverDTO` 暴露 `priority` / `visibility` / `lastLiveTime`**（原 DTO 注释"屏蔽内部运营字段"被明确打开，用于前端映射为用户化的"值得优先关注" / 私有角标 / 近期无更新），`SourceDiscoverService.convertToDiscoverDTO` 填充
    - **`UserSubscriptionDTO` 暴露 `priority` / `lastLiveTime`**，`SubscriptionController.convertToDTO` 从关联 `SourceModel` 填充（`UserSubscriptionModel` 只 cache 了 visibility，其他走 source lookup）
    - **`UserOrganizeCountService` 新增 `subscription` scope**：`SCOPE_COLLECTION_MAP` 加 `subscription → bb_user_subscription`，引入新常量 `STATUS_ACTIVE_SCOPES`（订阅源按 `status=ACTIVE` 过滤软删除，不走 `deleted` 字段），`/api/users/me/organize/counts?scope=subscription` 返回每文件夹/每标签的实际订阅数
    - **`UserSubscriptionMongoRepo.buildFilterCriteria` 支持 `folderId=__none__` sentinel**：新增 `FOLDER_ID_NONE_SENTINEL` 常量，命中 `folderId` 为 null 或空字符串两种历史写法
    - **"近 N 天进入我的早报 X 次" contribution API**（完整实现，未降级）：
      - `BriefContentItem` 新增 `sourceId` 字段
      - `GlobalBriefGeneratorService` 的两处 `BriefContentItem` 构造点 + `UserBriefGeneratorService.copyWithMatchReason` 同步写入 `sourceId`（来自 `DailyBriefInput.ContentCandidate.sourceId()`）
      - 新建 `UserSourceContributionService`：读用户近 N 天已完成 brief，遍历 `contentItems` 按 `sourceId` 聚合计数，历史 brief（`sourceId=null`）安全跳过
      - 新建 `SourceContributionDTO` + `UserDailyBriefRepo.findCompletedByUserIdInDateRange`
      - 暴露 `GET /api/users/me/subscriptions/contributions?days=7`（默认 7 天，范围 1-30），`featureFlag = FEATURE_SOURCE_SUBSCRIPTION_ENABLED`，由 `/api/users/me/*` 通配受 JWT 保护
  - **Wave 4 — 前端消费新字段（P0/P1）**：
    - **类型扩展**：`SourceDiscoverItem` / `UserSubscription` 加 `priority` / `visibility` / `lastLiveTime`；`MySourcesPage` 内部新增 `ManagedSourceItem` 扩展类型（+ `folderId` / `tagIds` / `featured` / `subscribedTime` / `briefContributionCount`），替代原本偷渡 via 交集类型的 `toDiscoverItem`
    - **`SourceCard` 新增 `SignalChips` 子组件**：严格遵循 5-DESIGN.md §11 "最多 1 个强信号" 原则：
      - 质量信号（amber chip + Sparkles icon + "值得优先关注"）：`priority === 'HIGH'` OR `qualifiedCountInPast3Months / countInPast3Months ≥ 50%`（后者需 totalCount ≥ 6 避免小样本噪声）
      - 可见性（neutral chip + Lock icon + "私有"）：`visibility === 'PRIVATE'`
      - 时效（muted dashed-border + CircleSlash icon + "近期无更新"）：`lastLiveTime > 30 天`，**仅在 manage/augment 语境下展示**，公共 Discover 不对站外来源打"silent"标签
    - **Manage 卡片"关系层"（L3）**：`renderRowMetaChips` 注入一整串 chip — folder（带颜色） → tags（最多 3 个 + `+N`） → `关注于 YYYY年M月D日` → featured ★ → `近 7 天进入早报 N 次`（amber sparkles）。所有 chip 使用统一的 rounded-border 样式，视觉上成块呈现"我与这个来源的关系"
    - **Manage 卡片 L4 行动始终可见**：原 `opacity-0 group-hover:opacity-100` 在触控设备完全不可发现，改为始终可见（Star / Organize / Unfollow 三个按钮），符合 `bestblogs-app/CLAUDE.md` 的"触控交互最小点击区域 44x44"约束
    - **`LibrarySidebar` 新增 `smartViews` prop**：渲染在"全部关注"之下、"文件夹"之上；Manage 页传入 4 个智能视图（`特别关注 / 未分类 / 最近更新 / 长期未更新`）；`scope="subscriptions"` 对应新增的 `Library.sidebarEmpty.subscriptions` i18n 空态文案；`selectedFolderId === folder.id || smartView === view` 的 mutual-exclusion state 确保 folder/tag/smart-view 三者同时只有一个激活
    - **`useSubscriptionFolders` / `useSubscriptionTags` 消费 counts**：两个 hook 共享 `organize-counts-subscription` SWR key（dedupe），自动注入真实 `subscriptionCount` 到 folder / tag 对象。`OrganizeScope` 前端类型加 `'subscription'`
    - **智能视图 → 后端 / 客户端 filter 映射**：
      - `featured` → `featured=true` 传给后端
      - `uncategorized` → `folderId=__none__` 传给后端（命中 Wave 3-T4 sentinel）
      - `recentlyUpdated` → 客户端 post-filter（`lastLiveTime` 在 7 天内）
      - `stale` → 客户端 post-filter（`lastLiveTime > 30 天` 或从未有过）
    - **contribution API 前端消费**：`getMySourceContributions(days)` API client + `SourceContribution` interface；`MySourcesPage` manage-intent 下用 SWR 拉一次 `subscription-contributions-7d`，在 `manageFetchFn` 内按 `sourceId` 打到 `ManagedSourceItem.briefContributionCount`，SourceCard 关系层按 `count > 0` 显示 chip
    - **`refreshManageList` 同步多个 SWR key**：`quotaMutate` + `folderSystem.refresh()` + `tagSystem.refresh()` + `contributionsMutate()`，确保关注/取消关注后 sidebar 计数、贡献 chip 全部即时更新
  - **Review 阶段捕获并修复的 3 个 latent bug**：
    - 🔴 **`sidebarEmpty.subscriptions` i18n key 缺失**：首次为 `LibrarySidebar` 引入 `subscriptions` scope 时，`tLibrary(`sidebarEmpty.${scope}`)` 会在新用户（0 folder + 0 tag）场景下显示裸 key。补齐 zh/en 双语 key
    - 🟡 **`featuredOnly` state 完全冗余**：被 `smartView === 'featured'` 完全取代但没删除，`setFeaturedOnly` 的所有调用都是 cosmetic。彻底清理死状态 + 更新 filter chip strip 和 clearAll 逻辑
    - 🟡 **`refreshManageList` 不刷 contribution / tags**：取消关注后 "近 7 天进入早报" chip 和新建的 tag 都不会立即反映，要等 SWR dedupe 60s 过期。补上 `contributionsMutate()` + `tagSystem.refresh()`
  - **关键修改文件清单**（前端 14 + 后端 11 = 25 个文件）：
    - **前端（14）**：`sources/page.tsx`（discover header）、`sources/my/page.tsx`（manage/augment + smart views + contribution wiring）、`me/sources/page.tsx`（wrapper）、新建 `me/sources/add/{page,layout}.tsx`、`components/source/{SourceCard,SourceListClient,DiscoverBatchActions}.tsx`、`components/library/LibrarySidebar.tsx`、`hooks/use-subscription-folders.ts`、`lib/api.ts`、`types/UserOrganize.ts`、`proxy.ts`、`navigation.ts`、`messages/{zh,en}.json`
    - **后端（11）**：`controller/dto/{SourceDiscoverDTO,UserSubscriptionDTO,SourceContributionDTO}.java`、`service/{SourceDiscoverService,UserOrganizeCountService,UserSourceContributionService}.java`、`controller/{SubscriptionController,UserOrganizeController}.java`、`entity/vo/BriefContentItem.java`、`worker/service/brief/{GlobalBriefGeneratorService,UserBriefGeneratorService}.java`、`repo/{UserDailyBriefRepo,mongo/UserDailyBriefMongoRepo}.java`、`repo/mongo/UserSubscriptionMongoRepo.java`
  - **验证状态**：
    - 前端 `pnpm test` = **598 passed**（含 3 个新测试文件 13 个新 case），零回归；`npx tsc --noEmit` clean；`pnpm lint` 修改文件零 error
    - 后端 `./mvnw clean compile -pl bestblogs-common,bestblogs-api,bestblogs-worker` = BUILD SUCCESS；`SubscriptionControllerTest`（15 tests）/ `UserOrganizeControllerTest + SourceDiscoverControllerTest`（35 tests）/ `bestblogs-common` 全量（365 tests）/ `GlobalBriefGeneratorServiceTest + UserBriefGeneratorServiceTest`（4 tests）**全部通过**
    - 浏览器 preview（`/me/sources` 实测）：241 个已关注 + 20 条渲染、4/4 smart view 节点（`特别关注 / 未分类 / 最近更新 / 长期未更新`）、`关注于 YYYY年M月D日` chip × 20、`私有`角标 × 30、`值得优先关注` 质量 chip、`近期无更新` 时效 chip、`近 7 天进入早报 N 次` contribution chip 全部正确渲染，0 console errors
    - `/zh/me/sources?tab=all` 的 301 redirect 实测：浏览器地址栏从 `?tab=all` 实际跳到 `/me/sources/add`
  - ✅ **TODO-051**（2026-04-08 已完成）：`SourceDiscoverControllerTest` / `SubscriptionControllerTest` 已补充对新字段（`priority` / `visibility` / `lastLiveTime`）的断言覆盖
  - ✅ **TODO-052**（2026-04-08 已完成）：`UserSourceContributionService` 已改为显式 `Clock.system(ZoneId.of("Asia/Shanghai"))`，并新增 `UserSourceContributionServiceTest` 覆盖日期窗口与聚合逻辑，避免部署环境时区漂移导致跨日偏差

#### M2 Landing Page 2.0 ✅ 开发完成（待 QA）

- 价值主张重塑：清晰传达「高质量内容 + 个性化工作流」定位
- Free / Pro 分层展示：差异化价值可感知
- 转化路径优化：强化升级激励与注册引导
- 上线阶段标识：LandingPhaseBadge 展示当前内测/早鸟/正式阶段
- PostHog 事件追踪：已形成上线效果闭环漏斗——Landing（`landing_*`）→ 鉴权（`auth_*`，含 `source` 归因）→ 激活（`brief_*` / `feed_*` / `follow_*`）→ 付费（`pro_*` / `pro_gate_*`）；本地链路已验证有数据（含 CSP 放行修复），生产 Dashboard/Funnel 配置按上线前窗口执行
- **2026-03-31 Review 修复**：
  - 客户端直接调用 API_BASE_URL 的 bug（`categoryApi.ts`、`verify/[token]/page.tsx`）→ 改走 `/api/proxy/*`
  - 所有 landing 入口 `/signup` → `/signin`（节省一次 307 跳转）
  - 首页文案全面优化：去除「不是…而是…」句式、合并冗余段落、对齐品牌母句
  - Slogan 更新：「发现更适合你的高质量内容」→「发现真正适合你的高质量内容」
  - Footer 重构：四列各 4 个链接，结构对齐产品能力分层（公共策展 / 个人工作流 / 关于 / 资源）
  - Header 菜单文案与 section 标题对齐；「先看今日精选」→「先看今日早报」，链接改 `/explore/brief`
  - ContentProof 时间过滤器：主取 `1d`（24h）+ 兜底 `1w`，与标题「这是今天值得读的内容」一致
- **2026-03-31 /pro 页面 Review 修复**：
  - Hero 区补充 3 个 benefit bullets（我的早报 / 为你推荐 / AI 伴读）+ 阶段 Badge，增强左右均衡
  - 去除邀请码入口（内测期无邀请码机制）
  - 去除冗余的 Final CTA 区块
  - 新增 Footer 区域（对齐 LandingFooter 四列结构）
  - 价格中文格式修正：`/month` → `/月`，去除价格右侧「内测中」badge（避免重复提示）
  - 补充价值主张区块（Pro 带来的改变）、每日回顾 / 自定义视图条目、文案全面对齐品牌规范
- **2026-04-11 Landing 视觉资产替换完成**：
  - ✅ Logo 视觉更新已完成
  - ✅ Workflow 四阶段内容已从 SVG Wireframe 替换为真实产品截图

#### M5 Pro 订阅闭环 ✅ 开发完成（待 QA）

- 订阅方案与定价：USD 统一定价（早鸟 $10/月至 9.1 → 正式 $20/月，首次 8 折 $16/月）
- Creem 支付集成：支付接口与自动化计费
- 订阅生命周期管理：激活/到期/续费/取消
- Pro 能力开放：我的早报、每日回顾、为你推荐、高阶 AI 伴读、自定义视图等
- 配额管理：Pro 用户各能力的日/月配额追踪
- Pro 门禁：服务层集中治理，Free/Pro 功能边界明确

#### M6 AI 伴读 ✅ 开发完成（待 QA）

- 内容摘要：智能生成文章/播客/视频核心观点摘要（skill_summary）
- 互动问答：基于当前内容的自由对话式提问
- 划线提问：对任意文本段落提问，获得深度解释
- 章节跳转：播客/视频快速定位并跳转相关章节
- 预置技能：思维导图、关键观点提炼、问答对生成等模板
- 配额控制：Free 有限次数（摘要为主），Pro 高阶能力与更高用量
- 配额耗尽引导：QuotaExhaustedCard 触发升级引导

#### M7 个性化推荐 ✅ 开发完成（待 QA）

- 多路召回：兴趣、探索、热点、协同 4 路并行召回
- 六维兴趣标签：Domain / Topic / Entity / Format 二维用户偏好建模
- 行为学习闭环：点击/阅读/收藏/划线/不感兴趣/深度阅读等信号实时更新偏好
- 智能重排：综合标签匹配（含 Entity 独立加权）、来源亲和度、新鲜度、质量分、多样性排序
- 推荐解释：用户可见的推荐理由，非黑盒
- 反馈机制：不感兴趣/感兴趣实时影响后续推荐
- Quality Feedback：内容质量反馈按钮，已接入兴趣画像（FEATURE_INTEREST_PROFILE_ENABLED = true）

#### M8 用户订阅源管理 ✅ 开发完成（待 QA）

- 公共订阅源库：BestBlogs 精选高质量订阅源浏览与订阅
- 私有订阅源：用户自定义导入 RSS 源，自动检测元数据
- 订阅源推荐：基于兴趣的订阅源发现
- 我的订阅流：统一展示所有关注来源的内容
- 自定义视图（Pro）：按自定义条件组织内容，上限 10 个视图
- **2026-04-08 三页角色分化**（详见 M1 § `2026-04-08 订阅源三页重构`）：`/explore/sources`（Layer 1 公共发现）/ `/me/sources`（Layer 2 管理台）/ `/me/sources/add`（Layer 1→2 扩充桥梁）三页壳层复用但语义分化；`SourceCard` 信号系统（质量/可见性/时效）落地；智能视图（特别关注/未分类/最近更新/长期未更新）接入 `LibrarySidebar.smartViews`；"我的关注 → 我的早报" 因果闭环通过新 `/api/users/me/subscriptions/contributions?days=7` 端点可视化（卡片上显示"近 7 天进入早报 N 次"）

#### M9 会话安全改造 ✅ 开发完成（待 QA）

- HttpOnly Cookie 鉴权：access_token / refresh_token 存储在 HttpOnly + SameSite=Strict Cookie，JS 不可读
- session_active 登录态标记：非 HttpOnly Cookie，前端读取判断登录状态
- API 代理层：所有前端请求经 `/api/proxy/*`，代理注入 Authorization header 与 X-Internal-Token
- 内部 Token 校验：后端 InternalTokenFilter 阻止绕过代理的直接 API 调用
- Safe Redirect：用户可控重定向 URL 经 `safe-redirect.ts` 验证，仅允许同站相对路径
- API 路径白名单：`/api/proxy/*` 严格白名单，防止路径穿透

---

### 第三层：可调用知识基础设施

#### M11 OpenAPI 2.0 🔄 核心回归已补齐，待端到端验证

- 混合搜索：`POST /openapi/v2/resources/search`（兼容 `/openapi/v2/search`）全文 + 语义检索并行
- 内容浏览：`GET /openapi/v2/resources`（分页 + 核心过滤参数）
- 热趋内容：`GET /openapi/v2/resources/trending`（兼容 `/openapi/v2/resource/trending`）
- 资源详情：`GET /openapi/v2/resources/{id}`（聚合详情）+ `GET /openapi/v2/resources/{id}/meta`（元信息）
- 全文获取：`GET /openapi/v2/resources/{id}/markdown`；播客转录与章节 `GET /openapi/v2/resources/{id}/podcast/content`
- 来源/推文/电子报/每日简报：`/openapi/v2/sources`、`/openapi/v2/tweets`、`/openapi/v2/newsletters`、`/openapi/v2/briefs/latest`
- API Key 鉴权：Header `X-API-KEY`，10 QPS 限流，按接口类型日配额管制
- 统一响应格式：`{success, code, message, requestId, data}`，1-based 分页
- **2026-04-08 回归补齐**：新增 `openapi/v2` 四个控制器的 MVC 测试（search / brief / trending / category），覆盖参数映射、边界条件（limit 截断/空数据）与响应结构
- **2026-04-08 v2 端点补齐**：按 REST 规范补齐 `openapi/v2/resources`、`/sources`、`/tweets`、`/newsletters` 四组路径，与 v1 并行提供迁移目标
- **2026-04-08 v2 参数语义重整**：优先保留“分页 + 核心过滤”主路径，同时在 `resources` 继续兼容前端已稳定使用的高价值过滤参数（`sourceId`、评分区间、qualifiedFilter），平衡易用性与迁移成本
- **2026-04-08 用户态能力开放**：新增 `/openapi/v2/me/*` 能力簇，对齐前端核心工作流：`feeds`、`subscriptions`、`bookmarks`、`highlights`、`history`、`tags/folders`、`briefs`、`interests`
- **2026-04-08 API Key 用户上下文贯通**：`/openapi/v2/*` 支持从 API Key 元数据恢复 `userId`，Agent 无需额外传 `user-id` 头即可调用用户态接口
- **2026-04-08 覆盖面第二轮补齐**：扩展开放 `sources options/recommended/discover + profile + api-keys + behaviors + custom-views + reviews + onboarding + invites + private sources + OPML import + sync + source-recommendations + reading`，形成从「冷启动建档 → 阅读沉淀 → 深度阅读 → 外部同步」完整链路
- **2026-04-08 覆盖面第三轮补齐**：新增 `resources batch-meta/read/similar/system-config/margin-notes`、`GET /openapi/v2/resources/search`（Query 版）、`categories` 根路径/primary/children、`custom-properties`，补足前端资源检索与知识消费闭环
- **2026-04-08 覆盖面第四轮补齐**：新增 `openapi/v2/me/pro/*`（status/plans/checkout/portal）、`openapi/v2/feature-flags`、`openapi/v2/share/brief/{shareToken}`、`openapi/v2/newsletters/sitemap`，补足前端订阅运营与公开分享场景
- **2026-04-08 覆盖面第五轮补齐**：新增 `GET /openapi/v2/resources/{id}` 聚合详情；`/openapi/v2/sources` 补齐 `priority` 过滤并对齐推荐源配置顺序；`/openapi/v2/tweets` 补齐 `sortType` 并与站内接口一致仅返回 `COMPLETED` 内容
- **2026-04-08 Agent 编排文档补齐**：新增 `bestblogs-docs/specs/openapi-v2-agent-playbooks.md`，提供冷启动/每日阅读/导入+深读+同步三条可执行调用链与最小参数模板
- **2026-04-08 v2 合同文件补齐**：新增 `bestblogs-service/documents/openapi/openapi-v2.yaml`（Agent-first，最小参数优先，覆盖核心内容发现 + 用户工作流 + 阅读会话）
- **2026-04-08 v2 合同覆盖扩展**：补齐 `/openapi/v2/interests/tags`、`/openapi/v2/categories/{hierarchy|primary|children}`、`/openapi/v2/me/{api-keys|custom-views|source-recommendations|reviews|onboarding|invites|tags|folders|organize/counts}`、`/openapi/v2/me/sources/*`、`/openapi/v2/me/behaviors/*`、`/openapi/v2/me/sync/{flomo|status}`、`/openapi/v2/me/pro/{checkout|portal}` 以及 bookmarks/highlights/history/briefs 的细粒度子路径，降低 Agent 编排时“靠猜参数/路径”的成本
- **2026-04-08 OpenAPI v2 回归**：`bestblogs-api` 下 `OpenApi*Test` 共 43 项全部通过（含资源域/分类/搜索新增用例）
- **2026-04-08 OpenAPI 过滤链回归**：新增 `OpenApiFilterChainOrderTest`（prod profile），验证 `Auth → RateLimit → DailyQuota` 顺序与拦截短路行为

---

## 部署准备进度（2026-04-11）

- ✅ 复用既有 MongoDB 集群（无需新建实例）
- ✅ Redis 单机服务已安装（standalone）
- ✅ 生产镜像已完成 build
- 🔄 `deploy/.env` 主体已准备（待最终生产密钥、域名和第三方 Key 核对）
- ⬜ 待完成：按 `DEPLOY.md` 逐项完成索引/种子初始化、服务健康检查、ConfigKey 初始化、监控告警与回滚预案演练

## 当前 P1 待办

- **TODO-051**（P2，运维）：Redis 升级为高可用模式 — 当前为单机 standalone（Redis 7.0.15），可用性依赖单节点。待 Pro 用户规模增长后，升级为 **Redis Sentinel**（主从 + 自动故障切换，Spring Boot 配置改动最小），届时更新 `deploy/.env` 中 `SPRING_DATA_REDIS_*` 配置，从 host/port 单机模式切换到 `sentinel.master` + `sentinel.nodes` 模式。Redis Cluster 因使用场景（分布式锁/限流/OpenAPI 鉴权元数据）不要求水平分片，短期内无需。

- **TODO-001**：推荐链路质量与参数化优化（超时阈值、可观测指标、回归测试）
- **TODO-002**：文档清理项：冷启动路径已收敛到 `/api/users/me/onboarding` + `/openapi/v2/me/onboarding`，同步清理文档中的旧路径表述
- **TODO-007**：Landing 2.0 上线效果埋点已补齐（Landing + Auth + Brief + Feed + Follow + Pro），当前以本地链路验证为主；生产环境看板配置与验收在上线前集中执行
  - **配置文档**：`bestblogs-docs/specs/landing-2-posthog-dashboard.md`
  - **当前状态（2026-04-09）**：本地点击链路已在 PostHog 收到事件数据
  - **上线前动作**：按 `specs/landing-2-posthog-dashboard.md` 完成 Dashboard/Funnel 创建与验收清单（Live Events 抽检 + 主漏斗校验）
- **TODO-011**：Pro 上线前用户问卷调查
- **TODO-012**：内测用户邀请与深度访谈
- **TODO-017**：存量用户邀请码迁移（bb_user_credit → bb_user）
- **TODO-048**：Daily Review Phase C Measurement 观察期（2026-04-08 → 2026-04-22）
  - **回看节点**：2026-04-15 中期检查（抽查事件量级、脏值），2026-04-22 终期按 `specs/daily-review-phase-d-decision-matrix.md` 判定 Phase D 入场
  - **依赖**：PostHog Project `bestblogs-app` 的 `NEXT_PUBLIC_POSTHOG_KEY` 需注入生产环境；Dashboard 组装按 `specs/daily-review-analytics-dashboard.md` §5
  - **不写新 feature**：纪律是"信号先行"，只观测不改产品

> 已关闭：TODO-010（国内支付，已决策 USD only）、TODO-018~025（兴趣标签 P1 全部修复）、TODO-040~041（Landing Logo 与首页截图已完成替换）

### Observation Windows（当前进行中的测量窗口）

| 窗口 | 起止 | 文档 | 终点判定 |
|---|---|---|---|
| Daily Review Phase C Measurement | 2026-04-08 → 2026-04-22 | `specs/daily-review-analytics-dashboard.md` + `specs/daily-review-phase-d-decision-matrix.md` | 按三条阈值（足迹 ≥50% / 思考 ≥20% / 历史 ≥30%）判定 Phase D 是否入场，且只挑 1 个模块 |

---

## 上线前页面验证清单

> 目标：逐页确认功能正常、设计符合规范、Free/Pro 边界正确、中英文均可用。
>
> 状态图例：⬜ 待验证 ／ 🔄 验证中 ／ ✅ 通过 ／ ❌ 有问题

### 公开页面（未登录可访问）

| # | 页面路径 | 核心验证点 | 状态 |
|---|---------|-----------|------|
| 1 | `/` 首页 | Landing 价值主张、Free/Pro 对比、CTA 转化路径、LandingPhaseBadge 阶段标识、响应式 | ✅ 通过（Logo + 首页截图已替换）|
| 2 | `/about` 关于 | 品牌文案、链接有效 | ✅ |
| 3 | `/how-it-works` 如何运作 | 流程说明准确、配图正常 | ✅ |
| 4 | `/pro` Pro 定价 | 定价（早鸟 $10/月）、功能列表、Creem 跳转、Phase 阶段展示正确 | ✅ 通过 |
| 5 | `/privacy` 隐私政策 | 内容完整、格式正常 | ✅ |
| 6 | `/terms` 服务条款 | 内容完整、格式正常 | ✅ |
| 7 | `/explore` 探索主页 | 分类导航、内容列表加载、筛选器、响应式 | ✅ 通过（4 视口 + light/dark 验证）|
| 8 | `/explore/brief` 早报列表 | 历史早报列表、翻页、点击跳转 | ⬜ |
| 9 | `/explore/newsletter` 电子报列表 | 内容加载、分类筛选 | ⬜ |
| 10 | `/explore/sources` 订阅源库 | 公共订阅源展示、搜索过滤、`内容广场 · 订阅源` header、`值得优先关注` 质量 chip、sort pills 用户化命名 | 🔄 代码改动已验证（preview 实测），待人工 QA |
| 11 | `/sources` 订阅源页 | 内容正常展示 | ⬜ |
| 12 | `/newsletter` 电子报列表 | 内容加载、分页 | ⬜ |
| 13 | `/newsletter/[id]` 电子报详情 | 内容渲染、元数据展示 | ⬜ |
| 14 | `/explore/brief/[briefDate]` 早报详情 | 公共早报内容展示、历史导航 | ⬜ |
| 15 | `/brief/share/[token]` 早报分享 | Pro 试读完整体验：分享者署名条 + 完整章节/字幕 + 底部 Pro CTA、OG/Twitter 卡片正确、ChapterPanel 不溢出、CTA 不被 StickyPlayer 遮挡 | ✅ 通过（3 视口 × light/dark × zh/en） |
| 16 | `/status/[id]` 推文详情 | 推文内容、来源链接 | ⬜ |

### 内容详情页（登录后体验增强）

| # | 页面路径 | 核心验证点 | 状态 |
|---|---------|-----------|------|
| 17 | `/article/[id]` 文章详情 | 正文渲染、AI 伴读面板（摘要/问答/划线）、配额门禁、Citation 跳转、Margin Notes、暗色模式 | ⬜ |
| 18 | `/podcast/[id]` 播客详情 | 播放器、转录展示、章节导航、AI 伴读 | ⬜ |
| 19 | `/video/[id]` 视频详情 | 视频嵌入（YouTube IFrame API）、章节面板、转录、AI 伴读 | ⬜ |

### 认证流程页面

| # | 页面路径 | 核心验证点 | 状态 |
|---|---------|-----------|------|
| 20 | `/signin` 登录 | 登录成功跳转、HttpOnly Cookie 设置、已登录自动重定向 | ✅ |
| 21 | `/signup` 注册 | 注册流程、邮件验证发送 | ⬜ |
| 22 | `/auth/callback` OAuth 回调 | 第三方登录回调处理 | ⬜ |
| 23 | `/forgot-password` 忘记密码 | 邮件发送确认 | ⬜ |
| 24 | `/reset-password` 重置密码 | Token 验证、密码重置成功 | ⬜ |
| 25 | `/verify/[token]` 邮件验证 | Token 有效性、验证成功页 | ⬜ |
| 26 | `/invite` 邀请码 | 邀请码输入、激活 Pro 流程 | ⬜ |
| 27 | `/unsubscribe/[token]` 退订 | 退订确认、Token 有效性 | ⬜ |

### 登录后功能页面

| # | 页面路径 | 核心验证点 | 状态 |
|---|---------|-----------|------|
| 28 | `/explore/brief` 每日早报（公共） | 公共早报展示、历史导航、Pro 引导 | ⬜ |
| 29 | `/reading` 工作台 | 侧边栏导航、三大入口（早报/为你推荐/订阅流）可达性 | ⬜ |
| 30 | `/reading/brief` 我的早报（个人） | Pro 门禁展示、个性化内容质量、音频入口 | ⬜ |
| 31 | `/reading/feed` 为你推荐 | 冷启动 Onboarding（首次）、推荐列表、不感兴趣/感兴趣反馈、Quality Feedback | ⬜ |
| 32 | `/reading/follow` 关注流 | 我的关注流内容加载、来源筛选 | ⬜ |
| 33 | `/sources/my` 我的订阅源 | 301 重定向到 `/me/sources` | ⬜ |
| 34 | `/sources/recommend` 推荐订阅源 | 基于兴趣推荐、订阅操作 | ⬜ |
| 35 | `/sources/my-recommendations` 我推荐的 | 列表展示 | ⬜ |
| 36 | `/library/bookmarks` 书签 | 书签列表、跳转详情 | ⬜ |
| 37 | `/library/highlights` 划线 | 划线列表、来源文章链接 | ⬜ |
| 38 | `/library/history` 阅读历史 | 历史记录加载、时间排序 | ⬜ |
| 39 | `/me` 个人中心 | 用户信息、Pro 状态展示 | ⬜ |
| 40 | `/me/sources` 我的关注（manage 态） | 智能视图（特别关注/未分类/最近更新/长期未更新）、sidebar 真实计数、卡片关系层（folder/tag/关注于 X/★/近 7 天进入早报 N 次）、SignalChips（质量/私有/近期无更新）、行内操作始终可见 | 🔄 代码改动已验证（preview 实测 241 已关注），待人工 QA |
| 40a | `/me/sources/add` 我的关注（augment 态）| 从公共源挑选扩充、per-row `关注 / 已关注` 按钮、batch bar `已选 N（X 新）` 排除已关注、`?tab=all` 301 重定向 | 🔄 代码改动已验证，待人工 QA |
| 41 | `/profile` 个人资料 | 资料编辑、头像上传 | ⬜ |
| 42 | `/settings` 设置 | Pro 订阅管理、邮件偏好、API Key 管理、语言切换、4 分组结构 | ✅ |

### 跨页面通用验证项

| # | 验证项 | 说明 | 状态 |
|---|--------|------|------|
| A | 响应式布局 | 桌面(1440)、平板(768)、移动端(375) 各关键页面 | ⬜ |
| B | 暗色模式 | 主要页面暗色模式下无色彩异常 | ⬜ |
| C | 中英文切换 | 语言切换后所有页面文案正确、无 i18n key 裸露 | ⬜ |
| D | Free/Pro 边界 | Free 用户访问 Pro 功能页时 ProGateCard 正确展示 | ⬜ |
| E | 登录态保持 | 刷新后登录态不丢失（HttpOnly Cookie 正常） | ⬜ |
| F | 错误状态 | 404、500、网络错误时有合适的降级 UI | ⬜ |

---

## 兴趣标签与推荐系统待办

### 已完成（本轮）

- **TODO-018**：Entity 标签类型丢失 Bug — 已修复，从 InterestTagCacheService 解析 tagType，不再硬编码
- **TODO-019**：收藏接入兴趣画像 — 已修复，`UserBookmarkService.addBookmark()` 现在写入 `bb_user_op_log`
- **TODO-020**：Quality Feedback feature flag — 已开启，`FEATURE_INTEREST_PROFILE_ENABLED` 默认 true
- **TODO-021**：源行为得分事件类型加权 — 已实现，share > bookmark > read > click 差异化权重
- **TODO-022**：Entity 标签召回与重排增强 — 已实现，重排时 Entity 匹配独立加权
- **TODO-024**：前端阅读深度埋点 — 已实现，SCROLL_100 / DWELL_60S / DWELL_120S 事件
- **TODO-025**：后端阅读深度信号处理 — 已实现，USER_DEEP_READ(0.04) / USER_SCROLL_COMPLETE(0.03) 事件类型

### P1：当前阶段

- **TODO-023**：searchBoostTerms 定期人工审计更新 — 当前标签匹配关键词为静态配置，需定期审视与补充新技术词汇

### P3：后续迭代（快速上线后规划）

- **TODO-026**：协同过滤召回路径 — 引入轻量协同过滤："和你兴趣相似的用户还在读"，补充 content-based 的盲区
- **TODO-027**：知识图谱关联 — Entity 标签间建立关联（OpenAI → GPT → ChatGPT），自动扩展召回相关 Entity
- **TODO-028**：主题演化追踪 — 在 Daily Brief 或个人中心展示"你的兴趣变化"，让用户感知系统在学习
- **TODO-029**：阅读历史摘要与每日回顾 — 周度/月度生成个人阅读报告，LLM 总结偏好变化和知识积累脉络
- **TODO-030**：searchBoostTerms 自动化维护 — 定期用 LLM 审计标签关键词覆盖度，自动建议新增/淘汰词汇

---

## AI 伴读待办

### 已完成（本轮）

- 划线自由提问：HighlightToolbar 增加 "提问" 入口，预填选中文本到 ActionBar
- 配额耗尽升级引导：SSE error code 150002 触发品牌化 QuotaExhaustedCard（Link → /pro）
- 快速摘要 skill：前后端新增 `skill_summary`，WelcomeMindmap 提供快捷入口
- 品牌语气统一：图标 Sparkles → BookOpen，术语对齐 "AI Reading Copilot" / "AI 伴读"
- Citation 点击跳转：`CitationAnchor` 已实现 scrollIntoView + amber 高亮

### P2：下一轮迭代

- **TODO-031**：列表页轻入口 — 在文章列表卡片增加 AI 伴读轻量入口（图标按钮），点击直接进入阅读页并打开 Copilot 面板，参照 5-DESIGN.md §10.3 "列表页轻入口，不占主视线"
- **TODO-032**：Margin Notes 非 Copilot 用户默认展示 — 当前 margin notes 仅在 Copilot 面板开启时可见，应为所有用户默认展示 AI 洞察侧注（只读），作为 Pro 体验预览
- **TODO-033**：播客/视频章节跳转 — 2-PRODUCT.md 定义的 M6 能力，当前仅文章类型支持，需扩展到播客/视频详情页
- **TODO-034**：AI 伴读行为接入兴趣画像 — Copilot 交互（提问、使用 skill、展开回答）应写入 `bb_user_op_log`，丰富推荐系统信号源

### P3：后续规划

- **TODO-035**：跨文章上下文 — Pro 用户可引用此前阅读过的文章作为对话上下文，实现关联阅读（2-PRODUCT.md §9 Pro 能力）
- **TODO-036**：个性化 Prompt — 结合用户兴趣标签自动调整 skill prompt，如为前端开发者侧重代码示例解读
- **TODO-037**：Review 模式入口 — 在研究与回顾场景提供更强结构化支持（5-DESIGN.md §10.3），如批量文章对比分析
- **TODO-038**：语音输入/输出 — ActionBar 已预留麦克风按钮（micComingSoon），实现语音问答交互
- **TODO-039**：Copilot 使用数据看板 — 统计 skill 使用频率、会话长度、配额消耗趋势，指导产品迭代

---

## Redis / Elasticsearch 上线前检查清单

> 分阶段灰度策略：Phase 0 全关 → Phase 1 开写 → Phase 2 开读

### Phase 0：ES 全关（首次部署）

| # | 检查项 | 类型 | 状态 |
|---|--------|------|------|
| 1 | 确认 `FEATURE_ES_WRITE_ENABLED` = false | ConfigKey | ⬜ |
| 2 | 确认 `FEATURE_HYBRID_SEARCH_ENABLED` = false | ConfigKey | ⬜ |
| 3 | 确认 `FEATURE_SIMILAR_ARTICLES_ENABLED` = false | ConfigKey | ⬜ |
| 4 | 确认 `FEATURE_VECTOR_RECALL_ENABLED` = false | ConfigKey | ⬜ |
| 5 | 确认 `SEARCH_READ_MODEL_MODE` = MONGO | ConfigKey | ⬜ |
| 6 | 验证应用在 ES 不可达时正常启动（api + admin-api） | 集成验证 | ⬜ |
| 7 | 验证搜索/相似文章端点返回 FEATURE_DISABLED 而非 500 | 接口验证 | ⬜ |

### Phase 1：开启 ES 写入（数据灌入）

| # | 检查项 | 类型 | 状态 |
|---|--------|------|------|
| 8 | 生产 ES 集群就绪（TLS 认证、IK 分词器已安装） | 基础设施 | ⬜ |
| 9 | 生产 ES 环境变量配置正确（ELASTICSEARCH_URIS/ES_USERNAME/ES_PASSWORD） | 环境变量 | ⬜ |
| 10 | Embedding API 可用（EMBEDDING_BASE_URL/EMBEDDING_API_KEY） | 环境变量 | ⬜ |
| 11 | 手动执行 ES 索引别名初始化（或重启 admin-api 触发） | 运维 | ⬜ |
| 12 | 设置 `FEATURE_ES_WRITE_ENABLED` = true | ConfigKey | ⬜ |
| 13 | 观察 EsIncrementalSyncJob 日志（每 10 分钟），确认 Embedding 成功写入 | 日志验证 | ⬜ |
| 14 | 观察 EsDailyReconciliationJob 日志（05:00），确认对账正常 | 日志验证 | ⬜ |
| 15 | 通过 Admin `/api/admin/embedding/stats` 确认 COMPLETED 数量逐步增长 | 接口验证 | ⬜ |
| 16 | 人工抽查 ES 文档内容与 MongoDB 一致性 | 数据验证 | ⬜ |
| 17 | 确认 Embedding 失败率低于阈值（<5%） | 质量验证 | ⬜ |

### Phase 2：开启 ES 读取

| # | 检查项 | 类型 | 状态 |
|---|--------|------|------|
| 18 | ES 文档覆盖率达标（COMPLETED 资源 >90% 已有 Embedding） | 数据验证 | ⬜ |
| 19 | 设置 `FEATURE_HYBRID_SEARCH_ENABLED` = true | ConfigKey | ⬜ |
| 20 | 验证 `/api/search/hybrid` 端点返回正确结果 | 接口验证 | ⬜ |
| 21 | 验证 `/openapi/v1/search` 端点返回正确结果 | 接口验证 | ⬜ |
| 22 | 调优 BM25/kNN 权重（HYBRID_SEARCH_BM25_BOOST/KNN_BOOST） | 质量验证 | ⬜ |
| 23 | 设置 `FEATURE_SIMILAR_ARTICLES_ENABLED` = true | ConfigKey | ⬜ |
| 24 | 验证 `/api/resource/{id}/similar` 返回相关结果 | 接口验证 | ⬜ |

### Redis 上线前检查

| # | 检查项 | 类型 | 状态 |
|---|--------|------|------|
| 25 | 生产 Redis 环境变量配置正确（HOST/PORT/PASSWORD/DATABASE） | 环境变量 | ⬜ |
| 26 | Redis 连通性验证（从 api + admin-api 均可连接） | 集成验证 | ⬜ |
| 27 | 连接池参数合理（默认 max-active=20，根据负载调整） | 配置 | ⬜ |
| 28 | 分布式锁功能验证：多实例部署时 Job 仅在一个节点执行 | 集成验证 | ⬜ |
| 29 | OpenAPI Filter 链验证：Auth → RateLimit → DailyQuota 顺序正确 | 接口验证 | ✅ |
| 30 | Redis 不可用时降级验证：Auth 降级 MongoDB、RateLimit/Quota 返回 503 | 降级验证 | ⬜ |
| 31 | Prometheus/Grafana 接入 `redis_command_latency_ms` 指标 | 监控 | ⬜ |

### 可选优化（上线后）

| # | 检查项 | 类型 | 状态 |
|---|--------|------|------|
| 32 | 高频 MongoDB 读（用户查询、Source 列表）迁移 Redis 缓存 | 性能优化 | ✅ |
| 33 | Guava 本地缓存（ConfigKey/InterestTag/Category）迁移 Redis L2 实现跨节点一致 | 性能优化 | ✅ |
| 34 | ES 集群健康 + 搜索延迟监控告警 | 监控 | ⬜ |
| 35 | Embedding 全量批量灌入工具（startBatchProcess 尚未实现） | 功能开发 | ⬜ |
| 36 | UserProfile / Source 向量生成链路完整实现 | 功能开发 | ⬜ |

---

## 下阶段规划

### Phase 2（下一阶段）

- 优化推荐质量与可观测性（召回质量、超时、解释可读性）
- 强化个性化反馈闭环（不感兴趣、兴趣漂移、周报洞察）
- 提升 OpenAPI 与站内能力的一致性
- 协同过滤召回（TODO-026）、知识图谱关联（TODO-027）
- 主题演化追踪（TODO-028）、阅读历史摘要（TODO-029）

### Phase 3（验证后）

- 个人知识沉淀能力（Learning/Knowledge OS）
- Agent Native 能力：Context Pack、Content Intelligence Network、ResearchSession、WatchRule + Triggered Digest（详见 `specs/agent-native.md`）
- Native App（以订阅和音频留存指标触发）
