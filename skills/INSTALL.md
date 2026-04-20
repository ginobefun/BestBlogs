# 安装 bestblogs-skills

## 1. 先安装 CLI

所有 skill 都 shell out 到 `bestblogs` CLI，所以第一步是装它：

```bash
npm install -g @bestblogs/cli
# 首次使用
bestblogs auth login
bestblogs auth status    # 验证 API Key 可用
```

## 2. 安装 Skills 到 Claude Code

```bash
cd bestblogs-skills
./install.sh
```

安装脚本做的事：

- 检查 `bestblogs` CLI 是否在 PATH
- 把 `skills/bestblogs-*` 软链到 `${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}/`

安装完重启 Claude Code（或其他 skill-aware 客户端）即可。

## 3. 触发验证

在 Claude Code 里说：

> 今天 BestBlogs 有什么值得读的？

应当看到 `bestblogs-discover` skill 被主动调用，返回一个候选列表带 candidateSource 徽标。

## 其他客户端

### Cursor custom tool

```jsonc
{
  "name": "bestblogs_discover_today",
  "command": "bestblogs discover today --limit 20 --json",
  "description": "Fetch today's worth-reading content from BestBlogs"
}
```

### OpenClaw / 任何 shell-capable agent

直接 shell out 调用 CLI 即可，SKILL.md 里的动作示例可以原样使用。

## 升级

```bash
npm update -g @bestblogs/cli
cd bestblogs-skills && git pull && ./install.sh    # 软链保持不变，skills 内容已更新
```

## 卸载

```bash
rm -r ~/.claude/skills/bestblogs-*
npm uninstall -g @bestblogs/cli
```
