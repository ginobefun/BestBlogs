# 11-OPERATIONS.md

本文件是 BestBlogs monorepo 的运维、Feature Flag、配置治理、监控、回滚事实来源。

## 原则

1. **上线可观测**：关键路径有日志、计数、告警。
2. **上线可控制**：新能力走 Feature Flag，默认关闭，人工验证后放量。
3. **上线可回滚**：任意功能都能通过 ConfigKey 瞬时关闭，不需要回滚部署。
4. **配置单一真相源**：所有动态参数都走 `ConfigKey` 枚举，禁止散落字符串。

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
- 推送失败 → 返回错误，不抛异常
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

### 调用层阈值告警（自 2026-04 起）

调用层告警 Job 每 5 分钟从 MeterRegistry 读取 AI / TTS 计数器，基于内存快照计算滑窗增量：

- AI 失败率（`(FAILED+TIMEOUT)/total`）超阈值（ConfigKey 可调，默认 0.1）→ WARNING
- TTS 成功率（`SUCCESS/REQUEST`）低于阈值（ConfigKey 可调，默认 0.9）→ WARNING

**降噪策略**：首次采样仅建基线不告警；窗口样本 < 10 不判断；同键在去重窗口内只推一次。

**当前局限**：单节点 MeterRegistry 读取，分布式部署下每节点独立计数；集群级聚合作为后续改进方向。

Counter 埋点：AI 调用（`bestblogs.ai.call.count{provider,status}`）和 TTS 调用（`bestblogs.tts.call.count{provider,status}`）在各自适配器的 try-finally 中写入。

### Job 执行监控（自 2026-04 起）

每次 Job 执行结束后自动三写：

1. **MongoDB 执行日志**（TTL 30 天）：用于故障排查 + traceId 关联，字段含 `jobName / startTime / endTime / durationMs / status / errMsg / traceId / nodeId / hostName`

2. **Micrometer Meter**：计数器 `bestblogs.job.execution.count{job,status}` + Timer `bestblogs.job.execution.duration{job,status}`（P50/P95/P99）

3. **分析平台事件 `job_execution`**：用于统一看板

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

- **通知通道**：主通道推送通知；备用通道推 P1
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

### 紧急降级与关停

| 场景 | 操作 |
|---|---|
| 分析平台后端上报异常拖垮主链路 | `FEATURE_BACKEND_POSTHOG_ENABLED=false` 秒级关停 |
| 某 Job 循环失败刷屏 | 对应 `*_JOB_DISABLED=true`（若已配）；否则调大 `ALERT_JOB_NO_SUCCESS_MINUTES_DEFAULT` 降噪 |
| 告警推送洪峰 | 调大 `ALERT_WEBHOOK_DEDUPE_SECONDS`（如 3600s）暂缓 |
| 告警 Webhook 自身故障 | 检查内部 Token 验证日志；临时 fallback 为运维直接查分析平台事件 |
| AI / TTS 调用层大面积异常 | 对应 ConfigKey 调高失败率阈值临时静默 + 关注分析平台 `ai_call_complete{status=FAILED}` 趋势 |

### 新环境部署 Checklist

部署前逐项检查：

- [ ] `deploy/.env.example` 中的所有必填变量已在 `.env` 填写
- [ ] MongoDB 已执行索引初始化脚本（含 Job 执行日志索引 + TTL）
- [ ] 存活监控按对应 checklist 配置完 Webhook
- [ ] 分析平台后端 API Key 已配置，启用前先验证样本事件
- [ ] 分析平台告警规则按 checklist 配置完毕，指向统一 Webhook 端点
- [ ] 通知推送已在测试账号上验证到达
- [ ] 关键 Runbook 在新环境上走一次演练

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

## 功能专项：内建翻译（Content Translate）

*Issue #104 · 设计 `specs/content-translate.md`*

### Feature Flag

- 主开关：`FEATURE_CONTENT_TRANSLATE_ENABLED`（默认 `false`，全量上线前必须显式开启）
- 相关 ConfigKey（详见 spec §4）：Free/Pro 每日配额、默认模型、降级模型

### 灰度阶梯（推荐）

| 阶段 | 目标 | 进入条件 | 观察窗口 | 关键阈值 |
|---|---|---|---|---|
| Stage 1 · 内测（<100 人）| Admin 手工把特定 userId 的 Feature Flag 生效；其余用户透明 | PR 合入 + 基础监控就绪 | 48h | post-filter 拒绝率 < 3%、LLM p95 < 15s、0 Bark 告警 |
| Stage 2 · 10% Pro 灰度 | 按 userId hash 分桶，仅对 Pro 账户开启 | Stage 1 所有阈值达标 | 72h | Pro 当日配额中位数 ≤ 10（表明没人被 20 配额约束）、缓存命中率 ≥ 40% |
| Stage 3 · 50% | 含部分 Free 账号 | Stage 2 阈值 + 人工抽检 10 篇译文合格（`specs/content-translate.md` §13 benchmark）| 72h | Free 配额耗尽后 `content_translate_quota_blocked` 事件可见 Pro 转化漏斗 |
| Stage 4 · 全量 | Flag 置 true | Stage 3 转化漏斗满足预期 | 7d | SSE error 率 < 1% |

### 关键指标（Micrometer，前缀 `bestblogs.content_translate.*`）

| 指标 | 类型 | 健康阈值 | 说明 |
|---|---|---|---|
| `attempt` | Counter `is_pro,target_lang` | —（趋势观察）| 每次 SSE 连接建立 |
| `cache.hit` | Counter `target_lang` | 命中率 ≥ 40%（Stage 2 后）| 某段命中已缓存译文 |
| `llm.latency` | Timer `model,rejected` | p95 < 15s | LLM 调用耗时 |
| `post_filter.reject` | Counter `reason` | 占 LLM 调用 < 3% | reason=`tag_leak:*` / `output_too_long` / `empty_output` |
| `free_preview.locked` | Counter | —（Free 转化信号）| Free 用户某段被 preview 限制锁定 |
| `quota.exceeded` | Counter `is_pro` | Free `is_pro=false` 占主 | 当日配额超限 |
| `lock.renew_failed` | Counter | 极低（< 0.1%）| 分布式锁续租失败，翻译中断 |

前端漏斗（PostHog）：`content_translate_toggle` → `content_translate_free_locked_view` → `content_translate_quota_blocked` → `pro_checkout_click`。

### 日志关键字（`grep` 排障用）

- `触发翻译 SSE` — 每次连接建立
- `翻译业务错误` — BizException（配额超限或内容未找到）
- `翻译 SSE 异常` — 未预期异常（需立即排查）
- `译文被 post-filter 拒绝` — 模型输出触发三层防御
- `分布式锁获取成功: key=translate:lock:` — 锁持有 / 释放轨迹

### 回滚 SOP（按优先级）

1. **Feature Flag 关闭**（秒级）：Admin → 设置 → `FEATURE_CONTENT_TRANSLATE_ENABLED=false` → 刷新参数缓存。前端入口按钮随之消失。
2. **单模型降级**：若默认模型故障，改 `CONTENT_TRANSLATE_MODEL_DEFAULT` 为其他可用模型，无需前端变更。
3. **压缩配额**：临时下调 Pro 每日配额，配合 LLM 成本爆炸场景。
4. **缓存全量失效**：生产事故下需刷新所有译文时，drop 译文缓存 collection（注意：会立即失去共享命中）。日常不需要——`contentVersion` 已处理单篇失效。

### 故障速查

| 症状 | 可能原因 | 操作 |
|---|---|---|
| 前端按钮不显示 | Feature flag 未开 / 翻译相关配置未刷缓存 | Admin 刷新参数缓存，浏览器硬刷新 |
| 所有段 `error=true, reason=waiter_timeout` | 持锁连接异常（LLM 卡死 / 虚拟线程 OOM）| 查日志分布式锁获取后是否有对应释放；必要时手动删除对应 Redis 锁 key |
| 所有段 `error=true, reason=tag_leak:*` | 模型输出失控（某个 prompt 模板问题）| 立即切 `CONTENT_TRANSLATE_MODEL_DEFAULT` 到已知可靠模型 |
| 同一用户 200ms 内两次触发，都被扣配额 | 正常 — 设计：按次扣减；退款窗口仅覆盖 abort | 若投诉集中，放宽退款窗口 ConfigKey |
| `content_translate.quota.exceeded` 暴涨 | Free 当日放量 / 配额过紧 | 检查 Pro 转化漏斗：若 `pro_checkout_click` 同步涨 = 符合预期；否则上调 Free 配额 |

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

## 安全相关的运维项

- **敏感配置**：仅来自环境变量或数据库加密字段，禁止硬编码默认值
- **API Key 加密**：使用 `APIKEY_ENCRYPTION_KEY` 加解密
- **Token 常量时间比较**：`MessageDigest.isEqual()`
- **CORS / 限流**：通过 `CORS_ALLOW_ORIGIN` / `PUBLIC_API_RATE_LIMIT_*` ConfigKey 管理

## 与其它文档的关系

- `4-ARCHITECTURE.md` — 架构约束（开关与灰度章节的源头）
- `7-CONVENTIONS.md` — 代码约定（配置相关风格）
- ops-review agent — 本文件约束的运行时检查员
- config-consistency agent — ConfigKey 三处一致性守护
