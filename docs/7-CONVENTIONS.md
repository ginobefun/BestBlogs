# BestBlogs.dev - Development Conventions

> **版本**: v2.1
> **最后更新**: 2026-03-27
> **状态**: 活文档，持续补充

---

## 1. 代码风格

### 1.1 TypeScript / React

| 规则 | 要求 |
|------|------|
| 导出方式 | 具名导出，禁止使用 `export default` |
| Props 类型 | 每个组件必须定义 Props interface |
| 样式优先 | Tailwind CSS，所有组件支持 `dark:` 变体 |
| 条件类 | 使用 `clsx` + `tailwind-merge` |
| 图标 | Lucide React |

```typescript
// ✅ 正确
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({ variant, onClick }: ButtonProps) { }

// ❌ 错误
export default function Button(props) { }
```

### 1.2 Java

| 规则 | 要求 |
|------|------|
| 版本特性 | 优先使用 Java 21: Record、Pattern Matching、Virtual Threads |
| 命名 | PascalCase 类名，camelCase 方法/变量 |
| 注释 | 中文注释，说明"为什么"而非"是什么" |
| 嵌套限制 | 超过 3 层缩进视为设计问题 |

```java
// ✅ 使用 Record
public record UserDTO(String id, String name) { }

// ✅ 使用 Pattern Matching
if (obj instanceof String s && s.length() > 10) { }

// ✅ 提前 return 减少嵌套
if (user == null) return;
if (!user.isActive()) return;
```

### 1.3 命名规范

| 层级 | Java | TypeScript |
|------|------|------------|
| 组件/类 | `*Controller`, `*Service`, `*Model` | PascalCase 组件名 |
| Hooks | - | `use*` 前缀 |
| 工具函数 | camelCase | camelCase |
| 常量 | UPPER_SNAKE_CASE | UPPER_SNAKE_CASE |
| 类型/接口 | PascalCase | PascalCase |

---

## 2. 关键约束（Critical）

### 2.1 金额字段

**要求**: 必须使用 `BigDecimal`，禁止 `Double`/`Float`

```java
// ❌ 错误
private Double amount;

// ✅ 正确
private BigDecimal amount;
```

### 2.2 多语言处理

**要求**: Controller 必须使用 `LanguageHelper.getEffectiveLanguage()`

```java
// ❌ 错误
LanguageEnum lang = LanguageEnum.parseLanguage(request.getHeader("Accept-Language"));

// ✅ 正确
LanguageEnum lang = LanguageHelper.getEffectiveLanguage(request.getHeader("Accept-Language"));
```

### 2.3 MongoDB 查询

**要求**: 大批量查询必须分页，禁止无限制 `findAll()`

```java
// ❌ 错误
List<Article> articles = articleRepository.findAll();

// ✅ 正确
Pageable pageable = PageRequest.of(0, 20);
Page<Article> articles = articleRepository.findAll(pageable);
```

### 2.4 环境变量安全

**要求**: 前端只能访问 `NEXT_PUBLIC_*` 前缀变量

```typescript
// ❌ 错误
const API_KEY = "sk-1234567890abcdef";

// ✅ 正确
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
```

### 2.5 API 响应格式

**要求**: 所有响应使用 `ApiResponse<T>` 格式

```json
{
  "success": true,
  "message": "操作成功",
  "data": { },
  "errorCode": null
}
```

---

## 3. 模块边界

### 3.1 后端分层依赖

```
Controller 层（API 入口）
    ↓
Application 层（应用服务）
    ↓
Domain 层（领域模型 + 领域服务）
    ↓
Infrastructure 层（Repository + Adapter）
```

**禁止**:
- Controller 直接操作 Repository
- Domain 层依赖 Infrastructure
- 跨层直接使用对象

### 3.2 文件大小限制

| 类型 | 限制 | 超过时行动 |
|------|------|------------|
| 单文件 | ≤ 800 行 | 拆分为多个类/模块 |
| 单包 | ≤ 8 个文件 | 拆分为子包 |

### 3.3 内容工作流边界

- 前台仅消费 `COMPLETED` 状态数据
- 状态转移必须通过 `ResourceModel` 行为方法
- 禁止 Controller 直接修改状态

---

## 4. 安全规范

### 4.1 JWT 认证

- Token 30 分钟过期，自动刷新
- 敏感操作验证 `adminFlag`
- 禁止日志记录完整 token

### 4.2 输入校验

- 所有外部输入必须校验
- 使用 `Optional` 或显式 null 检查
- 单元测试覆盖 null/空字符串场景

### 4.3 SQL/NoSQL 注入防护

- 禁止拼接查询语句
- 使用 Spring Data Repository
- 用户可配置 URL 需校验合法性

---

## 5. 测试规范

### 5.1 覆盖率要求

| 层级 | 覆盖率 |
|------|--------|
| 核心业务逻辑 | > 80% |
| Domain 层 | > 80% |
| 重构前后 | 不能降低 |

### 5.2 测试命名

格式: `test{场景}{期望结果}`

```java
@Test
void testFirstCheckInSuccess() { }

@Test
void testDuplicateCheckInReturnsZeroPoints() { }
```

### 5.3 测试数据库

- 使用 Testcontainers MongoDB（无需本地 MongoDB）
- 功能开关变更后必须调用 `parameterReadService.refreshCache()`
- 错误码断言使用数字字符串（如 `"101003"`）

---

## 6. Git 规范

### 6.1 Issue 关联（必须）

**每次提交必须关联一个 GitHub Issue。** 无 Issue 的工作先创建 Issue 再提交。

Issue 管理原则：
- 所有功能、Bug Fix、运营任务均在 [GitHub Issues](https://github.com/ginobefun/bestblogs-monorepo/issues) 中跟踪
- Issue 使用 Labels 分类：`p0/p1/p2/p3`（优先级）+ `type:*`（类型）+ `area:*`（组件）
- 功能 Issue 需写明验收标准（Acceptance Criteria）

### 6.2 Commit Message

遵循 Conventional Commits，**footer 必须包含 Issue 引用**：

```
<type>(<scope>): <subject>

[可选 body：说明为什么这样做，而非做了什么]

Closes #<issue-number>
```

**Type 说明：**

| Type | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `refactor` | 重构（不改变行为） |
| `perf` | 性能优化 |
| `docs` | 文档变更 |
| `test` | 测试补充 |
| `style` | 样式/格式（不影响逻辑） |
| `ops` | 运维/配置/开关变更 |
| `chore` | 构建工具、依赖升级等杂项 |

**Scope 说明（选填，建议使用）：**

| Scope | 对应模块 |
|-------|---------|
| `brief` | 每日早报 |
| `review` | 每日回顾 |
| `recommend` | 为你推荐 |
| `copilot` | AI 伴读 |
| `subscription` | 订阅源管理 |
| `pro` | Pro 订阅 |
| `search` | 搜索 |
| `openapi` | OpenAPI |
| `landing` | Landing 页面 |
| `settings` | 设置页 |
| `auth` | 鉴权 |
| `infra` | 基础设施 |

**原子提交原则：** 每个 commit 只做一件事，便于 `git bisect`、changelog 生成和 PR review。

**示例：**
```
feat(brief): implement UserBriefPreference settings API

Adds GET/PUT /api/users/me/brief/preferences endpoint and connects
the Settings brief section form to persist user customization.

Closes #101
```

```
fix(copilot): prevent auto-open on first visit during beta

During testing period, copilot panel should not auto-open
to avoid interrupting users before the feature is stable.

Closes #98
```

```
ops(infra): enable ElasticSearch and vector search in production

Configure ES connection pool, verify index health,
and enable FEATURE_VECTOR_SEARCH ConfigKey.

Closes #96
```

### 6.3 禁止操作

- ❌ 更新 git config
- ❌ `push --force` 到 main/master
- ❌ `git reset --hard` 除非明确要求
- ❌ `--no-verify` 跳过 hooks
- ❌ 提交不关联 Issue（紧急 hotfix 除外，事后补充）

---

## 6.5 可观测性约定（IMPORTANT）

新增/修改代码涉及外部调用、定时任务、告警规则时，必须遵守以下硬约束（详细条款见 `bestblogs-docs/11-OPERATIONS.md` §开发时的监控与告警要求）：

- **事件常量集中**：后端事件名引用统一常量类，禁止硬编码字符串；新增事件先更新 `bestblogs-docs/specs/observability-event-catalog.md`
- **外部调用双埋**：AI / TTS / HTTP 入口 try-finally 同时上报 Micrometer Counter/Timer + 分析平台事件；失败分支区分 `SUCCESS`/`FAILED`/`TIMEOUT`/`RATELIMITED`
- **Job 自动三写**：标准 Job 基类和 Job 锁注解自动写 MongoDB 执行日志 + Meter + 分析平台事件；日级/周级 Job 必须在健康检查 Job 中登记宽松阈值
- **告警统一入口**：通过统一告警分发服务触发，禁止绕过直接调通知适配层；`deduplicateKey` 按 `{source}:{alertName}:{granularity|param}` 命名
- **告警级别语义**：`CRITICAL`=任意一次告警（用户已受影响）、`WARNING`=阈值/滑窗触发、`INFO`=仅日志不触达
- **内部端点**：`/api/internal/*` 内部端点必须从公网限流过滤器跳过，避免告警洪峰被 503 误触
- **敏感字段**：禁止把完整 userId/email/连接字符串写入告警内容；errMsg 上报前截断并做白名单净化
- **Meter 命名**：`bestblogs.{module}.{action}.{result}`；分析平台事件命名：`{domain}_{action}[_outcome]` snake_case
- **告警阈值**：全部走 `ALERT_*` ConfigKey 动态调整；代码内仅保留 fallback 默认值

---

## 7. 性能规范

### 7.1 接口响应时间

| 指标 | 要求 |
|------|------|
| P95 | < 200ms |
| P99 | < 500ms |

超过限制必须优化（加索引、加缓存、异步处理）

### 7.2 大列表处理

- 超过 100 条使用虚拟滚动（`react-window`）
- 分页从 1 开始（`currentPage=1`）

---

## 8. 文档规范

### 8.1 新增功能

1. 更新 `2-PRODUCT.md` 产品能力地图
2. 如需架构变更，更新 `4-ARCHITECTURE.md`
3. 关键决策记录到 `2-PRODUCT.md` 或 `4-ARCHITECTURE.md`（不再单独维护 DECISIONS.md）

### 8.2 代码注释

- 说明"为什么"（Why），而非"是什么"（What）
- 中文注释

```java
// ❌ 错误
// Check if user is null
if (user == null) { }

// ✅ 正确
// 未登录用户不能操作，直接返回 401
if (user == null) { }
```

---

## 9. AI 协作技巧

### 9.1 Bug 报告模板

必须提供三要素:
1. 如何复现：具体操作步骤
2. 期望结果：正常应该看到什么
3. 实际结果：当前错误（含日志）

### 9.2 代码审查提示

```
Grill me on these changes and don't make a PR until I pass your test.
Prove to me this works.
```

### 9.3 规则更新

当 AI 犯错被纠正后:
```
Update the relevant CLAUDE.md so you don't make that mistake again.
```

---

## 10. 相关文档

| 文档 | 路径 | 说明 |
|------|------|------|
| 产品蓝图 | `2-PRODUCT.md` | 产品策略、能力矩阵、路线 |
| 技术架构 | `4-ARCHITECTURE.md` | 系统架构、数据流 |
| 设计原则 | `5-DESIGN.md` | 视觉与交互规范 |
| UI 执行规范 | `6-UI-SPEC.md` | UI 组件与交互细则 |
| 术语规范 | `10-TERMINOLOGY.md` | 中英术语与统一表达 |
| 当前状态 | `8-CURRENT_STATE.md` | 里程碑状态与待办 |

---

## 11. 更新日志

| 日期 | 变更 |
|------|------|
| 2026-03-27 | 更新文档引用，对齐新文档体系（编号前缀命名） |
| 2026-03-23 | 创建 CONVENTIONS.md，整合 SKILL.md 内容 |
| 2026-02-05 | 初始化团队规则库 |
