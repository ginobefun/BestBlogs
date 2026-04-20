---
name: bestblogs-profile
description: Use this skill when the user wants to set up, inspect, or update their BestBlogs interest profile and onboarding state (cold start). Triggers include "帮我做 BestBlogs 冷启动 / 设置兴趣标签 / 看我现在的画像 / bestblogs 的 onboarding", "set up my BestBlogs profile", "what topics have I chosen on BestBlogs". Invokes the `bestblogs` CLI.
---

# bestblogs-profile — BestBlogs Intake（冷启动 / 画像）

## 何时使用

- 用户第一次使用 BestBlogs，希望建立兴趣画像。
- 用户想查看自己当前选了哪些兴趣标签、语言偏好、onboarding 是否完成。
- 用户想重新设置一遍兴趣（作为漂移干预或重置）。

## 原语

| 原语 | CLI | 说明 |
|---|---|---|
| `bestblogs.profile.setup` | `bestblogs intake setup` | 交互或非交互地完成 onboarding |
| `bestblogs.profile.get` | `bestblogs intake show --json` | 获取当前画像 + onboarding 状态 |

## 前置检查

```bash
bestblogs auth status --json
```

若输出 `loggedIn: false` 或报 `AUTH_REQUIRED`，先提示用户运行 `bestblogs auth login`，获取 API Key 来自 https://bestblogs.dev/settings/api-keys。

## 动作

### 非交互建档

```bash
bestblogs intake setup --non-interactive \
  --tags "tag_ai,tag_coding,tag_product" \
  --lang both \
  --source-limit 10 \
  --json
```

输出示例：

```json
{
  "success": true,
  "data": {
    "onboardingCompleted": true,
    "interestTagCount": 3,
    "followedSources": 10,
    "languagePreference": "both"
  }
}
```

### 交互建档（推荐真人场景）

```bash
bestblogs intake setup
```

（CLI 会用 `prompts` 弹出多选，Skill 在 Claude Code 里 fork 子进程执行即可。）

### 查画像

```bash
bestblogs intake show --json
```

关心的字段（parse 时按需取）：

- `data.interests.explicitInterests[]` — 显式兴趣（含 tagName, weight）
- `data.interests.implicitInterests[]` — 隐式兴趣
- `data.interests.recentActiveTopics[]` — 近 7 天活跃主题
- `data.onboarding` — onboarding 状态
- `data.interests.driftDetected` — 是否有漂移

## 错误处理

- `error.code=AUTH_REQUIRED` → 提示运行 `bestblogs auth login`，中断流程
- `error.httpStatus=403` → 某些子能力需要 Pro，提示用户升级
- `error.code=RATE_LIMITED` → CLI 已自动退避重试一次；如仍失败告知用户稍后重试

## 输出契约

Skill 的 caller 应拿到结构化结果，例如：

```json
{
  "onboardingCompleted": true,
  "explicitInterestCount": 6,
  "languagePreference": "both",
  "driftDetected": false,
  "recentActiveTopics": ["AI Coding", "Dev Tools"]
}
```

## 组合建议

- 冷启动完成后，立即调用 `bestblogs-discover` 展示 "today" 列表，给用户第一次价值点击。
- 定期（每周或 drift 触发时）调用 `profile.get`，根据 `driftDetected=true` 建议用户打开 `bestblogs-profile setup` 重新调整。
