/**
 * 统一输出层。
 *
 * 所有命令都 `.action(async (opts) => { ... })` 里产出一个 payload，
 * 再调用 `writeResult(payload, { json })` 决定展示形式。
 */

import chalk from 'chalk'
import { getConfig } from '../config.js'

export interface OutputOptions {
  json?: boolean
}

export function resolveJsonMode(cliOpts: OutputOptions): boolean {
  if (cliOpts.json) return true
  const cfg = getConfig()
  return cfg.outputFormat === 'json'
}

export function writeJson(payload: unknown): void {
  process.stdout.write(JSON.stringify({ success: true, data: payload }, null, 2) + '\n')
}

/**
 * 渲染候选列表（discover today/for-you/following/search 共用）。
 */
export function renderCandidateList(
  candidates: Array<{
    resourceId?: string | null
    id?: string | null
    title?: string | null
    url?: string | null
    readUrl?: string | null
    resourceType?: string | null
    resourceTypeDesc?: string | null
    contentType?: string | null
    score?: number | null
    totalScore?: number | null
    weightedScore?: number | null
    language?: string | null
    languageDesc?: string | null
    candidateSource?: string | null
    selectionReason?: string | null
    fallbackApplied?: boolean | null
    personalized?: boolean | null
    sourceName?: string | null
  }>,
  title: string,
): void {
  if (candidates.length === 0) {
    process.stdout.write(chalk.yellow(`${title}：暂无内容\n`))
    return
  }
  process.stdout.write(chalk.bold(`\n${title}（共 ${candidates.length} 条）\n`))
  candidates.forEach((c, idx) => {
    const id = c.resourceId ?? c.id ?? '-'
    const kindLabel = c.resourceTypeDesc ?? formatResourceType(c.resourceType ?? c.contentType)
    const langLabel = c.languageDesc ?? formatLanguage(c.language)
    const score = c.score ?? c.weightedScore ?? c.totalScore
    const sourceLabel = formatCandidateSource(c.candidateSource, c.fallbackApplied)
    const scoreBadge = score != null ? chalk.cyan(`[${score}]`) : ''
    const link = c.readUrl ?? c.url ?? null

    const sourcePart = c.sourceName ? chalk.dim(` · ${c.sourceName}`) : ''
    process.stdout.write(`\n${chalk.dim(String(idx + 1).padStart(2))}. ${chalk.bold(c.title ?? '(无标题)')}${sourcePart}\n`)
    const metaParts = [chalk.dim(kindLabel), scoreBadge, chalk.dim(langLabel), sourceLabel].filter(Boolean)
    if (c.selectionReason) metaParts.push(chalk.italic(chalk.dim(c.selectionReason)))
    process.stdout.write(`    ${metaParts.join(chalk.dim('  '))}\n`)
    process.stdout.write(`    ${chalk.dim(id)}${link ? chalk.dim(' → ') + chalk.underline(link) : ''}\n`)
  })
  process.stdout.write('\n')
}

function formatResourceType(type: string | null | undefined): string {
  if (!type) return '内容'
  const map: Record<string, string> = {
    ARTICLE: '文章', VIDEO: '视频', PODCAST: '播客', NEWSLETTER: '邮件',
    TWITTER: '推文', WEIBO: '微博', WECHAT: '公众号', OTHER: '其他',
  }
  return map[type.toUpperCase()] ?? type
}

function formatLanguage(lang: string | null | undefined): string {
  if (!lang) return ''
  const map: Record<string, string> = {
    zh_CN: '中文', zh_TW: '繁体中文', en_US: '英文', en: '英文', zh: '中文',
  }
  return map[lang] ?? lang
}

function formatCandidateSource(source: string | null | undefined, fallback: boolean | null | undefined): string {
  if (!source) return ''
  const label = (() => {
    switch (source) {
      case 'my_brief': return chalk.magenta('Pro 早报')
      case 'public_brief': return chalk.blue('公共早报')
      case 'public_brief_fallback': return chalk.yellow('公共早报 · 降级')
      case 'for_you': return chalk.green('为你推荐')
      case 'following': return chalk.cyan('关注流')
      default: return chalk.dim(source)
    }
  })()
  if (fallback && !source.includes('fallback')) {
    return `${label}${chalk.yellow(' ↓')}`
  }
  return label
}

/**
 * 简洁 key-value 输出，适合 auth status、intake show 等。
 */
export function renderKeyValue(title: string, rows: Array<[string, string | number | boolean | null | undefined]>): void {
  process.stdout.write(chalk.bold(`\n${title}\n`))
  const labelWidth = Math.max(...rows.map(([k]) => k.length))
  for (const [k, v] of rows) {
    const rendered = v === null || v === undefined || v === '' ? chalk.dim('—') : String(v)
    process.stdout.write(`  ${chalk.dim(k.padEnd(labelWidth))}  ${rendered}\n`)
  }
  process.stdout.write('\n')
}
