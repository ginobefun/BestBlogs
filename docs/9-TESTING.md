# 9-TESTING.md

本文件是 BestBlogs monorepo 的测试约定事实来源。

## 原则

1. **测试要能防回归**，不是为了覆盖率数字；空 Mock 快速通过的测试等于没有。
2. **分层明确**：UT / IT / E2E 各守一块，不互相替代。
3. **断言具体**：真实字段、真实值、真实错误码，禁止只检查"不抛异常"。
4. **与代码同步演进**：改一个 Controller/Service，配套测试同步改；否则 `/deepreview` 里 `qa-review` 阻塞。

## 测试分层

### 单元测试（Unit Test）

**目标**：单个类/函数的纯逻辑正确性。

**后端（JUnit 5 + Mockito）**：
- 位置：`bestblogs-service/<module>/src/test/java/**`
- 命名：`<TargetClass>Test.java`
- 结构：Given-When-Then
- Mock 允许；**Mock 返回值必须符合契约**（对象非空、字段合理、分支可走通）
- 断言错误码使用 `BizErrorCode` 字符串值，禁止魔法数

**前端（Vitest + RTL）**：
- 位置：`bestblogs-app/**/__tests__/**` 或 `*.test.tsx`
- Hook 独立测试；关键组件做行为级测试
- 避免对实现细节的快照测试

### 集成测试（Integration Test）

**目标**：多组件协作（Controller → Service → Repository → DB）正确。

**后端**：
- 位置：`bestblogs-service/<module>/src/test/java/**`，类名以 `IT` 或 `IntegrationTest` 结尾
- 使用 `@SpringBootTest` + MockMvc
- **使用真实 MongoDB**（本地或 Testcontainers），**禁止** Mock DB
- 每个测试独立事务，结束后清理数据

**前端**：
- Playwright / uitest 用于跨页面交互
- 位置：`uitest/**`
- 需要预设测试账号（见 `uitest/.env.test.local`）

### 端到端测试（E2E）

**目标**：用户真实使用路径。

- 位置：`uitest/**`
- 覆盖关键流程：登录、订阅 Pro、阅读、收藏、兴趣配置、邮件早报
- 运行：`./uitest/start-local-all.sh start all` 起本地全栈，再跑测试脚本

## Mock 约束（**硬门禁**）

### 禁止
- `when(x).thenReturn(null)` 之后又断言 `notNull` — 空 Mock 陷阱
- `verify(x).method()` 但不 verify 参数 — 无意义验证
- 只写一个用例测"正常路径"，忽略错误/边界路径
- 用 Mock 替代真实 DB 做集成测试

### 必须
- Mock 返回值带真实数据结构（id / 时间戳 / 枚举值）
- 至少一个 happy path + 一个 error path
- 边界用例：空、null、极值、并发

## 覆盖度要求

- **新增类必须有配套测试**（至少 happy path + 1 个 error path）
- **修改既有类必须更新对应测试**
- **Bug 修复必须补一个回归用例**，防止同 Bug 再出现
- 覆盖率工具：`./mvnw jacoco:report`（后端）、`pnpm test -- --coverage`（前端），但**数字不是门禁**，测试质量才是

## 常用命令

### 后端

```bash
# 全量测试
cd bestblogs-service && ./mvnw test

# 单模块
./mvnw test -pl bestblogs-api
./mvnw test -pl bestblogs-common
./mvnw test -pl bestblogs-admin-api
./mvnw test -pl bestblogs-worker

# 单类
./mvnw test -pl bestblogs-api -Dtest=FooControllerTest

# 覆盖率
./mvnw verify  # 若配置了 jacoco
```

### 前端

```bash
# bestblogs-app
cd bestblogs-app && npm run test -- --run

# bestblogs-admin
cd bestblogs-admin && pnpm test -- --run

# 覆盖率
pnpm test -- --coverage
```

### 快速验证（`/verify`）

```bash
/verify all        # 所有范围
/verify app        # 仅 bestblogs-app
/verify admin      # 仅 bestblogs-admin
/verify service    # 整个后端
/verify common     # 仅 bestblogs-common
```

## CI 与本地的一致性

- 本地能跑通 = PR 能跑通
- 若本地通过但 CI 失败，优先考虑：环境差异（Node 版本、Java 版本、DB 启动）而非测试本身
- `/commit-pr` 内置硬门禁，本地过了再推，降低 CI 失败率

## 测试数据管理

- **后端**：优先使用 `@BeforeEach` 构造最小数据；禁止依赖既有库数据
- **前端**：固定测试 fixture 放 `__fixtures__/`；Playwright 用独立测试账号
- **敏感数据**：测试账号密码放 `.env.test.local`（不入 git）

## 与其它文档的关系

- `7-CONVENTIONS.md` — 代码规范（测试相关风格遵从其中）
- `/verify` skill — 跑本文件列出的命令的自动化封装
- `.claude/agents/qa-review.md` — 对本文件约束的运行时检查员
