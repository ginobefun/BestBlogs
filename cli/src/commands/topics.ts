/**
 * topics 命令组：主题列表 + 主题详情。
 */

import { Command } from 'commander'
import chalk from 'chalk'
import { topics } from '../api/endpoints.js'
import { TopicListItemSchema, TopicDetailSchema } from '../api/types.js'
import { resolveJsonMode, writeJson } from '../render/output.js'
import { exitCodeFor, printError } from '../render/errors.js'

export function registerTopicsCommands(parent: Command): void {
  const group = parent.command('topics').description('主题：浏览主题列表或查看单个主题详情')

  group.command('list')
    .description('浏览主题列表')
    .option('--type <t>', 'EVENT | DOMAIN | PERSON_ORG | COMPARISON（可选）')
    .option('--lang <code>', '语言（zh | en）', 'zh')
    .option('-p, --page <n>', '页码', '1')
    .option('-l, --limit <n>', '每页条数', '20')
    .option('--json', 'JSON 输出')
    .action(async (opts: { type?: string; lang?: string; page?: string; limit?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const page = await topics.list({
          type: opts.type,
          language: opts.lang,
          page: Number(opts.page ?? 1),
          pageSize: Number(opts.limit ?? 20),
        })
        const list = (page?.dataList ?? []).map((t) => TopicListItemSchema.parse(t))
        if (asJson) return writeJson({ topics: list, totalCount: page?.totalCount })
        renderTopicList(list, page?.totalCount)
      } catch (err) {
        printError(err, asJson)
        process.exit(exitCodeFor(err))
      }
    })

  group.command('get <slug>')
    .description('查看主题详情')
    .option('--lang <code>', '语言（zh | en）', 'zh')
    .option('--json', 'JSON 输出')
    .action(async (slug: string, opts: { lang?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const detail = await topics.get(slug, { language: opts.lang })
        const parsed = TopicDetailSchema.parse(detail)
        if (asJson) return writeJson({ topic: parsed })
        renderTopicDetail(parsed)
      } catch (err) {
        printError(err, asJson)
        process.exit(exitCodeFor(err))
      }
    })
}

function renderTopicList(
  list: Array<{
    slug?: string | null
    type?: string | null
    title?: string | null
    summary?: string | null
    publishedAt?: string | null
    tagCodes?: string[] | null
    pinnedOrder?: number | null
  }>,
  totalCount?: number | null,
): void {
  if (list.length === 0) {
    process.stdout.write(chalk.yellow('暂无主题\n'))
    return
  }
  const total = totalCount != null ? `（共 ${totalCount} 个）` : ''
  process.stdout.write(chalk.bold(`\n主题列表${total}\n`))
  for (const t of list) {
    const pinBadge = t.pinnedOrder != null ? chalk.yellow(` ★${t.pinnedOrder}`) : ''
    const typeBadge = t.type ? chalk.dim(` [${t.type}]`) : ''
    process.stdout.write(`\n  ${chalk.bold(t.title ?? '(untitled)')}${pinBadge}${typeBadge}\n`)
    process.stdout.write(`    ${chalk.dim(`slug: ${t.slug ?? '-'}`)}`)
    if (t.publishedAt) process.stdout.write(chalk.dim(`  · ${t.publishedAt.slice(0, 10)}`))
    process.stdout.write('\n')
    if (t.summary) process.stdout.write(`    ${chalk.dim(t.summary.slice(0, 120))}\n`)
  }
  process.stdout.write('\n')
}

function renderTopicDetail(
  t: {
    slug?: string | null
    type?: string | null
    title?: string | null
    summary?: string | null
    language?: string | null
    tagCodes?: string[] | null
    publishedAt?: string | null
    updatedAt?: string | null
    hasZhVersion?: boolean | null
    hasEnVersion?: boolean | null
    pinnedOrder?: number | null
    [key: string]: unknown
  },
): void {
  process.stdout.write(chalk.bold(`\n${t.title ?? '(untitled)'}`))
  if (t.type) process.stdout.write(chalk.dim(` [${t.type}]`))
  process.stdout.write('\n')
  process.stdout.write(chalk.dim(`slug: ${t.slug ?? '-'}  language: ${t.language ?? '-'}\n`))
  if (t.publishedAt) process.stdout.write(chalk.dim(`published: ${t.publishedAt.slice(0, 10)}`))
  if (t.updatedAt) process.stdout.write(chalk.dim(`  updated: ${t.updatedAt.slice(0, 10)}`))
  if (t.publishedAt || t.updatedAt) process.stdout.write('\n')
  if (t.tagCodes && t.tagCodes.length > 0) {
    process.stdout.write(chalk.dim(`tags: ${t.tagCodes.join(', ')}\n`))
  }
  if (t.summary) process.stdout.write(`\n${t.summary}\n`)
  const langs: string[] = []
  if (t.hasZhVersion) langs.push('zh')
  if (t.hasEnVersion) langs.push('en')
  if (langs.length > 0) process.stdout.write(chalk.dim(`\n可用语言: ${langs.join(' / ')}\n`))
  process.stdout.write('\n')
}
