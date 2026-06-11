# CURRENT_STATE.md — 当前状态与路线图

更新时间：2026-06-11（v2.5.0 release · 世界杯特刊 · Pro 我的早报偏好补充说明）

> 产品蓝图见 `2-PRODUCT.md`，架构细节见 `4-ARCHITECTURE.md`。

## v2.4.0 关键交付（2026-05-20）

> 完整 changelog 见 `bestblogs-app/content/changelog/v2.4.0.md`，全维度评审报告见 `.claude/plans/v2.4.0-release-deepreview.md`。

| 能力 | 入口 / Job / ConfigKey | 状态 |
|---|---|---|
| 北极星指标变更：Pro 早报日开数 | Dashboard 2.0 + 决策看板 v3 | ✅ 上线（M11）|
| Pro 即时早报 ≤ 15 min SLA | ProBriefBootstrapJob + `PRO_BRIEF_BOOTSTRAP_ENABLED` | ✅ 上线（M4 增强）|
| UserBriefJob 千人级分布式执行 | AbstractDistributedJob + `USER_BRIEF_DISTRIBUTED_ENABLED` | ✅ 上线（M4 增强）|
| W1 多渠道发布基础设施 + Top10 HITL | PublishTaskService + ApprovalTicket + TypefullyPublisher | ✅ 上线（M8）|
| URL 一键发现订阅源 | SourceDiscoveryRegistry + YouTube / 小宇宙 / 公众号 / HTML 兜底 | ✅ 上线（M5）|
| Pro 公众号自助订阅 wechat2rss | WechatSubscribeController + `WECHAT_PRO_SUBSCRIBE_ENABLED` | ✅ 上线（M5）|
| 精选周刊 v2 重设计 | `/library/newsletter` 视觉与 i18n 重写 | ✅ 上线（M7）|
| 我的空间 4 页合并 | `/library/reading` + 三列工作台 `/library/follow` | ✅ 上线（M6）|
| Onboarding v2 三步引导 | OnboardingWizardV2 + 兴趣标签简化到 Domain 层 | ✅ 上线（M3）|
| 内容广场 B1 Lean 重设计 | `/explore` 精简筛选 + 视角即视图 | ✅ 上线（M7）|
| 多管理员 SUPER_ADMIN / ADMIN | `@RequireRole` + `@AdminOperation` + `bb_admin_op_log` | ✅ 上线（M10）|
| 邮件投递统一日志 | MessageDeliveryLogService + `bb_message_delivery_log` | ✅ 上线（M11）|
| 高分英文文章预翻译队列 | PreTranslateQueue + `PRE_TRANSLATE_ENABLED` | ✅ 上线（M9）|
| prepub 预发环境 | `docker-compose.prepub.yml` + `ENV_TYPE` 驱动隔离 | ✅ 上线（M11）|
| Playwright E2E 主链路 | `uitest/e2e/tests/*.spec.ts` | ✅ 上线（M11）|
| 世界杯特刊一期 | `/worldcup` + `worldcup` 域 + `FEATURE_WORLDCUP_SPECIAL_ENABLED` | ✅ v2.5.0 发布准备完成 |

## 临时特刊状态（2026-06-11）

世界杯特刊一期是独立活动域，不改变 BestBlogs 主产品路线。当前实现以 Web 为主，包含公开特刊首页、单场详情、Timeline、竞猜、金球币、榜单、普神公开单、管理端参数配置和后台聚合 Job。Issue #1147 / #1150 增量：3 个一次性任务、每日隐藏彩蛋轮换（11 任务池确定性抽 K，分配持久化 `bb_worldcup_daily_task_assign`，前端不下发清单）、寻宝随机掉落（真实内容/早报/周刊/主题资源上服务端摇号，金额分档 100-500，`bb_worldcup_treasure_roll` 幂等）、未参与用户静默未中，新增 `WORLDCUP_DAILY_TASK_ENABLED` / `WORLDCUP_TREASURE_ENABLED` 等 5 个 ConfigKey（默认全关）。

上线默认 fail-closed：`FEATURE_WORLDCUP_SPECIAL_ENABLED`、`WORLDCUP_COMPLIANCE_APPROVED`、`WORLDCUP_PUBLIC_PAGE_ENABLED`、`WORLDCUP_BETTING_ENABLED`、`WORLDCUP_COIN_TASK_ENABLED`、`WORLDCUP_LEADERBOARD_ENABLED`、`WORLDCUP_DAILY_TASK_ENABLED`、`WORLDCUP_TREASURE_ENABLED` 等开关默认关闭。正式放量前需要完成真实 Mongo/Redis 环境集成测试、真实赛程与内容数据导入、运营结算演练，并由产品/法务确认后显式打开 `WORLDCUP_COMPLIANCE_APPROVED`。

## Phase A 运营增强（早鸟期 5/1 → 6/30，2026-05-09 启动）

> 完整方案见 `bestblogs-docs/specs/operations-phase-a.md`，UTM 规范见 `bestblogs-docs/specs/utm-conventions.md`。
> Parent Issue [#555](https://github.com/ginobefun/bestblogs-monorepo/issues/555) + 8 个子 Issue（#556-#563）。

| 任务 | Issue | 状态 |
|---|---|---|
| Operations Phase A spec + UTM conventions | #556 | ✅ 文档已落地（spec 605 行 + UTM 240 行）|
| `bestblogs-brief-syndicate` skill (T1 Routine 每日 09:00) | #557 | ✅ 实现完成（5 平台分发草稿，端到端 stub 测试通过）|
| `TelegramBroadcastJob` backend job (W3) | #558 | ✅ 实现完成（21 unit test 全过；`@HoldJobLock` + `JobHealthCheckJob.JOB_OVERRIDES` 已登记 1500min）|
| Apple/Spotify Podcast RSS feed endpoint (W3) | #559 | ✅ 实现完成（iTunes namespace + `PodcastBriefItem` VO 防 Entity 穿透）|
| `bestblogs-weekly-newsletter` skill (W5) | #560 | ✅ 实现完成（4 平台周刊草稿）|
| `bestblogs-weekly-pipeline` skill (T3 按需) | #618 | ✅ 合并 weekly-curator / create-podcast / create-blogger 三 skill 到 ops-skills 仓；4 stage 端到端（选题→双语推荐语→Admin 导入→播客→公众号文章）；统一 X-API-KEY |
| `bestblogs-founder-recap` skill (W6) | #561 | ✅ 实现完成（含 PII 扫描 + Founder 号红线检查）|
| `bestblogs-topic-distribute` skill (W7) | #562 | ✅ 实现完成（按主题类型自动选 4-6 平台）|
| `bestblogs-content-analytics` skill (T4 W8) | #563 | ✅ 实现完成（Telegram P0 实现 / 其他 P1-P3 stub）|
| `bestblogs-process-videos` ops-skills 迁移（ops W2）| #619 | ✅ 实现完成（从 gino-skills 迁入 + 自包含化 + X-API-KEY + Agent 工具子智能体并行编排；保留 Chrome+Gem 成本可控；waiting on：Mac mini staging 真实视频端到端跑通 + 4 条写路径回归）|
| 邀请功能重启 + 老用户激活活动 + 站内通知 | #574 | ✅ 实现完成（按人头封顶模型 + INVITE_VISIBILITY 灰度 + ReactivationPromo + bb_site_announcement 双语 admin CRUD + 13 后端单测；waiting on：admin 创建第一条 banner 公告 + 灰度切换观察）|
| Pro 时长双轨模型（cancel/refund 截断修复 + Admin 自然月赠送）| #582 | ✅ 实现完成（v2.3.0：proPaidEndTime + bonusDaysBalance 双轨字段 + ProSubscriptionDomainService 5 入口 + ProMaintenanceController backfill 端点 + 22 单测 + 双 webhook 集成回归；waiting on：上线前部署顺序 SOP（webhook 暂停 → 部署 → 索引 → backfill dryRun → 实跑 → 恢复 webhook）+ ~15 个 Creem 用户人工核对）|
| /pro 三分流 + Creem portal hasCreemPortal 修复 + IAP 字面量对齐 | 分支 `claude/allow-early-subscription-upgrade-zkLUI` | ✅ 实现完成（赠送型 Pro 用户提前订阅入口 + ProSubscriptionSourceEnum.isCreemBilled helper 兼容 WEB_CREEM/历史 CREEM + 前端 IAP 比对字面量从 APPLE_IAP/GOOGLE_IAP 纠正为 MOBILE_IOS/MOBILE_ANDROID + subscription-detail 接口失败 fail-closed fallback + scrollToCheckout 经父级 onScrollToCheckout 同步触发 highlight ring + bg-amber-700 硬编码改 variant="amber" + 文档同步）|
| 邮件营销广播 + Magic Link Pro 领取 | #640 | ✅ 实现完成（v2.3.0：MailChannel.MARKETING + 5 ConfigKey + PromoClaimTokenService HMAC + MarketingBroadcastDomainService AND-合并 3 SegmentationRule + admin /marketing-broadcast/new 圈选页 + MarketingTemplateBlockEditor 5-block 自研 + app /promo/claim 5 态领取页 + 4 个测试类 18 单测；waiting on：5/15 老用户激活活动实测 + Gmail/Outlook/iOS Mail 三处邮件渲染抽样 + Bark 告警演练 + 灰度切换 FEATURE_MARKETING_BROADCAST_ENABLED 上线观察）|
| `bestblogs-feed-quality-review` + `bestblogs-feed-quality-apply` skill（T1 Routine 每周一 03:00 + T5 本地按需）| #707 | ✅ 实现完成（只读规则引擎 9 条建议码：DISABLE_DEAD / DORMANT / FETCH_HEALTH_BAD / DOWNGRADE_PRIORITY / UPGRADE_PRIORITY / TAG_GAP / CATEGORY_DRIFT / CURATE_AS_SYSTEM / UNCURATE_FROM_SYSTEM + 配套交互式写回 skill：默认 dry-run、staleness 守门、NEVER_WRITE 三规则脚本级硬拒、`--api-base` 域名白名单防 SSRF、apply-log 带时间戳防覆盖、新源 30 天 grace 豁免；纯 Admin API；waiting on：Routine 首次触发 + 阈值收敛 2 周）|

**6/30 中期评审目标**（详见 `operations-phase-a.md §7.1`）：
- unknown/direct 注册占比从 70% 🔴 → < 40%
- WAU-R 从 1500-2500 → ≥ 3500
- Free → Pro 7d 转化率从 1.07% → ≥ 3%
- Substack EN 订阅 ≥ 100 / HN 主帖至少 1 次 ≥ 50 votes
- Apple Podcast 订阅 ≥ 50

## 当前阶段：Phase 1（个性化阅读工作流）

**阶段目标：**

- 稳定 Daily Brief（图文/邮件）全链路可用性
- 优化 Pro 升级路径与订阅留存
- 完成 Landing 2.0 改版，强化价值传达路径
- Pro 付费验证三阶段：
  - **邀请内测**（→ 2026-05-01）：定向邀请，修复与完善核心功能
  - **早鸟开放**（2026-05-01 → 2026-09-01）：开放注册，早鸟价 $4.9/月
  - **正式定价**（2026-09-01 起）：恢复原价 $9.9/月，首次开通 Pro 享 8 折优惠（$7.92/月）

**关注指标：** 每天打开「我的早报」的 Pro 用户数（北极星，2026-05-18 PRODUCT v2 切换）、Pro D7/D30 留存、Pro 拉新与续费率、二线副指标（X 绑定 / RSS / 伴读 / 翻译 / 回顾使用）（详见 `2-PRODUCT.md §7` 与 `specs/north-star-metric.md`）。

> **指标切换说明（2026-05-18）**：旧版 WQRL / WDRR / W4BR 北极星已被「每天打开『我的早报』的 Pro 用户数」替换，理由：旧路径抽象不可感、跨阶段切换成本高，无法直接代表 Pro 价值兑现。下表 v1 量化门槛取自旧 NSM 体系，2026-06-30 Phase A 中期评审前将由 `specs/north-star-metric.md` 重写为新北极星阈值；当前过渡期内旧门槛仅作历史参考，不再作为 Phase 转换硬门禁。

**进入 Phase 2 的信号**（PRODUCT §8.3，新北极星阈值待 spec 重写）：

| 信号类型 | 判断逻辑 |
|---------|---------|
| 北极星 | 「每天打开『我的早报』的 Pro 用户数」绝对值稳定上升 N 周 |
| 留存验证 | Pro D30 留存稳定，由工作流使用驱动而非新鲜感 |
| 付费验证 | Free → Pro 转化率稳定，Pro 续订率认可持续价值 |
| 工作流闭环 | 北极星上升同时，二线副指标（X 绑定 / RSS / 伴读 / 翻译 / 回顾 / Domain 篇数）也上升 |
| 反指标 | 在阈值内，未通过骚扰式 / 标题党 / 强制拉起拉高北极星 |
| 质量池规模 | 公共质量池日均新增内容量稳定 |

**量化门槛 v1（⚠️ 历史 / 待重写）** —— 以下表取自旧 NSM 体系（`specs/north-star-metric.md §3`，2026-04-28 写入）。**PRODUCT v2（2026-05-18）切换北极星后，下列 WQRL / WDRR / W4BR 阈值不再作为 Phase 转换硬门禁**，仅作过渡期历史参考；新阈值由 `specs/north-star-metric.md` 重写后落地：

| 指标 | 现状估算（2026-04-27 基线） | v1 历史门槛（已失效） |
|---|---|---|
| WAU-R（周活跃阅读用户，排除匿名 + 内部账号） | ~1,500–2,500 | ≥ 5,000 |
| ~~**WQRL**~~（v1 周合格阅读闭环数，单用户封顶 7） | ~600–1,000 / 周 | ~~≥ 3,500 / 周~~ |
| ~~**WDRR**~~（v1 周深度阅读闭环率） | ~15–20% | ~~≥ 30% 且连续 4 周稳定~~ |
| ~~W4BR~~（v1 早报驱动深度阅读用户） | ~250–400 / 周 | ~~≥ 1,000 / 周~~ |
| Pro 用户 WQRL/周 vs Free 倍数 | 未测（待 Wave 2 看板上线） | ≥ 2× |
| Free → Pro 7d 转化率（早鸟期） | 1.07%（含历史邀请） | ≥ 5% |
| **Pro 早报阅读漏斗实际阅读率**（Issue #695 Dashboard 2.0 新增；admin `/dashboard` A 区 L5 / L2） | 暂未测（聚合开关 5/15 打开，待 ≥ 1 周数据） | ≥ 40%（这一项与新北极星语义对齐，保留作为辅助观察） |

**触发动作（v1 历史）：** ~~WQRL ≥ 3,500 **且** WDRR ≥ 30% 连续 4 周~~ —— **已失效**。新触发动作待 `specs/north-star-metric.md` 重写后回填，门槛改为「新北极星绝对值稳定上升 N 周 + 一线/二线副指标全部满足 + 反指标在阈值内」。

**反向守门 7 项硬红线 v1（⚠️ 历史，详见 `specs/north-star-metric.md §4.3`）** —— 这套红线服务于旧 WQRL/WDRR 北极星，依赖深度阅读闭环路径。北极星切换后，**红线主线已由 VISION §8 五条产品红线（不以时间消耗为目标 / 不替用户读 / 公共质量不让步 / 不以量取胜 / 不做泛化 AI 工具箱）+ PRODUCT §7.4 反指标接管**，下表 7 项作为前端 / 后端基线健康指标继续监控但不再单独构成「北极星上涨也算败仗」判定：

1. `/reading/brief` LCP P75 ≤ 4s（当前 zh 7.0s / en 8.9s 🔴）
2. 核心 API 5xx 错误率 ≤ 0.5%
3. `session_mismatch_guard` 周次数 ≤ 5（04-27 出现 28 次）
4. `brief_listen_click` 周事件 ≥ 1（30d=0 🔴 埋点丢失）
5. unknown/direct 注册占比 ≤ 30%（当前 ~70% 🔴）
6. 指标口径异常（双源差距）= 0
7. 平均阅读时长不能持续上涨（反指标 · 与 VISION §6.2 / PRODUCT §7.4 一致，继续生效）

---

## 内测期任务跟踪（2026-04-12 → 04-30）

> 所有任务通过 GitHub Issues 跟踪：https://github.com/ginobefun/bestblogs-monorepo/issues
> 每次提交需关联 Issue，规范见 `7-CONVENTIONS.md §6`。

### 用户放量计划

| 时间 | 目标人数 | 来源 |
|------|---------|------|
| 第 1 周（4/12–4/18） | 10 人 | 赞赏用户 + 核心关注者 |
| 第 2 周（4/19–4/25） | 20 人 | 扩大邀请 |
| 第 3 周（4/26–4/30） | 50 人 | 定向推广，准备 5/1 早鸟开放 |

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
| [#346](https://github.com/ginobefun/bestblogs-monorepo/issues/346) | 每日回顾 v1 已对 Pro 全量开放：PostHog 数据采集 + Phase D 决策依赖修复（替代已 closed 的 #100）| 🔴 数据采集断链（5/8 决策节点风险）|
| ~~[#247](https://github.com/ginobefun/bestblogs-monorepo/issues/247)~~ → [#709](https://github.com/ginobefun/bestblogs-monorepo/issues/709) | 每日回顾 v2 重设计 → PMF & 入口诊断 | ❌ 2026-05-16 关闭（NO-GO），改由 #709 诊断接管 |
| [#101](https://github.com/ginobefun/bestblogs-monorepo/issues/101) | 早报个性化定制：Settings 连通后端 | ⬜ 待开始 |
| [#102](https://github.com/ginobefun/bestblogs-monorepo/issues/102) | 视频 Job 开关：skills 质检 → 自动化 | ⬜ 待开始 |
| [#103](https://github.com/ginobefun/bestblogs-monorepo/issues/103) | 30 天宣传基础：文案 + SEO + 操作指南 | 🔄 方向 2 完成（[#279](https://github.com/ginobefun/bestblogs-monorepo/issues/279) `/docs` 文档中心，2026-04-21）；方向 1 文案 / 方向 3 SEO 待开始 |

### P2 第三周收尾（4/26–4/30）

| Issue | 任务 | 状态 |
|-------|------|------|
| [#347](https://github.com/ginobefun/bestblogs-monorepo/issues/347) | Daily Brief 维持 skills 手动产出（决策反转 #98，公共早报仍走 Job）| ✅ 决策已记录（重新评估节点：用户量 >200 / 连续 2 天 SLA miss）|
| [#104](https://github.com/ginobefun/bestblogs-monorepo/issues/104) → [#333](https://github.com/ginobefun/bestblogs-monorepo/issues/333) | 沉浸式翻译：替换 wenrun.ai → Translate v2 全类型双向去重 | ✅ 已上线（生产入口已替换），🔴 11 项人工验证未跑（#333）|
| [#105](https://github.com/ginobefun/bestblogs-monorepo/issues/105) | 主题页面（Topic Pages）：编辑式深度解读 MVP | ✅ Phase A+B 开发完成（后端 API + Admin 管理 + 前端阅读页 + Article JSON-LD + OG 图 + 8 事件埋点 + sitemap + hreflang；待 5 篇样板内容上线验证 KPI） |
| [#244](https://github.com/ginobefun/bestblogs-monorepo/issues/244) → [#397](https://github.com/ginobefun/bestblogs-monorepo/issues/397) | 主题类型扩展（PERSON_ORG + COMPARISON）| 🔄 v2.1.3 周期内：PR-1 已合（#399）；PR-2/PR-3 开发完成（PERSON_ORG / COMPARISON 后端实体+API+ 前端视图+admin + 置顶功能），待 PR 合并验证 |
| [#106](https://github.com/ginobefun/bestblogs-monorepo/issues/106) | 兴趣标签整理 skill + 手动打标 | ⬜ 待开始 |
| [#107](https://github.com/ginobefun/bestblogs-monorepo/issues/107) | 更新 BestBlogs 对外 README | ⬜ 待开始 |

### P3 早鸟期后（5/1+）

| Issue | 任务 | 状态 |
|-------|------|------|
| [#108](https://github.com/ginobefun/bestblogs-monorepo/issues/108) | bestblogs-cli 开发（OpenAPI + Skills 封装） | ⬜ 待开始 |

---

## 里程碑状态（按飞轮层级）

> 图例：✅ 开发完成（待 QA） ／ 🔄 开发中 ／ ⬜ 待开始

> **两端入口映射**（PRODUCT §3 起）：第一层 = 公共策展层（未登录默认展示每日早报 / 精选周刊 / 主题解读；登录后增加内容广场），第二层 = 我的空间（我的早报 / 我的关注 / 我的阅读 / 我的回顾）。M3-M12 里程碑沿用「第一层 / 第二层 / 第三层」分组，但对应到 PRODUCT v2 的两端命名与入口结构。

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
- 邮件推送：早报邮件递送（08:30），支持 Newsletter 详细版（Top 3 头条级 + 7 条摘要级）/ 精简版，可在设置页配置；**多 Provider 容灾路由（issue #334）**：Resend（主）+ AWS SES / Sendflare / Cloudflare（备），主开关 `FEATURE_MAIL_ROUTER_ENABLED` 默认 `false` 等同改造前，runbook 见 `runbooks/email-provider-failover.md`
- AI 摘要：内容要点提炼与优先级排序
- 微信群推送：公共早报文本版推送至微信群（WeChatBriefPushJob）
- 失败自动重试：GlobalBriefRetryJob 在生成失败时自动恢复
- 质量监控：BriefQualityMonitor 追踪生成成功率与质量指标
- **播客化内容结构**：早报数据模型支持完整播客结构（podcastScript、transcriptionSegments、autoChapters、podcastShowNotes、keywords、deepReadItems 多条），前端复用播客类型，`DailyBriefDomainService` 拆分为 `GlobalBriefDomainService` + `UserBriefDomainService`（详见 `specs/detail/briefing-podcast-structure.md`）
- **每日回顾 Daily Review（Pro）**：Pro 专属晚间回顾（20:30 批量生成，与早报独立），含阅读足迹回顾、AI 摘要、思考记录。**v1 已对 Pro 全量开放（2026-04-26）**。**2026-05-16 Phase D 决策矩阵 NO-GO**：5 周实测站内 `review_tab_open` 仅 20 个 Pro 用户、阈值全部不达；邮件触达表现更好（69 人收 / 23 人开）。v2 重设计 #241/#247 已关闭（not_planned），后续诊断由 Issue #709 接管（A 入口优化 / B 邮件为主站内下线 / C 整体下线 / D 重启 v2 四选一），下次重看合并到 6/30 Phase A 中期评审
- **精选与头条自动化（设计中 · 2026-06-02）**：打通 `bestblogs-featured-finder`（站点精选）与 `bestblogs-daily-briefing`（早报头条）两条链路，目标在早报前完成评分 + 精选设置，并经「先影子测量、达标后分带放开」走向全自动选头条 / 精选。采用**后端字段桥接**（finder 把 headlinePotential / confidence 写入后端，候选池 DTO 透出，早报选题消费）。设计与落地清单见 `specs/featured-headline-automation.md`
- **历史日期导航**：「查看昨日」入口内嵌至早报 Header，跳转至 `/explore/brief/[date]`（公共）或 `/reading/brief/[date]`（Pro），同一 `BriefContent` 组件复用，历史页含「返回今日」回退；历史 Tab 列表移除，改为直接 URL 访问；后端新增 `GET /api/briefs/public/{date}` 端点（无需登录，CDN 缓存 1h），与 `/api/briefs/{date}`（Pro 专属）独立分流
- **早报分享**：生成个人专属分享链接，访客可沉浸式体验完整 Pro 早报，附 Pro 升级引导
- **Pro 早报双视图（Issue #242 Phase 1）**：站内可在「图文」与「播客」之间即时切换，偏好（`defaultBriefView`）与邮件形态（`briefFormat`）解耦；图文视图由 `BriefTextVariantAssembler` 请求时装配，不落库；两个 kill-switch（`FEATURE_BRIEF_TEXT_VIEW_ENABLED` / `FEATURE_BRIEF_DEFAULT_VIEW_SWITCH_ENABLED`）支持全局降级，Settings 页 + BriefHome 均给曾选 TEXT 的用户展示关闭态提示
- **Pro 早报亲切化文案（Issue #685 · v2.4.0）**：早报开头出现动态问候 + 用户称呼（如「早上好，Gino」），邮件 Subject / App Push / 早报标题同步亲切化。`BriefGreetingService` 纯函数式合成：时段（早上 / 下午 / 晚上）× 工作日 / 周末 / 中国法定节假日 × 中英双语；称呼复用 `UserEntity.nickName`，空则 fallback 到 email local-part。后端 ConfigKey `BRIEF_FRIENDLY_GREETING_ENABLED`（默认 false，灰度后开），关闭时输出与既有完全一致。PostHog 事件 `brief_greeting_rendered`（含 period / dayContext / hasName / locale）用于灰度覆盖率与 A/B 监控。Profile 页 displayName 输入框新增「希望被称呼为」标签 + 用途说明 hint，引导用户填写昵称

#### M10 管理后台 P0 ✅ 开发完成（待 QA）

- 内容审核台：对待审核内容进行质量确认与可见性操作
- 参数配置管理：动态修改 ConfigKey（推荐权重、AI 模型、特征开关），无需重启
- 运营内容编辑：编辑与发布公共早报、精选内容、推荐位
- 用户管理：用户数据查看、邀请码发放、订阅状态管理
- 系统监控：后台任务状态、内容流转进度、健康指标
- **私有源健康分体系（Issue #422 / 2026-05-01）✅ P0 开发完成**：探测时计算 GREEN/YELLOW/RED 健康分（基于最近发布天数 + 近期条目数），RED 拒绝创建（YELLOW 暂不阻塞）；存量回测 Job 通过 `POST /api/admin/source/health-score-backfill/run` 触发，输出分布报表 + 写入 `SourceModel.lastHealthScore`；Admin `/source-review` 列表展示语义色徽章（活跃 / 低频 / 已停更）；总开关 `FEATURE_RSS_HEALTH_SCORE` 默认 `false`，先 dry-run 验证 `redRatio ≤ 5%` 再放量。同步修复 3 项独立 RSS 探测安全 bug：`fetchDirectly()` SSRF 盲区 / 超时硬编码迁移到 ConfigKey / XXE+DOCTYPE 防护

#### M11 内测可观测性 🔄 Wave 1 / 1.3 / 2 / 3 已合并（v2.0.13 / #332 #338），Wave 1.4 推进中（#346）

**Wave 1（已合 v2.0.13）**：
- 后端事件常量 22 个：`source_*` / `follow_*` / `recommend_*` / `daily_review_*` / `openapi_*` / `admin_dashboard_*`（`PostHogEvents`）
- `OpenApiMetricsFilter`（order=0）+ `caller_type` 4 枚举（`user` / `founder_skill` / `external_api` / `unauthenticated`），异步上报 `openapi_request_success/failed`
- `apiKeyFingerprint` SHA-256 截 16 字节，避免明文 API Key 落地
- `OBSERVABILITY_EVENTS_ENABLED` 双开关（与 `FEATURE_BACKEND_POSTHOG_ENABLED` 复合）
- ~~`mail_provider_call`（multi-provider 路由埋点，#334）~~ —— Issue #585 下线，改由 Micrometer `bestblogs.mail.call.{count,duration}` 承担

**Wave 1.3 / Wave 2 / Wave 3（#338，已合并 v2.0.13）**：
- Wave 1.3 ✅：`daily_review_generate_success`（DailyReviewGeneratorService）+ `daily_review_complete`（DailyReviewController.submitThoughtResponse, completionType=submit_thought）+ `recommend_dislike`（BehaviorController, context=recommend_feed 维度）+ `daily_review_email_sent/opened` hook（DailyReviewService + EmailTrackingController HMAC token）；前端 `recommend_view/click` 待 bestblogs-app 接入
- Wave 2 ✅：`bb_metric_daily` 聚合宽表 + `MetricDailyAggregateJob`（凌晨 2 点跑批，双 kill switch）+ `MetricAdminController`（/today /trend /breakdown /decision-taken）+ OpenAPI 鉴权失败率（WARNING）/ Pro grant 失败（CRITICAL）告警增强；9 个新 ConfigKey 三处一致
- Wave 3 ✅：admin `/dashboard` 决策看板（7 张 KPI 卡 + 7 个功能详情页 placeholder/详情，前 3 个 Pro Brief/Public Brief/OpenAPI 完整图表）+ 决策标记按钮 → `admin_dashboard_decision_taken`；侧边栏接入 `ADMIN_DASHBOARD_ENABLED` 开关；dark token `--color-error/success/warning/info` 补齐

**Wave 1.4（#346 · 2026-04-26）—— v2.0 数据采集闭环**：
- 现状缺口：v2.0 核心功能（公共早报 / Pro 早报 / 主题页 / 我的回顾）数据采集系统性断链 —— 单一依赖 PostHog + 主题页域 op_log 真空 + Daily Review 完成态前端 scroll_bottom/click_recommend 缺埋点 + 邮件发送 hook 未接通
- 三轨并行（合 PR 进 v2.1.0）：
  - **轨 A（前端）**：补 `review_view_complete` IntersectionObserver + 防抖 5s + `daily_review_complete` (completionType=click_recommend) 推荐卡点击；同步双写 `BehaviorController.markReviewComplete` 后端 op_log
  - **轨 B（服务端兜底）**：op_log 新增 4 个 opType（`TOPIC_LIST_VIEW` / `TOPIC_DETAIL_VIEW` / `TOPIC_CTA_CLICK` / `REVIEW_COMPLETE`）；现有 7 个 v2.0 入口扩展 `feature/subFeature/tier/source/completionType` 顶层字段；新建 `UserOpType` / `UserOpContentKeys` 常量类（轻量收敛 13 个 opType，旧 80+ 留待后续）；`MailRouterService` 接通 `DailyReviewService.markReviewEmailSent` hook
  - **轨 C（聚合 + Dashboard）**：`MetricDailyAggregateJob.aggregateUserBehavior()` 段聚合 op_log → 9 个 `user_op.*` metricKey；`user_op.review.completed` 用 `BreakdownKey` 复合维度编码（tier × completionType 6 cell）；Admin Dashboard 4 张 placeholder 卡填实 + `DailyReviewPhaseDCard`（独立于 PostHog 计算足迹率/思考率/完读率）；6 个新 ConfigKey 三处一致（3 阈值 + 1 kill switch + 2 观察窗）
- 双源对账：4/26–5/5 抽样窗口，差异 ≤ 5% 视为正常；5/8 Phase D 决策仅依赖 Admin Dashboard 决策卡（独立于 PostHog）
- Spec 同步：`observability-event-catalog.md` §20「双源对照与分工策略」+ §21「行为聚合与 metricKey」；`daily-review-analytics-dashboard.md` §2.4「双源对账」

---

### 第二层：个人 AI 阅读工作流

#### M0 Onboarding V2 三步弹窗向导 ✅ 已上线（2026-05-08 首发，2026-05-09 最终方案）

- **流程反转**：旧两步「兴趣标签 → 信源」改为「公共信源 → 私域接入 → 兴趣方向」三步弹窗向导，**每步即时落库**，中途关闭不丢失
- **Step 1**：后端 `recommended-sources-by-categories?perCategory=12` 按 8 canonical category（AI / Engineering / Product / Business / Finance / Growth / Media / Lifestyle）足额返回，每分类独立 fallback chain，10min Guava 缓存；前端 4×3 紧凑卡片网格 + 一键订阅；「下一步」立即调 follow 落库
- **Step 2**：RSS 批量走 OPML 风格两步式（parse 预览带 INVALID 红色 / NEW 绿色等状态徽标 → confirm 真正写入），单次上限 200 条（`ONBOARDING_RSS_IMPORT_MAX`）；不要求 Pro，Free 用户走私有源配额；X 绑定跳 `/settings#xgo`，微信公众号 / 小宇宙 / YouTube 占位「稍后设置」
- **Step 3**：用户已有兴趣 tag 优先 + 选源 category 命中度自动派生，默认预选 Top 5；折叠 Top 10 + 展开 Top 30；「稍后再说」也保留默认选中提交
- **Celebration**：居中徽标 + 标题 / 三项统计 / Pro N 天试用 promo（方案 A 内联激活，仅 activated && !alreadyPro 时显示）/ 4 张订阅 QR / 单 CTA「进入我的关注」（`/reading/follow`，v2.4.0 #683 即时早报上线后从原双 CTA 收敛）
- **后端**：新增 `POST /api/pro/trial/activate`（幂等）+ `recommended-sources-by-categories` + `sources/import/rss-urls/{parse,confirm}` + ProTrial 内联到 `completeOnboarding`（方案 A：失败可重试不丢福利）+ `Source.category` 一次性归一化脚本 `deploy/init/07_migrate_source_category.js` + 9 个 PostHog 事件常量；4 项 ConfigKey 独立 admin 分组 `onboarding-v2`
- **响应式**：≥md 弹窗 ≤960px + 左侧 200px 主题侧栏，<md 全屏 sheet + 顶部水平 chip + QR 改 2×2；全暗黑模式适配
- **替换策略**：旧 V1 组件 `InterestTagOnboarding.tsx` / `SourceOnboardingStep.tsx` 直接删除，无 Feature Flag，依赖 git 历史回看
- 详见 `bestblogs-docs/specs/onboarding-v2.md`

#### M1 IA v2 信息架构 ✅ 开发完成（待 QA）

- 统一导航体系：侧边栏重构，核心入口可达性优化
- 内容分类重组：品类分组与浏览层级优化，降低认知负荷
- 统一内容列表系统：Explore / For You / Follow 三页代码路径统一，体验按页面意图分化
- 响应式布局：桌面 / 平板 / 移动端自适应，各关键页面通过 4 视口 + light/dark 验证；v2.0.12 完成移动端 UX 补齐（touch target ≥44px 全站补齐、100dvh 迁移修复 iOS Safari 底部工具栏遮挡、HTML 注释清理）
- Locale 自动检测：基于 IP / 浏览器语言自动推断并设置偏好
- 内容广场（Explore）：FilterToolbar 分层（QuickPresets / Sort / Filter / Density 单行布局）；已读态本地持久化；精选 / 个性化 / 来源质量信号系统接入
- 推荐流（For You）：`ContentListShell` 统一接管，Pro 门禁与 Feature Flag 闪烁修复
- 订阅流（Follow）：统一代码路径，sidebar 来源活跃度展示
- 订阅源三页角色分化：`/explore/sources`（公共发现）/ `/me/sources`（管理台）/ `/me/sources/add`（扩充桥梁）；SourceCard 质量 / 可见性 / 时效信号落地；智能视图（特别关注 / 未分类 / 最近更新 / 长期未更新）；"我的关注 → 我的早报"因果闭环可视化（每个来源显示近 7 天进入早报次数）
- 图书馆（Library）三页统一升级：书签 / 划线 / 阅读历史采用统一壳层，左侧 Sidebar（标签 / 文件夹 / 智能视图），支持时间筛选、关键词搜索、密度切换、工作流化卡片操作（继续阅读 / 查看上下文 / 归类 / 删除）
- 统一标签 / 文件夹体系：跨书签 / 划线 / 历史的统一组织维度

#### M2 Landing Page 2.0 ✅ 开发完成（待 QA）

- 价值主张重塑：清晰传达「高质量内容 + 个性化工作流」定位
- Free / Pro 分层展示：差异化价值可感知
- 转化路径优化：强化升级激励与注册引导
- 上线阶段标识：展示当前内测 / 早鸟 / 正式阶段
- PostHog 事件追踪：Landing → Auth → 激活 → 付费完整漏斗
- /pro 页面完善：benefit bullets、定价方案、价值主张区块

#### M5 Pro 订阅闭环 ✅ 开发完成（待 QA）

- 订阅方案与定价：USD 统一定价（早鸟 $4.9/月 → 正式 $9.9/月，首次 8 折）
- Creem 支付集成：支付接口与自动化计费
- 订阅生命周期管理：激活 / 到期 / 续费 / 取消
- Pro 能力开放：我的早报、每日回顾、为你推荐、高阶 AI 伴读、自定义视图等
- 配额管理：Pro 用户各能力的日 / 月配额追踪
- Pro 门禁：服务层集中治理，Free / Pro 功能边界明确

#### M6 AI 伴读 ✅ 开发完成（待 QA）

- 内容摘要：智能生成文章 / 播客 / 视频核心观点摘要（skill_summary）
- 互动问答：基于当前内容的自由对话式提问
- 划线提问：对任意文本段落提问，获得深度解释
- 章节跳转：播客 / 视频快速定位并跳转相关章节
- 预置技能：思维导图、关键观点提炼、问答对生成等模板
- 配额控制：Free 有限次数（摘要为主），Pro 高阶能力与更高用量
- 全内容类型覆盖：文章 / 播客 / 视频 / 推文四种类型均已支持，各自差异化欢迎语与快捷问题

#### M6.5 内建沉浸式翻译 ✅ 已上线（生产已替换 wenrun.ai · 待人工验证 · #333）

- **状态（2026-04-26）**：生产入口已切到内建段落级双语对照（#104 目标已达成），但 11 项人工验证清单未跑（#333），**5/1 早鸟开放前必须完成主路径验证（Article 中→英 / 推文 SSE 扣费 / 播客 Pro 边界 / SSE 长跑）**
- 替换外部 wenrun.ai 跳转为内建段落级双语对照，免跳出阅读流
- **v2 升级（Issue #333）**：
  - **全类型支持**：文章 / 推文 / **播客转录** / **视频转录**（音视频转录仅 Pro 用户可用）
  - **双向翻译**：zh ↔ en，按 `resource.language` 自动推断方向，前端零选项面板
  - **同用户同资源仅扣 1 次**：`bb_user_translation_log` 唯一索引 (userId, resourceId)，跨方向 / 跨日复访不再扣减 quota
- Free 3 段预览 + Pro 解锁完整译文（配额 20/天 · v2 不变）
- 技术链路：`/api/content-translate/resources/{id}/stream`（SSE）→ TargetLangResolver → ParagraphSplitter / TranscriptLoader → 段落级缓存（`bb_content_translation`，含 direction 字段）→ LLM（gpt-5.4-mini 默认 + gpt-5.4-nano fallback）→ post-filter（含语言合规校验）
- 三层 Prompt Injection 防御：XML wrap + system instruction + 输入 sanitize + 输出 tag / length / 语言合规校验
- Feature Flag：`FEATURE_CONTENT_TRANSLATE_ENABLED`（默认关闭，灰度放开）；v2 灰度开关 `CONTENT_TRANSLATE_DEDUP_BY_USER_RESOURCE_ENABLED` / `CONTENT_TRANSLATE_PODCAST_PRO_ONLY` / `VIDEO_PRO_ONLY`
- 详见 `specs/content-translate-v2.md`（v1 快照 `archive/specs/content-translate.md` 已 deprecated）

#### M7 个性化推荐 ✅ 开发完成（待 QA）

- 多路召回：兴趣、探索、热点、协同 4 路并行召回
- 六维兴趣标签：Domain(8) / Topic(~220) / Entity(~30 高信号) / Format(16) 四层标签体系；per-tier 打标上限（domain≤1/topic≤5/format≤1/entity≤3）已落地；cold-start 精简至 27 个 topic
- 行为学习闭环：点击 / 阅读 / 收藏 / 划线 / 不感兴趣 / 深度阅读等信号实时更新偏好
- 智能重排：综合标签匹配（含 Entity 独立加权）、来源亲和度、新鲜度、质量分、多样性排序
- 推荐解释：用户可见的推荐理由，非黑盒
- 反馈机制：不感兴趣 / 感兴趣实时影响后续推荐
- Quality Feedback：内容质量反馈，已接入兴趣画像

#### M8 用户订阅源管理 ✅ 开发完成（待 QA）

- 公共订阅源库：BestBlogs 精选高质量订阅源浏览与订阅
- 私有订阅源：用户自定义导入 RSS 源，自动检测元数据
- 订阅源推荐：基于兴趣的订阅源发现
- 我的订阅流：统一展示所有关注来源的内容
- 自定义视图（Pro）：按自定义条件组织内容，上限 10 个视图

#### M9 会话安全改造 ✅ 开发完成（待 QA）

- HttpOnly Cookie 鉴权：access_token / refresh_token 存储在 HttpOnly + SameSite=Strict Cookie，JS 不可读
- session_active 登录态标记：非 HttpOnly Cookie，前端读取判断登录状态
- API 代理层：所有前端请求经 `/api/proxy/*`，代理注入 Authorization header 与 X-Internal-Token
- 内部 Token 校验：后端验证机制阻止绕过代理的直接 API 调用
- Safe Redirect：用户可控重定向 URL 经验证，仅允许同站相对路径
- API 路径白名单：`/api/proxy/*` 严格白名单，防止路径穿透

---

### 第三层：可调用知识基础设施

#### M11 OpenAPI 2.0 🔄 核心回归已补齐，待端到端验证

- 内容发现：资源搜索（混合检索 BM25 + kNN / 全文）、分页浏览、热趋内容、聚合详情
- 内容阅读：Markdown 全文、播客转录与章节
- 内容类型：文章 / 播客 / 视频 / 推文 / 电子报 / 每日简报
- 用户工作流（`/openapi/v2/me/*`）：订阅管理、书签、划线笔记、阅读历史、兴趣标签、自定义视图、早报、Pro 订阅
- 冷启动：Intake 兴趣建档（`/openapi/v2/me/onboarding`）
- 认证：Header `X-API-KEY`，API Key 元数据恢复用户上下文，Agent 无需额外传 user-id
- 速率限制：10 QPS 限流，按接口类型日配额管制
- 统一响应格式：`{success, code, message, requestId, data}`，1-based 分页
- 文档：`bestblogs-docs/openapi/` 五份 Markdown 文档（auth / intake / discover / read / capture）

---

#### M12 Mobile App MVP 🚧 Wave 1 已合并（3/9 子 Issue 完成），Wave 2 三线并行启动

父 Issue #267 · Plan `archive/specs/mobile-app-plan.md`（v0.4-wave1-delivered）· Final Gate 2026-04-21：UC-1=B（AI 伴读进 V1.0）/ UC-2=A（保 6/30）/ UC-3=A（价对齐）/ Y 加人方案。

**Wave 1（2026-04-21 ~ 2026-04-22 合并）**：
- [x] #268 脚手架 + 设计 token 语义层 + 字体加载（PR #278）
  - Expo SDK 52 + React Native 0.76 + Expo Router v4 + NativeWind 4
  - 设计 token 双层（rawTokens.palette.{light,dark} + makeSemanticColors）+ ESLint AST 级禁直引
  - BBSkeleton / BBEmptyState / BBErrorState / BBOfflineBanner 四态（44pt · Dynamic Type 1.3× · WCAG AA）
  - i18n（i18next + ICU + expo-localization · zh/en）· ThemeProvider `lockLight=true` · Sentry/PostHog + PII 过滤
- [x] #269 后端 Mobile Auth + 过滤器链 + Delete Account（PR #286 · 6252 行 / 87 文件）
  - 4 端点：`POST /api/v2/auth/mobile/{login,refresh,logout}` · `DELETE /api/v2/account` · `GET /api/v2/users/me` · `GET /api/v2/mobile/config`
  - 过滤器链：InternalTokenFilter 豁免整个 `/api/v2/*` · JwtAuthFilter audience 路径强制 · AuthRateLimitFilter 白名单
  - Apple/Google JWKS（缓存 1h + per-URI 锁 + rotation fallback）· nonce 常量时间比较 · Apple 隐私 relay 过滤
  - Refresh token：opaque + SHA-256 hash · **原子 CAS rotation + 30s grace + reuse detection → 全账号撤销 + Bark 告警**
  - Account Linking：Redis GETDEL 原子消费 · 禁止 email 自动合并
  - **MongoDB 实现**（非 Spec 原假设的 MySQL Flyway）：3 新 collection + UserEntity 加 appleUserId/googleUserId/tokenGeneration
  - **18 ConfigKey** 三处一致 · 43 UT + 479 既有测试无回归
  - 遗留 debt → `#269-followup`：CleanupJob / PostHog 事件 / Linking+Google+JWKS 测试 / Controller MockMvc / Runbooks
- [x] #270 登录 UI + Onboarding 双路径 + Account Linking（PR #282 · 16474 行 / 56 文件）
  - API client 401 单飞 refresh + PII 过滤 · SecureStore · MSW 2.x dev+jest 双模式 mock
  - Zustand auth store 5 态 · Expo Router `(auth)/(tabs)` 分组 · AuthGate 守卫
  - 5 屏：Welcome · EmailSignIn · Linking · Onboarding Interests · Onboarding Confirm（Web 老用户简化）
  - 可达性：BBText MAX_FONT_SCALE · Haptics · pressed opacity · iPad maxWidth 480
  - 安全：Email 枚举防护（CWE-204）· linkingChallenge 单次消费
  - 副带：#266 Topic Pages ConfigKey 三处一致性修复
  - 遗留 debt：2 scaffold test 失败 → `fix/mobile-test-bootstrap` · Google 真实 OAuth · 密码重置 deep link · Detox E2E
- [x] #273 Reader + 收藏 + 分享 + AI 伴读胶囊（2026-04-22）
  - `GET /api/v2/resources/{id}` + `POST/DELETE/GET /api/v2/users/me/bookmarks/*`（Mobile v2 命名空间 · JWT 保护）
  - Reader 屏 7 组件：ReaderTopBar / MetaInfoBar / AISummaryBlock / ArticleBody / DensitySheet / AskAICapsule / AIValuePreview
  - MMKV 持久化字号密度（compact / cozy / relaxed · 立即生效）· Free 中间态 → Paywall 占位 · Pro → AI 伴读屏占位
  - 遗留：Universal Link 分享（App 上架后）· AI 伴读屏完整实现 · 收藏 tagIds/note / 管理屏
- [x] #274 RevenueCat IAP + Creem → RC 桥接 + Webhook 幂等（Phase A 完成 2026-04-22）
  - 2 webhook endpoint：`POST /api/webhook/revenuecat`（HMAC-SHA256 iOS/Android 双 secret · hex/base64 双编码 · eventId UNIQUE 幂等）· 7 类事件分派（INITIAL_PURCHASE/RENEWAL → activatePro · CANCELLATION → 仅审计 · EXPIRATION/REFUND 立即过期 SLO ≤30s · BILLING_ISSUE → WARNING · PRODUCT_CHANGE/UNCANCELLATION → 审计）
  - 2 查询 endpoint：`GET /api/v2/billing/mobile/{entitlements,subscription}` · JWT(aud=MOBILE) · Redis 缓存 TTL ≤60s · webhook 到达主动 invalidate
  - Creem→RC 桥接 P0：CreemWebhookController 激活/撤销分支调 RC promotional entitlement · MobileAuthService 登录兜底注入（Web Creem Pro 用户）· `proSubscriptionSource='WEB_CREEM'`
  - RevenueCatReconciliationJob（daily 01:30 · @HoldJobLock · 容忍 24h 漂移 · drift > 0 推 WARNING）
  - ConfigKey 11 个三处一致 · ProSubscriptionSourceEnum 值域（WEB_CREEM/MOBILE_IOS/MOBILE_ANDROID/PROMO/MANUAL/INVITE_REWARD）
  - 附带修复：AlertDispatchService bean 命名 + ControllerContextFilter JWT attribute 兜底（#269 遗留 bug）
  - 测试：9 UT + 18 集成测试全绿
  - Phase B 沙箱 E2E 依赖 RevenueCat / Apple / Google 账号就绪

**Wave 2 启动（2026-04-22~）三线并行**：
- [x] ✅ #273 Reader + 收藏 + 分享（Mobile · 本 PR）· AI 伴读胶囊容器已就位
- [ ] 🚧 #274 RevenueCat IAP + Creem → RC 桥接 + Webhook 幂等（Backend · 7d · 独立推进）
- [x] ✅ `fix/mobile-test-bootstrap`（PR #294 · jest CI 恢复）
- [ ] 📋 `#269-followup`（Backend · 2d · 消化 Wave 1 debt）

**Wave 3（5/5-5/11，提前启动 2026-04-24）**：
- [x] ✅ #271 早报 Tab（Mobile · Free 公共 + Pro 个性化 + 402 Paywall + 历史昨日切换 + 共享密度 Store）
- [x] ✅ #272 内容广场 + 搜索（2026-04-24 交付 · 后端 2 端点 + Mobile 2 屏 + 48 单测）
- [x] ✅ #275 我的 Tab + 推送 + Delete UI（2026-04-25 开发完成 · MobilePushDeliveryJob 双 cron + Delete Account 二次确认 + 5 ConfigKey + 5 PostHog 事件 · 初始 MOBILE_PUSH_DELIVERY_JOB_DISABLED=true，TestFlight 验证后打开）
- [x] 🔨 #327 AI 伴读只读短回答版（双端落地 · `feat/327-ai-reader-ask` · Backend 20 UT + Mobile 18 UT 全绿 · 待 deepreview/PR）

**Wave 5（5/19-5/30 · M3 提审 5/30 · 前移 2.5 周留 rejection cycle 缓冲）**：
- [ ] #276 Android 适配 + EAS 发布流水线 + ASO + Mobile 回滚 SOP

目标：**iOS 6/30 上架** · **Android 7/15-7/20 上架**（UC-2=A 保原计划 · Y 加人加速方案）。

---

## 后续规划

### 个性化推荐增强

当前阶段待完善：
- searchBoostTerms 定期人工审计更新（当前标签匹配关键词为静态配置）

后续迭代方向：
- 协同过滤召回："和你兴趣相似的用户还在读"，补充 content-based 的盲区
- 知识图谱关联：Entity 标签间建立关联，自动扩展召回
- 主题演化追踪：在 Daily Brief 或个人中心展示"你的兴趣变化"
- 阅读历史摘要：周度 / 月度个人阅读报告，LLM 总结偏好变化

- **TODO-001**：推荐链路质量与参数化优化（超时阈值、可观测指标、回归测试）
- **TODO-002**：文档清理项：冷启动路径已收敛到 `/api/users/me/onboarding` + `/openapi/v2/me/onboarding`，同步清理文档中的旧路径表述
- **TODO-007**：Landing 2.0 上线效果埋点已补齐（Landing + Auth + Brief + Feed + Follow + Pro），当前以本地链路验证为主；生产环境看板配置与验收在上线前集中执行
  - **配置文档**：`bestblogs-docs/specs/detail/landing-2-posthog-dashboard.md`
  - **当前状态（2026-04-09）**：本地点击链路已在 PostHog 收到事件数据
  - **上线前动作**：按 `specs/detail/landing-2-posthog-dashboard.md` 完成 Dashboard/Funnel 创建与验收清单（Live Events 抽检 + 主漏斗校验）
- **TODO-011**：Pro 上线前用户问卷调查
- **TODO-012**：内测用户邀请与深度访谈
- **TODO-017**：存量用户邀请码迁移（bb_user_credit → bb_user）
- **TODO-048**：Daily Review v1 PMF 与入口可见性诊断（替代 5/8 Phase D 决策）
  - **决策结果（2026-05-16）**：Phase D 决策矩阵 **NO-GO**。5 周实测 `review_tab_open` 仅 20 个 Pro 用户、3 条阈值全部不达且二级条件「绝对用户数 < 50」触发，问题不是 v1 体验弱而是 Pro 用户没进来过站内回顾页
  - **v2 重设计已暂停**：Issue #241 / #247 已关闭（not_planned），spec `daily-review-v2-redesign.md` 加暂停 banner 保留参考；v2 代码零落地无需回滚
  - **接力诊断**：Issue [#709](https://github.com/ginobefun/bestblogs-monorepo/issues/709) 接管，3 步诊断 → 4 选 1 决策（A 入口优化 / B 邮件为主站内下线 / C 整体下线 / D 重启 v2）
  - **数据基线**：站内 `review_tab_open` 57 次 / 20 人；邮件 `daily_review_email_sent` 127 / 69 人，`_opened` 66 / 23 人（≈33% 打开率）；邮件触达明显优于站内
  - **下次重看**：合并到 2026-06-30 Phase A 中期评审议程

### AI 伴读增强

当前阶段可做：
- 列表页轻入口：文章列表卡片增加 AI 伴读轻量入口，点击直接进入阅读页并打开面板
- Margin Notes 默认展示：为所有用户默认展示 AI 洞察侧注（只读），作为 Pro 体验预览
- AI 伴读行为接入兴趣画像：Copilot 交互写入用户行为信号，丰富推荐系统

### Observation Windows（当前进行中的测量窗口）

| 窗口 | 起止 | 文档 | 终点判定 |
|---|---|---|---|
| ~~Daily Review v1 全量数据采集~~ → Daily Review PMF & 入口诊断 | 2026-04-26 → ~~2026-05-05~~ → **2026-06-30 Phase A 中期评审**（窗口已合并） | `specs/detail/daily-review-phase-d-decision-matrix.md`（NO-GO 已回填） + Issue #709 | 2026-05-16 Phase D NO-GO（5 周 `review_tab_open` 仅 20 人，阈值全失败）；后续 #709 三步诊断 → 4 选 1 决策（入口优化 / 邮件为主 / 整体下线 / 重启 v2），下次重看合并到 6/30 Phase A 中期评审 |
| ~~Daily Review v2 重设计~~ | ~~2026-04-21 → 2026-05-08~~ → **已暂停（2026-05-16）** | `archive/specs/daily-review-v2-redesign-2026-05-16.md`（顶部 banner） | Issue #241 / #247 关闭（not_planned），v2 代码零落地无需回滚；spec 保留参考，重启条件见诊断 Issue #709 |

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
| 3 | `/how-it-works` 工作原理 | 流程说明准确、配图正常 | ✅ |
| 4 | `/pro` Pro 定价 | 定价（早鸟 $4.9/月）、功能列表、Creem 跳转、Phase 阶段展示正确 | ✅ 通过 |
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
| 16 | `/status/[id]` 推文详情 | 推文内容、来源链接、匿名访问正文可见、底部 VisitorBottomCTA 仅匿名展示 | ⬜ |

### 内容详情页（匿名可读，登录后体验增强）

> 自 v2.2.5（2026-05-08）起：四类内容详情页对未登录访客全量开放。是否拦截匿名访问由后端 ConfigKey `FEATURE_VISITOR_MODE_ENABLED` 控制（默认 `true`）。`flags.visitorMode=false` 时 `LoginRequired` 立即重定向 `/signin?redirect=…`，CTA 不渲染，`visitor_cta_view/click` 自然停发。

| # | 页面路径 | 核心验证点 | 状态 |
|---|---------|-----------|------|
| 17 | `/article/[id]` 文章详情 | 正文渲染、匿名可读、底部 VisitorBottomCTA 仅匿名展示且点击跳 `/signup?redirect=…`、登录后 CTA 隐藏、`recordReading` 仅登录态调用、AI 伴读面板（摘要/问答/划线）、配额门禁、Citation 跳转、Margin Notes、暗色模式 | ⬜ |
| 18 | `/podcast/[id]` 播客详情 | 播放器、转录展示、章节导航、匿名可读 + VisitorBottomCTA、AI 伴读 | ⬜ |
| 19 | `/video/[id]` 视频详情 | 视频嵌入（YouTube IFrame API）、章节面板、转录、匿名可读 + VisitorBottomCTA、AI 伴读 | ⬜ |

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
| A | 响应式布局 | 桌面 (1440)、平板 (768)、移动端 (375) 各关键页面 | ⬜ |
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

### AI 伴读后续规划

- 跨文章上下文（Pro）：引用此前阅读过的文章作为对话上下文
- 个性化 Prompt：结合用户兴趣标签自动调整 skill prompt
- 语音输入 / 输出：语音问答交互

---

## 下阶段规划

承接 PRODUCT §8 重写：Phase 2 不再是「下一阶段」串行模型，而是**向上（阅读沉淀）+ 向外（可调用基础设施）并行延伸**。两方向独立判断、并行启动，不强行先后。

### Phase 2 · 向上 —— 阅读沉淀深化

帮助用户把阅读过的内容沉淀为可回看、可复用的知识资产。

- 我的回顾 v1 信号弱（Phase D NO-GO，2026-05-16）→ 后续依据 Issue #709 四选一决策（入口优化 / 邮件为主站内下线 / 整体下线 / 重启 v2）
- 我的阅读图书馆深化（知识图谱 / 笔记结构化 / 跨内容研究会话）
- 强化个性化反馈闭环（不感兴趣、兴趣漂移、Domain 自定义篇数微调）
- 触发条件：阅读沉淀类指标（划线 / 书签 / 历史回访 / 我的回顾使用率）持续被使用

### Phase 2 · 向外 —— 可调用基础设施

让 BestBlogs 成为外部工具与智能体可调用的阅读 / 知识基础设施。

- **OpenAPI 2.0**：外部工具、个人脚本、Agent 通过 API 调用 BestBlogs 内容池与用户工作流（详见 `archive/specs/openapi-skills.md`）
- **Agent Native**：Context Pack、Content Intelligence Network、ResearchSession、WatchRule + Triggered Digest（详见 `archive/specs/agent-native.md`）
- 提升 OpenAPI 与站内能力的一致性
- 触发条件：开始收到外部 API 调用需求 + 结构化数据准备就绪

### 跨产品形态（持续投入，不绑定阶段）

- Mobile App（iOS + Android）：父 Issue #267 · iOS 7/31 / Android 8/15 目标 — 见 M12
- xgo.ing × BestBlogs 跨产品 Pro 联动：父 Issue #377（已落地，持续观察）
- 邀请系统 + 老用户激活活动：Issue #574（已落地，持续观察）
- 邮件营销广播：Issue #640（已落地，运营层调优）

### 阶段切换原则（重要）

- **信号驱动，不是日历驱动**
- 北极星 + 副指标 + 反指标全部满足后才启动 Phase 2 评估
- Phase A 中期评审（2026-06-30）是关键评估节点
- 阶段切换前需做 Phase 1 完整复盘：北极星历史 / 副指标 / 反指标 / VISION 红线检查
- **Phase 2 启动后保留 Phase 1 维护投入** —— 不是 Phase 1 结束，是叠加
