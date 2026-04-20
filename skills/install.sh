#!/usr/bin/env bash
#
# 把 bestblogs skills 安装到 Claude Code skills 目录（软链模式，便于更新）。
# 可通过 CLAUDE_SKILLS_DIR 环境变量改目标位置。
#
set -euo pipefail

TARGET_DIR="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/skills"
FORCE="${FORCE:-0}"

if [ "${1:-}" = "--force" ] || [ "${1:-}" = "-f" ]; then
  FORCE=1
fi

if ! command -v bestblogs >/dev/null 2>&1; then
  echo "⚠️  未检测到 'bestblogs' CLI。先安装：" >&2
  echo "    npm install -g @bestblogs/cli" >&2
  echo "    bestblogs auth login" >&2
  echo "" >&2
fi

if [ ! -d "$SOURCE_DIR" ]; then
  echo "✗ skills/ 目录不存在：$SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"

for skill in "$SOURCE_DIR"/bestblogs-*; do
  name="$(basename "$skill")"
  link="$TARGET_DIR/$name"

  if [ -e "$link" ] || [ -L "$link" ]; then
    if [ -L "$link" ]; then
      # 仅覆盖"指向本仓库 skills/ 的软链"；指向其他位置的软链视为用户自定义，需 --force 才覆盖
      current="$(readlink "$link")"
      if [ "$current" = "$skill" ]; then
        # 已经是正确的软链，跳过
        echo "= Unchanged $name"
        continue
      fi
      if [ "$FORCE" != "1" ]; then
        echo "✗ $link 是指向其他位置的软链（$current），使用 --force 覆盖" >&2
        exit 1
      fi
      rm -f "$link"
    else
      # 普通目录/文件：保护用户自定义内容，必须 --force 才覆盖
      if [ "$FORCE" != "1" ]; then
        echo "✗ $link 已存在且不是由 install.sh 创建的软链，使用 --force 覆盖（会移动到 $link.bak）" >&2
        exit 1
      fi
      mv "$link" "$link.bak.$(date +%s)"
    fi
  fi
  ln -sfn "$skill" "$link"
  echo "✓ Linked $name → $link"
done

echo ""
echo "全部完成。请重启 Claude Code 让新 skills 生效。"
echo "试一下：问 Claude '今天 BestBlogs 有什么值得读的？'"
