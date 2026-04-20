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

| 序号 | 文件 | 作用 |
|---|---|---|
| ① | `bestblogs-common/.../ConfigKey.java` | 枚举声明（单一真相源） |
| ② | `bestblogs-admin-api/.../ParameterConfigAdminController.java` | Admin API 暴露 |
| ③ | `bestblogs-admin/**/(parameter-config\|system-config)/...` | 管理后台 UI |

具体校验由 `.claude/agents/config-consistency.md` 在 `/deepreview` 中阻塞执行。

### 分组约定

`ConfigKey.java` 中以注释分组（见文件内 `// ==========` 标记）。新增项必须归入现有分组，或开新分组时同步更新 Admin UI 分组。

常见分组：
- 图片、邮件、通知、Cloudflare、OSS、Workflow API Key
- Job 开关（`*_JOB_DISABLED`）
- Feature Flag（`FEATURE_*_ENABLED`）
- 业务阈值（分数、配额、天数）
- 外部集成（OAuth、XGO、Creem）

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
- `.claude/agents/ops-review.md` — 本文件约束的运行时检查员
- `.claude/agents/config-consistency.md` — ConfigKey 三处一致性守护
