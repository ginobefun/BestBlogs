# BestBlogs 术语与统一表达

更新时间：2026-05-19  
状态：v2.4.0 重写草案（承接 VISION + PRODUCT + BRAND + ARCHITECTURE + DESIGN + UI-SPEC v2）

> 本文档用于统一 BestBlogs 在产品、设计、文案、架构、运营、代码和对外表达中的关键术语。
>
> 它不是产品说明书，不是功能 spec，也不是技术实现备忘录。  
> 它的核心职责是：当 BestBlogs 提到同一个概念时，我们到底应该怎么叫它。

---

## 1. 文档定位

`10-TERMINOLOGY.md` 是 BestBlogs 的统一命名边界。

它回答以下问题：

1. 同一个概念应该使用哪个主名称；
2. 用户可见名称和内部术语如何区分；
3. 中文和英文如何对应；
4. 哪些旧表达不应继续使用；
5. 当新功能、新入口、新能力出现时，应该如何命名。

术语文档不记录以下内容：

- 具体 Issue 编号；
- 具体 ConfigKey；
- 具体接口路径；
- 具体字段名；
- 具体 Job 名称；
- 具体邮件 Provider；
- 具体实现参数；
- 阶段性灰度策略；
- 历史实现过程。

这些内容应由 specs、architecture、operations、current state 或代码事实承接。

---

## 2. 使用原则

### 2.1 同一概念只保留一个主名称

同一个用户可见概念，尽量只保留一个主名称。

例如：

| 推荐表达 | 不推荐表达 |
|---|---|
| 我的早报 | 个性化早报 / 用户早报 |
| 我的关注 | 订阅流 / 我的订阅源 |
| 内容广场 | 发现页 |
| 主题解读 | 主题 / 研究报告 |
| AI 驱动的私人阅读助手 | AI 内容平台 / 内容聚合器 |

当历史代码、旧文档或内部实现仍保留旧名称时，应在备注中说明兼容关系，但不把旧名称继续作为用户主表达。

### 2.2 中文优先自然

中文表达优先选择用户一眼能懂的词，不强行按英文直译。

| 推荐表达 | 不推荐表达 |
|---|---|
| 内容广场 | Explore 页 |
| 我的早报 | My Brief |
| 我的关注 | Following Workspace |
| 来源偏好 | Source Affinity |
| 开放调用层 | Callable Infrastructure |
| 人工校准 | Human Calibration |

英文用于代码、API、国际化、媒体资料和必要的中英对照，但中文文档和中文界面优先使用自然中文表达。

### 2.3 用户语言优先于内部术语

用户可见名称优先使用结果导向、体验导向的表达。内部文档和技术文档可以保留更精确的结构术语。

| 用户看到的 | 内部文档可用的 |
|---|---|
| 主题解读 | Topic Page / Structured Context |
| 我的早报 | User Brief / Personalized Brief Job |
| AI 伴读 | Copilot / Reading Copilot |
| 沉浸式翻译 | Content Translate |
| 开放调用层 | OpenAPI / CLI / Agent-friendly Interface |

### 2.4 动作和关系要分清

最容易混淆的是「关注」和「订阅」。

| 场景 | 统一用词 | 说明 |
|---|---|---|
| 用户对内容来源的动作 | 关注 / 取消关注 | 不使用「订阅」 |
| 用户对付费方案的关系 | 订阅 Pro / 开通 Pro | 只有付费关系使用「订阅」 |
| 用户对内容的动作 | 收藏 / 划线 / 稍后读 / 不感兴趣 | 分别表达不同语义 |
| 系统对内容的动作 | 筛选 / 排序 / 解释 / 翻译 / 整理 | 不写成「替用户读完」 |

### 2.5 对外与对内分层表达

同一概念在不同场景下可以有不同表达，但需要分层清楚。

| 层级 | 适用场景 | 表达要求 |
|---|---|---|
| 用户可见 | UI、官网、邮件、社交媒体 | 自然、清楚、结果导向 |
| 产品文档 | PRODUCT、DESIGN、UI-SPEC | 可解释、可对齐、可执行 |
| 架构文档 | ARCHITECTURE、代码注释 | 边界清楚、语义准确 |
| 内部实现 | 代码、Job、字段、API | 可保持兼容命名，但不影响用户表达 |

### 2.6 首次出现可中英并列

当一个术语需要中英对应时，首次出现可写作：

> 中文（English）

之后保持统一，不再频繁切换。

例如：

- 公共策展层（Public Curation Layer）
- 我的空间（My Space）
- 开放调用层（Callable Capability Layer）

---

## 3. 品牌与定位术语

| 名称 | 中文 | 英文 | 使用场景 | 备注 |
|---|---|---|---|---|
| 用户主 slogan | 发现真正适合你的高质量内容 | Discover high-quality content that truly fits you | 首页、Open Graph、海报、SEO H1、产品发布 | 对外主表达 |
| 官方一句话定位 | AI 驱动的私人阅读助手 | AI-powered personal reading assistant | 官网、媒体资料、产品简介、About | 标准定位 |
| 完整定位句 | BestBlogs 是 AI 驱动的私人阅读助手，帮助用户建立稳定、可信、个性化的高质量信息输入 | BestBlogs is an AI-powered personal reading assistant that helps users build a stable, trusted, and personalized flow of high-quality information | About、媒体资料、产品介绍、品牌文档 | 最推荐用于正式介绍 |
| 中文自然版定位 | BestBlogs 是一位帮你判断什么值得读、协助你读懂，并逐渐理解你关注什么的私人阅读助手 | A personal reading assistant that helps you decide what is worth reading, understand it faster, and gradually learn what you care about | 中文介绍、社交媒体、用户问答 | 更口语化 |
| 长期方向说明 | 高质量信息输入、理解和持续跟踪的个人基础设施 | Personal infrastructure for high-quality information input, understanding, and ongoing tracking | 愿景、产品蓝图、战略材料 | 不作为首页主文案 |
| 废弃品牌母句 | 让高质量内容找到对的人 | Help high-quality content find the right people | 历史表达 | 不再作为品牌主表达 |

### 3.1 定位表达优先级

| 使用场景 | 推荐表达 |
|---|---|
| 首页 Hero | 发现真正适合你的高质量内容 |
| Open Graph | 发现真正适合你的高质量内容 |
| About | AI 驱动的私人阅读助手 + 完整定位句 |
| 媒体资料 | 完整定位句 |
| 社交媒体轻介绍 | 中文自然版定位 |
| 长期战略材料 | 长期方向说明 |

---

## 4. 产品结构术语

| 中文 | 英文 | 定义 | 使用层级 | 备注 |
|---|---|---|---|---|
| 公共策展层 | Public Curation Layer | 展示 BestBlogs 公共判断力的产品端，包括每日早报、精选周刊、主题解读、内容广场；未登录默认展示前三个入口，内容广场登录后开放 | 对外主用、产品文档主用 | 信任入口与质量门槛展示窗口 |
| 我的空间 | My Space / Personal Space | 面向登录用户开放、Pro 解锁完整工作流的个人化产品端，包括我的早报、我的关注、我的阅读、我的回顾 | 对外主用、产品文档主用 | 个性化与 Pro 价值兑现入口 |
| 公共质量池 | Public Quality Pool | 由 AI 初评、结构化分析、质量过滤和人工校准共同形成的高质量内容资产，供公共策展层和我的空间共同使用 | 产品文档主用、架构主用 | 不写成「中英双语质量池」 |
| 个人阅读流 | Personal Reading Flow | 由公共质量池、用户关注、兴趣画像和阅读行为共同形成的个人化内容流 | 产品文档主用、设计文档主用 | 用户界面优先使用具体入口名称 |
| 个人阅读工作流 | Personal Reading Workflow | 围绕我的早报、我的关注、我的阅读、我的回顾形成的持续阅读体验 | 产品文档主用 | Pro 完整价值兑现 |
| 开放调用层 | Callable Capability Layer / Open Access Layer | 通过 RSS、OpenAPI、CLI、Agent-friendly 接口开放稳定能力的长期延伸层 | 架构主用、内部主用 | 不作为当前主产品定位 |
| 跨入口能力 | Cross-Cutting Reading Capabilities | 横切公共策展层和我的空间的能力，包括 AI 伴读、沉浸式翻译、可解释推荐、行为学习等 | 产品文档主用、设计文档主用 | 不归属单一入口 |
| 每日节奏 | Daily Rhythm | 围绕早报、阅读、关注和回顾形成的连续阅读节奏 | 对外主用、产品文档主用 | 不使用 Daily Loop |
| 高质量信息输入 | High-quality Information Input | BestBlogs 帮助用户建立的稳定、可信、个性化的信息输入方式 | 品牌、产品、愿景主用 | 核心价值表达 |
| 跨平台、跨媒介、跨语言的质量判断体系 | Quality judgment system across platforms, media, and languages | BestBlogs 的核心能力和护城河表达 | 产品文档、架构文档主用 | 可在长文档中完整使用 |
| 编辑选目 | Editor's Selection / Editorial Picks | 公共策展层每日精选内容的拟人化表达，承载「克制、有判断力、宁少勿滥」的编辑态度 | 内容广场副标题、策展层品牌描述、对外文案 | 与「精选 (qualified)」的运营状态区分：编辑选目是品牌叙事，精选是运营标记 |

---

## 5. 用户可见入口术语

### 5.1 公共策展层入口

| 中文 | 英文 | 定义 | 使用层级 | 备注 |
|---|---|---|---|---|
| 每日早报 | Daily Briefing / Public Brief | 面向所有访问者的当日公共高质量内容整理 | 对外主用、产品文档主用 | 与「我的早报」区分 |
| 精选周刊 | Featured Weekly | 公共策展层的周节奏入口，对一周内容进行再次筛选、组织和表达 | 对外主用、产品文档主用 | 不简称 Newsletter |
| 主题解读 | Topic Page / Topic Brief | 围绕事件、领域、人物组织或对比对象的编辑式深度解读 | 对外主用、产品文档主用 | 用户入口统一用「主题解读」 |
| 内容广场 | Explore | 面向公共高质量内容的登录后浏览入口 | 对外主用、产品文档主用 | 替代「发现页」；未登录默认不展示 |

### 5.2 我的空间入口

| 中文 | 英文 | 定义 | 使用层级 | 备注 |
|---|---|---|---|---|
| 我的早报 | My Brief | 基于用户关注、兴趣和阅读行为生成的个人化早报 | 对外主用、产品文档主用 | 不再使用「个性化早报」「用户早报」 |
| 我的关注 | Following | 用户关注的来源和相关内容流 | 对外主用、产品文档主用 | 替代「订阅流」「我的订阅源」 |
| 我的阅读 | My Reading | 阅读历史、收藏、划线、笔记、稍后读等阅读沉淀入口 | 对外主用、产品文档主用 | 承接阅读后的回看与复用 |
| 我的回顾 | Daily Review | 我的空间中的日终阅读回顾入口，帮助用户整理当天阅读足迹和重点内容 | 对外主用、产品文档主用 | 入口名统一为「我的回顾」 |

### 5.3 入口术语关系

| 容易混淆 | 正确区分 |
|---|---|
| 每日早报 vs 我的早报 | 每日早报是公共入口；我的早报是个人化入口 |
| 内容广场 vs 我的关注 | 内容广场展示公共质量池；我的关注展示用户关注来源形成的个人内容流 |
| 主题解读 vs 文章 | 主题解读是多内容聚合后的结构化解读；文章是单篇内容 |
| 我的阅读 vs 我的回顾 | 我的阅读是阅读资产集合；我的回顾是日终整理入口 |
| 精选周刊 vs 邮件期刊来源 | 精选周刊是 BestBlogs 自己的公共入口；邮件期刊来源是外部内容来源类型 |

---

## 6. 内容对象与来源术语

### 6.1 内容类型

| 中文 | 英文 | 定义 | 备注 |
|---|---|---|---|
| 文章 | Article | 来自博客、媒体或个人网站的文本内容 | 不使用「博文」作为主术语 |
| 播客 | Podcast | 音频形态内容，通常来自播客频道的单集节目 | 界面可保留 Podcast |
| 视频 | Video | 视频形态内容，来源包括 YouTube、Bilibili 等平台 | 需要指明来源时写「来自 YouTube 的视频」 |
| 推文 / 线程 | Tweet / Thread | 来自 X 等平台的短内容或线程内容 | 标注来源时使用 X |
| 邮件期刊来源 | Newsletter Source | 外部邮件订阅类内容来源 | 不与「精选周刊」混淆 |
| 早报条目 | Brief Item | 出现在每日早报或我的早报中的单条内容 | 内部和产品文档可用 |
| 主题解读 | Topic Page / Topic Brief | 围绕多个内容组织形成的结构化解读 | 当前用户主入口 |
| 回顾条目 | Review Item | 出现在我的回顾中的已读内容、稍后阅读或思考线索 | 产品文档和 UI 文档可用 |

### 6.2 来源术语

| 中文 | 英文 | 定义 | 使用层级 | 备注 |
|---|---|---|---|---|
| 订阅源 | Source | 可以持续提供内容更新的来源对象，如博客、RSS、播客、视频频道、邮件期刊等 | 产品文档主用、架构主用 | 「订阅源」是名词，不是用户动作 |
| 关注 | Follow | 用户将某个来源加入自己的持续关注列表 | 对外主用 | 用户动作统一使用「关注」 |
| 取消关注 | Unfollow | 用户将某个来源移出自己的持续关注列表 | 对外主用 |  |
| 公共订阅源 | Public Source | 由平台维护、可供所有用户浏览和关注的来源 | 产品文档主用 |  |
| 私有订阅源 | Private Source | 由用户自己添加、只服务该用户个人阅读流的来源 | 产品文档、架构文档主用 | 私有内容不得进入公共入口 |
| 社区源 | Community Source | 由用户添加并在满足条件后可被其他用户发现和关注的来源元数据 | 产品文档主用 | 内容可见性仍需遵守架构边界 |
| 来源偏好 | Source Preference | 系统基于用户关注和行为形成的对不同来源的偏好判断 | 产品文档、数据文档主用 | 替代「来源亲和度」 |
| 关注贡献 | Source Contribution | 某个已关注来源在近一段时间内进入用户早报或推荐结果的情况 | 产品文档、数据文档可用 | 用于解释「关注 → 我的早报」关系 |
| 添加新来源 | Add Sources | 用户扩充自己关注来源的动作或页面 | 对外主用 | 不写「全部订阅源」 |
| 特别关注 | Featured Source / Starred Source | 用户对某个来源标记的重点偏好 | 对外可用 | 避免与内容侧 featured 混淆 |

### 6.3 关注与订阅的区分

| 场景 | 推荐表达 | 禁用表达 |
|---|---|---|
| 用户关注 RSS 来源 | 关注这个来源 | 订阅这个来源 |
| 用户取消来源 | 取消关注 | 取消订阅 |
| Pro 付费关系 | 订阅 Pro / 开通 Pro | 关注 Pro |
| 外部来源对象 | 订阅源 | 关注源 |
| 我的空间入口 | 我的关注 | 我的订阅源 |

---

## 7. AI、推荐与个性化术语

### 7.1 AI 能力术语

| 中文 | 英文 | 定义 | 使用层级 | 备注 |
|---|---|---|---|---|
| AI 伴读 | AI Reading Assistant / Reading Copilot | 帮助用户更快理解内容的阅读辅助能力，包括摘要、提问、解释、章节跳转等 | 对外主用、产品文档主用 | 不写成通用 AI 助手 |
| AI 摘要 | AI Summary | AI 为内容生成的结构化摘要，帮助用户快速了解要点 | 对外主用 |  |
| AI 问答 | AI Q&A | 用户针对当前内容向 AI 提问的能力 | 产品文档主用 | 必须绑定阅读场景 |
| 章节跳转 | Section Jump | 帮助用户快速定位到内容特定章节的能力 | 产品文档主用 |  |
| 沉浸式翻译 | Immersive Translate / Content Translate | 在内容详情页中提供原文、译文或双语对照的跨语言阅读能力 | 对外主用、产品文档主用 | 对外优先用「沉浸式翻译」 |
| 术语解释 | Term Explanation | 针对内容中的术语、概念或上下文提供解释 | 对外主用 |  |
| 跨文章伴读 | Cross-article Reading Assistant | 基于多篇内容上下文的高级 AI 伴读能力 | 产品文档主用 | #908：已从销售页 Pro Only 对比段移除，合并在通用 AI 伴读中；功能边界保留，销售层不单独宣传。同样下线的还有「长视频 / 长播客深度伴读」「Domain 自定义早报篇数」 |

### 7.2 内容判断与校准术语

| 中文 | 英文 | 定义 | 使用层级 | 备注 |
|---|---|---|---|---|
| AI 初评 | AI Screening | AI 对新采集内容进行结构化分析、初步评分和质量判断 | 产品文档、架构文档主用 | 替代「AI 筛选」「AI 评分」 |
| 人工校准 | Human Calibration | 人在关键内容、公共策展、评分标准和边界案例上进行校准 | 产品文档、架构文档主用 | 替代「专家精审」 |
| 编辑校准 | Editorial Calibration | 偏品牌或内容语境下的人工校准表达 | 对外可用 | 比「人工校准」更有编辑感 |
| 质量判断 | Quality Judgment | 对内容是否值得进入公共质量池或推荐结果的判断 | 产品文档主用 |  |
| 公共判断力 | Public Judgment | BestBlogs 在公共策展层展示出来的内容判断能力 | 品牌、产品、设计文档主用 |  |

### 7.3 推荐与个性化术语

| 中文 | 英文 | 定义 | 使用层级 | 备注 |
|---|---|---|---|---|
| 推荐能力 | Recommendation | 基于公共质量池、用户关注、兴趣和行为生成排序与推荐结果的能力 | 内部主用、产品文档可用 | 不作为用户侧顶层入口 |
| 推荐解释 | Recommendation Reason | 说明某条内容为什么出现在用户面前 | 对外主用、产品文档主用 | UI 可写「为什么推这条」 |
| 质量信号 | Quality Signal | 说明内容本身是否值得看的信号 | 设计、UI 文档主用 | 如精选、编辑推荐 |
| 相关性信号 | Relevance Signal | 说明内容和用户当前关注方向是否相关的信号 | 设计、UI 文档主用 | 主要出现在我的空间 |
| 个性化信号 | Personalization Signal | 说明内容为什么此刻出现在用户面前的信号 | 设计、UI 文档主用 | 不出现在公共策展层 |
| 兴趣标签 | Interest Tag | 用于描述用户兴趣与内容主题的结构化标签 | 对外主用、产品文档主用 |  |
| 兴趣画像 | Interest Profile | 基于用户选择与行为形成的兴趣模型 | 产品文档主用、内部主用 | 对外少用 |
| 我感兴趣的方向 | My Topics | 用户显式声明的关注方向集合 | UI 主用 | 不写「调权」「兴趣权重」 |
| 行为驱动学习 | Behavior-driven Learning | 系统通过用户关注、阅读、收藏、划线和反馈行为理解偏好 | 产品、设计文档主用 | 不开放手动调权 |

### 7.4 历史 / 兼容术语

| 旧术语 | 当前处理 |
|---|---|
| 为你推荐 / For You | v1 历史入口名，不再作为用户侧顶层入口 |
| 个性化推荐流 | 可在内部讨论中使用，但用户侧优先表达为「我的早报」「我的关注」或「推荐解释」 |
| 来源亲和度 | 替换为「来源偏好」 |
| 兴趣权重 / 调权 | 替换为「我感兴趣的方向」或「行为驱动学习」 |

---

## 8. 用户动作与商业术语

### 8.1 用户动作

| 中文 | 英文 | 定义 | 使用层级 | 备注 |
|---|---|---|---|---|
| 阅读 | Read | 用户打开并阅读内容 | 对外主用 |  |
| 收藏 | Bookmark | 将内容保存下来，方便后续回看 | 对外主用 | 长期保存感 |
| 划线 | Highlight | 在阅读中标记关键片段 | 对外主用 |  |
| 我的想法 | My thought | 划线附注的前缀文案，承载用户对该划线片段的个人备注；对应字段 `highlight.comment`/`note` | UI 主用 | 仅作为附注 prefix，不作为独立入口；区别于「划线」（标记片段）|
| 稍后读 | Read Later | 将内容标记为稍后阅读 | 对外主用 | 短期任务感 |
| 标记已读 | Mark as Read | 用户将内容标记为已阅读 | 对外主用 |  |
| 不感兴趣 | Not Interested | 用户对内容表达负反馈 | 对外主用 | 不写成「删除」或「屏蔽世界」 |
| 分享 | Share | 用户将内容分享到外部平台或生成分享链接 | 对外主用 |  |
| 关注 | Follow | 用户关注某个来源 | 对外主用 | 只用于来源 |
| 取消关注 | Unfollow | 用户取消对某个来源的关注 | 对外主用 |  |

### 8.2 商业与订阅术语

| 中文 | 英文 | 定义 | 使用层级 | 备注 |
|---|---|---|---|---|
| 免费版 | Free | 面向所有用户的基础能力层 | 对外主用 | 替代「免费层」 |
| Pro | Pro | BestBlogs 的付费方案名称 | 对外主用 | 不使用「Pro 会员」 |
| 开通 Pro | Start Pro | 用户首次进入 Pro 方案 | 对外主用 |  |
| 升级到 Pro | Upgrade to Pro | 用户从免费版进入 Pro | 对外主用 |  |
| 订阅 Pro | Subscribe to Pro | 用户与 Pro 方案之间的持续付费关系 | 对外主用 | 只有付费关系使用「订阅」 |
| Pro 订阅 | Pro Subscription | Pro 的持续付费关系 | 产品文档、运营文档主用 |  |
| 试用 Pro | Start Pro Trial | 用户通过试用完整体验 Pro 工作流 | 对外主用 | 不写成「预览 Pro」 |
| 配额 | Quota | 用户级动作配额，按可感知动作次数计量 | 产品、架构、UI 文档主用 | 不向用户暴露 token / 字符数 |
| Pro Only | Pro Only | 完整 Pro 工作流中的专属能力 | 产品文档、UI 文档主用 | 用户文案尽量解释具体价值 |

### 8.3 Pro 能力表达

| 能力 | 推荐表达 | 避免表达 |
|---|---|---|
| 我的早报 | 解锁完整的我的早报 | 尊享个人早报 |
| AI 伴读 | 使用更完整的 AI 伴读 | AI 替你读完 |
| 翻译 | 获得更高配额的跨语言阅读 | 一键看懂全网 |
| 我的回顾 | 解锁我的回顾，整理一天阅读收获 | 夜间叙事页 |
| 自定义视图 | 按你的关注方式整理内容 | 高级视图特权 |

---

## 9. 指标与内部术语

### 9.1 当前核心指标

| 中文 | 英文 | 定义 | 使用层级 | 备注 |
|---|---|---|---|---|
| Pro 早报日开数 | Pro Brief Open Users | 每天打开「我的早报」的 Pro 用户数，Web 打开或邮件打开任一即算 | 产品、数据文档主用 | 当前北极星指标 |
| Pro 留存 | Pro Retention | Pro 用户在一定周期后的持续活跃情况 | 产品、数据文档主用 | 可按 D7 / D30 / D90 |
| 工作流消费 | Workflow Consumption | 用户是否使用关注、伴读、翻译、回顾、收藏、划线等完整工作流能力 | 产品、数据文档主用 | 北极星的卫星指标 |
| 早报有效阅读 | Brief Effective Reading | 打开早报后进一步点击、收藏、划线、深读或使用 AI 伴读的行为 | 数据文档可用 | 后续质量校验指标 |

### 9.2 历史指标

| 中文 | 英文 | 当前处理 |
|---|---|---|
| 周合格阅读闭环 | Weekly Qualified Reading Loops / WQRL | v1 历史北极星主轴，仅作为历史参考 |
| 周深度阅读闭环率 | Weekly Deep Reading Rate / WDRR | v1 历史质量约束，已失效 |
| 早报驱动深度阅读用户 | Weekly Brief-driven Deep Reader / W4BR | v1 子指标，仅历史参考 |
| 周活跃阅读用户 | Weekly Active Reader / WAU-R | 可作为阅读活跃分析口径，但不是当前北极星 |

### 9.3 内部长期能力术语

| 中文 | 英文 | 定义 | 使用层级 | 备注 |
|---|---|---|---|---|
| 开放调用层 | Callable Capability Layer / Open Access Layer | 将稳定能力开放给外部工具、脚本、RSS、CLI 和智能体的架构层 | 架构主用 | 替代 Agent-ready Infrastructure |
| Agent-friendly 接口 | Agent-friendly Interface | 适合智能体调用的受控接口形态 | 内部主用、架构可用 | 不作为产品主定位 |
| OpenAPI | OpenAPI | 面向外部开发者和工具的 API 能力 | 对外可用、架构主用 |  |
| CLI | CLI | 命令行调用能力 | 内部主用、开发者文档可用 |  |
| 结构化研究包 | Context Pack | 供内部系统或智能体调用的结构化上下文对象 | 内部主用 | 不作为用户界面名称 |
| 研究会话 | Research Session | 围绕某个主题进行连续阅读、整理和思考的过程单元 | 内部主用、长期方向可用 | 当前不作为主产品入口 |
| 主题追踪 | Topic Tracking | 围绕某个主题持续监控和更新内容的能力 | 长期方向可用 | 当前不作为主入口 |
| MCP 服务 | MCP Service | 基于 MCP 协议对外暴露的服务能力 | 架构主用、内部主用 | 长期能力 |

---

## 10. 废弃表达

### 10.1 品牌与定位废弃表达

| 废弃表达 | 替代为 |
|---|---|
| 让高质量内容找到对的人 | 发现真正适合你的高质量内容 |
| AI 驱动的内容平台 | AI 驱动的私人阅读助手 |
| 内容聚合平台 | AI 驱动的私人阅读助手 |
| 内容聚合器 | AI 驱动的私人阅读助手 |
| AI 驱动的个性化高质量阅读工作流 | AI 驱动的私人阅读助手 |
| 高质量阅读与知识基础设施（作为首页主文案） | AI 驱动的私人阅读助手 |

### 10.2 产品入口废弃表达

| 废弃表达 | 替代为 |
|---|---|
| 发现页 | 内容广场 |
| 用户早报 | 我的早报 |
| 个性化早报 | 我的早报 |
| 公共早报（作为顶层入口名） | 每日早报 |
| 订阅流 | 我的关注 |
| 我的订阅源 | 我的关注 |
| 订阅源管理 / 关注管理（作为页头标题） | 我的关注 |
| 所有订阅源 / 全部订阅源 | 添加新来源 |
| 为你推荐 / For You（作为顶层入口） | 不再作为顶层入口，能力并入我的早报、我的关注和推荐解释 |
| 研究报告（作为当前顶层入口） | 主题解读 |
| 夜间叙事页（作为入口名） | 我的回顾 |
| 每日回顾（作为入口名） | 我的回顾 |

### 10.3 来源与推荐废弃表达

| 废弃表达 | 替代为 |
|---|---|
| Subscribe Source | Source / Follow |
| Unsubscribe Source | Unfollow |
| 我的订阅 | 我的关注 |
| 个人订阅源 / 个人来源 | 私有订阅源 |
| 来源亲和度 | 来源偏好 |
| 兴趣权重 | 我感兴趣的方向 |
| 调权 | 行为驱动学习 / Domain 自定义篇数 |
| 配置画像 | 我感兴趣的方向 |
| 中英双语质量池 | 不同语言的一手优质内容 / 公共质量池 |
| 跨源原生 | 跨平台、跨媒介、跨语言的质量判断体系 |

### 10.4 AI 与审核废弃表达

| 废弃表达 | 替代为 |
|---|---|
| AI 评分 | AI 初评 |
| AI 筛选 | AI 初评 |
| AI 过滤 | AI 初评 / 质量过滤 |
| 专家精审 | 人工校准 / 编辑校准 |
| 人工复审 | 人工校准 |
| 人工精审 | 人工校准 |
| AI 替你读完 | AI 伴读 / 帮你更快读懂 |
| 问我任何事（AI 伴读入口） | 针对当前内容提问 |
| 二级分类 / subCategory / aiSubcategory | 已废弃（v2.4.2）：内容分类改为单层 domain，细粒度分类由六维兴趣标签体系承担，不再维护 AI 二级子分类字段 |

### 10.5 架构与长期能力废弃表达

| 废弃表达 | 替代为 |
|---|---|
| Agent-ready Infrastructure | 开放调用层 / 可调用能力层 |
| Callable Infrastructure | 开放调用层 |
| 两端 + Agent 三层结构 | 公共策展层 + 我的空间；开放调用层作为长期延伸 |
| 三层飞轮 | 公共策展层 + 我的空间 |
| 工具接口（作为主术语） | 开放调用层 / Agent-friendly 接口 |
| 结构化研究包（用户主名称） | 主题解读 / Context Pack（内部） |

### 10.6 商业表达废弃表达

| 废弃表达 | 替代为 |
|---|---|
| 免费层 | 免费版 |
| Pro 会员 | Pro |
| VIP | Pro |
| 尊享 | Pro |
| 限时疯抢 | 试用 Pro / 开通 Pro |
| 不升就错过 | 解锁完整的私人阅读助手工作流 |
| 最后机会 | 当前不推荐使用 |
| 立即解锁人生效率 | 让每日阅读更适合你 |

---

## 11. 中英文速查表

### 11.1 品牌与产品

| 中文 | 英文 |
|---|---|
| 发现真正适合你的高质量内容 | Discover high-quality content that truly fits you |
| AI 驱动的私人阅读助手 | AI-powered personal reading assistant |
| 高质量信息输入 | High-quality information input |
| 稳定、可信、个性化的高质量信息输入 | Stable, trusted, and personalized flow of high-quality information |
| 公共策展层 | Public Curation Layer |
| 我的空间 | My Space / Personal Space |
| 公共质量池 | Public Quality Pool |
| 个人阅读流 | Personal Reading Flow |
| 个人阅读工作流 | Personal Reading Workflow |
| 开放调用层 | Callable Capability Layer / Open Access Layer |
| 每日节奏 | Daily Rhythm |

### 11.2 用户入口

| 中文 | 英文 |
|---|---|
| 每日早报 | Daily Briefing / Public Brief |
| 精选周刊 | Featured Weekly |
| 主题解读 | Topic Page / Topic Brief |
| 内容广场 | Explore |
| 我的早报 | My Brief |
| 我的关注 | Following |
| 我的阅读 | My Reading |
| 我的回顾 | Daily Review |
| AI 伴读 | AI Reading Assistant / Reading Copilot |
| 沉浸式翻译 | Immersive Translate / Content Translate |

### 11.3 内容与来源

| 中文 | 英文 |
|---|---|
| 文章 | Article |
| 播客 | Podcast |
| 视频 | Video |
| 推文 / 线程 | Tweet / Thread |
| 邮件期刊来源 | Newsletter Source |
| 早报条目 | Brief Item |
| 回顾条目 | Review Item |
| 订阅源 | Source |
| 公共订阅源 | Public Source |
| 私有订阅源 | Private Source |
| 社区源 | Community Source |
| 关注 | Follow |
| 取消关注 | Unfollow |
| 来源偏好 | Source Preference |
| 关注贡献 | Source Contribution |
| 添加新来源 | Add Sources |
| 特别关注 | Featured Source / Starred Source |

### 11.4 AI、推荐与个性化

| 中文 | 英文 |
|---|---|
| AI 初评 | AI Screening |
| 人工校准 | Human Calibration |
| 编辑校准 | Editorial Calibration |
| AI 摘要 | AI Summary |
| AI 问答 | AI Q&A |
| 章节跳转 | Section Jump |
| 术语解释 | Term Explanation |
| 推荐能力 | Recommendation |
| 推荐解释 | Recommendation Reason |
| 质量信号 | Quality Signal |
| 相关性信号 | Relevance Signal |
| 个性化信号 | Personalization Signal |
| 兴趣标签 | Interest Tag |
| 兴趣画像 | Interest Profile |
| 我感兴趣的方向 | My Topics |
| 行为驱动学习 | Behavior-driven Learning |

### 11.5 用户动作与商业

| 中文 | 英文 |
|---|---|
| 阅读 | Read |
| 收藏 | Bookmark |
| 划线 | Highlight |
| 稍后读 | Read Later |
| 标记已读 | Mark as Read |
| 不感兴趣 | Not Interested |
| 分享 | Share |
| 免费版 | Free |
| Pro | Pro |
| 开通 Pro | Start Pro |
| 升级到 Pro | Upgrade to Pro |
| 订阅 Pro | Subscribe to Pro |
| Pro 订阅 | Pro Subscription |
| 试用 Pro | Start Pro Trial |
| 配额 | Quota |
| Pro 早报日开数 | Pro Brief Open Users |

### 11.6 长期与内部

| 中文 | 英文 |
|---|---|
| OpenAPI | OpenAPI |
| CLI | CLI |
| Agent-friendly 接口 | Agent-friendly Interface |
| 结构化研究包 | Context Pack |
| 研究会话 | Research Session |
| 主题追踪 | Topic Tracking |
| MCP 服务 | MCP Service |
| 工具调用 | Tool Calling |
| 可调用能力 | Callable Capability |

---

## 12. 维护规则

### 12.1 新增术语标准格式

新增术语时，建议使用以下五列：

| 中文主名称 | 英文对应 | 一句话定义 | 使用层级 | 备注 |
|---|---|---|---|---|

其中：

- 中文主名称必须自然可读；
- 英文对应必须准确，不追求花哨；
- 定义必须能解释它和相邻概念的区别；
- 使用层级必须说明是用户可见、产品文档、架构文档、内部实现还是历史兼容；
- 容易混淆时必须填写备注。

### 12.2 更新原则

1. 新增功能或概念时，同步在本文件中添加对应术语。
2. 术语变更时，同步更新「废弃表达」和「中英文速查表」。
3. 若新术语与已有术语语义重叠，优先合并而非新增。
4. 用户可见入口优先使用已有产品结构命名，不随 spec 临时命名漂移。
5. 内部字段名可以保留兼容，但不反向污染用户可见表达。
6. 术语变更应同步检查 `BRAND`、`PRODUCT`、`DESIGN`、`UI-SPEC` 和相关 spec。
7. 不把 Issue、ConfigKey、字段、Job、接口路径作为主术语维护。
8. 历史术语如确需保留，必须标记为历史 / 兼容，不得混入当前主表达。

### 12.3 冲突处理

| 冲突类型 | 处理方式 |
|---|---|
| 用户界面和术语文档冲突 | 以本文件为准，并修正 UI |
| 品牌表达和术语文档冲突 | 以 `3-BRAND.md` 的品牌定位为准，并同步更新本文件 |
| 产品结构和术语文档冲突 | 以 `2-PRODUCT.md` 为准，并同步更新本文件 |
| 架构边界和术语文档冲突 | 以 `4-ARCHITECTURE.md` 为准，并同步更新本文件 |
| 代码字段和用户术语冲突 | 代码可保留兼容命名，但用户表达以本文件为准 |
| 历史文档和当前术语冲突 | 历史文档保持归档，当前文档使用新版术语 |

---

## 13. 一句话总结

`10-TERMINOLOGY.md` 的目标不是收集所有名词，而是统一 BestBlogs 的表达边界。

它要确保所有文档、界面、代码注释、营销文案和对外介绍，都尽量围绕同一组核心表达展开：

**发现真正适合你的高质量内容。  
BestBlogs 是 AI 驱动的私人阅读助手，帮助用户建立稳定、可信、个性化的高质量信息输入。**
