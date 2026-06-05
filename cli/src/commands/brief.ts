/**
 * brief 命令组：今日早报摘要。
 */

import { Command } from 'commander'
import chalk from 'chalk'
import { briefs } from '../api/endpoints.js'
import { resolveJsonMode, writeJson } from '../render/output.js'
import { exitCodeFor, printError } from '../render/errors.js'

export function registerBriefCommands(parent: Command): void {
  const group = parent.command('brief').description('每日早报：今日精选、历史归档')

  group.command('today')
    .description('今日早报（Pro = 个性化，默认 = 公共版）')
    .option('--locale <lang>', '语言（zh|en）', 'zh')
    .option('--json', 'JSON 输出')
    .action(async (opts: { locale?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const locale = opts.locale === 'en' ? 'en' : 'zh'
        let brief: unknown
        let label = '今日早报（公共版）'
        try {
          brief = await briefs.myToday()
          label = '今日早报（Pro 精选）'
        } catch {
          brief = await briefs.publicToday({ locale: locale as 'zh' | 'en' })
        }
        if (asJson) return writeJson({ brief })
        renderBrief(brief, label)
      } catch (err) {
        printError(err, asJson)
        process.exit(exitCodeFor(err))
      }
    })

  group.command('latest')
    .description('最新公开早报')
    .option('--json', 'JSON 输出')
    .action(async (opts: { json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const brief = await briefs.latest()
        if (asJson) return writeJson({ brief })
        renderBrief(brief, '最新早报')
      } catch (err) {
        printError(err, asJson)
        process.exit(exitCodeFor(err))
      }
    })
}

function renderBrief(brief: unknown, label: string): void {
  const b = brief as any
  if (!b) {
    process.stdout.write(chalk.yellow(`${label}：暂无数据\n`))
    return
  }
  process.stdout.write(chalk.bold(`\n${label}`))
  if (b.briefDate) process.stdout.write(chalk.dim(` · ${b.briefDate}`))
  process.stdout.write('\n')
  if (b.podcastTitle) process.stdout.write(chalk.italic(`  "${b.podcastTitle}"\n`))
  if (b.editorIntro) process.stdout.write(`\n${b.editorIntro}\n`)
  const items: unknown[] = b.contentItems ?? []
  if (items.length > 0) {
    process.stdout.write(chalk.bold(`\n精选内容（${items.length} 篇）\n`))
    items.forEach((item, idx) => {
      const it = item as any
      const title = it.title ?? '(无标题)'
      const source = it.sourceName ? chalk.dim(` · ${it.sourceName}`) : ''
      const featured = it.featured ? chalk.yellow(' ★') : ''
      process.stdout.write(`\n${chalk.dim(String(idx + 1).padStart(2))}. ${chalk.bold(title)}${source}${featured}\n`)
      if (it.matchReason) process.stdout.write(`    ${chalk.dim(it.matchReason)}\n`)
      if (it.resourceId) process.stdout.write(`    ${chalk.dim(it.resourceId)}\n`)
    })
  }
  process.stdout.write('\n')
}
