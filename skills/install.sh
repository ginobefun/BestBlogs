#!/usr/bin/env bash
#
# 把 bestblogs skills 安装到支持 SKILL.md 的 agent skills 目录（软链模式，便于更新）。
# 默认同时安装到 Claude Code 与 Codex；可用 --client 或 --dir 缩小范围。
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/skills"
PACKAGE_VERSION="$(awk -F'"' '/"version"[[:space:]]*:/ { print $4; exit }' "$SCRIPT_DIR/package.json")"
FORCE="${FORCE:-0}"
CLIENT="${BESTBLOGS_SKILLS_CLIENT:-all}"
CUSTOM_DIR=""

usage() {
  cat <<'EOF'
Usage: ./install.sh [options]

Options:
  --client <all|claude|codex>  Install target client (default: all)
  --dir <path>                 Install to one custom skills directory
  --force, -f                  Replace existing links/files created elsewhere
  --help, -h                   Show this help

Environment:
  BESTBLOGS_SKILLS_CLIENT      Default client when --client is omitted
  CLAUDE_SKILLS_DIR            Claude Code skills dir (default: ~/.claude/skills)
  CODEX_SKILLS_DIR             Codex skills dir (default: ~/.codex/skills)
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --force|-f)
      FORCE=1
      shift
      ;;
    --client)
      CLIENT="${2:-}"
      if [ -z "$CLIENT" ]; then
        echo "✗ --client 需要一个值：all、claude 或 codex" >&2
        exit 1
      fi
      shift 2
      ;;
    --dir)
      CUSTOM_DIR="${2:-}"
      if [ -z "$CUSTOM_DIR" ]; then
        echo "✗ --dir 需要一个目录路径" >&2
        exit 1
      fi
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "✗ 未知参数：$1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if ! command -v bestblogs >/dev/null 2>&1; then
  echo "Warning: 未检测到 'bestblogs' CLI。先安装：" >&2
  echo "    npm install -g @bestblogs/cli" >&2
  echo "    bestblogs auth login" >&2
  echo "" >&2
fi

if [ ! -d "$SOURCE_DIR" ]; then
  echo "✗ skills/ 目录不存在：$SOURCE_DIR" >&2
  exit 1
fi

target_dirs=()

if [ -n "$CUSTOM_DIR" ]; then
  target_dirs+=("$CUSTOM_DIR")
else
  case "$CLIENT" in
    all)
      target_dirs+=("${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}")
      target_dirs+=("${CODEX_SKILLS_DIR:-$HOME/.codex/skills}")
      ;;
    claude)
      target_dirs+=("${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}")
      ;;
    codex)
      target_dirs+=("${CODEX_SKILLS_DIR:-$HOME/.codex/skills}")
      ;;
    *)
      echo "✗ --client 只支持 all、claude 或 codex，收到：$CLIENT" >&2
      exit 1
      ;;
  esac
fi

install_to_dir() {
  local target_dir="$1"

  mkdir -p "$target_dir"
  echo "Installing BestBlogs skills to $target_dir"

  for skill in "$SOURCE_DIR"/bestblogs-*; do
    name="$(basename "$skill")"
    link="$target_dir/$name"

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
    echo "✓ Linked $name -> $link"
  done

  if [ -n "$PACKAGE_VERSION" ]; then
    printf '%s\n' "$PACKAGE_VERSION" > "$target_dir/.bestblogs-version"
  fi
}

for target_dir in "${target_dirs[@]}"; do
  install_to_dir "$target_dir"
  echo ""
done

echo "全部完成。请重启对应 agent 让新 skills 生效。"
echo "Codex 内置 skills（~/.codex/skills/.system）和 gstack skills（~/.codex/skills/gstack）不会被修改。"
echo "试一下：问 agent '今天 BestBlogs 有什么值得读的？'"
