---
title: BestBlogs 订阅源分享第三波：AI 领域高质量来源篇
date: 2026-06-09
description: 基于 BestBlogs 当前 1563 个订阅源、322 个兴趣标签和近期内容表现，整理 AI 领域高质量来源，按用户选择场景分组推荐。
slug: bestblogs-sources-part3-ai-high-quality
tags: BestBlogs, Sources, AI, RSS, Twitter, Podcast, YouTube
category: build
---

这是 BestBlogs 订阅源整理与分享系列的**第三波**。

[第一波整理了微信公众号](https://www.ginonotes.com/posts/bestblogs-sources-part1-from-wechat)，[第二波整理了播客和视频](https://www.ginonotes.com/posts/bestblogs-sources-part2-podcasts-videos)。这一期只聚焦一个领域：**AI 高质量来源**。

这份清单基于当前本地数据：

- 全量订阅源：`contents/bestblogs.bb_resource_source.json`
- 兴趣标签字典：`contents/bestblogs.bb_interest_tag.json`

BestBlogs 目前维护 **1563 个订阅源**，其中主分类为「人工智能」的来源有 **392 个**。如果把「编程技术」「商业科技」「产品设计」「投资财经」等分类里带有 AI 兴趣标签的交叉来源也算上，AI 相关来源约 **699 个**。

这也说明 AI 已经不是一个孤立分类。它同时出现在模型研究、开发者工具、产品创业、产业媒体和投资观察里。对用户来说，真正需要的不是订阅所有 AI 内容，而是根据自己的目标选择一组可信来源，再让 BestBlogs 帮你做筛选、聚合和解释。

## 如何阅读这份清单

表格里的「近期信号」使用 `高分 / Brief / 阅读` 三个数值，分别对应近三个月高质量内容数、进入 Brief 的内容数和阅读量。它不是绝对排名，而是帮助你判断一个来源近期是否活跃、是否持续产生可推荐内容。

| 优先级 | 建议使用方式 |
| --- | --- |
| 高 | 适合放进主阅读流，长期跟踪。 |
| 中 | 适合按主题选择性订阅，作为主阅读流补充。 |
| 普通 | 适合作为专题研究、工具观察或实时动态补充。 |

## 整体统计

### AI 主分类来源

| 类型 | 数量 |
| --- | ---: |
| X / Twitter | 183 |
| 文章 / Newsletter | 162 |
| 视频 | 44 |
| 播客 | 3 |
| **合计** | **392** |

### AI 相关来源分布

| 主分类 | AI 相关来源 |
| --- | ---: |
| 人工智能 | 392 |
| 编程技术 | 123 |
| 商业科技 | 96 |
| 产品设计 | 34 |
| 媒体资讯 | 14 |
| 效率成长 | 14 |
| 投资财经 | 12 |
| 未分类 | 11 |
| 生活文化 | 3 |
| **合计** | **699** |

## 一、模型公司与官方发布

如果你只想第一时间知道模型、产品和平台能力怎么变，这一组最适合优先订阅。官方来源不一定每天高频更新，但每次更新的信号通常很强。

| 来源 | 类型 | 语言 | 优先级 | 近期信号 | 主要标签 | 推荐理由 |
| --- | --- | --- | --- | --- | --- | --- |
| [OpenAI News](https://openai.com/news) | 文章 | 英文 | 高 | 17 / 171 / 10435 | AI Agent、AI 编程、研究前沿、LLM、模型发布 | OpenAI 官方新闻源，近三个月高分和 Brief 信号都很强，适合追踪模型、产品、平台和研究方向的一手信息。 |
| [Claude Blog](https://claude.com/blog) | 文章 | 英文 | 高 | 21 / 87 / 14140 | AI Agent、AI 编程、AI 产品、Anthropic、MCP | Anthropic 面向用户和团队的产品实践内容，近期高分数最高，和 Claude Code、团队工作流高度相关。 |
| [Anthropic News](https://www.anthropic.com/news) | 文章 | 英文 | 高 | 5 / 40 / 6161 | AI Agent、AI 安全、Anthropic、模型发布 | 更偏公司新闻、研究方向与安全议题，是理解 Anthropic 长期路线的基础来源。 |
| [Google DeepMind News](https://deepmind.google/blog/) | 文章 | 英文 | 高 | 5 / 16 / 2855 | 研究前沿、Google、模型训练、多模态 | 覆盖基础研究、模型进展和 AI for Science，适合补足 OpenAI/Anthropic 之外的研究视角。 |
| [Hugging Face - Blog](https://huggingface.co/blog) | 文章 | 英文 | 高 | 6 / 116 / 4803 | LLM、模型训练、多模态、开源 | 开源 AI 生态的重要窗口，兼具研究、工具和社区实践。 |
| [DeepSeek](https://wechat2rss.bestblogs.dev/feed/1709da4f538d4ce4fb6d7a8ba1a5a1c297919601.xml) | 文章 | 中文 | 高 | 1 / 2 / 1655 | LLM、模型发布、长上下文、AGI | 更新不高频，但作为中文模型公司官方源，适合跟踪关键发布和长期路线。 |
| [通义实验室](https://wechat2rss.bestblogs.dev/feed/4ebee6222ae08705b8aabc9116f0defbcb6b17c6.xml) | 文章 | 中文 | 高 | 7 / 23 / 5828 | LLM、多模态、模型训练、模型发布 | 阿里通义体系的技术和模型发布入口，近三个月高分内容稳定。 |
| [月之暗面 Kimi](https://wechat2rss.bestblogs.dev/feed/c5c43d4bc17bae656763859ed0903bb6314ec6fe.xml) | 文章 | 中文 | 高 | 4 / 10 / 1973 | LLM、AI Agent、AI 产品 | 产品化节奏清晰，适合观察长上下文与面向用户的 AI 助手演进。 |
| [MiniMax 稀宇科技](https://wechat2rss.bestblogs.dev/feed/00306b171f754d463b28cf83f3ba086ad009b430.xml) | 文章 | 中文 | 高 | 6 / 15 / 4652 | LLM、多模态、AI Agent、模型发布 | 覆盖文本、语音、视频和音乐等多模态能力，是中文多模态产品的重要来源。 |
| [智谱](https://wechat2rss.bestblogs.dev/feed/433d2134dca54d80804daf32e8be546155be3300.xml) | 文章 | 中文 | 高 | 3 / 13 / 3196 | LLM、AI Agent、长程智能体、模型发布 | 适合跟踪 GLM 体系、智能体和企业级 AI 动态。 |
| [腾讯混元](https://wechat2rss.bestblogs.dev/feed/306ce19a1ca590c9c2df781789e828d1acfa1356.xml) | 文章 | 中文 | 高 | 1 / 19 / 1294 | LLM、模型训练、世界模型、模型发布 | 腾讯混元官方源，适合作为国产模型发布补充。 |
| [AI at Meta Blog](https://ai.meta.com/blog/) | 文章 | 英文 | 中 | 2 / 0 / 436 | 研究前沿、Meta、LLM、多模态 | Meta AI 官方博客，更新节奏不如 OpenAI/Anthropic 密，但适合关注开源模型和研究动态。 |

## 二、AI 工程、Agent 与开发者实践

如果你是开发者、架构师、AI 工程师或技术负责人，这一组最值得放进主阅读流。它关注的是如何把 AI 做成真实系统：Agent 架构、上下文工程、评测、RAG、AI 编程、开发者工具和平台工程。

| 来源 | 类型 | 语言 | 优先级 | 近期信号 | 主要标签 | 推荐理由 |
| --- | --- | --- | --- | --- | --- | --- |
| [AI Engineer](http://www.youtube.com/feeds/videos.xml?channel_id=UCLKPca3kwwd-B59HNr-_lvA) | 视频 | 英文 | 高 | 31 / 272 / 10929 | AI 编程、AI Agent、RAG、模型评测 | 近期高分数和 Brief 数都非常突出，是 AI 工程实践最集中的视频来源之一。 |
| [Latent.Space](https://www.latent.space) | 文章 | 英文 | 高 | 15 / 111 / 9292 | AI Agent、AI 编程、研究前沿、上下文工程 | 兼具 Newsletter 和访谈视角，适合追踪一线 AI 工程师社区。 |
| [LangChain Blog](https://www.langchain.com/blog) | 文章 | 英文 | 高 | 15 / 24 / 5447 | Agent 编排、AI Agent、AI 编程、开源 | LangChain 生态官方源，适合跟踪 Agent 工具链和应用编排。 |
| [Cursor Blog](https://cursor.com/en-US/blog) | 文章 | 英文 | 高 | 8 / 28 / 2674 | AI Agent、AI 编程、AI 产品 | Cursor 官方产品与工程更新，是 AI IDE 演进的重要信号源。 |
| [Simon Willison's Weblog](http://simonwillison.net/atom/everything/) | 文章 | 英文 | 高 | 5 / 219 / 7839 | AI Agent、AI 编程、LLM、提示工程 | 长期稳定、判断克制，适合开发者建立对 LLM 工具的实际理解。 |
| [Google Developers Blog](https://developers.googleblog.com) | 文章 | 英文 | 高 | 12 / 46 / 4587 | AI Agent、AI 编程、Google、模型发布 | Google 面向开发者的官方技术入口，Gemini、平台能力和 API 更新都值得跟。 |
| [宝玉的分享](https://baoyu.io) | 文章 | 中文 | 高 | 10 / 46 / 15384 | AI Agent、AI 编程、上下文工程、LLM、提示工程 | 中文 AI 工程与产品实践中最值得长期关注的个人源之一。 |
| [The Cloudflare Blog](https://blog.cloudflare.com) | 文章 | 英文 | 高 | 29 / 102 / 8870 | AI Agent、后端、云原生、Cloudflare | 虽然主分类是工程，但近期 AI 相关工程内容非常强，适合看 AI 基础设施如何落地。 |
| [The GitHub Blog](https://github.blog/) | 文章 | 英文 | 高 | 6 / 53 / 3910 | AI 编程、开发者工具、GitHub、MCP | 适合跟踪 Copilot、开发者平台、安全和 AI 编程生态。 |
| [Google Antigravity](https://x.com/antigravity) | X | 英文 | 中 | 0 / 7 / 148 | AI Agent、AI 编程、开发者工具、Google | 新型 agentic development 平台，适合作为 AI IDE 方向的观察对象。 |
| [Replit](https://x.com/Replit) | X | 英文 | 中 | 0 / 1 / 501 | AI 编程、AI Agent、开发者工具、MCP | 适合追踪 Replit Agent 和浏览器内开发环境的产品节奏。 |
| [Qdrant](https://x.com/qdrant_engine) | X | 英文 | 中 | 0 / 1 / 201 | RAG、开源、向量数据库 | RAG 与向量检索基础设施的实用信号源。 |
| [AI SDK](https://x.com/aisdk) | X | 英文 | 普通 | 0 / 0 / 3 | AI 编程、开发者工具、OpenAI API | Vercel AI SDK 相关更新，适合前端和全栈开发者做工具观察。 |

## 三、研究、课程与论文理解

如果你希望补基础、追前沿、理解模型能力边界，这一组更适合做专题学习。它们不一定每天都必须读，但在学习某个方向时很有价值。

| 来源 | 类型 | 语言 | 优先级 | 近期信号 | 主要标签 | 推荐理由 |
| --- | --- | --- | --- | --- | --- | --- |
| [Hung-yi Lee](http://www.youtube.com/feeds/videos.xml?channel_id=UC2ggjtuuWvxrHHHiaDH1dlQ) | 视频 | 中文 | 高 | 3 / 6 / 3224 | LLM、模型训练、研究前沿、多模态 | 华语圈最系统的 AI 教学和论文解读来源之一。 |
| [Andrej Karpathy](https://x.com/karpathy) | X | 英文 | 高 | 8 / 18 / 1580 | LLM、AI Agent、研究前沿、模型训练 | 一线研究者和教育者视角，适合捕捉 AI 研究和工程范式变化。 |
| [The Batch | DeepLearning.AI](https://www.deeplearning.ai/the-batch/) | 文章 | 英文 | 高 | 5 / 17 / 1224 | AI 产品动态、模型发布、Newsletter | Andrew Ng 团队出品，适合每周快速理解 AI 重要进展。 |
| [OpenAI](http://www.youtube.com/feeds/videos.xml?channel_id=UCXZCJLdBC09xxGZ6gcdrc6A) | 视频 | 英文 | 高 | 17 / 112 / 5767 | LLM、模型发布、AI Agent、多模态、AI 安全 | 官方视频源适合看模型和产品能力如何被展示，也能捕捉发布会级别的信息。 |
| [Google DeepMind News](https://deepmind.google/blog/) | 文章 | 英文 | 高 | 5 / 16 / 2855 | 研究前沿、模型训练、多模态 | 适合看研究团队如何讲述关键成果。 |
| [Andrew Ng](https://x.com/AndrewYNg) | X | 英文 | 高 | 2 / 17 / 942 | AI 编程、模型训练 | AI 教育和应用落地视角稳定，适合做长期背景输入。 |
| [AI at Meta Blog](https://ai.meta.com/blog/) | 文章 | 英文 | 中 | 2 / 0 / 436 | Meta、LLM、多模态 | 适合关注 Meta 在开源模型、多模态和研究产品化上的进展。 |
| [Lex Fridman](http://www.youtube.com/feeds/videos.xml?channel_id=UCSHZKyawb77ixDdsGog4iWA) | 视频 | 英文 | 中 | 1 / 0 / 572 | 研究前沿、访谈 | 更适合作为长访谈补充，适合在专题学习时挑选嘉宾收听。 |
| [Berkeley AI Research](https://x.com/berkeley_ai) | X | 英文 | 普通 | 0 / 0 / 6 | 研究前沿、模型训练 | 学术研究机构账号，适合作为论文和研究动态补充。 |

## 四、AI 产品、创业与商业化

如果你关心 AI 如何变成产品、公司和新的工作方式，这一组更适合。它对产品经理、创业者、投资人和组织管理者会更有价值。

| 来源 | 类型 | 语言 | 优先级 | 近期信号 | 主要标签 | 推荐理由 |
| --- | --- | --- | --- | --- | --- | --- |
| [十字路口 Crossing](https://www.xiaoyuzhoufm.com/podcast/60502e253c92d4f62c2a9577) | 播客 | 中文 | 高 | 6 / 16 / 4631 | AI 产品、AI 商业化、AI Agent、创业 | 访谈 AI 时代的积极行动者，适合理解一线产品与团队变化。 |
| [AI 炼金术](https://www.xiaoyuzhoufm.com/podcast/63e9ef4de99bdef7d39944c8) | 播客 | 中文 | 中 | 2 / 17 / 2607 | AI Agent、AI 产品、AI 商业化 | 从阅读和洞察出发讨论 AI 带来的本质变化，适合产品和创业读者。 |
| [张小珺Jùn｜商业访谈录](https://www.xiaoyuzhoufm.com/podcast/626b46ea9cbbf0451cf5a962) | 播客 | 中文 | 高 | 10 / 19 / 7183 | 商业、AI 研究、LLM、深度访谈 | 长对话密度高，近期高分内容多，适合从人物和产业角度理解 AI 变革。 |
| [十字路口 Crossing](https://wechat2rss.bestblogs.dev/feed/20492a5f2d3637c178c01ab0bab7ed86a4a0995b.xml) | 文章 | 中文 | 中 | 2 / 57 / 5952 | AI 产品、AI Agent、AI 商业化、创业 | 同一品牌的图文源，适合想快速阅读访谈与观点整理的用户。 |
| [量子位](https://www.qbitai.com) | 文章 | 中文 | 中 | 4 / 320 / 34202 | AI 产品、LLM、模型发布、科技新闻 | 更新量大、阅读信号强，适合作为中文 AI 动态雷达，但需要 BestBlogs 做质量过滤。 |
| [机器之心](https://wechat2rss.bestblogs.dev/feed/8d97af31b0de9e48da74558af128a4673d78c9a3.xml) | 文章 | 中文 | 中 | 2 / 169 / 18777 | AI 媒体、LLM、研究前沿 | 中文 AI 媒体里更偏技术和论文的一支。 |
| [新智元](https://wechat2rss.bestblogs.dev/feed/e531a18b21c34cf787b83ab444eef659d7a980de.xml) | 文章 | 中文 | 中 | 1 / 132 / 12443 | LLM、研究前沿、模型发布、科技新闻 | 高频中文 AI 媒体源，适合捕捉热点和中文产业叙事。 |
| [AI前线](https://wechat2rss.bestblogs.dev/feed/25185b01482da0f485418ecb92e208b4416712fb.xml) | 文章 | 中文 | 中 | 0 / 69 / 6239 | LLM、AI Agent、AI 编程、AI 商业化 | 面向 AI 爱好者、开发者和科学家，适合作为中文技术实践补充。 |
| [腾讯科技](https://wechat2rss.bestblogs.dev/feed/a81bdfcbb9eefe870d285e81510ffa1af26e4520.xml) | 文章 | 中文 | 高 | 13 / 171 / 16670 | 商业、科技新闻、AI 产品 | 商业科技主分类下的高信号来源，适合看 AI 产品和科技公司动态。 |
| [硅谷101](https://wechat2rss.bestblogs.dev/feed/8f8fe34034f6123b168ed7847c51d50ff47cd7ee.xml) | 文章 | 中文 | 高 | 6 / 22 / 2121 | AI 商业化、研究前沿、科技评论、创业 | 适合从硅谷和科技产业视角理解 AI 变化。 |
| [Founder Park](https://wechat2rss.bestblogs.dev/feed/f940695505f2be1399d23cc98182297cadf6f90d.xml) | 文章 | 中文 | 高 | 4 / 47 / 10638 | AI 商业化、AI Agent、AI 编程、创业 | 专注科技创业者和真问题，适合创业者持续跟踪。 |

## 五、X / Twitter 观察哨

X 源更适合捕捉新产品、新论文、新争论和一线判断，但噪声也更高。建议放进 BestBlogs 后让系统做过滤，而不是手动逐条刷。

| 来源 | 类型 | 语言 | 优先级 | 近期信号 | 主要标签 | 推荐理由 |
| --- | --- | --- | --- | --- | --- | --- |
| [OpenAI](https://x.com/OpenAI) | X | 英文 | 高 | 5 / 116 / 1572 | LLM、AI Agent、AI 安全、OpenAI、AI 产品 | OpenAI 官方 X 账号，适合捕捉发布节奏和产品信号。 |
| [OpenAI Developers](https://x.com/OpenAIDevs) | X | 英文 | 高 | 7 / 135 / 2275 | LLM、AI Agent、AI 产品 | 开发者更新比主账号更实用，适合构建 OpenAI 应用的人关注。 |
| [Anthropic](https://x.com/AnthropicAI) | X | 英文 | 高 | 3 / 74 / 1354 | AI Agent、AI 安全、Anthropic、AI 产品 | Anthropic 公司级信号源。 |
| [Claude](https://x.com/claudeai) | X | 英文 | 高 | 9 / 72 / 1696 | AI Agent、AI 产品、AI 安全 | Claude 产品侧更新入口，近期高分信号不错。 |
| [LangChain](https://x.com/LangChainAI) | X | 英文 | 高 | 0 / 119 / 1512 | AI Agent、多模态、开源 | Agent 工程工具链更新密集，适合和 LangChain Blog 搭配。 |
| [Cursor](https://x.com/cursor_ai) | X | 英文 | 高 | 2 / 61 / 865 | AI 编程、AI Agent、AI 产品、Cursor | 适合跟 AI IDE 和代码助手变化。 |
| [宝玉](https://x.com/dotey) | X | 中文 | 高 | 1 / 268 / 14456 | AI 编程、AI Agent、AI 产品 | 中文 AI 实践者视角，信息筛选能力强，阅读信号极高。 |
| [meng shao](https://x.com/shao__meng) | X | 中文 | 中 | 2 / 133 / 12238 | 提示工程、RAG、AI Agent | 对 Prompt、RAG 和 Agent 持续跟踪，适合工程实践补充。 |
| [Simon Willison](https://x.com/simonw) | X | 英文 | 普通 | 0 / 4 / 588 | LLM、AI Agent、AI 编程、提示工程 | X 源适合补充实时动态，长文源更值得主读。 |
| [Harrison Chase](https://x.com/hwchase17) | X | 英文 | 高 | 0 / 54 / 1140 | AI Agent、多模态 | LangChain 创始人账号，适合观察 Agent 框架和生态趋势。 |
| [Boris Cherny](https://x.com/bcherny) | X | 英文 | 高 | 0 / 32 / 621 | LLM、AI Agent、AI 编程、提示工程 | Claude Code 相关一线视角，适合 AI 编程深度用户关注。 |

## 高/中优先级来源全量清单

为了方便用户真正做选择，下面把 AI 相关来源中所有高优先级和中优先级来源列全。这里的 AI 相关来源包括两类：主分类为「人工智能」的来源，以及其他主分类中带有 AI 兴趣标签或明显 AI 内容信号的来源。

本轮共覆盖 **223 个高/中优先级 AI 相关来源**：AI 主分类高优先级 53 个、AI 主分类中优先级 94 个、跨分类高优先级 31 个、跨分类中优先级 45 个。普通优先级不追求全量，只在最后补充近期信号较强或主题代表性强的来源。

### AI 主分类 · 高优先级

共 **53** 个。

| 来源 | 主分类 | 类型 | 语言 | 优先级 | 近期信号 | 主要标签 |
| --- | --- | --- | --- | --- | --- | --- |
| [AI Engineer](http://www.youtube.com/feeds/videos.xml?channel_id=UCLKPca3kwwd-B59HNr-_lvA) | 人工智能 | 视频 | 英文 | 高 | 31 / 272 / 10929 | AI 与智能应用、AI 编程、AI Agent、RAG / 检索增强、模型评测与基准 |
| [Claude Blog](https://claude.com/blog) | 人工智能 | 文章 | 英文 | 高 | 21 / 87 / 14140 | AI Agent、AI 编程、AI 产品与应用、AI 与智能应用、Anthropic |
| [OpenAI News](https://openai.com/news) | 人工智能 | 文章 | 英文 | 高 | 17 / 171 / 10435 | AI Agent、AI 编程、AI研究前沿、AI 与智能应用、大语言模型 (LLM) |
| [OpenAI](http://www.youtube.com/feeds/videos.xml?channel_id=UCXZCJLdBC09xxGZ6gcdrc6A) | 人工智能 | 视频 | 英文 | 高 | 17 / 112 / 5767 | AI 与智能应用、大语言模型 (LLM)、模型发布、AI Agent、多模态 AI |
| [Latent.Space](https://www.latent.space) | 人工智能 | 文章 | 英文 | 高 | 15 / 111 / 9292 | AI Agent、AI 编程、AI研究前沿、上下文工程、AI 与智能应用 |
| [LangChain Blog](https://www.langchain.com/blog) | 人工智能 | 文章 | 英文 | 高 | 15 / 24 / 5447 | Agent编排、AI Agent、AI 编程、AI 与智能应用、LangChain |
| [Claude](http://www.youtube.com/feeds/videos.xml?channel_id=UCV03SRZXJEz-hchIAogeJOg) | 人工智能 | 视频 | 英文 | 高 | 13 / 106 / 4230 | AI 与智能应用、AI Agent、AI 编程、AI 产品与应用、MCP协议 |
| [Google Developers Blog](https://developers.googleblog.com) | 人工智能 | 文章 | 英文 | 高 | 12 / 46 / 4587 | AI Agent、AI 编程、AI 与智能应用、Google、模型发布 |
| [宝玉的分享](https://baoyu.io) | 人工智能 | 文章 | 中文 | 高 | 10 / 46 / 15384 | AI Agent、AI 编程、上下文工程、AI 与智能应用、大语言模型 (LLM) |
| [Claude(@claudeai)](https://x.com/claudeai) | 人工智能 | X | 英文 | 高 | 9 / 72 / 1696 | AI 与智能应用、AI Agent、AI 产品与应用、AI安全与伦理 |
| [OpenAI Developers(@OpenAIDevs)](https://x.com/OpenAIDevs) | 人工智能 | X | 英文 | 高 | 7 / 135 / 2275 | AI 与智能应用、大语言模型 (LLM)、AI Agent、AI 产品与应用 |
| [Cursor Blog](https://cursor.com/en-US/blog) | 人工智能 | 文章 | 英文 | 高 | 8 / 28 / 2674 | AI Agent、AI 编程、AI 产品与应用、AI 与智能应用 |
| [Andrej Karpathy(@karpathy)](https://x.com/karpathy) | 人工智能 | X | 英文 | 高 | 8 / 18 / 1580 | AI 与智能应用、大语言模型 (LLM)、AI Agent、AI研究前沿、模型训练与推理 |
| [通义实验室](https://wechat2rss.bestblogs.dev/feed/4ebee6222ae08705b8aabc9116f0defbcb6b17c6.xml) | 人工智能 | 文章 | 中文 | 高 | 7 / 23 / 5828 | AI 与智能应用、大语言模型 (LLM)、多模态 AI、模型训练与推理、模型发布 |
| [Simon Willison's Weblog](http://simonwillison.net/atom/everything/) | 人工智能 | 文章 | 英文 | 高 | 5 / 219 / 7839 | AI Agent、AI 编程、AI 与智能应用、大语言模型 (LLM)、提示工程 |
| [Hugging Face - Blog](https://huggingface.co/blog) | 人工智能 | 文章 | 英文 | 高 | 6 / 116 / 4803 | AI Agent、AI 与智能应用、大语言模型 (LLM)、模型训练与推理、多模态 AI |
| [十字路口Crossing](https://www.xiaoyuzhoufm.com/podcast/60502e253c92d4f62c2a9577) | 人工智能 | 播客 | 中文 | 高 | 6 / 16 / 4631 | AI 与智能应用、创业、科技行业分析、AI 产品与应用、AI 商业化 |
| [MiniMax 稀宇科技](https://wechat2rss.bestblogs.dev/feed/00306b171f754d463b28cf83f3ba086ad009b430.xml) | 人工智能 | 文章 | 中文 | 高 | 6 / 15 / 4652 | AI 与智能应用、大语言模型 (LLM)、多模态 AI、AI Agent、模型发布 |
| [OpenAI(@OpenAI)](https://x.com/OpenAI) | 人工智能 | X | 英文 | 高 | 5 / 116 / 1572 | AI 与智能应用、大语言模型 (LLM)、AI Agent、AI 安全与对齐、OpenAI |
| [Anthropic News](https://www.anthropic.com/news) | 人工智能 | 文章 | 英文 | 高 | 5 / 40 / 6161 | AI Agent、AI安全与伦理、AI 与智能应用、Anthropic、模型发布 |
| [Google DeepMind News](https://deepmind.google/blog/) | 人工智能 | 文章 | 英文 | 高 | 5 / 16 / 2855 | AI研究前沿、AI 与智能应用、Google、模型发布、模型训练与推理 |
| [The Batch \| DeepLearning.AI](https://www.deeplearning.ai/the-batch/) | 人工智能 | 文章 | 英文 | 高 | 5 / 17 / 1224 | AI Agent、AI产品动态、AI 与智能应用、模型发布、Newsletter / 科技周报 |
| [浮之静](https://wechat2rss.bestblogs.dev/feed/abb0de0c0cb8f684a1606a4b20121b245547adce.xml) | 人工智能 | 文章 | 中文 | 高 | 4 / 22 / 5200 | AI 与智能应用、AI 编程、AI Agent、心理健康、阅读与写作 |
| [月之暗面 Kimi](https://wechat2rss.bestblogs.dev/feed/c5c43d4bc17bae656763859ed0903bb6314ec6fe.xml) | 人工智能 | 文章 | 中文 | 高 | 4 / 10 / 1973 | AI 与智能应用、大语言模型 (LLM)、AI Agent、AI 产品与应用 |
| [Sam Altman(@sama)](https://x.com/sama) | 人工智能 | X | 英文 | 高 | 3 / 108 / 1514 | AI 与智能应用、AI 商业化、AI Agent、OpenAI、科技行业分析 |
| [Anthropic Engineering](https://www.anthropic.com/engineering) | 人工智能 | 文章 | 英文 | 高 | 4 / 4 / 4274 | AI Agent、AI 编程、AI安全与伦理、AI 与智能应用、Harness工程 |
| [宝玉(@dotey)](https://x.com/dotey) | 人工智能 | X | 中文 | 高 | 1 / 268 / 14456 | AI 与智能应用、AI 编程、AI Agent、AI 产品与应用 |
| [Anthropic(@AnthropicAI)](https://x.com/AnthropicAI) | 人工智能 | X | 英文 | 高 | 3 / 74 / 1354 | AI 与智能应用、AI Agent、AI安全与伦理、Anthropic、AI 产品与应用 |
| [Logan Kilpatrick(@OfficialLoganK)](https://x.com/OfficialLoganK) | 人工智能 | X | 英文 | 高 | 3 / 72 / 1055 | AI 与智能应用、AI Agent、AI 产品与应用、AI 编程 |
| [智谱](https://wechat2rss.bestblogs.dev/feed/433d2134dca54d80804daf32e8be546155be3300.xml) | 人工智能 | 文章 | 中文 | 高 | 3 / 13 / 3196 | AI 与智能应用、大语言模型 (LLM)、AI Agent、长程智能体、模型发布 |
| [Hung-yi Lee](http://www.youtube.com/feeds/videos.xml?channel_id=UC2ggjtuuWvxrHHHiaDH1dlQ) | 人工智能 | 视频 | 中文 | 高 | 3 / 6 / 3224 | AI 与智能应用、大语言模型 (LLM)、模型训练与推理、AI研究前沿、多模态 AI |
| [Peter Steinberger 🦞(@steipete)](https://x.com/steipete) | 人工智能 | X | 英文 | 高 | 2 / 85 / 1684 | AI 与智能应用、AI Agent、MCP协议、科技行业分析 |
| [Cursor(@cursor_ai)](https://x.com/cursor_ai) | 人工智能 | X | 英文 | 高 | 2 / 61 / 865 | AI 与智能应用、AI 编程、AI Agent、AI 产品与应用、Cursor |
| [Andrew Ng(@AndrewYNg)](https://x.com/AndrewYNg) | 人工智能 | X | 英文 | 高 | 2 / 17 / 942 | AI 与智能应用、AI 编程、模型训练与推理 |
| [OpenClaw Blog](https://openclaw.ai/) | 人工智能 | 文章 | 英文 | 高 | 2 / 16 / 210 | AI Agent、AI 安全与对齐、AI安全事件、AI 与智能应用、OpenClaw |
| [Demis Hassabis(@demishassabis)](https://x.com/demishassabis) | 人工智能 | X | 英文 | 高 | 2 / 15 / 510 | AI 与智能应用、AI Agent、AI 产品与应用 |
| [Michael Truell(@mntruell)](https://x.com/mntruell) | 人工智能 | X | 英文 | 高 | 2 / 4 / 252 | AI 与智能应用、AI 编程、AI 产品与应用、创业 |
| [Google Gemini(@GeminiApp)](https://x.com/GeminiApp) | 人工智能 | X | 英文 | 高 | 1 / 73 / 796 | AI 与智能应用、AI Agent、AI 产品与应用 |
| [ClaudeDevs(@ClaudeDevs)](https://x.com/ClaudeDevs) | 人工智能 | X | 英文 | 高 | 1 / 69 / 414 | AI 与智能应用、AI 编程、开发者工具、MCP协议、Anthropic |
| [Greg Brockman(@gdb)](https://x.com/gdb) | 人工智能 | X | 英文 | 高 | 0 / 163 / 1433 | AI 与智能应用 |
| [Google DeepMind(@GoogleDeepMind)](https://x.com/GoogleDeepMind) | 人工智能 | X | 英文 | 高 | 1 / 62 / 603 | AI 与智能应用、AI Agent、具身智能 |
| [LangChain(@LangChainAI)](https://x.com/LangChainAI) | 人工智能 | X | 英文 | 高 | 0 / 119 / 1512 | AI 与智能应用、AI Agent、多模态 AI、开源项目 |
| [腾讯混元](https://wechat2rss.bestblogs.dev/feed/306ce19a1ca590c9c2df781789e828d1acfa1356.xml) | 人工智能 | 文章 | 中文 | 高 | 1 / 19 / 1294 | AI 与智能应用、大语言模型 (LLM)、模型训练与推理、世界模型、模型发布 |
| [Lee Robinson(@leerob)](https://x.com/leerob) | 人工智能 | X | 英文 | 高 | 1 / 19 / 299 | AI 与智能应用、AI 编程、数据产品 |
| [DeepSeek](https://wechat2rss.bestblogs.dev/feed/1709da4f538d4ce4fb6d7a8ba1a5a1c297919601.xml) | 人工智能 | 文章 | 中文 | 高 | 1 / 2 / 1655 | AI 与智能应用、大语言模型 (LLM)、模型发布、长上下文、AGI 研究与路径 |
| [Anthropic](http://www.youtube.com/feeds/videos.xml?channel_id=UCrDwWp7EBBv4NwvScIpBDOA) | 人工智能 | 视频 | 英文 | 高 | 1 / 2 / 690 | AI 与智能应用、AI 安全与对齐、大语言模型 (LLM)、AI Agent、AI研究前沿 |
| [Google DeepMind](http://www.youtube.com/feeds/videos.xml?channel_id=UCP7jMXSY2xbc3KCAE0MHQ-A) | 人工智能 | 视频 | 英文 | 高 | 1 / 1 / 263 | AI 与智能应用、AI研究前沿、多模态 AI、模型发布、AI 安全与对齐 |
| [Sam Altman](https://blog.samaltman.com/posts.atom) | 人工智能 | 文章 | 英文 | 高 | 1 / 0 / 364 | AI 商业化、AI 安全与对齐、AI 与智能应用、Sam Altman |
| [Harrison Chase(@hwchase17)](https://x.com/hwchase17) | 人工智能 | X | 英文 | 高 | 0 / 54 / 1140 | AI 与智能应用、AI Agent、多模态 AI |
| [Boris Cherny(@bcherny)](https://x.com/bcherny) | 人工智能 | X | 英文 | 高 | 0 / 32 / 621 | AI 与智能应用、大语言模型 (LLM)、AI Agent、AI 编程、提示工程 |
| [DeepLearning.AI(@DeepLearningAI)](https://x.com/DeepLearningAI) | 人工智能 | X | 英文 | 高 | 0 / 25 / 624 | AI 与智能应用、AI Agent、AI 产品与应用 |
| [Lex Fridman(@lexfridman)](https://x.com/lexfridman) | 人工智能 | X | 英文 | 高 | 0 / 5 / 195 | AI 与智能应用、AI研究前沿、科技行业分析 |
| [字节跳动Seed](https://wechat2rss.bestblogs.dev/feed/6efd40bb335d2037f365d284cb5e00f0843e737e.xml) | 人工智能 | 文章 | 中文 | 高 | 0 / 0 / 375 | AI 与智能应用、模型发布、多模态 AI、大语言模型 (LLM)、AI 语音 |

### AI 主分类 · 中优先级

共 **94** 个。

| 来源 | 主分类 | 类型 | 语言 | 优先级 | 近期信号 | 主要标签 |
| --- | --- | --- | --- | --- | --- | --- |
| [Towards Data Science](https://towardsdatascience.com/) | 人工智能 | 文章 | 英文 | 中 | 7 / 157 / 7440 | AI Agent、模型评测与基准、AI研究前沿、AI 与智能应用、模型训练与推理 |
| [量子位](https://www.qbitai.com) | 人工智能 | 文章 | 中文 | 中 | 4 / 320 / 34202 | AI 产品与应用、AI 与智能应用、大语言模型 (LLM)、模型发布、科技新闻 |
| [机器之心](https://wechat2rss.bestblogs.dev/feed/8d97af31b0de9e48da74558af128a4673d78c9a3.xml) | 人工智能 | 文章 | 中文 | 中 | 2 / 169 / 18777 | AI 与智能应用、资讯与媒体、大语言模型 (LLM)、AI研究前沿 |
| [NVIDIA Technical Blog](https://developer.nvidia.com/blog/feed/) | 人工智能 | 文章 | 英文 | 中 | 3 / 57 / 1343 | AI Agent、AI 与智能应用、NVIDIA、大语言模型 (LLM)、模型训练与推理 |
| [meng shao(@shao__meng)](https://x.com/shao__meng) | 人工智能 | X | 中文 | 中 | 2 / 133 / 12238 | AI 与智能应用、提示工程、RAG / 检索增强、AI Agent |
| [LangChain](http://www.youtube.com/feeds/videos.xml?channel_id=UCC-lyoTfSrcJzA1ab3APAgw) | 人工智能 | 视频 | 英文 | 中 | 3 / 20 / 1472 | AI 与智能应用、AI Agent、AI 工作流、RAG / 检索增强、MCP协议 |
| [Qwen(@Alibaba_Qwen)](https://x.com/Alibaba_Qwen) | 人工智能 | X | 英文 | 中 | 3 / 12 / 728 | AI 与智能应用、大语言模型 (LLM)、模型发布、开源项目 |
| [No Priors](http://www.youtube.com/feeds/videos.xml?channel_id=UCSI7h9hydQ40K5MJHnCrQvw) | 人工智能 | 视频 | 英文 | 中 | 3 / 11 / 1071 | AI 与智能应用、AI研究前沿、AI 商业化、AI 安全与对齐、AI 产品与应用 |
| [Anthropic Research](https://www.anthropic.com/research) | 人工智能 | 文章 | 英文 | 中 | 3 / 10 / 520 | AI研究前沿、AI安全与伦理、AI 与智能应用、大语言模型 (LLM) |
| [Google Cloud Blog](https://cloud.google.com/blog/) | 人工智能 | 文章 | 英文 | 中 | 2 / 83 / 4097 | AI Agent、云原生 / DevOps、AI 与智能应用、Google、大语言模型 (LLM) |
| [十字路口Crossing](https://wechat2rss.bestblogs.dev/feed/20492a5f2d3637c178c01ab0bab7ed86a4a0995b.xml) | 人工智能 | 文章 | 中文 | 中 | 2 / 57 / 5952 | AI 与智能应用、AI 产品与应用、AI Agent、AI 商业化、创业 |
| [数字生命卡兹克](https://wechat2rss.bestblogs.dev/feed/ff621c3e98d6ae6fceb3397e57441ffc6ea3c17f.xml) | 人工智能 | 文章 | 中文 | 中 | 2 / 45 / 6957 | AI 与智能应用、AI 编程、AI Agent、Vibe Coding、AI 产品与应用 |
| [新智元](https://wechat2rss.bestblogs.dev/feed/e531a18b21c34cf787b83ab444eef659d7a980de.xml) | 人工智能 | 文章 | 中文 | 中 | 1 / 132 / 12443 | AI 与智能应用、大语言模型 (LLM)、AI研究前沿、模型发布、科技新闻 |
| [AI炼金术](https://www.xiaoyuzhoufm.com/podcast/63e9ef4de99bdef7d39944c8) | 人工智能 | 播客 | 中文 | 中 | 2 / 17 / 2607 | AI 与智能应用、AI Agent、AI 产品与应用、AI 商业化、播客 |
| [Dwarkesh Patel](http://www.youtube.com/feeds/videos.xml?channel_id=UCXl4i9dYBrFOabk0xGmbkRA) | 人工智能 | 视频 | 英文 | 中 | 2 / 7 / 735 | AI 与智能应用、AI研究前沿、AI 商业化、AI 安全与对齐、访谈 |
| [Ahead of AI](https://magazine.sebastianraschka.com) | 人工智能 | 文章 | 英文 | 中 | 2 / 3 / 1076 | AI 编程、AI研究前沿、注意力机制、AI 与智能应用、大语言模型 (LLM) |
| [Midjourney(@midjourney)](https://x.com/midjourney) | 人工智能 | X | 英文 | 中 | 2 / 3 / 131 | AI 与智能应用、多模态 AI、Midjourney、AI 产品与应用 |
| [AI at Meta Blog](https://ai.meta.com/blog/) | 人工智能 | 文章 | 英文 | 中 | 2 / 0 / 436 | AI研究前沿、AI 与智能应用、Meta、大语言模型 (LLM)、多模态 AI |
| [AI at Meta(@AIatMeta)](https://x.com/AIatMeta) | 人工智能 | X | 英文 | 中 | 2 / 0 / 123 | AI 与智能应用、Meta、大语言模型 (LLM)、模型发布 |
| [Datawhale](https://wechat2rss.bestblogs.dev/feed/ea0dd8bddfe4fbfb32eaa81a1e1b628d45e97a80.xml) | 人工智能 | 文章 | 中文 | 中 | 1 / 36 / 8309 | AI 与智能应用、开源项目、AI研究前沿、AI Agent、AI 编程 |
| [How I AI](http://www.youtube.com/feeds/videos.xml?channel_id=UCRYY7IEbkHLH_ScJCu9eWDQ) | 人工智能 | 视频 | 英文 | 中 | 1 / 24 / 644 | AI 与智能应用、AI 产品与应用 |
| [Draco正在VibeCoding](https://wechat2rss.bestblogs.dev/feed/54dd1b1511fd066dfea2b4acde3e62787e8a687b.xml) | 人工智能 | 文章 | 中文 | 中 | 1 / 14 / 3572 | AI 与智能应用、AI 编程、Vibe Coding、多模态 AI |
| [歸藏的AI工具箱](https://wechat2rss.bestblogs.dev/feed/1c3e3571b1627d23ee9c64521a0b0a41d3fe2987.xml) | 人工智能 | 文章 | 中文 | 中 | 1 / 10 / 2461 | AI 与智能应用、AI 产品与应用、AI 编程、多模态 AI |
| [Google AI(@GoogleAI)](https://x.com/GoogleAI) | 人工智能 | X | 英文 | 中 | 1 / 11 / 318 | AI 与智能应用、多模态 AI、AI 产品与应用、Google |
| [Jerry Liu(@jerryjliu0)](https://x.com/jerryjliu0) | 人工智能 | X | 英文 | 中 | 1 / 10 / 892 | AI 与智能应用、AI Agent、AI 编程 |
| [Runway(@runwayml)](https://x.com/runwayml) | 人工智能 | X | 英文 | 中 | 1 / 9 / 339 | AI 与智能应用、视频AI、多模态 AI、AI 产品与应用、计算机视觉 |
| [ElevenLabs Blog](https://elevenlabs.io/blog) | 人工智能 | 文章 | 英文 | 中 | 1 / 7 / 151 | AI 产品与应用、AI 与智能应用、ElevenLabs、多模态 AI |
| [阶跃星辰](https://wechat2rss.bestblogs.dev/feed/3e2714d06aa36142e8ed6b3f4e5cf9090a069dd2.xml) | 人工智能 | 文章 | 中文 | 中 | 1 / 4 / 435 | AI 与智能应用、模型发布、AI 语音、大语言模型 (LLM)、多模态 AI |
| [Cognition(@cognition_labs)](https://x.com/cognition_labs) | 人工智能 | X | 英文 | 中 | 1 / 3 / 325 | AI 与智能应用、AI Agent |
| [Fei-Fei Li(@drfeifei)](https://x.com/drfeifei) | 人工智能 | X | 英文 | 中 | 1 / 1 / 82 | AI 与智能应用、AI研究前沿、计算机视觉、李飞飞 |
| [Mistral AI(@MistralAI)](https://x.com/MistralAI) | 人工智能 | X | 英文 | 中 | 1 / 1 / 54 | AI 与智能应用、大语言模型 (LLM)、模型发布、AI 产品与应用 |
| [AWS Artificial Intelligence](https://aws.amazon.com/blogs/machine-learning/) | 人工智能 | 文章 | 英文 | 中 | 0 / 85 / 2460 | AI Agent、AI 与智能应用、AWS、大语言模型 (LLM)、MCP协议 |
| [AI前线](https://wechat2rss.bestblogs.dev/feed/25185b01482da0f485418ecb92e208b4416712fb.xml) | 人工智能 | 文章 | 中文 | 中 | 0 / 69 / 6239 | AI 与智能应用、大语言模型 (LLM)、AI Agent、AI 编程、AI 商业化 |
| [Ethan Mollick(@emollick)](https://x.com/i/user/39125788) | 人工智能 | X | 英文 | 中 | 0 / 62 / 281 | AI 与智能应用、AI 商业化、企业级 AI、AI 素养 |
| [魔搭ModelScope社区](https://wechat2rss.bestblogs.dev/feed/d993a885260f96057b9a4c96212cb2c95bb5054b.xml) | 人工智能 | 文章 | 中文 | 中 | 0 / 29 / 4866 | AI 与智能应用、开源项目、模型发布、AI研究前沿、AI Agent |
| [AINLP](https://wechat2rss.bestblogs.dev/feed/875df1d1a991bf9250ba9813e3148f58ef2240d4.xml) | 人工智能 | 文章 | 中文 | 中 | 0 / 29 / 3363 | AI 与智能应用、大语言模型 (LLM)、AI Agent、AI 编程、开源项目 |
| [花叔](https://wechat2rss.bestblogs.dev/feed/ed3e181242a4622709081439d802523ecf7b78f2.xml) | 人工智能 | 文章 | 中文 | 中 | 0 / 25 / 2480 | AI 与智能应用、AI 编程、AI 产品与应用、Vibe Coding、独立开发 |
| [赛博禅心](https://wechat2rss.bestblogs.dev/feed/752c31ca0446b837339463fc5440539e20267d2f.xml) | 人工智能 | 文章 | 中文 | 中 | 0 / 22 / 4111 | AI 与智能应用、AI Agent、AI 产品与应用、大语言模型 (LLM)、多模态 AI |
| [李继刚(@lijigang_com)](https://x.com/lijigang_com) | 人工智能 | X | 中文 | 中 | 0 / 22 / 1710 | AI 与智能应用、提示工程、AI 产品与应用、心理与思维 |
| [王俊博客](https://www.wangjun.dev) | 人工智能 | 文章 | 中文 | 中 | 0 / 20 / 405 | AI 与智能应用、AI 编程、AI Agent、大语言模型 (LLM)、上下文工程 |
| [clem 🤗(@ClementDelangue)](https://x.com/ClementDelangue) | 人工智能 | X | 英文 | 中 | 0 / 16 / 740 | AI 与智能应用、开源项目、大语言模型 (LLM)、AI 产品与应用 |
| [Marcus on AI](https://garymarcus.substack.com) | 人工智能 | 文章 | 英文 | 中 | 0 / 15 / 552 | AI 与智能应用、AI Agent、科技行业分析 |
| [Amjad Masad(@amasad)](https://x.com/amasad) | 人工智能 | X | 英文 | 中 | 0 / 13 / 604 | AI 与智能应用、AI 编程、商业与创业、创业、AI 产品与应用 |
| [Philipp Schmid(@_philschmid)](https://x.com/_philschmid) | 人工智能 | X | 英文 | 中 | 0 / 13 / 547 | AI 与智能应用、大语言模型 (LLM)、AI Agent、模型训练与推理 |
| [Jeff Dean(@JeffDean)](https://x.com/JeffDean) | 人工智能 | X | 英文 | 中 | 0 / 12 / 168 | AI 与智能应用、模型训练与推理、AI 硬件与芯片、AI研究前沿 |
| [AI炼金术](https://wechat2rss.bestblogs.dev/feed/4915f3747653bbb9c7975323c11b768d2b9cd6c9.xml) | 人工智能 | 文章 | 中文 | 中 | 0 / 10 / 880 | AI 与智能应用、AI 商业化、AI 编程、Vibe Coding、AI 产品与应用 |
| [Latent.Space(@latentspacepod)](https://x.com/latentspacepod) | 人工智能 | X | 英文 | 中 | 0 / 10 / 332 | AI 与智能应用、大语言模型 (LLM)、AI Agent、科技新闻 |
| [ChatGPT(@ChatGPTapp)](https://x.com/ChatGPTapp) | 人工智能 | X | 英文 | 中 | 0 / 10 / 93 | AI 与智能应用、AI 产品与应用、大语言模型 (LLM)、OpenAI |
| [xAI(@xai)](https://x.com/xai) | 人工智能 | X | 英文 | 中 | 0 / 9 / 257 | AI 与智能应用、科技新闻 |
| [李继刚](https://wechat2rss.bestblogs.dev/feed/9645a69180041ff935c458753174fa8bc2061295.xml) | 人工智能 | 文章 | 中文 | 中 | 0 / 7 / 513 | 生活与文化、AI 与智能应用、阅读与写作、个人效率、提示工程 |
| [Google AI Developers(@googleaidevs)](https://x.com/googleaidevs) | 人工智能 | X | 英文 | 中 | 0 / 7 / 466 | AI 与智能应用、编程语言 |
| [Aravind Srinivas(@AravSrinivas)](https://x.com/AravSrinivas) | 人工智能 | X | 英文 | 中 | 0 / 7 / 372 | AI 与智能应用、AI 产品与应用、AI Agent、Perplexity |
| [Perplexity(@perplexity_ai)](https://x.com/perplexity_ai) | 人工智能 | X | 英文 | 中 | 0 / 7 / 320 | AI 与智能应用、AI 产品与应用、大语言模型 (LLM)、AI电脑操作 |
| [Google Antigravity(@antigravity)](https://x.com/antigravity) | 人工智能 | X | 英文 | 中 | 0 / 7 / 148 | AI 与智能应用、编程与工程、AI Agent、AI 编程、开发者工具 |
| [AI Engineer(@aiDotEngineer)](https://x.com/aiDotEngineer) | 人工智能 | X | 英文 | 中 | 0 / 6 / 296 | AI 与智能应用、AI Agent |
| [LlamaIndex 🦙(@llama_index)](https://x.com/llama_index) | 人工智能 | X | 英文 | 中 | 0 / 6 / 273 | AI 与智能应用、RAG / 检索增强、LlamaIndex、文档解析 |
| [Thomas Wolf(@Thom_Wolf)](https://x.com/Thom_Wolf) | 人工智能 | X | 英文 | 中 | 0 / 6 / 198 | AI 与智能应用、大语言模型 (LLM)、模型训练与推理、开源项目 |
| [阿真Irene](https://wechat2rss.bestblogs.dev/feed/d5ead392b0cf117d0ba4070e2261111fdde49711.xml) | 人工智能 | 文章 | 中文 | 中 | 0 / 4 / 1589 | AI 与智能应用、AI 产品与应用、多模态 AI、AI 编程 |
| [Milvus(@milvusio)](https://x.com/milvusio) | 人工智能 | X | 英文 | 中 | 0 / 5 / 435 | AI 与智能应用、RAG / 检索增强、向量数据库、AI Agent、AI基础设施 |
| [AI产品黄叔](https://wechat2rss.bestblogs.dev/feed/1f1030491e15e5349aae42367513d6b3f70a8f8b.xml) | 人工智能 | 文章 | 中文 | 中 | 0 / 4 / 1067 | AI 与智能应用、AI 产品与应用、AI Agent、AI 编程 |
| [AGENT橘](https://wechat2rss.bestblogs.dev/feed/6cef434b771dd75a91864b2e699a622cb4e3eb33.xml) | 人工智能 | 文章 | 中文 | 中 | 0 / 4 / 710 | AI 与智能应用、商业与创业、AI 商业化、AI Agent、AI 产品与应用 |
| [cat(@_catwu)](https://x.com/_catwu) | 人工智能 | X | 英文 | 中 | 0 / 4 / 171 | AI 与智能应用、AI 编程 |
| [Hugging Face(@huggingface)](https://x.com/huggingface) | 人工智能 | X | 英文 | 中 | 0 / 4 / 103 | AI 与智能应用、大语言模型 (LLM)、AI Agent、开源项目、模型训练与推理 |
| [Last Week in AI](https://lastweekin.ai) | 人工智能 | 文章 | 英文 | 中 | 0 / 3 / 644 | AI Agent、AI 与智能应用、大语言模型 (LLM)、Newsletter / 科技周报、科技新闻 |
| [ElevenLabs(@elevenlabsio)](https://x.com/elevenlabsio) | 人工智能 | X | 英文 | 中 | 0 / 3 / 260 | AI 与智能应用、AI 语音、AI 产品与应用、ElevenLabs |
| [Xiaomi MiMo](https://wechat2rss.bestblogs.dev/feed/19c2af88005704d49ea397c203dcb45339532946.xml) | 人工智能 | 文章 | 中文 | 中 | 0 / 3 / 222 | AI 与智能应用、大语言模型 (LLM)、模型发布、AI Agent |
| [Weaviate AI Database(@weaviate_io)](https://x.com/weaviate_io) | 人工智能 | X | 英文 | 中 | 0 / 3 / 117 | AI 与智能应用、RAG / 检索增强、向量数据库、AI基础设施 |
| [Yann LeCun(@ylecun)](https://x.com/ylecun) | 人工智能 | X | 英文 | 中 | 0 / 3 / 72 | AI 与智能应用、大语言模型 (LLM)、世界模型、AI研究前沿 |
| [LMSYS Blog](https://www.lmsys.org/blog/) | 人工智能 | 文章 | 英文 | 中 | 0 / 3 / 9 | AI Agent、AI 与智能应用、大语言模型 (LLM)、模型训练与推理、AI基础设施 |
| [Dify(@dify_ai)](https://x.com/dify_ai) | 人工智能 | X | 英文 | 中 | 0 / 2 / 208 | AI 与智能应用、AI Agent、平台工程、AI 工作流、开发者工具 |
| [Lovable(@lovable_dev)](https://x.com/lovable_dev) | 人工智能 | X | 英文 | 中 | 0 / 2 / 138 | AI 与智能应用、AI 编程、Vibe Coding、AI 产品与应用 |
| [Manus(@ManusAI_HQ)](https://x.com/ManusAI_HQ) | 人工智能 | X | 英文 | 中 | 0 / 2 / 102 | AI 与智能应用、AI Agent |
| [Alex Albert(@alexalbert__)](https://x.com/alexalbert__) | 人工智能 | X | 英文 | 中 | 0 / 2 / 97 | AI 与智能应用、Anthropic、AI 产品与应用 |
| [DeepSeek(@deepseek_ai)](https://x.com/deepseek_ai) | 人工智能 | X | 英文 | 中 | 0 / 2 / 59 | AI 与智能应用、大语言模型 (LLM)、模型发布、DeepSeek、AI 产品与应用 |
| [向阳乔木推荐看](https://wechat2rss.bestblogs.dev/feed/3e50f11753a7c5ed689565fbf5abf96cb4541c57.xml) | 人工智能 | 文章 | 中文 | 中 | 0 / 1 / 905 | AI 与智能应用、AI Agent、AI 产品与应用、AI 编程、开源项目 |
| [Replit ⠕(@Replit)](https://x.com/Replit) | 人工智能 | X | 英文 | 中 | 0 / 1 / 501 | AI 与智能应用、编程与工程、AI 编程、AI Agent、开发者工具 |
| [Qdrant(@qdrant_engine)](https://x.com/qdrant_engine) | 人工智能 | X | 英文 | 中 | 0 / 1 / 201 | AI 与智能应用、RAG / 检索增强、开源项目、向量数据库 |
| [Kevin Weil 🇺🇸(@kevinweil)](https://x.com/kevinweil) | 人工智能 | X | 英文 | 中 | 0 / 1 / 147 | AI 与智能应用、大语言模型 (LLM)、AI 产品与应用、模型发布、OpenAI |
| [leerob](http://www.youtube.com/feeds/videos.xml?channel_id=UCZMli3czZnd1uoc1ShTouQw) | 人工智能 | 视频 | 英文 | 中 | 0 / 1 / 141 | AI 与智能应用、AI 编程、AI 产品与应用、AI Agent、MCP协议 |
| [Dario Amodei(@DarioAmodei)](https://x.com/DarioAmodei) | 人工智能 | X | 英文 | 中 | 0 / 1 / 66 | AI 与智能应用、AI安全与伦理、AI研究前沿、AI Agent |
| [Mike Krieger(@mikeyk)](https://x.com/mikeyk) | 人工智能 | X | 英文 | 中 | 0 / 1 / 35 | AI 与智能应用、AI 产品与应用、Anthropic、AI Agent |
| [Last Week in AI](https://lastweekin.ai) | 人工智能 | 文章 | 英文 | 中 | 0 / 1 / 0 | AI产品动态、AI 与智能应用、科技新闻 |
| [Dify](https://wechat2rss.bestblogs.dev/feed/e46c03a4cb65509e22ab9a8507888a2096319d65.xml) | 人工智能 | 文章 | 中文 | 中 | 0 / 0 / 681 | AI 与智能应用、AI 工作流、RAG / 检索增强、开源项目 |
| [NotebookLM(@NotebookLM)](https://x.com/NotebookLM) | 人工智能 | X | 英文 | 中 | 0 / 0 / 114 | AI 与智能应用、AI Agent |
| [bolt.new(@boltdotnew)](https://x.com/boltdotnew) | 人工智能 | X | 英文 | 中 | 0 / 0 / 82 | AI 与智能应用、AI 编程 |
| [Scott Wu(@ScottWu46)](https://x.com/ScottWu46) | 人工智能 | X | 英文 | 中 | 0 / 0 / 63 | AI 与智能应用、AI 编程、AI Agent、自主编码 |
| [Ian Goodfellow(@goodfellow_ian)](https://x.com/goodfellow_ian) | 人工智能 | X | 英文 | 中 | 0 / 0 / 19 | AI 与智能应用、AI研究前沿、多模态 AI |
| [Stanford AI Lab(@StanfordAILab)](https://x.com/StanfordAILab) | 人工智能 | X | 英文 | 中 | 0 / 0 / 16 | AI 与智能应用、AI研究前沿、强化学习 |
| [Varun Mohan(@_mohansolo)](https://x.com/_mohansolo) | 人工智能 | X | 英文 | 中 | 0 / 0 / 14 | AI 与智能应用、AI 编程、AI 产品与应用、开发者工具 |
| [Nano Banana 2(@NanoBanana)](https://x.com/NanoBanana) | 人工智能 | X | 英文 | 中 | 0 / 0 / 5 | AI 与智能应用、多模态 AI |
| [Geoffrey Hinton(@geoffreyhinton)](https://x.com/geoffreyhinton) | 人工智能 | X | 英文 | 中 | 0 / 0 / 3 | AI 与智能应用、大语言模型 (LLM)、模型训练与推理、AI 安全与对齐、AI研究前沿 |
| [Arthur Mensch(@arthurmensch)](https://x.com/arthurmensch) | 人工智能 | X | 英文 | 中 | 0 / 0 / 0 | AI 与智能应用、大语言模型 (LLM)、AI 产品与应用、Mistral AI |
| [karpathy](https://karpathy.bearblog.dev) | 人工智能 | 文章 | 英文 | 中 | 0 / 0 / 0 | AI 编程、AI研究前沿、AI 与智能应用、大语言模型 (LLM) |
| [DeeplearningAI](https://wechat2rss.bestblogs.dev/feed/9d094d066a5faacff0eb0a6b95efbba20d4f1fc9.xml) | 人工智能 | 文章 | 中文 | 中 | 0 / 0 / 0 | AI 与智能应用、AI 素养、大语言模型 (LLM)、吴恩达 |

### 跨分类 AI 相关 · 高优先级

共 **31** 个。

| 来源 | 主分类 | 类型 | 语言 | 优先级 | 近期信号 | 主要标签 |
| --- | --- | --- | --- | --- | --- | --- |
| [阿里云开发者](https://wechat2rss.bestblogs.dev/feed/39fc51b0b1316137e608c45da5dbbca4f9eb9538.xml) | 编程技术 | 文章 | 中文 | 高 | 34 / 79 / 39516 | AI 与智能应用、编程与工程、AI Agent、AI 编程、云原生 / DevOps |
| [The Cloudflare Blog](https://blog.cloudflare.com) | 编程技术 | 文章 | 英文 | 高 | 29 / 102 / 8870 | 编程与工程、AI Agent、后端开发、云原生 / DevOps、AI 与智能应用 |
| [腾讯云开发者](https://wechat2rss.bestblogs.dev/feed/6cec2c211479a5502896375860009782cf10c2ba.xml) | 编程技术 | 文章 | 中文 | 高 | 23 / 66 / 37294 | AI 与智能应用、编程与工程、AI Agent、AI 编程、云原生 / DevOps |
| [腾讯技术工程](https://wechat2rss.bestblogs.dev/feed/1e0ac39f8952b2e7f0807313cf2633d25078a171.xml) | 编程技术 | 文章 | 中文 | 高 | 17 / 48 / 21842 | AI 与智能应用、编程与工程、AI 编程、AI Agent、AI 安全与对齐 |
| [大淘宝技术](https://wechat2rss.bestblogs.dev/feed/26fef2307bebc8673703f7e726982d8f56c9a219.xml) | 编程技术 | 文章 | 中文 | 高 | 17 / 43 / 9281 | 编程与工程、AI 编程、深度长文 |
| [InfoQ](https://www.infoq.com) | 编程技术 | 文章 | 英文 | 高 | 13 / 377 / 18485 | AI Agent、后端开发、云原生 / DevOps、编程与工程、大语言模型 (LLM) |
| [腾讯科技](https://wechat2rss.bestblogs.dev/feed/a81bdfcbb9eefe870d285e81510ffa1af26e4520.xml) | 商业科技 | 文章 | 中文 | 高 | 13 / 171 / 16670 | 商业与创业、科技新闻、AI 产品与应用 |
| [Lenny's Podcast](http://www.youtube.com/feeds/videos.xml?channel_id=UC6t1O76G0jYXOAoYCm153dA) | 产品设计 | 视频 | 英文 | 高 | 14 / 19 / 5255 | 产品与设计、产品管理、增长设计、AI 产品与应用、访谈 |
| [Sequoia Capital](http://www.youtube.com/feeds/videos.xml?channel_id=UCWrF0oN6unbXrWsTN7RctTw) | 商业科技 | 视频 | 英文 | 高 | 10 / 41 / 3003 | 商业与创业、风险投资、创业、AI 商业化、科技行业分析 |
| [freeCodeCamp](https://www.freecodecamp.org/news/) | 编程技术 | 文章 | 英文 | 高 | 8 / 224 / 10226 | AI Agent、AI 编程、后端开发、编程与工程、前端与 Web |
| [a16z](http://www.youtube.com/feeds/videos.xml?channel_id=UC9cn0TuPq4dnbTY-CBsm8XA) | 商业科技 | 视频 | 英文 | 高 | 10 / 26 / 1771 | 商业与创业、风险投资、创业、AI 商业化、科技行业分析 |
| [张小珺Jùn｜商业访谈录](https://www.xiaoyuzhoufm.com/podcast/626b46ea9cbbf0451cf5a962) | 商业科技 | 播客 | 中文 | 高 | 10 / 19 / 7183 | 商业与创业、AI 与智能应用、AI研究前沿、大语言模型 (LLM)、播客 |
| [Y Combinator](http://www.youtube.com/feeds/videos.xml?channel_id=UCcefcZRL2oaA_uBNeo5UOWg) | 商业科技 | 视频 | 英文 | 高 | 9 / 37 / 2126 | 商业与创业、创业、风险投资、AI 商业化、科技行业分析 |
| [Product School](http://www.youtube.com/feeds/videos.xml?channel_id=UC6hlQ0x6kPbAGjYkoz53cvA) | 产品设计 | 视频 | 英文 | 高 | 7 / 35 / 1061 | 产品与设计、产品管理、AI 产品与应用、视频 |
| [阿里技术](https://wechat2rss.bestblogs.dev/feed/6535a444e9651fecae3383363be7589acdebe2b6.xml) | 编程技术 | 文章 | 中文 | 高 | 7 / 25 / 9500 | 编程与工程、AI 与智能应用、云原生 / DevOps、AI 编程、开源项目 |
| [Lenny Rachitsky(@lennysan)](https://x.com/lennysan) | 产品设计 | X | 英文 | 高 | 6 / 103 / 1808 | 产品与设计、产品管理、AI 产品设计、职业成长 |
| [The GitHub Blog](https://github.blog/) | 编程技术 | 文章 | 英文 | 高 | 6 / 53 / 3910 | AI Agent、AI 编程、开发者工具、编程与工程、GitHub |
| [硅谷101](https://wechat2rss.bestblogs.dev/feed/8f8fe34034f6123b168ed7847c51d50ff47cd7ee.xml) | 商业科技 | 文章 | 中文 | 高 | 6 / 22 / 2121 | AI 与智能应用、商业与创业、AI 商业化、AI研究前沿、科技评论 |
| [Martin Fowler](https://martinfowler.com) | 编程技术 | 文章 | 英文 | 高 | 5 / 38 / 4238 | AI 编程、代码质量、编程与工程、Spec Coding、系统设计 |
| [屠龙之术](https://www.xiaoyuzhoufm.com/podcast/6507bc165c88d2412626b401) | 商业科技 | 播客 | 中文 | 高 | 5 / 20 / 2724 | 商业与创业、科技行业分析、创业、AI 商业化、播客 |
| [42章经](https://www.xiaoyuzhoufm.com/podcast/648b0b641c48983391a63f98) | 商业科技 | 播客 | 中文 | 高 | 5 / 6 / 2017 | AI 与智能应用、创业、风险投资、AI 产品与应用、AI 商业化 |
| [Founder Park](https://wechat2rss.bestblogs.dev/feed/f940695505f2be1399d23cc98182297cadf6f90d.xml) | 商业科技 | 文章 | 中文 | 高 | 4 / 47 / 10638 | AI 与智能应用、商业与创业、AI 商业化、AI Agent、AI 编程 |
| [Elevate](https://addyo.substack.com) | 编程技术 | 文章 | 英文 | 高 | 4 / 6 / 2221 | AI Agent、AI 编程、编程与工程、前端与 Web、技术领导力 |
| [Sundar Pichai(@sundarpichai)](https://x.com/sundarpichai) | 商业科技 | X | 英文 | 高 | 3 / 33 / 425 | 商业与创业、AI 与智能应用、AI Agent、企业级 AI、科技行业分析 |
| [字节跳动技术团队](https://wechat2rss.bestblogs.dev/feed/d3a9e4d6f125cc98d1691dbc30cd97fec7ae2d03.xml) | 编程技术 | 文章 | 中文 | 高 | 3 / 28 / 3050 | 编程与工程、AI 与智能应用、AI Agent、AI 编程、多模态 AI |
| [Marc Andreessen 🇺🇸(@pmarca)](https://x.com/pmarca) | 商业科技 | X | 英文 | 高 | 0 / 306 / 3278 | 商业与创业、科技行业分析、创业、风险投资、趋势观察 |
| [Spring Blog](https://spring.io) | 编程技术 | 文章 | 英文 | 高 | 2 / 57 / 1247 | AI Agent、后端开发、编程与工程、MCP协议、开源项目 |
| [爱范儿](https://www.ifanr.com) | 媒体资讯 | 文章 | 中文 | 高 | 1 / 135 / 20749 | AI产品动态、资讯与媒体、模型发布、科技新闻、科技评论 |
| [Satya Nadella(@satyanadella)](https://x.com/satyanadella) | 商业科技 | X | 英文 | 高 | 1 / 39 / 338 | 商业与创业、AI 与智能应用、企业级 AI、AI 商业化、AI 产品与应用 |
| [语言即世界language is world](https://wechat2rss.bestblogs.dev/feed/e1ed0d3edd93f90aef602105eb7ca51b35b7060a.xml) | 商业科技 | 文章 | 中文 | 高 | 1 / 2 / 1423 | AI 与智能应用、AI研究前沿、具身智能、深度访谈 |
| [GitHub(@github)](https://x.com/github) | 编程技术 | X | 英文 | 高 | 0 / 49 / 624 | 编程与工程、AI 编程、开发者工具、开源项目 |

### 跨分类 AI 相关 · 中优先级

共 **45** 个。

| 来源 | 主分类 | 类型 | 语言 | 优先级 | 近期信号 | 主要标签 |
| --- | --- | --- | --- | --- | --- | --- |
| [InfoQ 中文](https://wechat2rss.bestblogs.dev/feed/13da94d7eb314b49fa251cb7e8399cae29d772db.xml) | 编程技术 | 文章 | 中文 | 中 | 8 / 200 / 19564 | AI 与智能应用、编程与工程、AI Agent、AI 编程、Vibe Coding |
| [ByteByteGo Newsletter](https://blog.bytebytego.com) | 编程技术 | 文章 | 英文 | 中 | 6 / 48 / 3952 | AI Agent、后端开发、编程与工程、大语言模型 (LLM)、Newsletter / 科技周报 |
| [腾讯研究院](https://wechat2rss.bestblogs.dev/feed/6152301e0978bffb0a8284cab339262b9764dcfb.xml) | 商业科技 | 文章 | 中文 | 中 | 5 / 46 / 6696 | AI 与智能应用、AI 商业化、趋势观察、AI Agent、深度长文 |
| [Web3天空之城](https://wechat2rss.bestblogs.dev/feed/6aac3cc6d4c6df6fb3f77dea4ea4ba4a2053d6e7.xml) | 商业科技 | 文章 | 中文 | 中 | 2 / 43 / 3258 | AI 与智能应用、商业与创业、AI 商业化、科技行业分析、大语言模型 (LLM) |
| [前端早读课](https://wechat2rss.bestblogs.dev/feed/ce2456e157156d42259c1198f05a33e27b1ed959.xml) | 编程技术 | 文章 | 中文 | 中 | 2 / 38 / 5129 | 编程与工程、前端与 Web、AI 编程、开发者体验 |
| [快手技术](https://wechat2rss.bestblogs.dev/feed/c4cc10d2e32a5fa12927581ae581a336f399fe75.xml) | 编程技术 | 文章 | 中文 | 中 | 2 / 13 / 3800 | 编程与工程、AI 与智能应用、后端开发、AI 编程、系统设计 |
| [美团技术团队](https://tech.meituan.com/feed/) | 编程技术 | 文章 | 中文 | 中 | 2 / 8 / 897 | 后端开发、编程与工程、美团、模型训练与推理、多模态 AI |
| [掘金本周最热](https://juejin.im/recommended?sort=weekly_hottest) | 编程技术 | 文章 | 中文 | 中 | 1 / 42 / 6797 | AI 编程、后端开发、编程与工程、前端与 Web、移动开发 |
| [Vercel News](https://vercel.com/blog) | 编程技术 | 文章 | 英文 | 中 | 1 / 26 / 1821 | AI Agent、AI 编程、云原生 / DevOps、编程与工程、Vercel |
| [晚点LatePost](https://wechat2rss.bestblogs.dev/feed/c442206ec9957f3c52f2f40300ca532079538b31.xml) | 商业科技 | 文章 | 中文 | 中 | 1 / 23 / 1871 | AI 与智能应用、商业与创业、AI 商业化、科技行业分析、趋势观察 |
| [得物技术](https://wechat2rss.bestblogs.dev/feed/1cde72c9129b1f79cbb150166e7fed9a7568ee10.xml) | 编程技术 | 文章 | 中文 | 中 | 1 / 13 / 2458 | AI 与智能应用、编程与工程、AI Agent、AI 编程、后端开发 |
| [卫诗婕｜漫谈Light the Star](https://www.xiaoyuzhoufm.com/podcast/6627fda4b56459544087d86a) | 商业科技 | 播客 | 中文 | 中 | 1 / 12 / 899 | AI 与智能应用、AI 产品与应用、AI 商业化、具身智能、播客 |
| [Naval](http://www.youtube.com/feeds/videos.xml?channel_id=UCh_dVD10YuSghle8g6yjePg) | 商业科技 | 视频 | 英文 | 中 | 1 / 12 / 147 | AI 与智能应用、AI 商业化、AI研究前沿、商业模式与战略、科技行业分析 |
| [硅谷101](https://www.xiaoyuzhoufm.com/podcast/5e5c52c9418a84a04625e6cc) | 商业科技 | 播客 | 中文 | 中 | 1 / 9 / 1468 | AI 与智能应用、科技行业分析、趋势观察、AI 商业化、播客 |
| [小红书技术REDtech](https://wechat2rss.bestblogs.dev/feed/0f8c47df6fd304112518544776e0bbf1d98ba0b9.xml) | 编程技术 | 文章 | 中文 | 中 | 1 / 6 / 1492 | AI 与智能应用、开源项目、多模态 AI、模型训练与推理 |
| [42章经](https://wechat2rss.bestblogs.dev/feed/f6694726ced4ba3d7c7cd65c6edf2160c5978387.xml) | 商业科技 | 文章 | 中文 | 中 | 1 / 5 / 1366 | 商业与创业、商业模式与战略、创业、AI 产品与应用、创始人故事 |
| [Addy Osmani(@addyosmani)](https://x.com/addyosmani) | 编程技术 | X | 英文 | 中 | 1 / 2 / 251 | AI 与智能应用、AI 编程、开发者工具 |
| [Lex Fridman](http://www.youtube.com/feeds/videos.xml?channel_id=UCSHZKyawb77ixDdsGog4iWA) | 商业科技 | 视频 | 英文 | 中 | 1 / 0 / 572 | AI 与智能应用、AI研究前沿、访谈 |
| [ginobefun(@hongming731)](https://x.com/hongming731) | 编程技术 | X | 中文 | 中 | 0 / 75 / 4794 | AI 与智能应用、AI Agent、AI 编程 |
| [人人都是产品经理](https://wechat2rss.bestblogs.dev/feed/2d790e38f8af54c5af77fa5fed687a7c66d34c22.xml) | 产品设计 | 文章 | 中文 | 中 | 0 / 68 / 8953 | AI 与智能应用、产品与设计、AI 产品与应用、AI 商业化、产品管理 |
| [Google(@Google)](https://x.com/i/user/20536157) | 商业科技 | X | 英文 | 中 | 0 / 56 / 126 | AI 与智能应用、AI 产品与应用、Google、科技新闻 |
| [CSDN](https://wechat2rss.bestblogs.dev/feed/b0b7f2852aecdcc5a0eb08d33afc1c08b855d98b.xml) | 编程技术 | 文章 | 中文 | 中 | 0 / 46 / 3986 | 编程与工程、科技新闻、AI 编程、Vibe Coding |
| [笔记侠](https://wechat2rss.bestblogs.dev/feed/4c5d9bcc2fbfcd1dc81fb67559653f8957ef4760.xml) | 效率成长 | 文章 | 中文 | 中 | 0 / 41 / 4417 | 商业与创业、AI 与智能应用、商业模式与战略、AI 商业化、创业 |
| [刘润](https://wechat2rss.bestblogs.dev/feed/c1354f67c314d25d6e236a58724043bdc46d6079.xml) | 投资财经 | 文章 | 中文 | 中 | 0 / 34 / 2521 | 商业与创业、效率与成长、AI 商业化、商业模式与战略、职业成长 |
| [a16z(@a16z)](https://x.com/a16z) | 商业科技 | X | 英文 | 中 | 0 / 32 / 1317 | AI 与智能应用、创业 |
| [51CTO技术栈](https://wechat2rss.bestblogs.dev/feed/d1fabe6c569ffc44979075dde2f57c65e07c3045.xml) | 编程技术 | 文章 | 中文 | 中 | 0 / 28 / 3301 | 编程与工程、AI 与智能应用、AI Agent、AI 编程、AI 商业化 |
| [百度Geek说](https://wechat2rss.bestblogs.dev/feed/6cc437d76f9dc4f7c35011c72e471e33e7bdd384.xml) | 编程技术 | 文章 | 中文 | 中 | 0 / 29 / 2078 | AI 与智能应用、编程与工程、AI Agent、AI 编程、后端开发 |
| [Tw93(@HiTw93)](https://x.com/HiTw93) | 编程技术 | X | 中文 | 中 | 0 / 26 / 1027 | AI 与智能应用、AI Agent、AI 编程 |
| [swyx(@swyx)](https://x.com/swyx) | 编程技术 | X | 英文 | 中 | 0 / 23 / 760 | AI 与智能应用、AI 编程、开源项目 |
| [@levelsio(@levelsio)](https://x.com/levelsio) | 商业科技 | X | 英文 | 中 | 0 / 22 / 1268 | 商业与创业、独立开发、Vibe Coding、AI 编程 |
| [Google](http://www.youtube.com/feeds/videos.xml?channel_id=UCK8sQmJBp8GCxrOtXWBpyEA) | 商业科技 | 视频 | 英文 | 中 | 0 / 22 / 253 | AI 与智能应用、AI Agent、AI 产品与应用 |
| [Guillermo Rauch(@rauchg)](https://x.com/rauchg) | 编程技术 | X | 英文 | 中 | 0 / 21 / 668 | AI 与智能应用、AI 编程 |
| [逛逛GitHub](https://wechat2rss.bestblogs.dev/feed/38be32e5376d852c13d3383e4d7a757fd9a55ff6.xml) | 编程技术 | 文章 | 中文 | 中 | 0 / 18 / 2336 | AI 与智能应用、编程与工程、开源项目、AI Agent、AI 编程 |
| [GitHub](http://www.youtube.com/feeds/videos.xml?channel_id=UC7c3Kb6jYCRj4JOHHZTxKsQ) | 编程技术 | 视频 | 英文 | 中 | 0 / 15 / 359 | AI 与智能应用、AI Agent、科技行业分析 |
| [APPSO](https://wechat2rss.bestblogs.dev/feed/4ae111e5b509609a5ee96c9894f1868fbafd793e.xml) | 商业科技 | 文章 | 中文 | 中 | 0 / 15 / 189 | AI 与智能应用、大语言模型 (LLM)、AI 产品与应用、AI产品动态 |
| [京东技术](https://wechat2rss.bestblogs.dev/feed/fa0be550682410cc187c0d1eab1a0fc4e073b949.xml) | 编程技术 | 文章 | 中文 | 中 | 0 / 12 / 1097 | 编程与工程、后端开发、系统设计、AI Agent、数据库 |
| [vivo互联网技术](https://wechat2rss.bestblogs.dev/feed/b3ceb5cb1e4602ca55704650a157ec9c5b2f0d31.xml) | 编程技术 | 文章 | 中文 | 中 | 0 / 12 / 807 | 编程与工程、开源项目、AI Agent、系统设计、移动开发 |
| [谷歌开发者](https://wechat2rss.bestblogs.dev/feed/9c65b8470acb8a5400199616536995d5ba90f52e.xml) | 编程技术 | 文章 | 中文 | 中 | 0 / 6 / 326 | 编程与工程、前端与 Web、移动开发、开发者工具、Google |
| [David Heinemeier Hansson](https://world.hey.com/dhh) | 编程技术 | 文章 | 英文 | 中 | 0 / 4 / 154 | AI Agent、后端开发、编程与工程、DHH、开源项目 |
| [ruanyf(@ruanyf)](https://x.com/i/user/1580781) | 商业科技 | X | 中文 | 中 | 0 / 3 / 150 | AI 与智能应用、科技新闻、AI 素养、开源项目 |
| [Dear Architects](https://www.deararchitects.xyz/archive) | 编程技术 | 文章 | 英文 | 中 | 0 / 0 / 193 | AI Agent、AI 编程、API设计、领域驱动设计、编程与工程 |
| [GitHubDaily](https://wechat2rss.bestblogs.dev/feed/5b195b2d021f8151ac4f81ceae54cd48f08b0632.xml) | 编程技术 | 文章 | 中文 | 中 | 0 / 0 / 49 | AI 与智能应用、开源项目、AI 产品与应用、AI Agent |
| [Tim Cook(@tim_cook)](https://x.com/i/user/1636590253) | 商业科技 | X | 英文 | 中 | 0 / 0 / 4 | AI 与智能应用、科技新闻、Apple |
| [The GitHub Blog](https://github.blog/engineering/) | 编程技术 | 文章 | 英文 | 中 | 0 / 0 / 0 | AI 编程、云原生 / DevOps、开发者工具、编程与工程、GitHub |
| [淘宝设计](https://wechat2rss.bestblogs.dev/feed/6d515611c75b76de8e766e08f0beca8c491a8e82.xml) | 产品设计 | 文章 | 中文 | 中 | 0 / 0 / 0 | 产品与设计、用户体验设计、设计系统、创造力、AI 产品与应用 |

### 普通优先级补充

普通优先级来源数量很大，本期只补充近期 Brief、阅读或主题代表性较强的一批，适合作为专题研究或工具观察来源。

| 来源 | 主分类 | 类型 | 语言 | 优先级 | 近期信号 | 主要标签 |
| --- | --- | --- | --- | --- | --- | --- |
| [Tw93 Blog](https://tw93.fun) | 编程技术 | 文章 | 中文 | 普通 | 5 / 4 / 7839 | AI Agent、AI 编程、AI 与智能应用、前端与 Web、大语言模型 (LLM) |
| [LessWrong](https://www.lesswrong.com) | 人工智能 | 文章 | 英文 | 普通 | 2 / 278 / 13219 | 模型评测与基准、AI安全与伦理、决策思维、AI 与智能应用 |
| [HackerNoon](https://hackernoon.com) | 编程技术 | 文章 | 英文 | 普通 | 3 / 133 / 6366 | AI 编程、编程与工程、大语言模型 (LLM)、RAG / 检索增强、创业 |
| [Microsoft Research Blog](https://www.microsoft.com/en-us/research/blog/) | 人工智能 | 文章 | 英文 | 普通 | 4 / 12 / 1058 | AI Agent、AI研究前沿、AI 与智能应用、Microsoft |
| [Engineering at Meta](https://engineering.fb.com/) | 编程技术 | 文章 | 英文 | 普通 | 4 / 4 / 851 | 编程与工程、系统设计、AI Agent、安全、Meta |
| [青稞AI](https://wechat2rss.bestblogs.dev/feed/b22be100fcd702f02cd6574b5aecb8a08d48438f.xml) | 人工智能 | 文章 | 中文 | 普通 | 3 / 13 / 2623 | AI 与智能应用、科技新闻 |
| [开始连接 LinkStart](https://www.xiaoyuzhoufm.com/podcast/63ff0da51b1faf8a0b70b337) | 商业科技 | 播客 | 中文 | 普通 | 2 / 17 / 1558 | AI 与智能应用、科技行业分析、创业、AI 商业化、播客 |
| [晚点聊 LateTalk](https://www.xiaoyuzhoufm.com/podcast/61933ace1b4320461e91fd55) | 商业科技 | 播客 | 中文 | 普通 | 2 / 15 / 1206 | AI 与智能应用、科技行业分析、AI 商业化、深度访谈、播客 |
| [Every](https://every.to/newsletter) | 人工智能 | 文章 | 英文 | 普通 | 2 / 14 / 1756 | AI Agent、AI 编程、AI 产品与应用、AI 工作流、AI 与智能应用 |
| [MiniMax (official)(@MiniMax__AI)](https://x.com/MiniMax__AI) | 人工智能 | X | 英文 | 普通 | 2 / 10 / 437 | AI 与智能应用、模型发布、AI Agent、多模态 AI |
| [TIANYU2FM — 对谈未知领域](https://www.xiaoyuzhoufm.com/podcast/5f22729f9504bbdb77253e46) | 商业科技 | 播客 | 中文 | 普通 | 2 / 6 / 464 | AI 与智能应用、科技行业分析、深度访谈、播客 |
| [VentureBeat](https://venturebeat.com/feed/) | 商业科技 | 文章 | 英文 | 普通 | 1 / 50 / 2309 | AI Agent、AI安全事件、AI 与智能应用、资讯与媒体、大语言模型 (LLM) |
| [硅星人Pro](https://wechat2rss.bestblogs.dev/feed/c62ceda9eed269d851802bdbc5f33c4fabbf7462.xml) | 商业科技 | 文章 | 中文 | 普通 | 1 / 39 / 6225 | AI 与智能应用、AI 产品与应用、科技新闻、趋势观察、AI 商业化 |
| [MarkTechPost](https://www.marktechpost.com/) | 人工智能 | 文章 | 英文 | 普通 | 1 / 34 / 2096 | AI Agent、AI研究前沿、AI 与智能应用、大语言模型 (LLM)、模型发布 |
| [The Keyword (blog.google)](https://blog.google/) | 人工智能 | 文章 | 英文 | 普通 | 1 / 16 / 1861 | AI Agent、AI 与智能应用、Google、大语言模型 (LLM)、模型发布 |
| [AICodeKing](http://www.youtube.com/feeds/videos.xml?channel_id=UC0m81bQuthaQZmFbXEY9QSw) | 人工智能 | 视频 | 英文 | 普通 | 1 / 12 / 1760 | AI 与智能应用、AI 编程、Vibe Coding、MCP协议、开源项目 |
| [Microsoft for Developers](https://devblogs.microsoft.com/) | 编程技术 | 文章 | 英文 | 普通 | 1 / 13 / 543 | 编程与工程、云原生 / DevOps、AI Agent、AI 编程、Microsoft |
| [Stack Overflow Blog](https://stackoverflow.blog/) | 编程技术 | 文章 | 英文 | 普通 | 1 / 12 / 1291 | 编程与工程、AI 编程、开源项目、开发者体验、科技评论 |
| [Databricks](https://www.databricks.com) | 编程技术 | 文章 | 英文 | 普通 | 1 / 11 / 1657 | AI 与智能应用、数据工程、大语言模型 (LLM)、企业级 AI |
| [Stratechery by Ben Thompson](https://stratechery.com) | 媒体资讯 | 文章 | 英文 | 普通 | 1 / 11 / 359 | AI 商业化、商业模式与战略、商业与创业、科技行业分析、趋势观察 |
| [第一财经](https://www.xiaoyuzhoufm.com/podcast/64c75555e8176c3ff81de98c) | 投资财经 | 播客 | 中文 | 普通 | 1 / 11 / 278 | 财经与经济、科技行业分析、AI 商业化、投资与市场、趋势观察 |
| [Greg Isenberg](http://www.youtube.com/feeds/videos.xml?channel_id=UCPjNBjflYl0-HQtUvOx0Ibw) | 商业科技 | 视频 | 英文 | 普通 | 1 / 9 / 1273 | 商业与创业、创业、独立开发、商业模式、视频 |
| [小米技术](https://wechat2rss.bestblogs.dev/feed/8bbc1ba1d363e70cd42d1ce89fb9070cb075c3b3.xml) | 编程技术 | 文章 | 中文 | 普通 | 1 / 8 / 979 | AI 与智能应用、编程与工程、AI研究前沿、多模态 AI、AI 编程 |
| [Gino Notes](https://ginonotes.com) | 编程技术 | 文章 | 中文 | 普通 | 1 / 7 / 1884 | AI Agent、AI 编程、AI 与智能应用、产品管理、提示工程 |
| [海外独角兽](https://wechat2rss.bestblogs.dev/feed/7200d3a5e976d231deb1e40ad33745c0e649b029.xml) | 商业科技 | 文章 | 中文 | 普通 | 1 / 6 / 2752 | 商业与创业、创业、AI Agent、AI 商业化、Harness工程 |
| [AI寒武纪](https://wechat2rss.bestblogs.dev/feed/5903009f48a5e4aa44d8ac941a54fe3aafc3e03c.xml) | 人工智能 | 文章 | 中文 | 普通 | 1 / 6 / 1833 | AI 与智能应用、AI 产品与应用、模型发布、AI 编程、开源项目 |
| [跨国串门儿计划](https://www.xiaoyuzhoufm.com/podcast/670f3da40d2f24f28978736f) | 商业科技 | 播客 | 中文 | 普通 | 0 / 99 / 7943 | AI 与智能应用、大语言模型 (LLM)、AI 产品与应用、AI 商业化、播客 |
| [Alex Kantrowitz](http://www.youtube.com/feeds/videos.xml?channel_id=UCye1YedIypHffYb8k6Gp9wg) | 商业科技 | 视频 | 英文 | 普通 | 1 / 6 / 117 | 资讯与媒体、科技新闻、AI 商业化、趋势观察、视频 |
| [Matthew Berman](http://www.youtube.com/feeds/videos.xml?channel_id=UCawZsQWqfGSbCI5yjkdVkTA) | 人工智能 | 视频 | 英文 | 普通 | 1 / 5 / 563 | AI 与智能应用、模型发布、AI 产品与应用、模型评测与基准、视频 |
| [Core Memory Podcast](http://www.youtube.com/feeds/videos.xml?channel_id=UC2ohDbbkpfngjaeV7TBHRcg) | 商业科技 | 视频 | 英文 | 普通 | 1 / 5 / 221 | 资讯与媒体、科技新闻、趋势观察、AI 商业化、播客 |
| [Slack Engineering](https://slack.engineering) | 编程技术 | 文章 | 英文 | 普通 | 1 / 5 / 135 | AI Agent、编程与工程、系统设计 |
| [智能涌现](https://wechat2rss.bestblogs.dev/feed/049f4d78f94b31ab6afda95b1a65f0e562c8d5c2.xml) | 人工智能 | 文章 | 中文 | 普通 | 1 / 4 / 282 | AI 与智能应用、AI 商业化、产业动态、趋势观察、企业级 AI |
| [Stripe Blog](https://stripe.com/blog) | 商业科技 | 文章 | 英文 | 普通 | 1 / 4 / 90 | AI 产品与应用、商业与创业、财经与经济、金融科技、SaaS |
| [yan5xu(@yan5xu)](https://x.com/yan5xu) | 人工智能 | X | 中文 | 普通 | 1 / 3 / 623 | AI 与智能应用、AI Agent、AI 编程、AI 产品与应用 |
| [Product Talk](https://www.producttalk.org/) | 产品设计 | 文章 | 英文 | 普通 | 1 / 3 / 513 | AI 产品与应用、产品与设计、产品管理 |
| [Kimi.ai(@Kimi_Moonshot)](https://x.com/Kimi_Moonshot) | 人工智能 | X | 英文 | 普通 | 1 / 2 / 743 | AI 与智能应用、模型发布、AI Agent、大语言模型 (LLM)、月之暗面 |

## 按用户目标选择

如果你不想逐个挑，可以直接按目标选择：

| 目标 | 建议优先订阅 |
| --- | --- |
| 第一时间知道模型和产品发布 | OpenAI News、Claude Blog、Anthropic News、Google DeepMind News、DeepSeek、通义实验室、MiniMax、智谱 |
| 做 AI 应用和 Agent 工程 | AI Engineer、Latent.Space、LangChain Blog、Cursor Blog、Simon Willison、宝玉的分享、The Cloudflare Blog、The GitHub Blog |
| 补 AI 基础和研究视野 | Hung-yi Lee、Andrej Karpathy、The Batch、Google DeepMind News、Andrew Ng、AI at Meta Blog |
| 看 AI 产品和商业化 | 十字路口 Crossing、张小珺Jùn｜商业访谈录、AI 炼金术、量子位、机器之心、新智元、Founder Park |
| 用 X 做实时观察 | OpenAI、OpenAI Developers、Anthropic、Claude、LangChain、Cursor、宝玉、meng shao、Harrison Chase |

## 后续维护建议

AI 来源池后续可以继续拆成几个可选择的订阅包：

| 来源包 | 适合用户 | 代表标签 |
| --- | --- | --- |
| AI 官方与模型发布 | 想第一时间知道模型和产品更新的人 | `llm`、`model-releases`、`entity-openai`、`entity-anthropic`、`entity-google` |
| AI 工程与 Agent 实践 | 开发者、架构师、AI 工程师 | `ai-agent`、`ai-coding`、`context-engineering`、`mcp-protocol`、`rag` |
| AI 研究与课程 | 学习者、研究者、技术负责人 | `ai-research-frontier`、`model-training`、`multimodal-ai`、`ai-safety` |
| AI 产品与商业化 | 产品经理、创业者、投资人 | `ai-product`、`ai-business`、`startups`、`enterprise-ai` |
| AI 中文动态雷达 | 中文读者、日常跟进热点的人 | `tech-news`、`model-releases`、`ai-product-updates` |

这期先把 AI 领域的可选来源整理出来。下一步更适合单独处理「编程技术」「商业科技」「投资财经」三个领域：先 review 分组和候选源，再分别发布，避免一篇文章承载太多主题。
