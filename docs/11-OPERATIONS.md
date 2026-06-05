# 11-OPERATIONS.md

本文件是 BestBlogs monorepo 的运维、Feature Flag、配置治理、监控、回滚事实来源。**承接 PRODUCT v2 北极星指标变更（每天打开「我的早报」的 Pro 用户数）与 VISION §8 五条红线**（详见 §运维规约 末尾「价值红线 read-only 副本」）。

## 原则

1. **上线可观测**：关键路径有日志、计数、告警。
2. **上线可控制**：新能力走 Feature Flag，默认关闭，人工验证后放量。
3. **上线可回滚**：任意功能都能通过 ConfigKey 瞬时关闭，不需要回滚部署。
4. **配置单一真相源**：所有动态参数都走 `ConfigKey` 枚举，禁止散落字符串。
5. **价值不让步**：任何回滚 / 灰度 / 阈值调整都不得违反 VISION §8 五条红线（详见 §运维规约 末尾）。

## ConfigKey 治理

### 单一真相源
```
bestblogs-service/bestblogs-common/src/main/java/dev/bestblogs/common/parameter/ConfigKey.java
```

所有动态配置项在此枚举声明。**禁止**：
- 业务代码硬编码配置 key 字符串（如 `"FOO_ENABLED"`）
- 默认值通过环境变量取代代码默认（环境变量仅覆盖 code default）
- 同一参数在多处重复声明

### 三处一致性（**硬门禁**）

新增或修改 ConfigKey 必须同步以下三处，任一缺失不允许合入：

| 序号 | 位置 | 作用 |
|---|---|---|
| ① | `bestblogs-common` ConfigKey 枚举 | 单一真相源 |
| ② | `bestblogs-admin-api` 参数配置 Controller | Admin API 暴露 |
| ③ | `bestblogs-admin` 管理后台配置 UI | 可视化配置界面 |

### 分组约定

`ConfigKey.java` 中以注释分组（见文件内 `// ==========` 标记）。新增项必须归入现有分组，或开新分组时同步更新 Admin UI 分组。

常见分组：
- 图片、邮件、通知、对象存储、Workflow API Key
- Job 开关（`*_JOB_DISABLED`）
- Feature Flag（`FEATURE_*_ENABLED`）
- 业务阈值（分数、配额、天数）
- 外部集成（OAuth、第三方服务）
- **配额治理（v2.4.0 新增分组语义，承接 PRODUCT §4）**：用户级动作配额（关注源数量 / AI 伴读次数 / 沉浸式翻译次数 / Domain 自定义篇数）的上限 ConfigKey。原则：
  - **可感知动作次数计量**优先于不可感知的 token / 字符数
  - **日重置**与 BestBlogs 整体日节奏（早报 / 回顾）一致
  - **相关动作共享配额**（同类协助动作共享同一配额池，避免多入口刷量）
  - **完全 Pro Only 能力**（个性化早报 / 跨文章伴读 / 自定义视图 / 长视频长播客 / 我的回顾 / Domain 自定义篇数）必须由 `ProFeatureHelper.requirePro` 在服务层集中守门，不依赖 ConfigKey 灰度开关切换访问权限
  - **不引入用户调权配置项**（VISION §3 / PRODUCT §5.4 行为驱动画像原则）—— 用户偏好由显式行为产生，不通过 ConfigKey 或 admin UI 暴露给用户调节

## Feature Flag

### 命名规范
- 功能开关：`FEATURE_<NAME>_ENABLED`（默认 `false`，验证后置 `true`）
- Job 开关：`<JOB_NAME>_JOB_DISABLED`（默认 `false`，异常时可置 `true` 暂停）
- Admin 功能开关：`ADMIN_<NAME>_ENABLED`

### 使用准则
- **新功能必须有 Feature Flag**（例外：单文案修改、纯内部重构）
- Flag 默认值**保守**：新功能默认关、默认 Job 开
- **灰度策略**：
  - 全局开关 → 先内部账号 → 再 10% → 全量
  - 用户维度灰度通过 `user.flags` 或 `FeatureFlagService` 读取
- **死 Flag 清理**：功能稳定 ≥ 2 版本后，移除 Flag 及相关判断代码（作为技术债每月清理）

### Kill Switch
- 每个 Feature Flag 都是 kill switch：出问题时直接后台置 `false`
- 不允许用代码部署回滚取代 Flag（太慢）

### 已登记的 Feature Flag

> 新增 Feature Flag 必须在此登记；出问题时运维按本表回滚。

| ConfigKey | 默认 | 所属功能 | 关闭效果 | 回滚 SOP |
|---|---|---|---|---|
| `FEATURE_BRIEF_TEXT_VIEW_ENABLED` | `true` | Pro 早报图文视图（#242）| `DailyBriefService.buildTextVariant` 直接返回 null；所有 Pro 早报读接口 `textVariant=null`，前端 Pro/分享页降级为编辑荐语 + contentItems 列表（Legacy 视图已在 #524 移除） | Admin 参数配置页置 `false` → 等次次查询即生效（无重启）；受影响事件：`brief_text_view_fallback {reason=kill_switch_off}` 会出现在 PostHog |
| `FEATURE_BRIEF_DEFAULT_VIEW_SWITCH_ENABLED` | `true` | Pro 站内默认视图偏好开关（#242）| `User.defaultBriefView` 读写均返 null（后端不暴露 DB 旧值）；前端 ViewSwitcher 隐藏；Settings 页 Select 锁定并给曾选 TEXT 的用户展示琥珀色提示；BriefHome 顶部给曾选 TEXT 的用户展示 dismissable banner | Admin 参数配置页置 `false` → 立即生效；前端已在 Settings + BriefHome 双触点给用户感知 |
| `FEATURE_DAILY_BRIEF_PODCAST_ENABLED` | `false`（v2.2.5 起默认 `false`，与生产实际对齐 · #565）| Pro 早报播客生成 kill switch（#448 · 降成本下线 TTS）| `DailyBriefAudioJob.execute()` 与 `BriefMgrService.generateAudio() / generateAll() Step 3` 三处守卫，关闭时跳过 TTS 链路；新生成 brief `podcastScript / audioUrl` 留空，`transcriptionSegments / autoChapters` 仍由 GlobalBrief 工作流产出（不影响图文体验）；前端 `BriefViewSwitcher` 据 `Boolean(audioUrl)` 隐藏播客 Tab，`BriefHomeShared` 初始视图自动落 `text`；管理后台 `/brief` 三 Tab 同步隐藏音频卡 / 收听率 KPI / 趋势表音频列；历史已生成的播客数据保留可播放 | Admin 参数配置页置 `true` → 下次 cron（07:30）生效，恢复 TTS 生成；回滚路径**无需发版**。⚠️ v2.2.5 默认值 `true → false` 仅影响**全新部署**，现有环境 DB 已有覆盖记录不变 |
| `ADMIN_BRIEF_RETRY_BATCH_ENABLED` | `true` | 早报后台一键重试入口 kill switch（#565）| `BriefAdminController.POST /retry-batch` 入口校验，置 `false` 时直接返回 `FEATURE_DISABLED` 错误码；不影响 `POST /retry-user` 单条重试入口 | Admin 参数配置页置 `false` 紧急停用；恢复 `true` 立即生效（参数缓存 ≤ 5 min 失效） |
| `ADMIN_BRIEF_RETRY_STUCK_THRESHOLD_MINUTES` | `30` | 批量重试默认 GENERATING 卡住阈值（分钟，#565）| `BriefMgrService.retryBatch()` 在请求体未传 `stuckThresholdMinutes` 时使用此默认值识别卡住任务；调小放宽（更激进）/ 调大收紧（更保守）| Admin 即时调整 |
| `ADMIN_BRIEF_RETRY_DEFAULT_LIMIT` | `50` | 批量重试默认单批上限（#565）| 请求体未指定 `limit` 时使用；强制不超过 `ADMIN_BRIEF_RETRY_MAX_LIMIT` | Admin 即时调整 |
| `ADMIN_BRIEF_RETRY_MAX_LIMIT` | `100` | 批量重试单批硬上限（#565 · 网关超时缓解）| 请求 `limit` 超过此值会被截断；按单条 Dify ~30s 估算，最坏 50min 执行时间 | Admin 即时调整；P1 follow-up：异步化后此 cap 可放宽 |
| `ADMIN_BRIEF_RETRY_FAILURE_ALERT_RATIO` | `0.3` | 批量重试失败比例告警阈值（#565）| `BriefMgrService.retryBatch()` 完成后若 `failedCount/totalCandidates > ratio` 则推 `internal:brief-retry-batch-failure:{briefDate}` WARNING 告警（同日内 dedup） | Admin 即时调整；调小（如 0.1）更敏感，调大（如 0.5）容忍更多失败 |
| `FEATURE_MOBILE_PUSH_ENABLED` | `false` | Mobile 推送总开关（#275）| `MobilePushDeliveryService.deliver()` 头部检查，关闭时整批跳过。设备注册端点 `POST /api/v2/devices/register` 仍接受写入（保留 Expo token），Job 不投递 | Admin 参数配置页置 `false` → 下次 cron 跳过；**已发出的推送无法撤回**（Expo Push 固有限制） |
| `MOBILE_PUSH_DELIVERY_JOB_DISABLED` | `true` | Mobile 推送 Job 级开关（#275 · 与 Feature Flag 双保险）| `MobilePushDeliveryJob.executePro/executeFree` 头部检查，`true` 时直接 return 不进入 service。初始默认 `true`，TestFlight 验证后改 `false` 才真正投递 | 置 `true` 立即暂停 Job（下次 cron 不执行）；配合 `FEATURE_MOBILE_PUSH_ENABLED` 双开关 |
| `FEATURE_PRO_TRIAL_ENABLED` | `true` | Onboarding V2 冷启动 Pro 试用发放总开关（kill-switch 语义，2026-05-09）| `ProTrialService.activateOnboardingTrial` 进入第一分支返回 `activated=user.isPro()`，新用户 onboarding 完成后不发放试用；**已发放的 Pro 权益不撤回**（与 xgo entitlement 一致语义）。PostHog 上报 `pro_trial_skipped {reason=disabled}` | Admin 参数配置页 `onboarding-v2` 分组置 `false` → 参数缓存 ≤ 5 min 失效后即时生效。注意默认 `true` 与项目惯例（功能开关默认 `false`）相反，因新用户即享权益是产品决策 |
| `FEATURE_INVITE_SYSTEM_ENABLED` | `false` | 邀请功能 v2 总开关（#574）| 关闭时 `InviteController` `/invites` `/invites/records` `/invites/apply` 全部抛 FEATURE_DISABLED；`InviteQueryService.checkEligibility` 返回 `visible=false reason=disabled`；前端 `/me/invite` 显示功能未开放、PromoBanner 不展示邀请相关公告 | Admin `feature-flags` 分组置 `false` → 缓存 ≤ 5 min 失效后秒级生效；已发放奖励不撤回 |
| `INVITE_VISIBILITY` | `PRO_ONLY` | 邀请系统灰度受众（#574）| `PRO_ONLY`：仅当前 Pro 会员可见 `/me/invite` 与 `/records` 端点；非 Pro 用户看升级提示。`ALL`：放开给所有登录用户 | Admin `ops` 分组改值；切 `ALL` 前先观察 `invite_blocked_by_visibility` PostHog 事件量与 Pro 邀请转化率（详见 spec §7） |
| `FEATURE_REACTIVATION_PROMO_ENABLED` | `false` | 老用户激活活动总开关（#574）| `ReactivationPromoService.evaluateEligibility` 第一分支返回 `disabled`；`/me/promo` 页所有用户看到"活动暂未开放"；PostHog 上报 `reactivation_promo_blocked {reason=disabled}` | Admin `ops` 分组置 `false` → 秒级生效。**注意**：开启前必须先在 admin `/announcements` 创建对应 placement 公告，否则前端 banner 入口缺失 |
| `REACTIVATION_PROMO_DAYS` / `_START_AT` / `_END_AT` / `_USER_REGISTERED_BEFORE` | 14 / `2026-05-15...` / `2026-05-31...` / `2026-05-09...` | 激活活动参数（#574）| `start/end` 必须 ISO-8601 含时区；解析失败 fail-closed 视为 disabled（防 fail-open）。`registered_before` 选填，控制注册时间资格防新注册套利 | 修改 ConfigKey 后下一次 GET/claim 即生效；时间格式错误会推 PostHog `reactivation_promo_blocked {reason=disabled}` 而非静默放行 |
| `INVITE_INVITER_DAYS_PER_INVITE` / `_MAX_DAYS` / `INVITE_INVITEE_PRO_DAYS` | 7 / 28 / 7 | 邀请奖励池参数（#574）| 单次邀请奖励天数 / 活动期奖励池上限（含激活活动）/ 被邀请人 onboarding 赠送天数。运行时由 `InviteService.processInviteReward` 在分布式锁内串行累加 `user.activityPromoGrantedDays` | 调高 `_MAX_DAYS` 让现有邀请人继续累加；调低不会回收已发放天数 |
| `PUBLIC_API_RATE_LIMIT_SITE_PUBLIC_MAX_RPM` | 60 | 站内通知/邀请资格公开端点 IP 限流（#574）| `/api/site/announcements` 与 `/api/invites/eligibility` 共用此分组，分钟窗口超限返回 429 | 紧急放量可调高至 120/180；爬虫扫描时调低至 30 |
| `MOBILE_PUSH_BATCH_SIZE` | `500` | Mobile 推送批量大小（#275 · 配合 Expo 100 条/批分片再聚合）| 值过小导致 Expo API 调用次数增加；值过大可能触 Expo 限流 | 调整后下次 cron 生效 |
| `MOBILE_PUSH_TIMEZONE` | `Asia/Shanghai` | Mobile 推送投递时区（#275）| Job 用该时区计算 briefDate；非法值回退 Asia/Shanghai 并 warn log | 调整后下次 cron 生效 |
| `MOBILE_DELETE_ACCOUNT_COOLDOWN_DAYS` | `7` | Delete Account 冷静期天数（#275 · 未来实现软删除 + 定期清理时消费）| 当前后端 `MobileAccountController` 直接调 `deleteAccount` 物理删除，未消费该 key（V1.1 接入后软删除）| ConfigKey 仅登记，V1.0 不影响实际行为 |
| `FEATURE_USER_BEHAVIOR_AGGREGATE_ENABLED` | `false` | v2.0 数据采集闭环 `aggregateUserBehavior` 段（#346）| `MetricDailyAggregateJob.aggregateUserBehavior` 整段跳过；`bb_metric_daily` 9 个 `user_op.*` metricKey 当日不写入；Phase D 决策卡显示"尚未有行为日志聚合数据" | Admin 参数配置页置 `true` → 次日凌晨 02:00 生效；脏数据回滚命令：`db.bb_metric_daily.deleteMany({metricKey: {$in: [...]}, date: {$gte: 'yyyyMMdd'}})` |
| `ALERT_DAILY_REVIEW_FOOTPRINT_RATE_THRESHOLD` | `0.50` | Daily Review 足迹率阈值（#346 · Phase D 决策卡）| Phase D 决策卡 `pass=false` 误判 | Admin 即时调整，无需重启 |
| `ALERT_DAILY_REVIEW_THOUGHT_RATE_THRESHOLD` | `0.20` | Daily Review 思考率阈值（#346 · Phase D 决策卡）| 同上 | 同上 |
| `ALERT_DAILY_REVIEW_COMPLETION_RATE_THRESHOLD` | `0.30` | Daily Review 完读率阈值（#346 · Phase D 决策卡）| 同上 | 同上 |
| `DAILY_REVIEW_PHASE_D_OBSERVATION_START` | `20260426` | Daily Review Phase D 观察窗起点（#346）| 仅作 Admin Dashboard 显示；不影响实际查询逻辑 | 5/8 决策后改为下一观察期或保持归档值 |
| `FEATURE_TEST_HELPER_ENABLED` | `false` | 前端 E2E 测试辅助端点（`/api/internal/test/verification-code`）开关，用于 Playwright 自动化「发码 → 服务端读码 → 验码」登录链路 | `TestVerificationCodeController` peek 端点 `assertFeatureEnabled` 抛 `FEATURE_DISABLED`；E2E 拿不到验证码无法登录，本地 / 测试环境 Playwright 套件失败 | **生产环境永远应保持 `false`**；同时 Controller 类带 `@Profile({"local","test"})` 双重保护——非 local/test profile 下 Bean 不会装配，写入此 ConfigKey 也无意义。**不在 admin UI 暴露**（避免运维误开启）；只能直接改 MongoDB `bb_parameter` 或通过 `uitest/scripts/init-test-data.js` 在本地启动时写入 |
| `DAILY_REVIEW_PHASE_D_OBSERVATION_END` | `20260505` | Daily Review Phase D 观察窗终点（#346）| 同上 | 同上 |
| `PUBLIC_API_RATE_LIMIT_BEHAVIOR_REPORT_MAX_RPH` | `60` | 公开行为上报端点（如 `/api/behaviors/topic-cta`）IP 级小时限流（#346 防匿名刷量） | 上调放宽防刷阈值；下调收紧（< 60 时影响正常用户）| Admin 即时调整 |
| `DAILY_REVIEW_EMAIL_INLINE_ENABLED` | `false` | Daily Review 生成完成后内联 @Async 邮件分发灰度开关（#362）| `DailyReviewGeneratorService.generateReviewForUser()` 末尾 `sendForReview()` 不被调用，已生成的 review 仍可被 admin `POST /api/admin/daily-review/dispatch` 手动补发 | Admin 参数配置页置 `false` → 即时止血（已提交到 executor 的任务仍会执行完成，但不会有新任务进入）；不影响 Daily Review 生成主链路 |
| `MAIL_ROUTE_DAILY_REVIEW` | `SENDFLARE,RESEND,CLOUDFLARE` | Daily Review 邮件渠道路由表（#362 / W2 + Cloudflare 接入）| 三层兜底：Sendflare → Resend → Cloudflare（public beta · 2026-04，仅作灾难性兜底，前两 provider 都 fail 时才被调用） | Admin 参数配置页改 `SENDFLARE,RESEND` 暂时禁用 Cloudflare；改 `RESEND` 完全跳过 Sendflare 与 Cloudflare；**禁止把 CLOUDFLARE 放到首位**直至 ≥ 3 个月清洁送达率 |
| `XGO_INTEGRATION_ENABLED` | `false` | xgo.ing × X 关注同步总开关（#377）| 关闭后所有 X 同步路径熔断：`POST /api/users/me/xgo/sync` 返回 `FEATURE_DISABLED`；`XgoFollowingsSyncJob` 直接 return；`XgoBindController.startBind` 抛 `X_OAUTH_FAILED`。已绑定记录 + 已同步 X_USER 私有源不受影响 | Admin 参数配置页置 `false` → 秒级生效；不会回滚已注入的 X 用户私有源 |
| `XGO_ENTITLEMENT_SYNC_ENABLED` | `false` | BestBlogs Pro → xgo.ing PRO 跨产品权益联动（#377）| 关闭后 `CreemWebhookController` 不再调 `XgoEntitlementService.grant/revoke`，**已 grant 的 xgo PRO 不会自动撤销**（保留权益），需配合手动对账。前端 Pro 联动状态条隐藏 | Admin 参数配置页置 `false` → 秒级生效；阻止新 Pro 订单触发跨产品 grant，不影响 X follows 同步 |
| `OAUTH_X_LOGIN_ENABLED` | `false` | X OAuth 登录入口开关（#377 · 当前仅占位，BIND 模式始终启用，LOGIN 模式 v1.1 实现）| 关闭后未来"使用 X 登录"按钮隐藏；BIND 模式（已登录用户绑定 X）不受此开关影响 | Admin 参数配置页置 `false` → 秒级生效（v1.1 起生效） |
| `XGO_USER_MAX_X_SOURCES` | `1000` | 单用户 X 用户私有源订阅上限（#377 · 对齐 xgo.ing PLUS tier）| 上调放宽（注意 xgo.ing API quota）；下调收紧（已超 quota 的用户当批同步会按 `quality desc` 截断）| Admin 即时调整 |
| `DAILY_REVIEW_EMAIL_LIST_UNSUBSCRIBE_URL` | `""` | Daily Review 邮件 RFC 8058 List-Unsubscribe URL 模板（#362 / #378）| 留空时 fallback 为 `${DOMAIN_MAIN}/api/email/unsubscribe?token=XXX`；非空时按模板拼接 token | 一般无需调；如需指向独立反馈页（如统一退订中心）可改 |
| `FEATURE_CONTENT_READ_TRACKING_ENABLED` | `true` | **v1 NSM 深度阅读埋点 kill switch**（#393 / #394 / #688）。**默认 true 与本表多数 Flag 不同**：语义为 kill-switch（出问题时关）而非渐进放量开关。⚠️ **PRODUCT v2 已切换北极星为「每天打开『我的早报』的 Pro 用户数」**（不依赖此埋点），本 flag 现在仅守 v1 历史 NSM 看板（WQRL/WDRR）；新 NSM 埋点事实见 `specs/my-daily-brief.md §9.4`，本 flag 在新 NSM spec 重写后可评估废弃 | 前端 `useContentReadTracking` hook 跳过订阅/计时；`content_read_progress` / `content_read_completed` / `content_read_exit`（#688）停止发送；v1 WQRL/WDRR 计算不全面但 `copilot_query_submit` 等其他 T1 信号仍可用；**新北极星「Pro 早报打开数」不受影响**（由 `brief_mailing_open` + Web 端 `my_brief_view` 等独立事件支撑）。注：`content_bookmark_toggle` / `content_highlight_save`（#688）由独立组件触发，**不在此 kill-switch 范围**，需通过停用对应功能或后端事件配额控制 | Admin 参数配置页置 `false` → 前端 SWR 节流窗口 10 min（`FEATURE_FLAGS_MIN_REFRESH_INTERVAL_MS`，#591 弱网降频后取代旧 30s 轮询；`revalidateOnFocus=false` + `refreshInterval=0`，仅 visibilitychange 距离上次成功拉取 ≥ 10 min 或网络重连时触发）失效后生效；急停可调 `POST /api/admin/parameters/refresh` + 浏览器硬刷新；fail-closed：缓存缺值时前端也不发埋点 |
| `SOURCE_DISCOVER_INCLUDE_PRIVATE` | `true` | 发现页是否展示社区源（已审核通过的私有源，#425）。**默认 true 与本表多数 Flag 不同**：语义为紧急回滚 kill-switch 而非渐进放量开关；产品决策为全量启用以最大化跨用户复用率 | `SourceDiscoverService.buildVisibilityScope()` 仅返回 `[SYSTEM, PUBLIC]`，发现页恢复改造前行为；已订阅社区源的用户关注列表不受影响（仅发现页不再展示）；内容流（Explore / Feed / 早报 / 搜索）行为始终不变 | Admin 参数配置页置 `false` → 参数缓存失效（≤ 5 min L2 Redis TTL）后生效；如需立即生效，调 `POST /api/admin/parameters/refresh` 强制刷新 |
| `FEATURE_RSS_HEALTH_SCORE` | `false` | 私有源健康分体系总开关（Issue #422 / P0）| 关闭时：`detect-rss` 不计算 healthScore；新建私有源 `lastHealthScore` 不写入；`createPrivateSource` 不抛 `PRIVATE_SOURCE_HEALTH_RED`；Admin `/source-review` 健康徽章列为空（向后兼容） | Admin 参数配置页置 `true` 灰度开启；先跑回测 dry-run（`POST /api/admin/source/health-score-backfill/run?dryRun=true`）观察 `redRatio ≤ 5%` 再正式启用；出问题置 `false` 即时回退 |
| `FEATURE_BRIEF_RC_ENABLED` | `false` | Pro 早报独立推荐引擎（Issue #523 / #527）| 关闭时回落到 `recommendFromGlobalBrief()` 路径（依赖 GlobalBriefJob 先运行）| Admin 置 `true` 灰度开启；回滚置 `false` → 参数缓存 ≤ 5 min 失效；回滚前确认当日 GlobalBriefJob 已完成 |
| `BRIEF_AI_ENABLED` | `false` | Pro 早报 AI 生成（Dify Workflow，Issue #527）| 关闭时跳过 AI 生成，使用规则兜底的 `podcastTitle` / `keywords` / `editorIntro`| Admin 置 `true` 开启；AI 失败不阻塞早报内容（catch + warn）；回滚置 `false` 即时生效 |
| `BRIEF_FRIENDLY_GREETING_ENABLED` | `false` | Pro 早报亲切化文案 kill switch（Issue #685）| 默认 `false` → 早报正文 / 标题 / 邮件 Subject / App Push 输出与既有完全一致。开启 → `UserBriefGeneratorService` 在 AI 结果上 post-process 注入「早上好，Gino，这是为你精选的今日早报」式问候 + 称呼 + 「{nickName}的今日精选 · 」标题前缀；`EmailBriefChannel` Subject 改为 `{greeting + 称呼} — 你的 BestBlogs 早报 · {date}`；`MobilePushDeliveryService` Pro Push 标题改为 `{greeting + 称呼}`。称呼优先 `UserEntity.nickName`，空则取 email local-part（截断 20 字），完全匿名时不带名问候。节假日表硬编码 2026 年（2027 起静默退化为工作日并 warn 一次） | Admin 参数配置页 `daily-brief` 分组置 `true` → 参数缓存 ≤ 5 min 失效后生效；回滚置 `false` 立即生效，已写入 DB 的 `title` / `editorIntro` 不会自动回滚（下一个早报周期才覆盖）。PostHog 监控 `brief_greeting_rendered`（含 period / dayContext / hasName / locale）。年度运维项：每年 12 月在 `BriefGreetingService.CHINA_HOLIDAYS_BY_YEAR` 补下一年节假日表 |
| `BRIEF_RC_DOMAIN_QUOTA_ENABLED` | `false` | Pro 早报 Domain 配额召回灰度开关（Issue #684）| 默认 `false` → 走旧 follow/tag/hot 三桶路径（向后兼容）。置 `true` 且用户 `quotaPerInterest` 非空时 → `UserBriefRecommendationService.recommendByDomainQuota` 严格按用户每 Domain 配额切桶，不跨 Domain HOT 兜底；单 Domain 内容不足时降到 `BRIEF_RC_DOMAIN_QUALITY_THRESHOLD_RELAXED`(60) 继续拉 | Admin 参数配置页置 `false` 即时回滚到旧路径，参数缓存 ≤ 5 min 失效。开启前确认存量用户已 backfill `quotaPerInterest`，否则用户走默认旧路径无影响 |
| `BRIEF_RC_DOMAIN_QUALITY_THRESHOLD` | `80` | Domain 配额召回的默认质量分门槛（Issue #684）| 每 Domain 优先按此门槛拉内容；调低则候选池更大但质量下降；调高则更严格但易触发降级 | Admin 即时调整，参数缓存 ≤ 5 min 失效 |
| `BRIEF_RC_DOMAIN_QUALITY_THRESHOLD_RELAXED` | `60` | Domain 配额召回的降级质量分门槛（Issue #684）| 单 Domain 不足配额时在同 Domain 内降到此门槛继续拉，**不跨 Domain HOT 兜底**；调低会污染早报，调高会让早报偏短 | Admin 即时调整 |
| `USER_INTEREST_QUOTA_TOTAL_MAX` | `50` | 用户每日 `Σ quotaPerInterest` 硬上限（Issue #684）| PATCH `/api/users/me/interests/quota` 写入时服务端校验，越界抛 `USER_INTEREST_QUOTA_EXCEEDED` (105404)；运维注意此值**只能增不能减**，调低后存量用户已配置的 quota 总和可能 > 新上限，前端进度条显示 `60/50` 异常 | Admin 即时调整；建议仅在产品语义升级时调整 |
| `FEATURE_NEWSLETTER_V2_ENABLED` | `false` | 精选周刊 v2 重设计（Issue #739）灰度总开关 | 关闭时：前端详情页 `NewsletterPage` 守门 `flags.newsletterV2` 隐藏 AudioStrip / HighlightItem / BlogCtaCard（即使后端已填字段）；`/newsletter/[id]/read` 路由因 `blog.hasReadingView=true` 条件天然 404；`NewsletterMgrService.resolveSendChannel()` 返回 `WEEKLY_DIGEST` 走旧邮件链路 + admin 上传 HTML | Admin 参数配置页 `feature-flags` 分组置 `false` 即时回滚；邮件 channel 立即生效；前端 SWR ≤ 10 min 缓存窗口（`FEATURE_FLAGS_MIN_REFRESH_INTERVAL_MS`）失效后生效，急停可调 `POST /api/admin/parameters/refresh`。已发出邮件无法撤回 |
| `MAIL_ROUTE_EMAIL_NEWSLETTER` | `RESEND,SENDFLARE` | 精选周刊 v2 邮件路由（Issue #739 · 与 MARKETING 同策略避开 CF beta）| 默认双 provider 主备；改 `RESEND` 完全跳过 Sendflare；改 `RESEND,SENDFLARE,CLOUDFLARE` 启用三层兜底（需先确认 CF beta 清洁送达率 ≥ 3 个月） | Admin 参数配置页 `communication` 分组改 → 参数缓存 ≤ 5 min 失效 |
| `USER_INTEREST_QUOTA_DEFAULT_PER_DOMAIN` | `10` | 单 Domain 兜底默认配额（Issue #684）| 仅在用户首次走 Onboarding 但 `inferDomainQuotaFromSources` 解析为空 / 反推失败时由 `DomainCodes.DEFAULT_FALLBACK_QUOTA` 兜底使用；常态用户经 `allocateByWeight` 已分配，不消费此值 | Admin 即时调整；常规无需调整，仅当 8 Domain 数量变更或基线配比改变时联动调整 |
| `INTEREST_QUOTA_BACKFILL_ENABLED` | `false` | `InterestQuotaBackfillJob` 一次性回填 kill switch（Issue #684，**高危一次性 Job**）| 默认 `false` → Job 03:30 cron 触发后直接跳过。置 `true` → 扫描存量用户的 topic 层 `explicitInterests`，反推到 Domain 后平均分配 `quotaPerInterest`。**回填完成后必须手动置回 `false`**，否则每次 cron 都空转扫描 | 运维 SOP：① 置 `_DRY_RUN=true` + `_ENABLED=true` 看日志验证 → ② MongoDB 抽样确认反推逻辑 → ③ 置 `_DRY_RUN=false` 实写 → ④ 跑完置 `_ENABLED=false`。`JobHealthCheckJob.JOB_OVERRIDES` 已登记 1500 min |
| `INTEREST_QUOTA_BACKFILL_DRY_RUN` | `true` | `InterestQuotaBackfillJob` 干运行守卫（Issue #684）| 默认 `true` → 仅日志输出反推结果，不调 `updateQuotaPerInterest` 写库；置 `false` 才真正写入 | 与 `INTEREST_QUOTA_BACKFILL_ENABLED` 配合使用；先 dry-run 验证再切实写 |
| `BRIEF_RC_BUDGET_MODEL_ENABLED` | `false` | Pro 早报预算装配模型灰度开关（Issue #1046）| 默认 `false` → control 走旧三桶加分制（与上线前逐字一致）。经实验 JSON `BRIEF_RC_SCORING_EXPERIMENT_CONFIG` 的 group override `budgetModelEnabled:true` 对 budget 组开启 → 按 `relevance/exploration/discovery` 三段预算切槽（默认 60/25/15）+ featured 保底头条 + 同源硬 cap + rawScore 质量地板 + 类目门控。**所有 #1046 行为改动仅在 budget 路径生效，control 纯净** | Admin 改实验 JSON 即可灰度/回滚；置回 control 组无 override 即秒退旧行为，参数缓存 ≤ 5 min 失效。当日已生成早报不重算，调整次日全效 |
| `BRIEF_RC_FALLBACK_CATEGORY_GATE_ENABLED` | `false` | Pro 早报 fallback 类目门控（Issue #1046 F1，**仅 budget 路径生效**）| 默认 `false`。置 `true` 后 budget 路径剔除领域不匹配的 tag/hot 公共候选（订阅内容与无领域标签内容不受限；用户无领域画像时跳过）。零 AI 订阅用户不再被灌 AI | Admin 参数配置页 `daily-brief` 分组置 `false` 即时回滚，参数缓存 ≤ 5 min 失效 |
| `BRIEF_RC_*`（预算/评分/召回/配额参数组，含 `BRIEF_RC_SUBSCRIBE_BOOST`/`BRIEF_RC_BUDGET_RELEVANCE_RATIO`/`BRIEF_RC_BUDGET_EXPLORATION_RATIO`/`BRIEF_RC_FEATURED_RESERVED_SLOTS` 等） | 见 ConfigKey | 推荐引擎召回/评分/配额/降级/预算参数组（Issue #527 / #1046）| 调整召回量、评分权重、最低条数、三段预算比例等；参数均在 Admin 参数配置页可调 | Admin 即时调整；参数缓存 ≤ 5 min 失效；调 `POST /api/admin/parameters/refresh` 强制刷新 |
| `RSS_HEALTH_THRESHOLDS` | `{"greenDays":30,"redDays":180,"minEntries":3}` | 健康分阈值 JSON（Issue #422）| 调整 GREEN/YELLOW/RED 边界；JSON 解析失败回落 service 内默认值 | Admin 即时调整；dry-run 报表 `redRatio > 5%` 时放宽 `redDays` 或降低 `minEntries` |
| `RSS_DETECT_TIMEOUT_MS` | `8000` | RSS 探测超时（毫秒；连接 + 读取统一；Issue #422）| 调小造成正常站点误判 RED；调大占线程更久 | Admin 即时调整 |
| `RSS_DETECT_HTML_MAX_BYTES` | `1048576` | RSS 响应体最大字节数；超出立即截断防过大响应（Issue #422）| 调小误伤大型 feed；调大放大内存压力 | Admin 即时调整；调大时建议同步缩短超时 |
| `PRIVATE_SOURCE_AUTO_APPROVE` | `false` | 私有源自动审核通过开关（Issue #422 / #473）| 关闭时所有新建私有源走 PENDING 等待管理员审核（v2.2.1 之前默认行为）；开启时 GREEN/YELLOW 健康分私有源直接置 `APPROVED+enabled`，RED 仍被 `PRIVATE_SOURCE_HEALTH_RED` 拦截（依赖 `FEATURE_RSS_HEALTH_SCORE=true` 配套生效） | Admin 参数配置页置 `true`；建议先确认 `FEATURE_RSS_HEALTH_SCORE=true` 且 redRatio ≤ 5%。回滚：置 `false` 即时恢复手工审核 |
| `NEW_SOURCE_FIRST_FETCH_JOB_DISABLED` | `false` | 关闭新增私有源首次拉取兜底 Job 的 kill switch（Issue #473）| 默认 `false` → `NewSourceFirstFetchJob` 每 2 分钟扫描近 1 小时内 `lastFetchTime=null` 的 PRIVATE+APPROVED+enabled 源批量补拉，PostHog 上报 `source_first_fetch_started/completed/failed`；置 `true` → Job 直接 return，已审核源需等下一个 20 分钟主 RSS 调度 | 出现首次拉取压力（如 RSS 站点限流）时置 `true` 临时熔断；问题排除后恢复 `false`。Job 日志双写 `bb_job_execution_log`，`JobHealthCheckJob.JOB_OVERRIDES` 已登记（30 min 心跳） |
| `XGO_CANONICAL_KEY_BACKFILL_ENABLED` | `false` | X 源 canonicalKey 回填 Job Phase A 开关（Issue #483）| 默认 `false`（不回填）。置 `true` → `XgoSourceCanonicalKeyJob` Phase A 扫描所有 `resourceType=TWITTER ∧ canonicalKey=null` 的源，读 `extAttrs.xUserId \|\| twitterUserId` 写 `canonicalKey = xu:{xUserId}`，顺带归一 extAttrs key 名。**回填完成后手动置回 `false`**，防止 Job 空转 | 回填过程中若出现大量 skip（canonicalKey 已被占用），说明存在重复源待 Phase B 处理；Phase A 完成后查询 `canonicalKey=null` 的 TWITTER 源数量趋近 0 即可关闭 |
| `XGO_CANONICAL_KEY_MERGE_ENABLED` | `false` | X 源 canonicalKey 去重合并 Job Phase B 开关（Issue #483，**高危**）| 默认 `false`（不合并）。**建议仅在 Phase A 全部完成后启用**。置 `true` → `XgoSourceCanonicalKeyJob` Phase B 一次性全量扫描活跃 canonicalKey，按 canonicalKey 分组找重复对，每组保留最优主源（X_USER > RSS；同类按 subscriberCount desc、createdTime asc），副源迁移订阅 + tombstone canonicalKey + 禁用（不物理删除）；合并完成推 INFO 告警，有 error 推 WARNING | **高危操作**：合并后副源订阅迁移不可自动回滚（需手动重建订阅）。运行前确认 Phase A 已完成、有监控覆盖。合并完成后置回 `false`，等人工确认无遗留问题后再关注被禁用源的清理 |
| `DAILY_BRIEF_TELEGRAM_PUSH_ENABLED` | `false` | 早报 Telegram 频道推送开关（Issue #558）| 默认 `false` → `TelegramBroadcastJob` 09:00 cron 触发后头部检查跳过，不调 Telegram Bot API。开启时配合 `DAILY_BRIEF_JOB_DISABLED` 双开关（早报子系统总开关）；任一关闭整体跳过 | Admin 参数配置页置 `false` → 下次 cron 立即生效。批量失败 ≥ 50% 走 `internal:telegram-broadcast-batch-failure:{date}` WARNING；Job 异常走 `internal:telegram-broadcast-job-exception:{date}`。`JobHealthCheckJob.JOB_OVERRIDES` 已登记 1500 min（日级容忍 25h） |
| `DAILY_BRIEF_TELEGRAM_BOT_TOKEN` | `""` | Telegram Bot Token（@BotFather 申请）（Issue #558）| 空字符串 → `TelegramBriefPushService` 检查后整批 fail-soft，不调 Bot API；既不走开关检查路径也不写 PostHog 失败事件 | **敏感字段**：admin UI 已标 `password + sensitive: true`。**注意**：Admin API GET 当前明文返回（与 wechatBotApiKey 既有模式一致），admin 账号必须开 2FA |
| `DAILY_BRIEF_TELEGRAM_CHAT_IDS` | `[]` | Telegram 目标 Chat ID 列表（JSON array，频道 `@username` 或数字 ID）| 空列表 → service 头部检查跳过；JSON 解析失败 → log error + 空列表兜底；元素含 null / 字面 `"null"` / 空串均被过滤 | Admin 改后下次 cron 生效；可分批增减 chat 灰度 |
| `DAILY_BRIEF_TELEGRAM_PARSE_MODE` | `"HTML"` | Telegram 推送解析模式（HTML/Markdown/MarkdownV2/留空 = 纯文本）| 透传到 `sendMessage` API；不合规值 Telegram 会 400 拒绝（fail-soft 收 errorCode=400 + description 入告警）| Admin 改后下次 cron 生效；推荐 HTML（兼容性最佳）|
| `USER_BRIEF_DISTRIBUTED_ENABLED` | `false` | UserBriefJob 分布式执行总 kill switch（Issue #775 · #978）| 默认 `false` → Legacy 单实例。`true` → 多节点均分 + **波次拉取**（`USER_BRIEF_WAVE_SIZE`）+ **波次超时**（`USER_BRIEF_WAVE_TIMEOUT_MINUTES`）+ 节点末轮重试；06:40 生成、07:40 邮件（`cron.brief.email`） | 生产建议 `true`（≥4 活跃节点）。`JobHealthCheckJob` `UserBriefJob` 阈值 **65 min** |
| `USER_BRIEF_WORKER_TASK_TIMEOUT_MINUTES` | `50` | 单节点总预算**下限**（分钟）；实际 `min(硬上限,max(下限,估算))` | 节点预算用尽后标 FAILED；勿再用 18 | 线上曾配 60：可改为 **50**（与默认一致即可） |
| `USER_BRIEF_WAVE_SIZE` | `50` | 每波提交线程池的用户数 | 波次独立超时，非整节点一次 latch | 单机 Dify 并发配合 `user-brief.max-size=10` |
| `USER_BRIEF_WAVE_TIMEOUT_MINUTES` | `15` | 单波最长等待（分钟） | 超时任务留待节点末轮重试 | — |
| `USER_BRIEF_HARD_CEILING_MINUTES` | `55` | 单节点生成硬上限（分钟） | 对齐 06:40→07:40 约 60 分钟窗口 | — |
| `USER_BRIEF_MASTER_WAIT_MINUTES` | `65` | 主节点轮询等待全集群完成（分钟） | 须大于单节点硬上限 | — |
| `USER_BRIEF_WORKER_LOCAL_RETRY_ENABLED` | `true` | 单用户处理失败时同节点立即重试一次 | 与节点末轮重试叠加 | 保持开启 |
| `USER_BRIEF_STUCK_SCAN_LIMIT` | `2500` | Master 合并 stuck userId 扫描上限 | 次日 cron 兜底 | 2000 用户档可 **2500**；见下表 |

**UserBrief 运维档位（4 台 admin-api Job 节点、`max-size=10`）**

| 档位 | 建议 ConfigKey | 部署 |
|------|----------------|------|
| **~1000 Pro** | 上表默认值；`USER_BRIEF_DISTRIBUTED_ENABLED=true` | `bestblogs.executor.user-brief.max-size=10`；Dify 峰值并发 ≤ **40** |
| **~2000 Pro** | 同上；或 `USER_BRIEF_WAVE_SIZE=40` 略增波次 | **6～8** 个活跃 Job 节点更稳（4 台不够时双进程/台）；否则依赖末轮重试 + 少量次日 stuck |
| `PRO_BRIEF_BOOTSTRAP_ENABLED` | `false` | Pro 用户即时早报生成 Job 总 kill switch（Issue #683）| 默认 `false` → `ProBriefBootstrapJob` 每 5 min cron 头部检查跳过，新开通 Pro 用户的首份早报等次日 06:50 `UserBriefJob` 批次生成。开启 → 扫 `bb_pro_subscription_log` 最近 30 min `PAID_PERIOD_SYNC/BONUS_GRANTED/ADMIN_GRANT_MONTHS` 事件，对每个新 Pro 用户加锁 `retry-brief:{userId}:{briefDate}`（与 admin retry 路径互斥）→ 并发拉源（≤ 3）→ sleep 60s 等评分 → `UserBriefGeneratorService.forceRegenerate` → PostHog 上报 `pro_first_brief_{generated,failed}`。SLA 目标：付费完成 → 首份早报 ≤ 15 min P95 | Admin 参数配置页 `daily-brief` 分组置 `true` → 参数缓存 ≤ 5 min 失效后生效；回滚置 `false` 立即生效。配套参数 `PRO_BRIEF_BOOTSTRAP_LOOKBACK_MIN`（默认 30，扫描窗口）/ `PRO_BRIEF_BOOTSTRAP_MAX_USERS`（默认 20，单批上限）/ `PRO_BRIEF_BOOTSTRAP_FETCH_CONCURRENCY`（默认 3，拉源并发）。告警双轨：CRITICAL 单用户日内累计失败 ≥ 3 次 `internal:pro-brief-bootstrap-fail:{date}:{userId}` + WARNING 批次 failed/total > 20% 且 total ≥ 5 `internal:pro-brief-bootstrap-fail-rate:{date}`。`JobHealthCheckJob.JOB_OVERRIDES` 已登记 30 min（容忍 6 次连续失败窗口）|
| `PODCAST_RSS_ENABLED` | `false` | Podcast RSS Feed 总开关（Issue #559 · Apple/Spotify）| 默认 `false` → `GET /rss/brief-podcast` 直接返回 503 `Service Unavailable`，不查 DB 不输出 XML | **关闭前确认无 Apple Podcasts 订阅**——连续多天 503 可能触发平台下架警告。回滚路径：Admin 参数配置页置 `false` 立即生效 |
| `PODCAST_RSS_AUTHOR` | `"BestBlogs"` | Podcast 作者（itunes:author，节目级，公开显示）| 影响 Apple Podcasts / Spotify 节目页"作者"字段。空值时 owner_email 回退用此值 | 修改后 24h 内生效（Apple aggregator 缓存）|
| `PODCAST_RSS_OWNER_NAME` | `"BestBlogs"` | Podcast 所有者姓名（itunes:owner/itunes:name；不公开，Apple 联络用）| Apple Podcasts Connect 提交时强制要求；缺失时 Apple 拒绝上架 | 修改后下一次 RSS 抓取生效 |
| `PODCAST_RSS_OWNER_EMAIL` | `""` | Podcast 所有者邮箱（itunes:owner/itunes:email；不公开，Apple 联络用）| **空值时上架 Apple Podcasts 必拒**。⚠️ **隐私警告**：建议用角色邮箱（如 `podcast@bestblogs.dev`）而非个人邮箱——RSS XML 中明文，被订阅者抓取可见 | 启用 `PODCAST_RSS_ENABLED=true` 前必须配置（见 `bestblogs-docs/specs/operations-phase-a.md §6.1 上线 Checklist`）|
| `PODCAST_RSS_IMAGE_URL` | `""` | Podcast 节目封面 URL（itunes:image，≥ 1400×1400 PNG/JPG）| Apple Podcasts 强制要求；建议放 R2 静态资源；URL 非法时 controller log warn 并跳过 image | 上架前必须配置；上架后修改需通过 Apple Podcasts Connect 重新提交 |
| `PODCAST_RSS_CATEGORY` | `"Technology"` | Podcast 主分类（itunes:category）| 影响 Apple Podcasts / Spotify 分类页排序与搜索；Admin UI select 给 5 常用值（Technology/News/Education/Business/Society & Culture），其他 Apple 官方分类需手动填入 | 修改后下次 cron 生效；不影响存量订阅者 |
| `PODCAST_RSS_EXPLICIT` | `false` | Podcast 是否包含成人内容（itunes:explicit）| BestBlogs 默认 false；置 true 会在客户端打 explicit 徽章 | 影响节目级 + 单集级 itunes:explicit 字段 |
| `FILTER_LLM_ENABLED_FOR_ARTICLE` | `false` | 内容流水线文章 filter LLM 开关（Issue #564 / W3 灰度）| **默认 false**（v2.3.0 收紧）：必须先确认 Dify 0-100 schema 已发布 + `FILTER_FLOW_API_KEY` 已配后再开。关闭时 `FilterDecisionService.decide` 直接返回 `DISABLED`，不调 Dify、不写 filterResult，资源直接进 WAIT_ANALYSIS | Admin 参数配置页置 `true` 启用；不影响推文/播客/视频；Dify flow 故障或预算紧张时可单独熔断 |
| `FILTER_LLM_ENABLED_FOR_TWEET` | `false` | 内容流水线推文 filter LLM 开关（入口拦截，Issue #564）| **默认 false**：必须先在 AI 工作流页配置 `TWEET_FILTER_FLOW_API_KEY` 并发布对应 Dify flow 后再开启，否则 Dify 调用会因空 API key 抛 SysException 然后 fail-soft 全量放行（Meter `bestblogs.filter.fallback.count{resourceType=TWITTER}` 持续增量即此原因）| 出问题立即置 `false`：`TwitterEntryStrategy` 直接放行进 WAIT_ANALYSIS，等同 Issue #564 之前行为 |
| `FILTER_LLM_ENABLED_FOR_PODCAST` | `false` | 内容流水线播客 filter LLM 开关（Issue #564，预留）| 当前播客 filter 走时长规则（PODCAST_MIN_DURATION_SECONDS）；置 `true` 在 W3 灰度后视情况启用 | 默认关，无需操作；后续启用前需准备 Dify flow |
| `FILTER_LLM_ENABLED_FOR_VIDEO` | `false` | 内容流水线视频 filter LLM 开关（Issue #564，预留）| 同播客 | 默认关，无需操作 |
| `FILTER_DRY_RUN` | `true` | 内容流水线 filter 灰度观察模式（Issue #564）| **默认 true**：Dify 仍打分并把 `filterResult.value` 写回 `bb_resource`，但 `FilterDecisionService` 输出 `DRY_RUN_REJECT` 后 `FilterHandler` / `TwitterEntryStrategy` 仍推进至 WAIT_ANALYSIS（不 cancel 不 CANCELLED）。第 4 天起置 `false` 启用真实淘汰 | Admin 参数配置页置 `false` → 参数缓存失效后立即生效；切换前**必须**确认 §`specs/content-pipeline-filter.md §8.2` MongoDB query DRY_RUN_REJECT 占比可接受（建议 < 30%） |
| `FILTER_MIN_SCORE_ARTICLE` / `FILTER_MIN_SCORE_TWEET` / `FILTER_MIN_SCORE_PODCAST` / `FILTER_MIN_SCORE_VIDEO` | `30` / `50` / `30` / `30` | 各类型 filter 通过最低分（0-100，Issue #564）| 高于此分进 analysis；调高使更多内容被砍；调低更宽松 | Admin 即时调整；建议先用 MongoDB `bb_resource.filterResult.value` `$bucket` 聚合（详见 `specs/content-pipeline-filter.md §8.2 Query B`）看 quickScore 分布再定阈值 |
| `FILTER_INPUT_SUMMARY_MAX_CHARS` | `200` | Filter Dify 输入摘要截断长度（Issue #564）| 调小降低 prompt 成本但可能损失判断精度；调大增加 token 消耗 | Admin 即时调整 |
| `FILTER_FAIL_SOFT_ALERT_THRESHOLD` | `50` | Filter fail-soft 5 分钟突发告警阈值（Issue #564）| `ServiceHealthAlertJob.checkFilterFallbackBurst` 5 min 窗口 fail-soft 计数 ≥ 阈值触发 WARNING（dedupKey `internal:filter-fail-soft-burst:5min`），提示运维 Dify flow 不可用 | Admin 即时调整；告警过频可调高，告警漏报可调低。**与 `internal:ai-failure-rate:5min` 可能同时触发**（Dify flow 故障是同源故障，两个 dedupKey 各走一条 Bark），优先排查 Dify flow 状态再分别处置。详见 `bestblogs-docs/runbooks/content-pipeline-filter.md` |
| `FILTER_TWEET_BATCH_MAX_SIZE` | `20` | 推文批量初评单批最大条数（Issue #564 批量化）| 同一订阅源的推文一次 Dify 调用最多评多少条，降低逐条调用成本并控制输入体积。调大减少调用次数但可能撑爆 Dify 输入上限；调小更安全但调用更频繁 | Admin 即时调整；`TwitterEntryStrategy` 入口拦截下次 RSS 调度生效 |
| `XGO_SYNC_PRESERVE_USER_CANCEL_ENABLED` | `true` | X 同步取消保留 kill switch（Issue #554）| 默认 `true`：`XgoFollowingsSyncService.subscribeUserToSource` 走 `subscribeXUserSourceFromSync`，CANCELLED 订阅在下一轮同步保持不被覆盖回 ACTIVE（用户主动取消的关注不再被恢复）。置 `false` 时退回旧路径 `subscribeXUserSource()`，CANCELLED 会被重激活（v2.4.5 之前行为）| Admin 参数配置页置 `false` → 参数缓存 ≤ 5 min 失效；仅作事故回滚开关，不建议常态关闭（违反 Issue #554 设计目标） |
| `INACTIVE_THRESHOLD_NEW_SOURCE_DAYS` | `10` | 新源保护期（天，Issue #554 双阈值僵尸判定）| 调大放宽保护期（减少新源误杀，但延后老源 zombie 判定）；调小收紧（可能误杀新建后拉取慢的源）。配合 `INACTIVE_THRESHOLD_ZOMBIE_DAYS=90`：源需同时满足"创建超 10 天 ∧ lastFetchTime 距今 > 90 天 ∧ lastLiveTime 非 null"才判僵尸 | Admin 参数配置页即时调整；下次 RSS 调度（每 20 分钟）生效；如需立即生效调 `POST /api/admin/parameters/refresh` |
| `INACTIVE_THRESHOLD_ZOMBIE_DAYS` | `90` | 僵尸源内容陈旧阈值（天）| 调大延后回收（保留更多 cold 源）；调小激进回收（注意误禁率） | 同上 |
| `ZOMBIE_SOURCE_AUTO_DISABLE` | `true` | 自动禁用低优先级僵尸源开关 | 关闭时 `DistributedTaskCoordinator.autoDisableZombieSources` 跳过；僵尸源仍不参与抓取调度，但 `enabled` 字段保持 true | Admin 参数配置页置 `false` 紧急停用；恢复 `true` 后下一轮调度生效 |
| `ALERT_TELEGRAM_ENABLED` | `false` | 告警 Telegram 备用通道开关（Issue #615）| 默认 `false`：Bark 失败后直接返回 error，不触发 Telegram。置 `true` 后，Bark 推送失败或 Bark 未配置（`BARK_NOTIFICATION_KEY` 为空）时自动 fallback 到 Telegram；需配套 `ALERT_TELEGRAM_BOT_TOKEN` + `ALERT_TELEGRAM_CHAT_ID` | 开启前必须先在 @BotFather 创建 bot 并将其加入目标频道/群组；验证通道可达后置 `true`。回滚置 `false` → 参数缓存 ≤ 5 min 失效后生效 |
| `ALERT_TELEGRAM_BOT_TOKEN` | `""` | 告警 Telegram Bot Token（Issue #615）| 空字符串 → `trySendTelegramFallback` 校验后 fail-soft 跳过，不调 Bot API | **敏感字段**：admin UI 已标 `password + sensitive: true`。**注意**：token 明文返回（与既有模式一致），admin 账号必须开 2FA。格式：`{botId}:{botSecret}` |
| `ALERT_TELEGRAM_CHAT_ID` | `""` | 告警 Telegram Chat ID（频道 @username 或数字 ID，Issue #615）| 空字符串 → fallback 跳过，与 BOT_TOKEN 检查联动。格式：频道填 `@channelusername`（字母+数字+下划线），群组填数字 ID（负数，如 `-1001234567890`）| 修改后参数缓存失效（≤ 5 min）生效；可通过 @getidsbot 获取频道/群组 ID |
| `FEATURE_MARKETING_BROADCAST_ENABLED` | `false` | 邮件营销广播 kill switch（Issue #640）| 关闭时 `MarketingBroadcastAdminController.send` 直接抛 `FEATURE_DISABLED` (109001)；admin sidebar `/marketing-broadcast/new` 入口隐藏；`AdminFeatureFlagController` 返回 `marketingBroadcastEnabled=false` | Admin `marketing` 分组置 `true` 灰度开启；运营完成后建议置回 `false` 防误触发；不影响事务邮件与既有 broadcast 数据 |
| `MARKETING_DEDUP_WINDOW_DAYS` | `7` | 同 campaign 频次锁窗口（天，Issue #640）| 同 `campaignCode` 窗口内对同 userId 二次发送被跳过；0 = 关锁；dryRun 不消耗锁 | Admin 即时调整；运营误发可临时改 0 取消锁 + dryRun 重跑核验，再恢复 7 |
| `MARKETING_BATCH_SIZE` | `200` | 营销广播单批游标大小（Issue #640）| 调小增加调度次数 + Mongo 查询次数；调大可能 OOM / 网关超时 | Admin 即时调整；峰值用户量级 > 50w 时考虑调大至 500 |
| `MARKETING_BROADCAST_FAIL_ALERT_RATIO` | `0.1` | 营销广播失败率告警阈值（0~1，Issue #640）| 一次 campaign 完成后 `failed/total > 阈值` 触发 Bark CRITICAL，dedupKey `internal:marketing-broadcast-fail:{campaignCode}` | Admin 即时调整；调小（如 0.05）更敏感、调大（如 0.2）容忍更多失败 |
| `MAIL_ROUTE_MARKETING` | `RESEND,SENDFLARE` | MARKETING channel 邮件路由（Issue #640）| 主 Resend → 备 Sendflare；**刻意避开 Cloudflare**（CF Email beta 未验证清洁送达率，营销邮件量级大风险敏感） | Admin 即时调整；改 `RESEND` 强制单 provider 排查；改 `SENDFLARE,RESEND` 临时切首选；**禁止把 CLOUDFLARE 放到首位**直至 ≥ 3 个月清洁送达率验证 |
| `NEWSLETTER_DELIVERY_LOG_ENABLED` | `true` | Newsletter per-recipient 投递日志开关（Issue #645）| 默认 `true`：`NewsletterMgrService.sendToTier` 每个收件人先 `upsertPending` 写 `bb_message_delivery_log`，发送后回写 SENT/FAILED；已 SENT 用户跳过防重发；admin `POST /api/admin/newsletter/{id}/retry-failed` 仅重发 FAILED 记录。置 `false` 时整链路回退到旧 boolean 路径（不写日志，全量重发会重复发件），失败定位不可用 | Admin 参数配置页置 `false` → 参数缓存 ≤ 5 min 失效；老数据保留不删；恢复 `true` 后已 SENT 用户继续被跳过，不会重复 |
| `BRIEF_DELIVERY_LOG_ENABLED` | `true` | Pro 早报 per-recipient 投递日志开关（Issue #843）。**默认 `true` 是 kill-switch 语义而非渐进放量**：`EmailBriefChannel.send` 每次发送前 `upsertPending` 写 `bb_message_delivery_log`（channel=EMAIL_BRIEF, businessId=`UserDailyBriefEntity.id`），成功后 `markSent` 记录 providerUsed+providerMessageId 供 webhook 回写。置 `false` 时退化到旧路径：仅写 `UserDailyBriefEntity` 内嵌字段（`emailDeliveryStatus`/`emailSentTime`/`emailFailReason`），无 provider/messageId/attempts 信息；admin `POST /api/admin/brief/retry-failed-emails` 仍可用（扫 entity 字段，不依赖 log）| Admin 参数配置页「邮件相关」分组置 `false` → 参数缓存 ≤ 5 min 失效；老数据保留不删；恢复 `true` 后已 SENT 用户继续被跳过 |
| `DAILY_REVIEW_DELIVERY_LOG_ENABLED` | `true` | 每日回顾 per-recipient 投递日志开关（Issue #843）。**默认 `true` 是 kill-switch 语义**：`DailyReviewEmailService.sendInternal` 每次发送前 `upsertPending` 写 `bb_message_delivery_log`（channel=EMAIL_DAILY_REVIEW, businessId=`UserDailyReviewEntity.id`），成功后 `markSent`。置 `false` 时退化到旧路径：仅写 `UserDailyReviewEntity.{emailDeliveryStatus,emailDeliveredAt,emailDeliveryErrorMsg}` 内嵌字段；admin `POST /api/admin/daily-review/dispatch?mode=RETRY_FAILED` 当前仍扫 entity，v2.5.x 迁移到 log | 同上：Admin 即时切换，参数缓存 ≤ 5 min 失效；老数据不删 |
| `FEATURE_ADMIN_MULTI_ROLE_ENABLED` | `true` | 多管理员体系 kill switch（v2.4.0 · Issue #714）| `@RequireRole(SUPER_ADMIN)` 切面**仍校验 ADMIN 基础权限**但跳过 SUPER_ADMIN 分层（避免 ADMIN 自我提权访问管理员 CRUD）；`@AdminOperation` 切面跳过 `bb_admin_op_log` 落库 | Admin `feature-flags` 分组置 `false` → 参数缓存 ≤ 5 min 失效；已落库 op log 不删；恢复 `true` 立即恢复双档与审计 |
| `ADMIN_OP_LOG_TTL_DAYS` | `90` | 管理员操作流水保留天数（v2.4.0 · Issue #714，**仅展示用**）| 实际 TTL 由 MongoDB `bb_admin_op_log.expireAt` 索引控制，写入时按硬编码 90d 计算 expireAt | 修改此 ConfigKey **不会自动重建索引**：先 `db.bb_admin_op_log.dropIndex("idx_expireAt_ttl")` → 改 `AdminOperationLogService.DEFAULT_TTL_MS` 重启服务 → 再创建新 TTL 索引 |
| `FEATURE_FOLLOW_WORKSPACE_V2_ENABLED` | `true` | 我的关注三列工作台 kill switch（Issue #737）| `/reading/follow` 回退到旧 `ContentListShell + WorkspacePageHeader`（v2.3.x 行为）；`/sources/my?intent=manage` 取消 client-side 跳转，恢复独立管理页。**注意默认 `true` 与项目惯例（功能开关默认 `false`）相反** — 因合并发布 + 设计稿已经过 4 轮 PM 反馈固化，运维 SOP 优先用 kill switch 而非默认关。前端 `useFeatureFlags.defaultFlags.followWorkspaceV2=false` 仅为冷启动 SSR 安全占位。**已知 SWR 缓存延迟**：客户端 `useFeatureFlags` revalidate 间隔最长 10 min；kill switch 关闭后，已经在 `/reading/follow` 的用户最长 10 min 内仍走 v2 UI；建议用户手动刷新即时回退 | Admin 参数配置页「For You 推荐系统配置」分组置 `false` → 参数缓存 ≤ 5 min 失效；告知用户硬刷新或等待 ≤ 10 min。回滚不影响已有数据（无 schema 变更，全部复用现有 API） |
| `APPROVAL_TICKET_TIMEOUT_MINUTES` / `_TELEGRAM_CHAT_ID` / `_TIMEOUT_JOB_ENABLED` | `30` / `""` / `false` | 早报 Top10 审批工单（Epic #759 · #762）。`_TIMEOUT_JOB_ENABLED` 默认 false 灰度，dogfood 3 天后开启 | `_TIMEOUT_JOB_ENABLED=false` → `ApprovalTicketTimeoutJob` 跳过执行，PENDING 工单不被自动回退（灾备 / 演练用）；`_TIMEOUT_MINUTES` 调大放宽审批时长 | Admin 参数配置页「每日早报」分组内「审批超时 Job」置 `false` 紧急停用；`JobHealthCheckJob.JOB_OVERRIDES` 已登记 `ApprovalTicketTimeoutJob` 10 min 阈值 |
| `PUBLISH_TYPEFULLY_ENABLED` / `_TOKEN` / `_SOCIAL_SET_ID` / `_API_BASE` | `false` / `""` / `""` / `https://api.typefully.com` | Typefully 多渠道发布（Epic #759 · #761）。`_ENABLED` 默认 false 灰度；`_TOKEN` 是 sensitive，admin UI 走 `maskSensitive`+sentinel 模式 | `_ENABLED=false` → `TypefullyPublisher.publish` 第一行检查返回 failed result，后端 service 层将任务标 FAILED（不调 API）；其它配置缺失（token / social_set_id）也走相同路径 | Admin 参数配置页 `publish-typefully` 分组置 `false` 紧急停用；失败任务通过 `POST /api/admin/publish/{id}/retry` 手动重试 |
| `CONTENT_REVIEW_TELEGRAM_ENABLED` / `_BOT_TOKEN` / `_CHAT_ID` / `_WEBHOOK_SECRET` | `false` / `""` / `""` / `""` | 高分内容评审推送 Telegram 审核群（Issue #1086 · **专用 bot，与告警 / 早报审批 bot 隔离**）。即时（≥`HIGH_SCORE_NOTIFY_THRESHOLD` 处理完成时 `ResourceEventListener` 与 Bark 并行发卡片）+ 定时（`ContentReviewDigestJob` 每小时 :20 汇总 COMPLETED + qualified=null + ≥阈值）。卡片带 6 个 inline 按钮（+3/+2/-2/-3/标记精选/标记非精选），点击经 `POST /api/admin/webhook/telegram-review` 回调 `RawResourceMgrService` 执行评审，编辑原消息刷新状态行。`_BOT_TOKEN` / `_WEBHOOK_SECRET` 是 sensitive，admin UI 走 `maskSensitive`+sentinel | `_ENABLED=false` → 即时与定时同时停止（监听器 / Job 头部检查跳过）；`_BOT_TOKEN` / `_CHAT_ID` 空 → `ContentReviewTelegramService` fail-soft 跳过；`_WEBHOOK_SECRET` 空 → webhook 拒绝所有回调（fail-closed） | Admin 参数配置页 `运维与集成 → 高分内容评审推送` 分组置 `false` 紧急停用；参数缓存 ≤ 5 min 失效。**初次启用 SOP**：① @BotFather 建 bot 并拉入审核群 → ② 填 `_BOT_TOKEN` / `_CHAT_ID` / `_WEBHOOK_SECRET`（`openssl rand -base64 32`）→ ③ 调 Telegram `setWebhook` 指向 `https://api.bestblogs.dev/api/admin/webhook/telegram-review` 并带 `secret_token`（参考早报审批 bot 的 setWebhook 步骤）→ ④ 置 `_ENABLED=true`。`JobHealthCheckJob.JOB_OVERRIDES` 已登记 `ContentReviewDigestJob` 130 min 阈值 |

### 邮件多 Provider 路由（issue #334）

主开关 `FEATURE_MAIL_ROUTER_ENABLED`：

- 默认 `false` → 所有邮件发送退回单 RESEND adapter（行为等同改造前）
- 置 `true` → 启用 `MailRouterService`，按 ConfigKey `MAIL_ROUTE_<CHANNEL>` 路由表执行多 provider 调度
- 凭证（AWS_SES_*, SENDFLARE_*, CF_EMAIL_*）+ 7 个 channel 路由表（含 #362 新增 `MAIL_ROUTE_DAILY_REVIEW`）+ 告警阈值（`ALERT_MAIL_PRIMARY_FAILURE_COUNT`）通过 admin Settings → 通信与通知配置写入数据库
- 切换 SOP / 灾备演练流程：`bestblogs-docs/runbooks/email-provider-failover.md`
- 监控（Issue #585 后）：仅 Micrometer `bestblogs.mail.call.count{provider,channel,status}` + `bestblogs.mail.call.duration{provider,channel}`；PostHog `mail_provider_call` 已下线，业务粒度的 `brief_email_*` 不变

> **触达通路策略说明**（承接 PRODUCT §6.3）：邮件目前是 Web 端最强的主动触达通路（Phase A 实测打开率 ~33%），但**不锁定为长期首选**。后续 Mobile App / 小程序 / App Push 等多端能力建立后，每个新通路需做实测对比，确认有效触达率后才纳入推送通路评估池。运维不要把「邮件永远首选」当硬约束 —— 新通路有效性验证通过即可调整路由优先级，PRODUCT 层不锁死单一通路。

## 可观测性

### 日志
- 关键路径（API 入口、Job 执行、外部调用）必须有日志
- 日志级别：
  - `ERROR`：异常，需告警
  - `WARN`：降级、重试、边界
  - `INFO`：业务关键事件（Job 启动/完成、用户登录/订阅）
  - `DEBUG`：仅开发环境
- **日志上下文**：`userId` / `resourceId` / `traceId`（有就带）
- **禁止**日志泄露：密码、完整 token、完整 API key、用户邮箱全量（部分脱敏 OK）

### 指标 / 计数
- 新 Job：成功数、失败数、平均耗时
- 新 API：QPS、错误率、P99 延迟（通过现有限流/监控体系）
- 关键业务：订阅激活数、日活、Pro 转化

### 告警
- ERROR 日志触发 Bark（`BARK_NOTIFICATION_URL`）
- Job 连续失败 ≥ 3 次触发 Bark
- 生产事故通过 `deploy/` 下的监控配置升级

### 统一告警 Webhook（自 2026-04 起）

所有监控源（分析平台告警 / 存活监控 / 日志告警）通过 Webhook 汇入自建内部端点，由后端分级分发到通知通道：

**关键字段**：
- `source`：告警来源（分析平台 / 存活监控 / 日志系统 / 内部）
- `level`：`CRITICAL` / `WARNING` / `INFO`（`INFO` 只记日志和分析平台事件，不推送通知）
- `deduplicateKey`：推荐 `{source}:{alertName}:{granularity}`，同键在去重窗口（ConfigKey 可调，默认 600s）内只推一次
- `tags`：附加上下文，会拼到推送内容并作为分析平台事件属性

**降级规则**：
- Redis 去重失败 → 降级为直推（宁多告警不漏）
- Bark 推送失败 → 若 `ALERT_TELEGRAM_ENABLED=true` 且 `ALERT_TELEGRAM_BOT_TOKEN` + `ALERT_TELEGRAM_CHAT_ID` 已配置，自动 fallback 到 Telegram；否则返回错误，不抛异常（Issue #615）
- Bark 未配置（`BARK_NOTIFICATION_KEY` 为空）→ 直接尝试 Telegram 通道
- 分析平台上报失败 → 日志降级，不阻塞主告警路径

### 后端事件上报（自 2026-04 起）

业务 / 应用 / 系统健康事件统一通过后端分析平台上报，与前端事件合并到同一漏斗：

- 事件名引用统一常量，禁止硬编码字符串
- 启用方式：Spring 启动属性控制实现（NoOp vs 真实 Bean），运行时 ConfigKey 随时可关，零重启
- 异步：内部有界线程池，主链路绝不阻塞
- 故障：异常全 catch + warn 日志，调用方不需要 try-catch

### 监控覆盖矩阵

| 维度 | 入口 |
|---|---|
| 业务 / 应用事件（前端 + 后端）| 统一分析平台事件上报 |
| 计数型告警（失败率、成功率、漏斗）| 分析平台告警 → 统一 Webhook |
| 存活 / 端口 / HTTP 心跳 | 存活监控 → 统一 Webhook |
| 日志 ERROR / 慢查询关键字 | 日志告警 → 统一 Webhook |
| Job 执行 | MongoDB 执行日志 + Job 健康检查 |
| 系统健康（Mongo/Redis/JVM）| 健康采样 Job → 分析平台事件 |
| **北极星指标看板**（PRODUCT §7）| PostHog Dashboard 「Pro 用户每日打开『我的早报』数」+ 一线副指标（Pro D7/D30 留存 / Pro 活跃率）+ 二线副指标（X 绑定 / 自有源 / 伴读 / 翻译 / 回顾 / Domain 篇数）。看板埋点事实见 `specs/my-daily-brief.md §9.4`，看板重写跟进 issue 见 `specs/north-star-metric.md` ⚠️ |

> **新北极星 vs v1 NSM**：v1 NSM（WQRL/WDRR）依赖 `FEATURE_CONTENT_READ_TRACKING_ENABLED` 看板（见 §Feature Flag 章节标注），新北极星不依赖该 kill switch。新 NSM spec 重写完成前，两套看板并存观察。

### 调用层阈值告警（自 2026-04 起）

调用层告警 Job 每 5 分钟从 MeterRegistry 读取 AI / TTS 计数器，基于内存快照计算滑窗增量：

- AI 失败率（`(FAILED+TIMEOUT)/total`）超阈值（ConfigKey 可调，默认 0.1）→ WARNING
- TTS 成功率（`SUCCESS/REQUEST`）低于阈值（ConfigKey 可调，默认 0.9）→ WARNING

**降噪策略**：首次采样仅建基线不告警；窗口样本 < 10 不判断；同键在去重窗口内只推一次。

**当前局限**：单节点 MeterRegistry 读取，分布式部署下每节点独立计数；集群级聚合作为后续改进方向。

Counter 埋点：AI 调用（`bestblogs.ai.call.count{provider,status}`）和 TTS 调用（`bestblogs.tts.call.count{provider,status}`）在各自适配器的 try-finally 中写入。

### Job 执行监控（自 2026-04 起 · 2026-05-10 #585 调整为双写）

每次 Job 执行结束后自动双写：

1. **MongoDB 执行日志**（TTL 30 天）：用于故障排查 + traceId 关联，字段含 `jobName / startTime / endTime / durationMs / status / errMsg / traceId / nodeId / hostName`

2. **Micrometer Meter**：计数器 `bestblogs.job.execution.count{job,status}` + Timer `bestblogs.job.execution.duration{job,status}`（P50/P95/P99）

> 原 PostHog `job_execution` 事件（"三写"中的第三写）已于 Issue #585 下线，统一看板改读 DB / Meter。

埋点入口：Job 基类的 `execute()` finally 块（覆盖标准分布式 Job）和 Job 锁注解切面的 `@Around` finally 块（覆盖非继承基类的简单 Job）均自动完成，**无需额外代码**。

Job 健康检查 Job 每 5 分钟扫描：若 Job 最近一次 SUCCESS 时间超过配置阈值（默认 60 分钟，日级/周级 Job 可通过 overrides 登记宽松值），则推 WARNING 告警。从未成功过的 Job 不触发告警（避免新部署误报）。

## 开发时的监控与告警要求（IMPORTANT）

任何涉及外部依赖调用、定时任务、关键业务状态变更的代码改动，必须按本节要求落地可观测性。违反将被 `/deepreview` 的 ops/qa/arch 视角拦截。

### 新增 / 修改 Job（`@Scheduled` 或 Job 基类子类）

- **继承 Job 基类**：`execute()` finally 块已自动三写（MongoDB 执行日志 + Micrometer + 分析平台事件），**无需任何额外代码**。
- **`@Scheduled` + `@HoldJobLock`**：Job 锁注解切面 finally 块同样自动三写，**无需改动**。
- **纯 `@Scheduled`（不继承 + 不加锁）**：显式注入执行记录器并在 finally 调用 `record(...)`。
- **日级 / 周级 / 长周期 Job**：必须在 Job 健康检查 overrides 中登记预期最大静默阈值（分钟），否则 60 分钟默认阈值会误报。
- **禁用开关**：有独立运行语义的 Job 必须配 `*_JOB_DISABLED` ConfigKey，便于出事故时不重部署即停机。

### 新增 / 修改外部调用（AI / TTS / HTTP / 第三方）

调用入口必须 try-finally 双埋：

1. **Micrometer Counter + Timer**：`{module}.call.count{provider,status}` + `{module}.call.duration{provider,status}`
2. **分析平台事件**：引用事件名常量，禁止硬编码字符串
3. **事件目录登记**：新增事件先更新 `specs/observability-event-catalog.md`，再改代码
4. **失败分支**：区分 `SUCCESS` / `FAILED` / `TIMEOUT` / `RATELIMITED`（4xx 限流单独标）；日志级别相应分 `INFO` / `WARN` / `ERROR`

### 新增 / 修改 API 端点

- **公网端点**：默认受内部 Token 验证 + 公网限流过滤器（`/api/*`）；新增端点必须评估是否需要 JWT 保护
- **`/api/internal/*` 内部端点**：由外部监控系统直调，**必须从公网限流过滤器跳过**；缺失会导致告警洪峰被 503 误拦截
- **关键业务端点**：评估是否需要分析平台事件（与业务漏斗看板联动）；明显失败分支（如 Webhook 权益开通失败）必须通过告警分发服务直接触发 CRITICAL 告警

### 新增告警触发

- **统一入口**：必须通过告警分发服务触发，**禁止直接调通知适配层**（绕过去重 + 分析平台事件登记）
- **级别**：
  - `CRITICAL`：任意一次即告警，用于"用户已受影响"的事故（如 Pro Webhook 失败、Job 连续失败）
  - `WARNING`：阈值或滑窗触发，用于"趋势异常"（如 AI 失败率 > 10%、Job 超时）
  - `INFO`：仅记录日志 + 分析平台事件，不触达通知通道
- **`deduplicateKey` 规范**：`{source}:{alertName}:{granularity|param}`；同键在去重窗口（ConfigKey 可调，默认 600s）内只推一次
- **`tags` 字段**：禁止写入用户 PII（email / 完整 userId 可上但脱敏）、禁止写入完整堆栈或连接字符串

### 新增 ConfigKey

- **三处一致性**（硬门禁）：本文件 §ConfigKey 治理已详述
- **默认值保守**：新功能 Feature Flag 默认 `false`；Job 开关默认 `false`（即不禁用）
- **敏感字段**：API Key / Secret 在前端 `configMetadata` 声明 `type: 'password'` + `sensitive: true`

### 新增事件 / 指标命名约定

- **分析平台事件**：`{domain}_{action}[_outcome]` snake_case（`brief_generate_failed` / `ai_call_complete`）
- **Micrometer Meter**：`bestblogs.{module}.{action}.{result}`（`bestblogs.job.execution.count` / `bestblogs.ai.call.duration`）；tag 固定字段 `status` / `provider` / `job` 等

## 运维规约与 on-call 约定

### 日常 / 夜间告警响应

- **通知通道**：主通道 Bark；Bark 失败自动 fallback 到 Telegram（需配 `ALERT_TELEGRAM_ENABLED` + `ALERT_TELEGRAM_BOT_TOKEN` + `ALERT_TELEGRAM_CHAT_ID`）
- **CRITICAL** 级告警：on-call 必须 30 分钟内响应（定位或启动降级）
- **WARNING** 级告警：工作时间 2 小时内响应；夜间可合并处理次日处置
- **INFO** 级告警：只记录，不触达通知

事故响应 SOP（细则见 `runbooks/`）：

1. 收到告警 → 先查 Runbook 匹配
2. 匹配 → 按"缓解"段立即执行，减少用户影响
3. 未匹配 → 按固定 5 段格式现场撰写新 Runbook（现象 / 判断 / 缓解 / 根治 / 验证）
4. 事故处理完成 → 必须回填对应 Runbook 的"历史事件"表；长期根治走独立 Issue

### 告警阈值调整

- 全部通过 `ALERT_*` ConfigKey 动态调整，Admin 后台设置 → 刷新参数缓存（秒级生效）
- 每月 review 一次 PostHog Alerts 误报率；持续误报（> 3 次/周无 root cause）必须调整阈值或静默
- **绝不**直接在代码中硬编码告警阈值（除 fallback 默认值）

### 价值红线 read-only 副本（VISION §8）

以下 5 条是 BestBlogs 的产品红线（来源 `1-VISION.md §8` + `2-PRODUCT.md §11.1`）。**作为 on-call 与运维决策的硬约束**：任何为了拉回北极星 / 缓解告警 / 完成 KPI 的临时调整，触犯下列任一条都必须拒绝：

| 红线 | 在运维决策中意味着 |
|---|---|
| 不以时间消耗为目标 | 禁止通过插入更多内容 / 拉低信息密度 / 延长加载时长拉高阅读时长指标；阅读时长是观察指标不是优化目标 |
| 不替用户完成「阅读、理解、思考、形成判断」这条链 | 任何「AI 替我读完所以不用点开」类型的功能 / 文案 / 推送都不上线；伴读永远是「协助」不是「替代」 |
| 公共策展层质量门槛不向大众化让步 | 公共早报 / 周刊 / 主题 / 内容广场默认排序参数永远以质量为锚；禁止用「热度」「点击率」覆盖编辑精审结果 |
| 不以量取胜 | 不通过暴力扩源 / 暴力扩量稀释质量池；新增源 / 新主题必须经过 §订阅源治理 SOP |
| 不做泛化 AI 工具箱 | AI 能力始终围绕阅读与知识场景；不上线通用对话 / 通用搜索 / 通用写作类入口 |

**操作守则**：
- 任何「为了北极星好看」的运维调整需对照本表自查
- on-call 发现产品 / 运营请求触犯红线，应升级到主开发者拒绝执行
- 红线检查也是 `/release` 阶段 ops-review 视角的必检项

### 紧急降级与关停

| 场景 | 操作 |
|---|---|
| 分析平台后端上报异常拖垮主链路 | `FEATURE_BACKEND_POSTHOG_ENABLED=false` 秒级关停所有后端事件 |
| Wave 1 业务事件埋点异常（不影响其他链路）| `OBSERVABILITY_EVENTS_ENABLED=false` 秒级关停 Wave 1 7 域 17 事件，保留 Daily Brief / Pro / TTS / AI / 系统健康等基础事件 |
| 某 Job 循环失败刷屏 | 对应 `*_JOB_DISABLED=true`（若已配）；否则调大 `ALERT_JOB_NO_SUCCESS_MINUTES_DEFAULT` 降噪 |
| 告警推送洪峰 | 调大 `ALERT_WEBHOOK_DEDUPE_SECONDS`（如 3600s）暂缓 |
| 告警 Webhook 自身故障 | 检查内部 Token 验证日志；临时 fallback 为运维直接查分析平台事件 |
| AI / TTS 调用层大面积异常 | 对应 ConfigKey 调高失败率阈值临时静默 + 关注分析平台 `ai_call_complete{status=FAILED}` 趋势 |
| Wave 2 聚合 Job 异常或写入压力大 | `METRIC_DAILY_AGGREGATE_JOB_DISABLED=true`（直接禁用）或 `FEATURE_METRIC_DAILY_AGGREGATE_ENABLED=false`（dry-run 模式只统计不写） |
| OpenAPI 鉴权失败率告警噪声 | 调高 `ALERT_OPENAPI_AUTH_FAILURE_RATE_THRESHOLD`（默认 0.3）或 `ALERT_OPENAPI_AUTH_FAILURE_MIN_SAMPLES`（默认 20）降低敏感度 |
| Pro grant CRITICAL 误报 | 调高 `ALERT_PRO_GRANT_FAILURE_COUNT`（默认 1）；该告警是任意一次失败即 CRITICAL，调到 2 表示需要连续 2 次才告警 |
| xgo.ing 整体不可用导致 entitlement 持续失败 | `XGO_ENTITLEMENT_SYNC_ENABLED=false` 仅暂停跨产品权益联动（BestBlogs Pro 不受影响）；待 xgo.ing 恢复再回开 + 手动触发 `XgoEntitlementReconcileJob` 补发；详见 `runbooks/xgo-entitlement-recovery.md` |
| xgo.ing 集成被滥用（X OAuth 高频 denied / state_mismatch） | `OAUTH_X_LOGIN_ENABLED=false` 隐藏 X 登录入口（已绑定用户登录路径不变）；同时 `XGO_INTEGRATION_ENABLED=false` 整体停同步直至定位 abuse 源 |
| Wave 3 决策看板入口需要紧急隐藏 | `ADMIN_DASHBOARD_ENABLED=false`（默认 true），sidebar 隐藏入口 + 路由 404 |

### 新环境部署 Checklist

部署前逐项检查：

- [ ] `deploy/.env.example` 中的所有必填变量已在 `.env` 填写
- [ ] MongoDB 已执行 `deploy/init/00_create_indexes.js`（含 Job 执行日志 TTL + 下方 v2.1.0 升级新增的三组索引）
- [ ] **（升级到 v2.1.0+ 时）**重跑 `mongosh "$SPRING_DATA_MONGODB_URI" deploy/init/00_create_indexes.js`：脚本幂等，会新增四组关键索引——
  - `bb_user_translation_log` `(userId, resourceId)` UNIQUE（#333 翻译 v2 用户级去重前置；缺失会让并发 SSE 退化为多次扣费）
  - `bb_webhook_event_processed` `eventId` UNIQUE + `createdAt` TTL 30d（#274 RC webhook 幂等保证）
  - `bb_metric_daily` `(metricKey, date)` UNIQUE + `(metricKey, date desc)` + `expireAt` TTL（#338 Wave 2 决策看板数据载体；缺失会让 `MetricDailyAggregateJob` upsert 失败或写入重复行）
  - `bb_user_op_log` `(opType, opTime desc)` 复合索引（#346 Wave 1.4 行为聚合前置；缺失会让 `MetricDailyAggregateJob.aggregateUserBehavior` 凌晨 02:00 跑批做全表扫描，TTL 90 天数据量积累后会触发 Mongo 慢查询告警；新环境首次部署 collection 为空时建索引快但仍是阻塞门禁）
- [ ] **（升级到 v2.1.1+ 时）**重跑 `mongosh "$SPRING_DATA_MONGODB_URI" deploy/init/00_create_indexes.js` 触发新增索引——
  - `bb_user_mail_unsubscribe` `(userId, channel)` UNIQUE（#362 / #378 Daily Review 邮件退订前置；缺失会导致 `UserMailUnsubscribeRepo.existsByUserIdAndChannel` 全表扫描 + RFC 8058 List-Unsubscribe POST 在并发场景下产生重复退订记录）
- [ ] **（首次部署 Topic Pages 或升级到 v2.1.0+ 时）**执行 `mongosh "$SPRING_DATA_MONGODB_URI" deploy/init/03_create_topic_indexes.js`（#266 主题集合索引；幂等，对存量 Topic collection 安全）
  - **v2.1.3+ 重跑**：脚本新增 `idx_zh_status_published` / `idx_en_status_published`（不带 type 前缀，服务 sitemap `findAllPublished` 全量查询，避免新增类型后退化为全表扫描，#397 PR-1）+ `idx_pinned_published` sparse 索引（覆盖 `pinnedOrder != null` 的置顶主题，配合 `TopicMongoRepo.pageQuery()` Aggregation `$addFields { _pinnedSortKey }` null-last 排序，#397 PR-2/3）
- [ ] **（首次部署 ES 写入或升级到 v2.1.0+ 时）**执行 `ENV=prod ES_HOST=... bash deploy/init/04_create_es_indexes.sh`（#330 ES 三索引：ResourceDocument 39 字段 + SourceDocument 15 字段 + UserProfileDocument，含 vector(1536)）。索引创建后再开 `FEATURE_ES_WRITE_ENABLED=true`，避免写入指向不存在的索引
- [ ] 存活监控按对应 checklist 配置完 Webhook
- [ ] 分析平台后端 API Key 已配置，启用前先验证样本事件
- [ ] 分析平台告警规则按 checklist 配置完毕，指向统一 Webhook 端点（`runbooks/posthog-alerts-checklist.md` 含 Wave 2 OpenAPI 鉴权失败率告警入口确认）
- [ ] 通知推送已在测试账号上验证到达
- [ ] 关键 Runbook 在新环境上走一次演练
- [ ] **（升级到 v2.0.14+ 时）**执行 `mongosh "$SPRING_DATA_MONGODB_URI" deploy/init/05_backfill_api_key_caller_type.js` 给存量 OpenAPI Key 回填 `caller_type=external_api`（一次性，幂等；新环境首次部署 collection 为空时跳过）。运行后 Redis 中已缓存的 ApiKey 元数据需等 1h TTL 自然失效，或 admin UI 触发刷新；fallback 期间 `callerType` 字段读 `external_api`，功能不受影响。
- [ ] **（升级到 v2.0.14+ 时）**`POSTHOG_HASH_USER_ID_KEY` 在 admin 后台 → 可观测性分组中配置（`openssl rand -base64 32`）；空值降级为裸 SHA256，可被彩虹表反查；旋转密钥后旧 `hashedUserId` 与新值断链，需配合 PostHog 用户合并操作。
- [ ] **（升级到 v2.2.0+ 时）**重跑 `mongosh "$SPRING_DATA_MONGODB_URI" deploy/init/00_create_indexes.js`：脚本幂等，会新增以下索引——
  - `bb_mobile_refresh_token` `expiresAt` 索引（#355/#404 `MobileRefreshTokenCleanupJob` 每日 03:00 按到期时间删除，缺失全表扫描）
  - `bb_mobile_refresh_token` `userId` 索引（revokeAllByUserId / findByUserId 常用路径）
  - `bb_oauth_state` TTL 索引（#382 X OAuth PKCE 状态 10min 自动清理）
  - `bb_user_xgo_binding` userId / xUserId / bindStatus+lastSyncedAt 三组索引（#382 xgo.ing 集成）
  - `bb_xgo_entitlement_retry` eventId / status+nextRetryAt / userId+action+status / expireAt TTL 四组索引（#382 entitlement 重试队列）
- [ ] **（升级到 v2.2.0+ 时）**在 Admin 后台配置 xgo.ing 集成参数（`OAUTH_X_CLIENT_ID` / `OAUTH_X_CLIENT_SECRET` / `OAUTH_X_REDIRECT_URI`），写入后方可开启 `OAUTH_X_LOGIN_ENABLED` 和 `XGO_INTEGRATION_ENABLED`；两者均默认 `false`，不配置不生效
- [ ] **（升级到 v2.2.0+ 时）**RSS 健康分默认关闭（`FEATURE_RSS_HEALTH_SCORE=false`）；上线后先跑 dry-run 回测（`POST /api/admin/source/health-score-backfill/run?dryRun=true`），确认 `redRatio < 5%` 再调阈值、开总开关
- [ ] **（仅历史信息，v2.3.0 已完成生产迁移）**Onboarding V2 上线期间曾依赖三套 category 归一化脚本（`07_migrate_source_category.js` / `08_backfill_category_alias.js` / `09_migrate_source_category_to_primary_code.js` / `10_migrate_interest_tag_category_to_primary_code.js`），它们均在 2026-05-12 一次性跑过并归并到 `06_migrate_interest_tag_category_to_primary_code.js`。当前 `deploy/init/` 仅保留 00-06 六个脚本。**新环境首次部署**直接重跑 `00_create_indexes.js` + `06_migrate_interest_tag_category_to_primary_code.js` 即可；如果接管的 DB 还残留旧 `bb_resource_source.category` 短码（如 `Tech/Programming`），需要手动按 `bb_category_config.code` 重命名，或从 git 历史 `git show 029aeb6d7~1:deploy/init/07_migrate_source_category.js` 恢复脚本临时执行。
- [ ] **（升级到含 Issue #645 的版本时）**重跑 `mongosh "$SPRING_DATA_MONGODB_URI" deploy/init/00_create_indexes.js`：脚本幂等，会新增 `bb_message_delivery_log` 的四组索引（`(channel,businessId,userId)` UNIQUE 幂等键 + `(businessId,status)` retry-failed 扫描 + `(channel,status,createdTime)` 全局观测 + `providerMessageId` sparse 预留 webhook 关联）。**缺失会导致 Newsletter retry-failed 走全表扫描且 UNIQUE 幂等失效，并发发送时可能重复发件**。无 TTL（审计保留 ≥1 年，待量大再评估补 TTL）。
- [ ] **（升级到含 Issue #714 / v2.4.0 的版本时）**两步：
  1. 先重跑 `mongosh "$SPRING_DATA_MONGODB_URI" deploy/init/00_create_indexes.js`：会创建 `bb_admin_op_log` 的 4 组索引（`(adminUserId, opTime DESC)` 按管理员翻页 + `(action, opTime DESC)` 按动作 + `(targetType, targetId, opTime DESC)` 按对象 + `expireAt` TTL 90 天）。**缺失 TTL 索引时审计日志将永不清理，长期运行会撑爆磁盘**。
  2. 再执行 `mongosh "$SPRING_DATA_MONGODB_URI" deploy/init/07_migrate_super_admin_v240.js`：把存量唯一 ADMIN 用户升级为 SUPER_ADMIN（同时保留 ADMIN 兼容 `isAdmin()`）。脚本幂等：已有 SUPER_ADMIN 时跳过；无 ADMIN 时跳过（initAdmin 流程会直接创建 SUPER_ADMIN）；存在 ≥2 个 ADMIN 时**仅打印列表不自动决策**，需人工指定首位 SUPER_ADMIN（脚本输出 `db.bb_user.updateOne` 命令）。
  3. 验收：登录 admin → 任意写操作 → `db.bb_admin_op_log.find().sort({opTime:-1}).limit(5)` 应看到记录。

## 灰度与回滚

### 灰度发布清单

| 步骤 | 方式 |
|---|---|
| 1. 内部账号验证 | 通过 `user.flags` 或手工数据库置位 |
| 2. 小比例（1%-10%）| `FeatureFlagService` + 用户哈希 |
| 3. 放量（50%）| 同上，调整比例 |
| 4. 全量（100%）| 直接 Flag ON |
| 5. 移除 Flag | 稳定 2+ 版本后清理代码 |

### 回滚 SOP

**优先级**：Feature Flag off > ConfigKey 调整 > 数据库回滚 > 代码部署回滚

1. **Feature Flag off**：后台把 Flag 置 `false`，秒级生效。
2. **ConfigKey 调整**：如调高阈值、禁用 Job、缩短超时。
3. **数据库回滚**：仅在已知数据损坏时；必须有备份。
4. **代码部署回滚**：最后手段，分钟级，涉及中断。

每个大需求上线必须在 release PR 里声明"回滚预案"（属于哪一级 + 具体操作）。

### Mobile 回滚 SOP（iOS + Android）

**Mobile 回滚比 Web 昂贵：App Store / Play Store 审核需数小时到数天。优先级**：

1. **后端 Kill Switch**（秒级 · 首选）
   - 管理后台把 `FEATURE_MOBILE_APP_ENABLED` 置 `false`
   - `GET /api/v2/mobile/config` 将返回 `enabled=false`
   - App 启动时读到会显示升级提示 / 功能禁用横幅（#276 交付）
2. **按功能级 ConfigKey 关闭**（秒级）
   - `MOBILE_IAP_ENABLED` / `MOBILE_REVENUECAT_WEBHOOK_ENABLED` / `MOBILE_PUSH_DELIVERY_JOB_DISABLED`
   - `MOBILE_SIGN_IN_APPLE_ENABLED` / `MOBILE_SIGN_IN_GOOGLE_ENABLED`（JWKS 故障熔断）
   - `MOBILE_REFRESH_TOKEN_TTL_DAYS`（安全事件时动态缩短）
   - webhook / 推送 Job 可独立停止
3. **EAS Update OTA 回滚**（分钟级）
   - 仅能修复 JS/资源 bug，不能改 native 代码
   - `eas update --republish --channel <channel> --group <prev-group-id>`
   - 必须前置：`runtimeVersion.policy = 'appVersion'` + 代码签名（Plan #9 启用）
4. **App Store Phased Release 暂停**（小时级）
   - App Store Connect → My Apps → Version → Pause Phased Release
   - 停止 7 天梯度放量（1% / 2% / 5% / 10% / 20% / 50% / 100%）
5. **紧急下架**（最后手段 · 需 Apple Expedited Review）
   - App Store Connect → Remove from Sale
   - Expedited Review 申请解释使用场景（P0 bug 通常 24h 内审批）
   - Android：Play Console → Production → Halt rollout

**决策树**：
- JS 层 bug 可修 → EAS Update OTA
- Native 层 bug → Kill Switch 第一时间止血 + 紧急重新提审
- 不可修 bug（如支付链路断裂）→ Kill Switch + 暂停 Phased Release

详细 Runbook 与演练记录由 Plan #9 (#276) 补齐。

## 功能专项：内建翻译（Content Translate v2）

*Issue #333（v2 · v2.0.14）· 设计 `specs/content-translate-v2.md`（取代已 deprecated 的 `archive/specs/content-translate.md`）*

### Feature Flag

- 主开关：`FEATURE_CONTENT_TRANSLATE_ENABLED`（默认 `false`，全量上线前必须显式开启）
- v2 灰度开关（默认 `true`，**生产首次上线建议手动改 `false` 跑 1 天观察**）：
  - `CONTENT_TRANSLATE_DEDUP_BY_USER_RESOURCE_ENABLED` — 同用户同资源仅扣费一次
  - `CONTENT_TRANSLATE_PODCAST_PRO_ONLY` — 播客转录翻译仅 Pro 用户可用
  - `CONTENT_TRANSLATE_VIDEO_PRO_ONLY` — 视频转录翻译仅 Pro 用户可用
- 容量与速度参数：
  - `CONTENT_TRANSLATE_PARAGRAPH_CONCURRENCY`(3) — 段落级并发（v2.1 接入）
  - `CONTENT_TRANSLATE_MODEL_LONG_TEXT`(`gpt-5.4-mini`) — 长文本（音视频转录）模型
  - `CONTENT_TRANSLATE_SSE_LONG_IDLE_TIMEOUT_MS`(180000) — 长文本 SSE 空闲超时
- v1 原有：`CONTENT_TRANSLATE_FREE/PRO_DAILY_QUOTA`、`CONTENT_TRANSLATE_MODEL_DEFAULT/FALLBACK`、`CONTENT_TRANSLATE_QUOTA_REFUND_WINDOW_MS`、`CONTENT_TRANSLATE_FREE_PREVIEW_PARAGRAPHS`、`CONTENT_TRANSLATE_CACHE_TTL_DAYS` 不变

### 灰度阶梯（v2 推荐）

| 阶段 | 目标 | 进入条件 | 观察窗口 | 关键阈值 |
|---|---|---|---|---|
| Stage 0 · v2 上线 D0 | **DEDUP 已默认开启**（fix/333 起默认值=true）；PODCAST/VIDEO Pro Only 开启。若需观察期先关闭 DEDUP，手动在 Admin 将 `CONTENT_TRANSLATE_DEDUP_BY_USER_RESOURCE_ENABLED=false`，观察 24h 后再改回 true。 | PR 合入 + 索引脚本 `00_create_indexes.js` 已执行（确认 `bb_user_translation_log` 唯一索引存在；**若索引缺失则必须先将 DEDUP 置 false，否则并发场景产生重复扣费**） | 24h | dedup.first_charge ≥ 0（默认开启态）、dedup.rollback_failed=0 |
| Stage 1 · DEDUP 验证 | 确认 dedup 运行稳定（如 Stage 0 手动关闭过则切回 `CONTENT_TRANSLATE_DEDUP_BY_USER_RESOURCE_ENABLED=true`） | Stage 0 无异常 + 双向 prompt + 播客/视频翻译稳定 | 48h | dedup.cache_hit/first_charge ≥ 0.3（30% 以上为复访场景）、rollback_failed=0 |
| Stage 2 · 10% Pro 灰度 | 按 userId hash 分桶 | Stage 1 所有阈值达标 | 72h | Pro 当日扣费中位数 ≤ 5（dedup 后远低于 v1 的 10）、缓存命中率 ≥ 40% |
| Stage 3 · 50% | 含部分 Free 账号 | Stage 2 阈值 + 人工抽检 10 篇译文合格 | 72h | Free 配额耗尽后 `content_translate_quota_blocked` 漏斗可见 |
| Stage 4 · 全量 | Flag 置 true | Stage 3 转化漏斗满足预期 | 7d | SSE error 率 < 1% |

### 部署前检查（v2 上线必做）

1. **运维执行索引脚本**：`mongosh ... deploy/init/00_create_indexes.js`，确认 `bb_user_translation_log` 出现 `idx_user_resource` 唯一索引。**若缺失**，dedup 在并发场景下退化为多次扣费。
2. **Tweet Translate Flow prompt 调整**：Dify Studio 中删除"翻译 content body"指令，仅保留 title/summary/tags 翻译；staging 跑 50 条样本对比，确认 `zhSummary` 输出未降级后再切 prod。
3. **顺序**：先部署后端（`FEATURE_CONTENT_TRANSLATE_ENABLED=false`）→ 切 Dify Prompt → 灰度打开 Flag。

### 关键指标（Micrometer，前缀 `bestblogs.content_translate.*`）

| 指标 | 类型 | 健康阈值 | 说明 |
|---|---|---|---|
| `attempt` | Counter `is_pro,target_lang,direction` | —（趋势观察）| 每次 SSE 连接建立（v2 新增 direction 维度） |
| `cache.hit` | Counter `target_lang` | 命中率 ≥ 40%（Stage 2 后）| 某段命中已缓存译文 |
| `llm.latency` | Timer `model,rejected` | p95 < 15s | LLM 调用耗时 |
| `post_filter.reject` | Counter `reason` | 占 LLM 调用 < 3% | reason=`tag_leak:*` / `output_too_long` / `empty_output` / `lang_mismatch:*`（v2 新增） |
| `free_preview.locked` | Counter | —（Free 转化信号）| Free 用户某段被 preview 限制锁定 |
| `quota.exceeded` | Counter `is_pro` | Free `is_pro=false` 占主 | 当日配额超限 |
| `lock.renew_failed` | Counter | 极低（< 0.1%）| 分布式锁续租失败，翻译中断 |
| **`dedup.first_charge`**（v2 新增）| Counter `resource_type,is_pro` | —（趋势观察）| 用户首次为某资源扣费 |
| **`dedup.cache_hit`**（v2 新增）| Counter `resource_type` | 上线一周后稳定增长 | 用户复访已扣费资源（跳过 quota 扣减） |
| **`dedup.rollback`**（v2 新增）| Counter | 占 first_charge 比例 < 5% | quota.consume 失败 / 退款窗口内 abort 触发的 log 回滚 |
| **`dedup.rollback_failed`**（v2 新增）| Counter | **必须为 0**；> 0 立即告警 | rollback 自身 DB 失败 → log 残留 → 用户被误判已扣费、获得免费翻译 |

前端漏斗（PostHog）：`content_translate_toggle` → `content_translate_free_locked_view` → `content_translate_quota_blocked` → `pro_checkout_click`。

### 日志关键字（`grep` 排障用）

- `触发翻译 SSE` — 每次连接建立
- `翻译业务错误` — BizException（配额超限 / Pro 专属 / 内容未找到 / 语言不符 等）
- `翻译 SSE 异常` — 未预期异常（需立即排查）
- `译文被 post-filter 拒绝` — 模型输出触发三层防御（含 v2 语言合规检查）
- `翻译扣费 dedup 命中` — 用户复访已扣费资源（信息级别）
- `dedup 状态不一致：consume 失败后 rollback 也失败` — **CRITICAL**，必须人工介入清理 `bb_user_translation_log`
- `翻译扣费记录回滚失败（dedup 状态可能不一致，需运维介入）` — 同上等价日志
- `分布式锁获取成功: key=translate:lock:` — 锁持有 / 释放轨迹

### 回滚 SOP（按优先级）

1. **DEDUP 灰度回退**（秒级）：Admin → 设置 → `CONTENT_TRANSLATE_DEDUP_BY_USER_RESOURCE_ENABLED=false` → 刷新参数缓存。回到按次扣费的 v1 行为。`bb_user_translation_log` 已有数据保留但不再被读，无副作用。
2. **Pro Only 灰度回退**：`CONTENT_TRANSLATE_PODCAST_PRO_ONLY=false` 或 `CONTENT_TRANSLATE_VIDEO_PRO_ONLY=false` 立即放开 Free 用户访问（注意会消耗更多 LLM 成本）。
3. **Feature Flag 关闭**（秒级）：`FEATURE_CONTENT_TRANSLATE_ENABLED=false` → 前端入口消失。
4. **单模型降级**：若默认模型故障，改 `CONTENT_TRANSLATE_MODEL_DEFAULT` 或 `CONTENT_TRANSLATE_MODEL_LONG_TEXT` 到其他可用模型。
5. **压缩配额**：临时下调 Pro 每日配额，配合 LLM 成本爆炸场景。
6. **缓存全量失效**：生产事故下需刷新所有译文时，drop `bb_content_translation` collection（注意：会立即失去共享命中）。日常不需要——`contentVersion` 已处理单篇失效。
7. **手动清理用户翻译扣费记录**：用户投诉"未翻译却被扣费"时，DBA 执行 `db.bb_user_translation_log.deleteOne({userId: '<uid>', resourceId: '<rid>'})`；同时同步退还 quota：`db.bb_content_translate_quota.updateOne({userId, date}, {$inc:{usedCount: -1}})`。

### 故障速查

| 症状 | 可能原因 | 操作 |
|---|---|---|
| 前端按钮不显示 | Feature flag 未开 / 翻译相关配置未刷缓存 | Admin 刷新参数缓存，浏览器硬刷新 |
| 所有段 `error=true, reason=waiter_timeout` | 持锁连接异常（LLM 卡死 / 虚拟线程 OOM）| 查日志分布式锁获取后是否有对应释放；必要时手动删除对应 Redis 锁 key |
| 所有段 `error=true, reason=tag_leak:*` 或 `lang_mismatch:*` | 模型输出失控 / 方向偏离（如 zh 目标输出英文）| 立即切 `CONTENT_TRANSLATE_MODEL_DEFAULT` 到已知可靠模型；若仅 lang_mismatch 持续，检查 prompt 模板 |
| Free 用户首次播客/视频翻译被拒（错误码 171005）| Pro Only 灰度生效（默认 true）| 正常；前端 toast 含 Pro CTA 按钮，引导升级 |
| `dedup.rollback_failed > 0` | quota.consume 失败 + log rollback 也失败（DB 写不可用） | **CRITICAL** — 立即告警；按"回滚 SOP §7"手动清理 log 残留 |
| `dedup.cache_hit` 异常高（> 80%）| 灰度刚开启时正常（存量复访集中）；持续高位需评估是否产品形态偏向"反复阅读固定材料" | 监控趋势，结合内容消费多样性指标判断 |
| 同一用户 200ms 内两次触发，都被扣配额 | DEDUP 灰度未开（按次扣费 v1 行为）| 检查 `CONTENT_TRANSLATE_DEDUP_BY_USER_RESOURCE_ENABLED`；若已开仍现，查 user_translation_log 是否被异常清理 |
| `content_translate.quota.exceeded` 暴涨 | Free 当日放量 / 配额过紧 | 检查 Pro 转化漏斗：若 `pro_checkout_click` 同步涨 = 符合预期；否则上调 Free 配额 |
| 中文文章翻译为英文质量差 | post-filter `lang_mismatch:en` 高 | 检查 source language 推断（resource.language 是否为 zh_CN）；考虑切换 `CONTENT_TRANSLATE_MODEL_DEFAULT` 至更擅长 zh→en 的模型 |

## 功能专项：Mobile AI 伴读（Issue #327）

*Issue #327 · 设计 `specs/mobile-app.md §14.2` + `archive/specs/mobile-app-plan.md §#327`*

### Feature Flag

- **主开关**：`MOBILE_AI_READER_FEATURE_ENABLED`（默认 `false`，全量上线前必须显式开启）
- **下发链路**：服务端 `MobileConfigController.config()` 把 `aiReaderFeatureEnabled` 字段写入 `GET /api/v2/mobile/config`，客户端启动时拉取 + React Query staleTime 5 分钟
- **关闭行为**：客户端不隐藏 `AskAICapsule` 入口，进入伴读屏后显示『敬请期待』占位（保留功能感知）；后端 `featureFlagHelper.assertFeatureEnabled` 同步兜底拒绝（403 + `code=FEATURE_DISABLED`）
- **相关 ConfigKey（共 7 项 · 三处一致）**：`MOBILE_AI_READER_RATE_LIMIT_PER_MINUTE`(5) / `_PER_DAY`(50) / `MAX_TURNS`(3) / `MODEL`(`claude-sonnet-4-6`) / `SYSTEM_PROMPT`(空时 fallback) / `ARTICLE_MAX_CHARS`(8000)

### 灰度阶梯（推荐）

| 阶段 | 目标 | 进入条件 | 观察窗口 | 关键阈值 |
|---|---|---|---|---|
| Stage 1 · 内测（≤ 20 人）| 内部测试账号通过 TestFlight 拿到打包；Admin 全局打开 Flag，靠 App 分发管控范围 | PR 合入 + Filter 单测绿 + Service 测试绿 | 48h | LLM 错误率 < 5%、首 token P95 < 8s、`mobile_ai_reader_rate_limit_block_total` 无暴涨 |
| Stage 2 · 10% App Store Phased Release | 第 1 天 1% → 第 2 天 10% | Stage 1 阈值达标 + 0 Bark 告警 | 48h | `bestblogs.mobile_ai_reader.call.count{status=FAILED}` 占比 < 5%、`call.duration{status=SUCCESS}` P95 < 8s、限频命中率 < 20% |
| Stage 3 · 全量 | Phased Release 100% | Stage 2 阈值满足 + 人工抽检 5 段对话语种 / prompt 一致 | 7d | SSE error 占比 < 1%、日成本 < $500 |

### 关键指标（Micrometer · 前缀 `bestblogs.mobile_ai_reader.*` 与 `mobile_ai_reader_*`）

| 指标 | 类型 | 健康阈值 | 说明 |
|---|---|---|---|
| `bestblogs.mobile_ai_reader.call.count{status}` | Counter | `status=FAILED` 占比 < 5% | LLM 调用结果（SUCCESS/FAILED/BIZ_REJECTED）。**关键**：本指标由 `MobileAiReaderService` 直接写入，不依赖 `LlmStreamClient`（其当前不写 Meter） |
| `bestblogs.mobile_ai_reader.call.duration{status}` | Timer | P95 < 8s | 端到端调用耗时 |
| `mobile_ai_reader_rate_limit_block_total{quota}` | Counter | 命中率 < 20% | per-user 限流命中（`per_minute` / `per_day`） |
| `mobile_ai_reader_rate_limit_redis_error_total` | Counter | 任意非零 = WARNING | Filter 限流计数 Redis 故障 fail-open 次数（影响防刷） |

PostHog 事件（前后端联合漏斗 · 详见 `specs/observability-event-catalog.md §6`）：
- 后端：`mobile_ai_reader_ask_started` → `_completed` / `_error` / `_rate_limited`
- 前端：`mobile.ai_reader.ask_submit` → `_first_token` → `_completed` / `_aborted` / `_rate_limited`

### 日志关键字（`grep` 排障用）

- `[mobile-ai-reader] 启动流式回答` — 每次请求进入 Controller
- `[mobile-ai-reader] LLM 流式调用出错` — onError 回调（LLM 服务异常）
- `[mobile-ai-reader] 业务异常` — BizException（feature disabled / pro required / turn 超限 / 文章不存在）
- `[mobile-ai-reader] 限流命中` — Filter 拦截（含 quotaType / userId / count / limit）
- `[mobile-ai-reader] Redis 计数异常，降级放行` — Redis 故障 fail-open（关注限流降级风险）

### 回滚 SOP（按优先级）

1. **Feature Flag 关闭**（秒级）：Admin → 设置 → Mobile 分组 → `MOBILE_AI_READER_FEATURE_ENABLED=false` → 刷新参数缓存。客户端走『敬请期待』；后端 `assertFeatureEnabled` 立即拒绝。
2. **模型降级**：若 `claude-sonnet-4-6` 不可用，改 `MOBILE_AI_READER_MODEL` 为其他可用 OpenAI 兼容模型（运行时生效，无需重部署）
3. **压缩配额**：临时下调 `_PER_MINUTE` / `_PER_DAY` 阈值，限制成本爆炸场景
4. **代码回滚**：worktree base = `v2.0.14`，必要时 revert PR commit；本变更不引入 schema 迁移、不破坏既有 `/api/reading/*` 路径

### 故障速查

| 症状 | 可能原因 | 操作 |
|---|---|---|
| Pro 用户进入伴读屏看到『敬请期待』 | Flag 关闭 / mobile config 缓存未刷 | 检查 `MOBILE_AI_READER_FEATURE_ENABLED`；客户端杀进程或等待 staleTime |
| 大面积 LLM 失败但 Bark 无告警 | LLM 失败率告警未配 / Meter 未读取 | 配 PostHog Alerts 监听 `mobile_ai_reader_ask_error` 事件计数；或扩展 5 分钟健康巡检 Job 读取 `bestblogs.mobile_ai_reader.call.count{status=FAILED}` |
| 用户反馈"明明今天没问几次就被限频" | per_day Redis key 跨 UTC 自然日衔接、或限频默认值过低 | 检查 `MOBILE_AI_READER_RATE_LIMIT_PER_DAY`；查 Redis key `bb:{env}:user:rl:mobile_ai_reader_ask:{userId}:1d:*` 当前计数 |
| `mobile_ai_reader_rate_limit_redis_error_total` 暴涨 | Redis 实例故障 / 网络不稳 | 走 Redis 故障 runbook；Filter 已 fail-open 不会拒绝用户但防刷暂时失效 |
| iPad 横屏布局错乱 | 全局 portrait lock 在 iPad 仍可能被覆盖 | 验证 `app/_layout.tsx` 的 `ScreenOrientation.lockAsync`；Mobile UI 复审 |

## 功能专项：Mobile Auth（Issue #355）

*Issue #355 · Wave 1 技术债消化 · 依赖 `specs/mobile-app.md §6~§7`*

### Feature Flag / ConfigKey

| Key | 默认值 | 说明 |
|---|---|---|
| `FEATURE_MOBILE_APP_ENABLED` | `false`（生产启用前需手动置 `true`）| 全局 Kill Switch，false 时所有 `/api/v2/auth/mobile/*` 返回 `MOBILE_APP_DISABLED` |
| `MOBILE_SIGN_IN_APPLE_ENABLED` | `true` | Apple Sign In 熔断开关 |
| `MOBILE_SIGN_IN_GOOGLE_ENABLED` | `true` | Google Sign In 熔断开关 |
| `MOBILE_REFRESH_TOKEN_TTL_DAYS` | `30` | Refresh token 有效天数（安全事件时可临时缩短） |
| `MOBILE_REFRESH_TOKEN_GRACE_SECONDS` | `30` | Refresh token rotation 宽限窗口（秒） |
| `MOBILE_LINKING_CHALLENGE_TTL_SECONDS` | `300` | Account Linking challenge Redis TTL |
| `MOBILE_REFRESH_TOKEN_CLEANUP_JOB_DISABLED` | `false` | 每日 03:00 清理过期 token 的 Job 开关 |
| `MOBILE_CREEM_RC_BRIDGE_ENABLED` | `false` | Creem→RevenueCat 桥接开关 |

### 关键路径监控

PostHog 事件（详见 `specs/observability-event-catalog.md §12.3`）：

| 事件 | 说明 | 健康阈值 |
|---|---|---|
| `mobile_login_success` | 登录成功（含 provider / isNewUser 维度） | 无骤降 |
| `mobile_logout` | 登出（含 scope=device/all） | 正常 |
| `mobile_delete_account` | 账号删除（不可逆） | 异常峰值需告警 |
| `mobile_linking_started` | Account Linking 发起 | 正常 |
| `mobile_linking_completed` | Account Linking 完成 | 正常 |

Job 健康：

```bash
mongosh "$SPRING_DATA_MONGODB_URI" --eval "
  db.bb_job_execution_log.find(
    { jobName: 'MobileRefreshTokenCleanupJob' },
    { startTime: 1, status: 1, errMsg: 1 }
  ).sort({ startTime: -1 }).limit(5);
"
```

### 应急 Runbooks

| 场景 | Runbook |
|---|---|
| Apple Sign In 故障 | `runbooks/mobile-auth-apple-outage.md` |
| Google Sign In 故障 | `runbooks/mobile-auth-google-outage.md` |
| Refresh Token 重放攻击 | `runbooks/mobile-auth-reuse-detected.md` |
| 账号误删恢复 | `runbooks/mobile-auth-delete-account-recovery.md` |

### 回滚 SOP（按优先级）

1. **全局 Kill Switch**（秒级）：`FEATURE_MOBILE_APP_ENABLED=false` → App 所有 auth 端点返回 `MOBILE_APP_DISABLED`
2. **按 Provider 熔断**（秒级）：`MOBILE_SIGN_IN_APPLE_ENABLED=false` 或 `MOBILE_SIGN_IN_GOOGLE_ENABLED=false`
3. **缩短 token TTL**（秒级，针对安全事件）：`MOBILE_REFRESH_TOKEN_TTL_DAYS` 改为 `1`，存量旧 token 在下次 refresh 时被缩短窗口逐出
4. **停止清理 Job**：`MOBILE_REFRESH_TOKEN_CLEANUP_JOB_DISABLED=true`（避免误删大量未过期 token）

## 数据库迁移

- **原则**：向前兼容。新老代码能同时跑。
- **添加字段**：允许，默认值保证老代码可读
- **删除字段**：两步走——先 deprecate（新代码不再读写），再真删
- **改字段语义**：禁止；用新字段 + 双写 + 迁移 + 切换

## 部署与环境

### 必填环境变量（缺失会导致服务起不来）

见根 `CLAUDE.md`「启动前必填变量」：
- `JWT_SECRET_KEY`、`INTERNAL_API_TOKEN`、`APIKEY_ENCRYPTION_KEY`
- `SPRING_DATA_MONGODB_URI`
- `OPENAI_API_KEY`（可占位 `sk-placeholder`）

新增必填变量必须同步：
- `deploy/.env.example`
- 根 `CLAUDE.md`「启动前必填变量」段

### 部署流水线

- 当前通过 `deploy/` 目录下脚本部署
- Release PR 合入 main → 触发生产部署
- 生产验证由 release PR 的「Manual Verification Checklist」驱动

### 预发环境（prepub）

> 完整操作指南：[`deploy/PREPUB.md`](../deploy/PREPUB.md) · 设计 Issue：[#687](https://github.com/ginobefun/bestblogs-monorepo/issues/687)

**目标**：在合 main 之前，把已合入 `prepub` 分支的代码以"准生产"形态跑一遍端到端验证。

**拓扑要点**

- **物理隔离**：1 台独立预发主机（与生产 4 节点完全分离），自包含 Nginx。
- **MongoDB 逻辑隔离**：复用生产副本集，DB 名 `bestblogs_prepub`，账号 `bestblogs_prepub_user` **仅授权该 DB 读写**——账号本身没有 `bestblogs`（生产）DB 权限是误操作的最后一道闸。
- **Redis 物理隔离**：预发主机本机 standalone（生产是 cluster mode，不复用）。
- **天然 key 前缀**：`bestblogs.env=${ENV_TYPE}` 已是 `RedisCacheService` / `RedisDistributedLockBackend` / `OpenApiRedisService` / ES 索引名的默认前缀，`ENV_TYPE=prepub` 直接得到 `bb:prepub:*`。
- **镜像复用**：不打 `:prepub` 镜像，CI 直接用 `:<commit-sha>`，差异 100% 在 `.env`。
- **域名独立**：`prepub.bestblogs.dev` / `prepub-admin.bestblogs.dev` / `prepub-api.bestblogs.dev`；Nginx 必须加 `X-Robots-Tag: noindex`。

**触发方式**

```
push origin prepub  →  .github/workflows/deploy-prepub.yml  →  自动构建 + SSH 部署到 SSH_HOST_PREPUB
```

也可在 GitHub Actions 页面手动 `workflow_dispatch`。`concurrency.group: deploy-prepub` 与生产互不阻塞。

**与生产共享但独立赋值的关键变量**

| 变量 | 生产 | 预发 |
|---|---|---|
| `ENV_TYPE` | `prod` | `prepub` |
| `SPRING_PROFILES_ACTIVE` | `prod` | `prepub` |
| `SPRING_DATA_MONGODB_URI` | `…/bestblogs?…` | `…/bestblogs_prepub?…`（独立账号）|
| `SPRING_DATA_REDIS_CLUSTER_NODES` | 6 节点 | **不设** |
| `SPRING_DATA_REDIS_HOST/PORT` | 不用 | `127.0.0.1:6379` |
| `JWT_SECRET_KEY` 等密钥 | 生产值 | **独立生成**（避免 token 跨环境互通）|
| 邮件 / 支付 / PostHog adapter | 真实凭证 | 默认 `ENABLED=false` |
| `BARK_NOTIFICATION_URL` | 配置 | 留空 |

**变更落地清单**

| 文件 | 用途 |
|---|---|
| `deploy/PREPUB.md` | 操作主指南 |
| `deploy/.env.prepub.example` | 复制到预发主机 `/opt/bestblogs-prepub/.env` |
| `deploy/docker-compose.prepub.yml` | override compose，仅覆写 `ENV_TYPE` + `SPRING_PROFILES_ACTIVE` |
| `.github/workflows/deploy-prepub.yml` | `push prepub` 触发的 CI |
| `bestblogs-service/bestblogs-api/src/main/resources/application-prepub.properties` | Spring profile（不开 cluster.nodes） |
| `bestblogs-service/bestblogs-admin-api/src/main/resources/application-prepub.properties` | 同上 |

**新增/变更预发资源时的硬约束**

- 改了 `deploy/docker-compose.yml`（生产）的 service 名、端口、环境变量名 → 必须同步评估 `deploy/docker-compose.prepub.yml`、`.env.prepub.example` 是否需要跟进
- 改了 `deploy.yml` 的镜像 build / cache 策略 → `deploy-prepub.yml` 同步
- 改了 `application-prod.properties` 任一 key → 评估 `application-prepub.properties` 是否需要补
- 新增 prepub 域名 / 端点 → 同步 Nginx + DNS + 证书

**安全护栏**

- `deploy-prepub.yml` 部署前 preflight 校验 `.env` 必须含 `ENV_TYPE=prepub` 与 `SPRING_PROFILES_ACTIVE=prepub`，缺失直接 fail
- MongoDB prepub 账号无生产 DB 任何角色（误连 prod URI 会立即 auth fail）
- Nginx 加 `X-Robots-Tag: noindex, nofollow`；建议 HTTP Basic Auth 防外部访问

## 安全相关的运维项

- **敏感配置**：仅来自环境变量或数据库加密字段，禁止硬编码默认值
- **API Key 加密**：使用 `APIKEY_ENCRYPTION_KEY` 加解密
- **Token 常量时间比较**：`MessageDigest.isEqual()`
- **CORS / 限流**：通过 `CORS_ALLOW_ORIGIN` / `PUBLIC_API_RATE_LIMIT_*` ConfigKey 管理

## 订阅源治理 SOP

### 运营强制屏蔽（Issue #554）

适用场景：违规账号 / 持续低质 / 用户投诉 / 法务要求等需要永久屏蔽某订阅源的情况，且需保证用户再添加 / OPML 导入 / X 同步都不会复活。

操作步骤（admin UI）：
1. 进入 `/source` 列表，按 ID / RSS URL / 名称定位目标源。
2. 行操作菜单点击 **运营屏蔽**，填写 reason（建议明确："违规内容" / "用户投诉 #xxx" / "法务通知"）。
3. 确认后状态列变红色"已屏蔽"，hover 查看 reason。
4. 验收：用户前台尝试订阅 → 报错"该订阅源已被运营屏蔽"。

底层效果（参考 `bestblogs-docs/specs/source-block-and-zombie.md`）：
- `blocked=true, blockedReason, blockedTime` 写入 `bb_resource_source`。
- `isSubscribable()` 返回 false，所有添加/导入/同步入口被拒绝（详见 spec §3 守门入口表）。
- **不级联取消** 现有 ACTIVE 订阅，避免运营手抖导致大规模影响。

恢复（解除屏蔽）：行操作菜单 → **解除屏蔽** → 二次确认。

### 僵尸源自动 disable

判定规则（双阈值，Issue #554 修正）：
- `INACTIVE_THRESHOLD_NEW_SOURCE_DAYS`（默认 10 天）：新源保护期，createdTime 不到此天数不判僵尸。
- `INACTIVE_THRESHOLD_ZOMBIE_DAYS`（默认 90 天）：内容陈旧阈值。
- `lastFetchTime / lastLiveTime` 任一为 null 时让源继续走抓取兜底，写入后下一轮再判定，避免新源连一次抓取机会都没有就被禁。

调整阈值：admin → 配置 → "RSS 拉取调度" 分组。

误禁恢复：admin 列表筛选 `disableReason=ZOMBIE_AUTO_DISABLE` → 行操作菜单 → "启用"。

## 功能专项：Pro 公众号自助订阅 wechat2rss 接入（Issue #691）

### Feature Flag / ConfigKey 表（7 项 · admin 分组 `wechat-subscribe`）

| ConfigKey | 默认值 | 用途 |
|---|---|---|
| `WECHAT_PRO_SUBSCRIBE_ENABLED` | `false` | 总开关 / kill switch；关闭时 API + Provisioning Job 全部静默 |
| `WECHAT_PRO_SUBSCRIBE_AUTO_APPROVE` | `false` | 自动接入开关；false=人工审核走 PENDING；true=直接创建 PROVISIONING source |
| `WECHAT_PRO_SUBSCRIBE_QUOTA_PER_USER` | `100` | 单用户累计 recommendation 上限（防滥用，与通用 USER_MAX_SUBSCRIPTIONS=5000 分桶） |
| `WECHAT_PRO_SUBSCRIBE_DAILY_LIMIT_PER_USER` | `100` | 单用户单日提交上限 |
| `WECHAT2RSS_API_BASE` | `""` | wechat2rss 服务 Base URL（自部署），空时 fail-soft 返回失败 |
| `WECHAT2RSS_API_KEY` | `""` | wechat2rss API Token（sensitive，admin UI 应标 password） |
| `WECHAT_MP_ACCOUNT_BLACKLIST` | `""` | 公众号黑名单（逗号分隔 bizId），命中后 BIZ_ID 输入直接拒绝 |

### 灰度 SOP（3 步）

| Step | ConfigKey 组合 | 观察指标 |
|---|---|---|
| 1（1-3 天） | ENABLED=true / AUTO_APPROVE=false / QUOTA=5 / DAILY=5 | 内部账号 3-5 个公众号，wechat2rss p99、`provisioningStatus` 流转、`NewSourceFirstFetchJob` 告警是否出现 |
| 2（3-5 天） | QUOTA=10 / DAILY=5，邀请群定向 | wechat2rss 成功率 ≥ 90%，接入时长 < 10 min，失败原因 top 3 |
| 3（7d+ 稳定） | AUTO_APPROVE=true / QUOTA=100 | kill switch `WECHAT_PRO_SUBSCRIBE_ENABLED` 是唯一全局熔断 |

### 告警与 dedupKey

- `internal:wechat-provisioning-stuck:{date}` (WARNING)：单源 PROVISIONING 超 24h 转 FAILED 触发，按日 dedup
- `internal:source-review-stale:{date}` (WARNING)：审核队列堆积告警，已覆盖私有源 + wechat 推荐（`SourceReviewAlertJob`），按日 dedup

> **关于 wechat2rss 服务健康监控**：当前未设独立 `internal:wechat2rss-fail-rate:5min` 滑窗告警。
> wechat2rss 调用失败采用 fail-soft 模式（adapter 返回 `Wechat2RssResponse.fail` 不抛异常）：
> ① 用户端：`WECHAT2RSS_PROVIDER_FAILED` (173005) 错误码 + 友好提示 `errorProviderFailed`；
> ② 数据落库：每次失败都写 `bb_source_recommendation` REJECTED 记录（含 failureReason）；
> ③ 事件上报：`wechat_source_failed` PostHog 事件（含 errorCode 维度）。
> 运维通过 PostHog 看板观察失败率即可，无需 Bark 主动推送（rationale：wechat2rss 是用户自助
> 接入链路，失败不影响存量功能可用性，且 fail-soft 已让用户体验降级而非崩溃）。
> 后续若灰度发现失败率长期 >30%，可在 `ServiceHealthAlertJob` 加 `wechat2rss.call.count` Meter
> 与对应滑窗检查（参考 `checkFilterFallbackBurst` 模式）。

### 部署核查清单（新环境上线必读）

灰度启用 wechat-subscribe 前，运维需在 admin Settings 配置以下两项（凭证当前**不在 `.env.example`**
中声明，统一走 ConfigKey 动态写入）：

1. **`WECHAT2RSS_API_BASE`**：自部署的 wechat2rss 服务 Base URL（含 scheme + host，无尾斜杠）。
   例：`https://wechat2rss.internal.example.com`。空时所有用户提交立即返回 `WECHAT2RSS_PROVIDER_FAILED`
   错误码（静默 fail-soft，但用户无法接入新公众号）。
2. **`WECHAT2RSS_API_KEY`**：服务端发放的 Bearer Token。admin Settings 表单展示为 PasswordInput；
   GET 接口返回 sentinel `***MASKED***` 而非明文（CWE-312 防御）；POST 收到 sentinel 时不覆盖原值。
   配置后建议本地手动 curl `POST {BASE}/add/{bizId}` 验证连通性。

凭证错配的典型故障：所有用户提交返回 173005 `errorProviderFailed` 文案，admin 推荐审核页 wechat
类型行数持续为 0，但 PostHog `wechat_source_failed` 事件呈尖刺。优先核查 `WECHAT2RSS_API_BASE` /
`WECHAT2RSS_API_KEY` 是否非空。

### 回滚

关闭 `WECHAT_PRO_SUBSCRIBE_ENABLED`：① API 拒绝新提交；② Provisioning Job 静默跳过；③ 已 PROVISIONING 状态的源由 Job 重新启用后继续处理或运营手动处理（admin 源管理页筛选 `platform=WECHAT AND provisioningStatus=PROVISIONING` 后批量「标记 FAILED 并禁用」）；④ 已 APPROVED 订阅关系不受影响。

## 功能专项：URL 一键发现 RSS（YouTube + 小宇宙 + 微信公众号 + 通用 HTML 兜底）（Issue #706 · 扩展 Issue #781）

### Feature Flag / ConfigKey 表（10 项 · admin 分组 `source-discovery`）

| ConfigKey | 默认值 | 用途 |
|---|---|---|
| `FEATURE_URL_BASED_SOURCE_DISCOVERY_ENABLED` | `false` | 总开关 / kill switch；关闭时 `detect-rss` 端点仅接受 RSS URL（回退旧行为），不调用 SourceDiscoveryRegistry |
| `DISCOVERY_YOUTUBE_ENABLED` | `false` | YouTube 子开关；关闭时输入 youtube.com / youtu.be URL 抛 `SOURCE_DISCOVERY_PLATFORM_DISABLED` (174003) |
| `DISCOVERY_XIAOYUZHOU_ENABLED` | `false` | 小宇宙子开关；关闭时输入 xiaoyuzhoufm.com URL 同上 |
| `DISCOVERY_GENERIC_HTML_ENABLED` | `false` | 通用 HTML head 兜底子开关（灰度后开）；关闭时未知域名抛 `SOURCE_DISCOVERY_NOT_SUPPORTED` (174001) |
| `DISCOVERY_WECHAT_ENABLED` | `false` | 微信公众号子开关（#781）；**依赖 `WECHAT2RSS_API_BASE` + `WECHAT2RSS_API_KEY` 凭证齐全**（与 Pro 自助订阅 #691 共享凭证），凭证缺失时 adapter.isEnabled() 返回 false，Registry 抛 PLATFORM_DISABLED |
| `DISCOVERY_AUTO_APPROVE_GREEN_ENABLED` | `false` | discovery 链路 GREEN 健康分自动审核通过；与 `PRIVATE_SOURCE_AUTO_APPROVE` 互独立，仅 `canonicalKey != null` 时生效 |
| `DISCOVERY_WECHAT_AUTO_APPROVE_ENABLED` | `false` | 微信公众号专项自动审核（#781）；不依赖 healthScore=GREEN（wechat2rss 首拉前必 RED）。开启后 `createPrivateSource` 跳过 RED 阻塞 + 标 `provisioningStatus=PROVISIONING` 让 `WechatSourceProvisioningJob` 接管首拉 |
| `DISCOVERY_USER_DAILY_QUOTA` | `30` | 单用户每日探测次数上限（Redis 计数器 `bb:{env}:user:rl:source_discovery:{userId}:{yyyyMMdd}`，超限抛 174005）。防滥用 + 防 YouTube IP 封禁 |
| `DISCOVERY_YOUTUBE_HTML_MAX_BYTES` | `5242880` | YouTube 页面截断上限（5MB，频道页 ytInitialData 较大，独立大上限避免误截导致 channelId 提取失败） |
| `DISCOVERY_XIAOYUZHOU_RSS_BASE` | `https://rsshub.bestblogs.dev/xiaoyuzhou/podcast/` | 小宇宙 RSSHub 镜像 base URL（trailing slash 会自动补齐） |

### 灰度 SOP（3 步）

| Step | ConfigKey 组合 | 观察指标 |
|---|---|---|
| 1（1-3 天） | 总开关=true / YouTube+小宇宙=true / GenericHtml=false / QUOTA=5 / AUTO_APPROVE=false | 内部账号 3-5 个频道+播客，channelId / podcastId 提取成功率、健康分分布、PostHog `source_discovery_failed.failureReason` top 3 |
| 2（3-5 天） | QUOTA=10，邀请群定向 | 探测成功率 ≥ 90%；admin 推荐审核页 `platform IN (YOUTUBE, XIAOYUZHOU)` 待审核数 < 10/天 |
| 3（7d+ 稳定） | AUTO_APPROVE=true / QUOTA=30 / GenericHtml=true | kill switch `FEATURE_URL_BASED_SOURCE_DISCOVERY_ENABLED` 是唯一全局熔断 |

### 告警与 dedupKey

- 单平台 10min 失败率 > 50%：当前**未内置 AlertDispatchService 调用**，依靠 PostHog Alerts 外部配置（按 `source_discovery_failed.platform` 拆解）。建议 dedupKey `internal:discovery-platform-down:{platform}`，灰度后期评估是否补内置 Bark 告警
- RSSHub 镜像 `rsshub.bestblogs.dev` 宕机：影响范围仅小宇宙路径，应急切换公共镜像 → POST `/api/admin/parameter/source-discovery` 修改 `DISCOVERY_XIAOYUZHOU_RSS_BASE`，或单平台 kill switch 关闭 `DISCOVERY_XIAOYUZHOU_ENABLED`

### 隐私 / 数据脱敏（IMPORTANT）

PostHog 上报严格脱敏：
- **绝不上报完整 URL**：`source_discovery_{attempted,succeeded,failed}` 仅 `inputUrlHost`（`URI.getHost()`）
- **channelId / podcastId / rssUrl 不入 PostHog**：仅在数据库 `bb_source.extAttrs.discoverySource` 与 `canonicalKey` 字段保留
- `source_discovery_confirmed` 仅上报 `canonicalKeyPrefix`（如 `youtube:channel`），不含具体 ID
- `failureReason` 走 `DiscoveryFailureReason` enum 字面量，不带原始异常 message / 堆栈

### 回滚

三层独立 kill switch：
1. 总开关 `FEATURE_URL_BASED_SOURCE_DISCOVERY_ENABLED=false` → 回到旧 RSS-only 行为（旧前端粘 RSS URL 仍可用）
2. 单平台 `DISCOVERY_{YOUTUBE,XIAOYUZHOU,GENERIC_HTML,WECHAT}_ENABLED=false` → 受影响平台返回 174003
3. `DISCOVERY_AUTO_APPROVE_GREEN_ENABLED=false` / `DISCOVERY_WECHAT_AUTO_APPROVE_ENABLED=false` → 新源回到 PENDING 人工审核

**微信公众号专项**（Issue #781）：`WechatSourceProvisioningJob` 已升级为双路径守门（`WECHAT_PRO_SUBSCRIBE_ENABLED || DISCOVERY_WECHAT_ENABLED`，任一开启即接管），即使仅开启路径 B（discovery）也能正常处理 PROVISIONING 源。两条 wechat 路径共享 `WECHAT_MP_ACCOUNT_BLACKLIST` 黑名单。

已落库的 `platform / canonicalKey` 字段不受开关影响（已订阅源继续拉取）；`idx_canonicalKey_unique` 索引在重启后保留，开关再开不会冲突。

详见 `bestblogs-docs/specs/url-based-source-discovery.md`。

## 与其它文档的关系

- `4-ARCHITECTURE.md` — 架构约束（开关与灰度章节的源头）
- `7-CONVENTIONS.md` — 代码约定（配置相关风格）
- ops-review agent — 本文件约束的运行时检查员
- config-consistency agent — ConfigKey 三处一致性守护
