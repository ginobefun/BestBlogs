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

## UI Smoke 与发布前一键验证

### UI Smoke 统一入口

新增：`uitest/run-smoke.sh`

```bash
./uitest/run-smoke.sh
```

执行内容：
- `uitest/scripts/smoke_test.py`

前置检查：
- 脚本会先检查 `localhost:3002/8090` 连通性；
- 本地服务未就绪时会快速失败，并提示执行 `./uitest/start-local-all.sh start all`。

输出：
- 日志与汇总写入 `uitest/screenshots/run-<timestamp>/`

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
- 后端 UT / IT（Maven profile）
- 前端 Unit / Integration
- CLI Unit（稳定层）+ 可选 Live E2E

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
4. 以“只要不抛异常”为主要断言。

### 必须

1. 至少一个 happy path + 一个 error path。
2. 关键场景增加边界用例（空、null、极值、并发）。
3. Bug 修复必须补回归测试。

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
