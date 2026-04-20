# Changelog

## 0.1.0 (2026-04-16)

初版。覆盖 `/openapi/v2/*` 的核心阅读工作流。

### 新增

- `auth login / status / logout`
- `intake setup / show`
- `discover today / for-you / following / search / trending / newsletters / newsletter <id>`
- `read deep <resourceId>`（带 `--markdown-only` / `--json` / `--no-mark-read`）
- `capture bookmark add / list / update / remove`（add 幂等）
- `capture highlight add / update / remove`
- `capture highlights / notes`（使用 `entryType=highlight|note` 服务端过滤）
- `capture history list / remove / clear`
- `explain profile / sources --days N / score <id>`

### 解释字段

`discover today` 编排 my_brief → public_brief → for_you → following 回退链；每条候选携带 `candidateSource` / `selectionReason` / `fallbackApplied` / `personalized`（依赖后端 v2.0.7）。

### 契约

- 响应包络：`{success, code, message, requestId, data}`
- 错误对象：`{success:false, error:{code, httpStatus, message, retryable}}`
- 退出码：`1` 通用、`2` 认证、`3` 权限、`4` not-found、`5` 限流、`6` 5xx

### Bin 别名

- `bestblogs`（主命令）
- `bbcli`（短别名，与 GitHub Issue #108 MVP 命名对齐）
