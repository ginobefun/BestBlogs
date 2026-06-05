# 9-TESTING.md

本文件是 BestBlogs monorepo 的测试约定事实来源。

## 目标

1. 支持**快速回归**（开发/PR）与**全面验证**（发布前）双目标。
2. 让测试具备**可执行分级**，而不是仅靠文件命名约定。
3. 保证本地与 CI 门禁一致，避免“本地绿、CI 红、发布前手工拼命令”。

## 基线盘点（可重复）

```bash
python3 scripts/testing/inventory-stats.py
```

盘点输出基线文档：
- `bestblogs-docs/runbooks/test-inventory.md`

## 测试分层与级别

### 用例分层（语义层）

1. `UT`（Unit Test）
- 目标：验证单个类/函数纯逻辑。
- 特征：不依赖 Spring 容器、DB、外部系统。

2. `IT`（Integration Test）
- 目标：验证 Controller/Service/Repo/DB 等多组件协作。
- 特征：允许 SpringBootTest、MockMvc、Testcontainers。

3. `E2E`（End-to-End）
- 目标：验证真实用户路径或跨边界关键链路。
- 特征：链路级断言、场景完整性优先。

### 执行级别（门禁层）

1. `L0 Fast`（开发前/提交前）
- 快速检查：UT 为主。

2. `L1 PR`（PR 门禁）
- 主回归：UT + IT。

3. `L2 Release`（发布前门禁）
- 全验证：UT + IT + E2E + UI smoke。

4. `L3 Nightly`（夜间）
- 长耗时与稳定性类测试（按需扩展）。

## 后端分级实现（bestblogs-service）

后端通过 JUnit Tag + Maven Profile 实现可执行分级。

### Tag 规则

- `@Tag("unit")`
  - 纯逻辑/纯 mock，不起 Spring 容器。
- `@Tag("integration")`
  - Spring 容器/MockMvc/Testcontainers/多组件协作测试。
- `@Tag("e2e")`
  - 链路级 E2E 场景。
- 当前后端覆盖率：`174/174 = 100%` 已显式分类。

### Maven Profiles

在 `bestblogs-service/pom.xml` 统一定义：

- `test-unit`：排除 `integration,e2e`
- `test-integration`：仅运行 `integration`
- `test-e2e`：仅运行 `e2e`

运行命令：

```bash
cd bestblogs-service

# L0 / UT
./mvnw test -Ptest-unit

# L1 / IT
./mvnw test -Ptest-integration

# L2 / E2E
./mvnw test -Ptest-e2e
```

## 前端与 CLI 分级实现

### bestblogs-app / bestblogs-admin

新增脚本：

```bash
# Unit（默认）
pnpm test:unit

# Integration（预留命名约定：*.integration.test.ts(x)）
pnpm test:integration

# E2E（预留命名约定：*.e2e.test.ts(x)）
pnpm test:e2e

# 发布前前端全套
pnpm test:release
```

### bestblogs-cli

新增脚本：

```bash
# Unit
pnpm test:unit

# E2E smoke
pnpm test:e2e

# 发布前全套
pnpm test:release
```


### bestblogs-mobile（Mobile）
**位置**：`bestblogs-mobile/src/**/__tests__/**` 与 `bestblogs-mobile/app/**/__tests__/**`。

**单测（jest-expo）**：
- 命名：`*.test.ts(x)`
- 必须覆盖：
  - 纯逻辑模块（`pii-filter` / `observability` / `i18n` locale 解析 / `makeSemanticColors`）
  - 设计 token 语义映射（暗黑改造风险项——`palette.{light,dark}` key 对称、`accentQuality` 锁 `amber600`）
  - i18n 消息键完整性（zh / en 对称 · 无空值）
  - 全局状态组件硬门禁（`minHeight ≥ minTouchSize` 直接断言组件 props · `maxFontSizeMultiplier = MAX_FONT_SCALE` 直接断言 Text props · VoiceOver 合并元素）
- 禁止：间接断言常量值而非组件渲染结果（eg. `expect(minTouchSize >= 44)` 不能替代 `expect(btn.props.style.minHeight).toBe(44)`）

**E2E（Detox）**：
- 计划位置：`bestblogs-mobile/e2e/**`（#270 起补）
- 首批用例：Apple/Google/Email 三种登录 · Account Linking 确认 · Delete Account · Creem→RevenueCat Pro 识别
- 上架前冒烟：冷启动 → 登录 → 打开早报 → 订阅 → 退订

**Mock 约束**：
- `react-native-reanimated` 必须用官方 mock（`react-native-reanimated/mock`）
- `expo-localization` / `expo-constants` 在测试里走 `jest.mock` 控制系统 locale 与运行时 extras
- `@sentry/react-native` / `posthog-react-native` 在 observability 测试中 mock，避免副作用

**Pre-PR**：`cd bestblogs-mobile && pnpm lint && pnpm type-check && pnpm test`。
## UI Smoke 与发布前一键验证

### UI Smoke 统一入口

新增：`uitest/run-smoke.sh`

```bash
./uitest/run-smoke.sh
```

执行内容：
- `uitest/scripts/smoke_test.py`（兼容历史，Python Playwright，仅冒烟旧路由）
- `uitest/e2e/`（新主线：@playwright/test + TypeScript，覆盖 v2.4 核心链路）

前置检查：
- 脚本会先检查 `localhost:3002/8090` 连通性；
- 本地服务未就绪时会快速失败，并提示执行 `./uitest/start-local-all.sh start all`。

输出：
- 日志与汇总写入 `uitest/screenshots/run-<timestamp>/`
- Playwright HTML 报告：`uitest/e2e/playwright-report/index.html`

### Playwright E2E（v2.4+ 主线）

位置：`uitest/e2e/`，详见该目录 README。

关键能力：
- 4 个预设账号（admin / normal / pro / onboarding）由 `uitest/scripts/init-test-data.js` 幂等注入
- 登录走真实「发码 → 服务端读码 → 验码」链路：后端新增 `/api/internal/test/verification-code` 端点
  （仅 `local` / `test` profile 装配 + `X-Internal-Token` + `FEATURE_TEST_HELPER_ENABLED` 三重门禁），
  生产部署 Bean 不存在
- storageState 持久化登录态：`auth.setup.ts` 跑一次，正式用例直接复用 cookie
- 5 个 Project 维度组织：`auth-setup` / `anonymous` / `authenticated-normal` / `authenticated-pro` / `onboarding`

覆盖场景（7 个 spec / 36 个用例）：
- 首页（匿名 + 已登录两态）
- 登录页表单 + 端到端验证码登录
- 公共早报 `/explore/brief`
- 我的早报 `/reading/brief`（Pro）
- 内容广场 `/explore` + 4 种类型筛选
- 文章 / 播客 / 视频 / Newsletter 详情页
- Onboarding V2 三步引导端到端

### 两端 4+4 入口 smoke 必跑矩阵（v2.4.0 起）

承接 PRODUCT §3 两端结构，每个入口至少 1 个 anonymous + 1 个 authenticated 用例；Pro Only 入口额外覆盖 Pro 状态：

| 入口 | anonymous | authenticated-normal | authenticated-pro |
|---|---|---|---|
| **公共策展层** | | | |
| 每日早报 `/explore/brief` | ✅ 已覆盖 | ✅ 已覆盖 | — |
| 精选周刊 `/newsletter`、详情页 `/newsletter/[id]` | ✅ 已覆盖（详情页） | ⬜ 列表态待补 | — |
| 主题解读 `/topics`、`/topics/[slug]` | ⬜ 待补 | ⬜ 待补 | — |
| 内容广场 `/explore` + 精选/最新双视角 | ✅ 已覆盖 | ✅ 已覆盖 | — |
| **我的空间** | | | |
| 我的早报 `/reading/brief` | LoginRequired 跳 `/signin` | ⬜ 预览态可见 + Pro 升级提示 | ✅ 已覆盖 |
| 我的关注 `/reading/follow`（FollowWorkspace v2） | LoginRequired | ⬜ 待补 | ⬜ 待补 |
| 我的阅读 `/library/reading`（4 collection） | LoginRequired | ⬜ 待补 | ⬜ 待补 |
| 我的回顾 `/library/review` 入口低优先级（v1 维持） | LoginRequired | — | ⬜ 入口可达即可 |

⬜ 标注为新增 v2.4.0 应补的入口 smoke。新增 spec 时优先复用 `auth.setup.ts` 持久化 storageState 和 4 个预设账号。

### 北极星埋点 E2E 回归用例（必跑）

北极星指标 = 每天打开「我的早报」的 Pro 用户数（PRODUCT §7）。**至少 1 条 E2E 用例必须断言**新北极星核心事件：

- `brief_mailing_open`（邮件打开通路 · 由 Resend webhook + 像素回调触发）
- `my_brief_view`（Web 打开通路 · 进入 `/reading/brief` 页面时触发）
- 「打开」口径：Web OR 邮件任一即算 —— E2E 用例需覆盖两条通路至少各 1 次

埋点事实见 `specs/my-daily-brief.md §9.4`。

### 发布前一键验证

新增：`scripts/testing/release-verify.sh`

```bash
./scripts/testing/release-verify.sh
```

默认顺序：
1. backend-unit
2. backend-integration
3. backend-e2e
4. app-release-tests
5. admin-release-tests
6. cli-release-tests
7. cli-live-e2e（可选）
8. ui-smoke

可选跳过 UI smoke：

```bash
BB_SKIP_UI_SMOKE=true ./scripts/testing/release-verify.sh
```

可选启用 CLI live E2E（需提供可用 API Key，建议指向稳定测试环境）：

```bash
BB_RUN_CLI_LIVE_E2E=true BESTBLOGS_API_KEY=bbk_xxx BESTBLOGS_BASE_URL=http://localhost:8090 \
  ./scripts/testing/release-verify.sh
```

说明：
- `cli-release-tests` 会强制清空 `BESTBLOGS_API_KEY/BESTBLOGS_BASE_URL`，保证默认门禁稳定可复现。
- `cli-live-e2e` 仅在 `BB_RUN_CLI_LIVE_E2E=true` 时执行，未提供 `BESTBLOGS_API_KEY` 会直接失败。
- `release-verify.sh` 遇到首个失败步骤即中断，避免后续步骤掩盖失败层级。

报告输出：
- `bestblogs-docs/runbooks/reports/release-verify-<timestamp>/summary.md`

## CI 门禁

### PR 门禁

新增 workflow：`.github/workflows/pr-functional-tests.yml`

覆盖：
- 后端 UT（Maven `test-unit` profile）
- 前端 Unit / Integration
- CLI Unit（稳定层）+ 可选 Live E2E

后端 IT（Maven `test-integration` profile）已从 PR 自动门禁移除，改为手动 workflow，以降低 Actions 用量：

- Workflow：`.github/workflows/backend-integration-manual.yml`
- 触发：`workflow_dispatch`（GitHub Actions → **Backend Integration (Manual)** → Run workflow）
- 本地等价：`cd bestblogs-service && ./mvnw test -Ptest-integration`

### 发布前门禁

新增 workflow：`.github/workflows/release-validation.yml`

触发：`workflow_dispatch`

能力：
- 执行 `scripts/testing/release-verify.sh`
- 支持开关 `run_ui_smoke`
- 上传 release verify 报告 artifact

## 命令矩阵

### L0 Fast

```bash
cd bestblogs-service && ./mvnw test -Ptest-unit
cd bestblogs-app && pnpm test:unit
cd bestblogs-admin && pnpm test:unit
```

### L1 PR

```bash
cd bestblogs-service && ./mvnw test -Ptest-unit
cd bestblogs-service && ./mvnw test -Ptest-integration
cd bestblogs-app && pnpm test:unit
cd bestblogs-admin && pnpm test:unit
cd bestblogs-cli && pnpm test:unit
```

### L2 Release

```bash
./scripts/testing/release-verify.sh
```

## 门禁矩阵

1. PR 门禁：
- 后端 `test-unit` 必过。
- 后端 `test-integration` 必过（当前为全量 integration）。
- 前端 `test:unit` 必过。
- CLI `test:release` 必过。

2. Release 门禁：
- `release-verify.sh` 作为唯一入口。
- 输出 Markdown 报告并保留每步日志。

## 失败处理流程

1. 先看 `release-verify` 控制台中的首个失败步骤。
2. 打开对应日志文件（`bestblogs-docs/runbooks/reports/release-verify-<timestamp>/<step>.log`）。
3. 在失败层修复后仅重跑该层，确认通过后再重跑整条 `release-verify`。
4. 缺陷修复必须补一条回归用例（UT/IT/E2E 至少其一）。

## 验收口径（DoD）

1. L0：目标 8 分钟内完成。
2. L1：目标 20 分钟内完成。
3. L2：目标 60 分钟内完成。
4. PR / Release 门禁分离且稳定。
5. 任一缺陷修复可追溯到回归用例。

## 测试数据与安全约束

1. 测试配置中禁止提交真实密钥、真实外网敏感地址。
2. `application-test.properties` 仅使用测试占位值。
3. 集成测试优先使用 Testcontainers 或本地可重建依赖。

## 断言质量硬门禁

### 禁止

1. `when(x).thenReturn(null)` 后再断言非空。
2. 只验证 `verify(method())` 不验证关键参数。
3. 只有 happy path，无 error/boundary。
4. 以「只要不抛异常」为主要断言。

### 必须

1. 至少一个 happy path + 一个 error path。
2. 关键场景增加边界用例（空、null、极值、并发）。
3. Bug 修复必须补回归测试。

## 跨入口能力硬门禁（v2.4.0 起）

承接 PRODUCT §3.3 跨入口能力，每项能力必须覆盖以下测试约束：

### AI 伴读（SSE 流式）

- SSE 流稳定性：长连接 ≥ 30s 不断流
- token 取消：客户端 abort 后服务端清理资源
- 跨文章上下文（**完全 Pro Only**）：Free 用户调用返回 `FORBIDDEN_PRO_ONLY`；Pro 用户返回正常流
- 配额耗尽：Free 用户达上限返回 `QUOTA_EXCEEDED` + 升级提示链接

### 沉浸式翻译 v2（Issue #333）

- **同用户同资源仅扣 1 次**：并发 SSE 请求由 `bb_user_translation_log (userId, resourceId)` UNIQUE 索引保证；测试需断言并发 5 次请求 → 计费 1 次
- 全类型覆盖：article / podcast / video / tweet 各 1 条用例
- 双向：zh→en 与 en→zh 各 1 条用例

### Domain 自定义篇数（Issue #684 · **Pro Only**）

- 配额上限：`Σ quotaPerInterest ≤ USER_INTEREST_QUOTA_TOTAL_MAX`，超出返回 `USER_INTEREST_QUOTA_EXCEEDED (105404)`
- Free 用户调用 PATCH `/api/users/me/interests/quota` 返回 `FORBIDDEN_PRO_ONLY`
- 单 Domain 降级：单 Domain 不足配额时降到 `BRIEF_RC_DOMAIN_QUALITY_THRESHOLD_RELAXED`(60) 继续拉，**无 HOT 跨 Domain 兜底**

### 自定义视图（**Pro Only**）

- Free 用户访问保存视图 API 返回 `FORBIDDEN_PRO_ONLY`
- Pro 用户保存 / 切换 / 删除视图均可成功
- 服务层 `ProFeatureHelper.requirePro` 集中守门（不依赖前端隐藏入口）

### 行为驱动画像 PII 过滤

- PostHog 事件不得包含完整 email / userId / 堆栈
- 关注 / 阅读 / Domain 自定义篇数事件需有对应 `bb_user_op_log` 写入

## 反骚扰断言原则（VISION §8）

测试**不得断言**以下骚扰式行为模式：

- ❌ 「弹窗在首访自动出现」「Modal 在 N 秒后自动弹起」
- ❌ 「升级 Pro 提示在 X 时间内必触达」
- ❌ 「push 在用户未操作时主动唤醒」
- ❌ 「标题党文案出现」（如「N 篇错过的重要内容！」）
- ❌ 「AI 替我读完无需点开」类按钮 / 入口被默认渲染

如果测试用例验证「升级 CTA 可见」，**必须同时验证**：CTA 不阻断浏览 + 可关闭 + 触发条件是「能力天花板触达」（如配额耗尽）而非时间窗口。

## 当前分级改造文件

1. 后端分级：
- `bestblogs-service/pom.xml`
- `bestblogs-service/**/src/test/java/**`

2. 前端/CLI 脚本：
- `bestblogs-app/package.json`
- `bestblogs-admin/package.json`
- `bestblogs-cli/package.json`

3. 统一验证脚本：
- `uitest/run-smoke.sh`
- `scripts/testing/release-verify.sh`

4. CI：
- `.github/workflows/pr-functional-tests.yml`
- `.github/workflows/release-validation.yml`
