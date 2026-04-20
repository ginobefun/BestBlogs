/**
 * discover 命令组：today / for-you / following / search / newsletters / newsletter。
 */

import { Command } from 'commander'
import chalk from 'chalk'
import { feeds, newsletters, search, trending } from '../api/endpoints.js'
import { ResourceMetaSchema } from '../api/types.js'
import { discoverToday } from '../orchestration/discoverToday.js'
import { fromResourceMeta } from '../utils/normalize.js'
import { renderCandidateList, resolveJsonMode, writeJson } from '../render/output.js'
import { exitCodeFor, printError } from '../render/errors.js'

function parseLimit(val: string | undefined, def = 20): number {
  const n = Number(val ?? def)
  return Number.isFinite(n) && n > 0 ? n : def
}

export function registerDiscoverCommands(parent: Command): void {
  const group = parent.command('discover').description('发现：今日、个性化、关注流、搜索、周刊')

  group.command('today')
    .description('今天最值得读的内容（Pro → 个性化 → 公共 → for-you → following 回退链）')
    .option('-l, --limit <n>', '返回条数', '20')
    .option('--json', 'JSON 输出')
    .action(async (opts: { limit?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const result = await discoverToday({ limit: parseLimit(opts.limit) })
        if (asJson) return writeJson(result)
        const label = result.primarySource === 'my_brief' ? 'Today (Pro 精选)' : 'Today (公共精选)'
        renderCandidateList(result.candidates, label)
        if (result.fallbackApplied) {
          process.stdout.write(chalk.yellow(`⚠ 已触发降级回退（来源链: ${result.details.triedSources.join(' → ')}）\n`))
        }
      } catch (err) {
        printError(err, asJson)
        process.exit(exitCodeFor(err))
      }
    })

  group.command('for-you')
    .description('个性化推荐流（需 Pro）')
    .option('-l, --limit <n>', '返回条数', '20')
    .option('--lang <code>', 'language 过滤（en_US / zh_CN）')
    .option('--json', 'JSON 输出')
    .action(async (opts: { limit?: string; lang?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const page = await feeds.forYou({ page: 1, pageSize: parseLimit(opts.limit), language: opts.lang })
        const metas = (page?.dataList ?? []).map((r) => ResourceMetaSchema.parse(r))
        const candidates = metas.map((m) => fromResourceMeta(m))
        if (asJson) return writeJson({ candidates })
        renderCandidateList(candidates, 'For You')
      } catch (err) {
        printError(err, asJson)
        process.exit(exitCodeFor(err))
      }
    })

  group.command('following')
    .description('关注源内容流')
    .option('-l, --limit <n>', '返回条数', '20')
    .option('--lang <code>', 'language 过滤')
    .option('--json', 'JSON 输出')
    .action(async (opts: { limit?: string; lang?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const page = await feeds.subscriptions({ page: 1, pageSize: parseLimit(opts.limit), language: opts.lang })
        const metas = (page?.dataList ?? []).map((r) => ResourceMetaSchema.parse(r))
        const candidates = metas.map((m) => fromResourceMeta(m))
        if (asJson) return writeJson({ candidates })
        renderCandidateList(candidates, 'Following')
      } catch (err) {
        printError(err, asJson)
        process.exit(exitCodeFor(err))
      }
    })

  group.command('search <query...>')
    .description('关键词搜索内容')
    .option('-l, --limit <n>', '返回条数', '20')
    .option('--type <t>', 'ARTICLE / PODCAST / VIDEO / TWITTER')
    .option('--lang <code>', 'en_US / zh_CN')
    .option('--sort <s>', 'recent / score / readCount')
    .option('--json', 'JSON 输出')
    .action(async (queryParts: string[], opts: { limit?: string; type?: string; lang?: string; sort?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const raw = await search.resources({
          q: queryParts.join(' '),
          pageSize: parseLimit(opts.limit),
          type: opts.type,
          language: opts.lang,
          sort: opts.sort,
        })
        const list = extractList(raw)
        const candidates = list.map((r) => fromResourceMeta(ResourceMetaSchema.parse(r)))
        if (asJson) return writeJson({ candidates })
        renderCandidateList(candidates, `Search: ${queryParts.join(' ')}`)
      } catch (err) {
        printError(err, asJson)
        process.exit(exitCodeFor(err))
      }
    })

  group.command('trending')
    .description('热趋内容（今日 / 本周 / 本月）')
    .option('-p, --period <p>', 'today | week | month', 'week')
    .option('-l, --limit <n>', '返回条数', '20')
    .option('--lang <code>', '语言过滤（en_US / zh_CN）')
    .option('--json', 'JSON 输出')
    .action(async (opts: { period?: string; limit?: string; lang?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const validPeriod: 'today' | 'week' | 'month' = ['today', 'week', 'month'].includes(opts.period ?? '')
          ? (opts.period as 'today' | 'week' | 'month')
          : 'week'
        const raw = await trending.list({ period: validPeriod, limit: parseLimit(opts.limit), language: opts.lang })
        const list = extractList(raw)
        const candidates = list.map((r) => fromResourceMeta(ResourceMetaSchema.parse(r)))
        if (asJson) return writeJson({ period: validPeriod, candidates })
        renderCandidateList(candidates, `Trending · ${validPeriod}`)
      } catch (err) {
        printError(err, asJson)
        process.exit(exitCodeFor(err))
      }
    })

  group.command('newsletters')
    .description('浏览精选周刊')
    .option('-l, --limit <n>', '返回条数', '20')
    .option('--json', 'JSON 输出')
    .action(async (opts: { limit?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const raw = await newsletters.list({ pageSize: parseLimit(opts.limit) })
        const list = extractList(raw)
        if (asJson) return writeJson({ newsletters: list })
        process.stdout.write(chalk.bold(`\n周刊（${list.length} 期）\n`))
        for (const nl of list) {
          const title = (nl as any).title ?? '(untitled)'
          const id = (nl as any).id ?? '-'
          const time = (nl as any).publishTime ?? ''
          process.stdout.write(`  ${chalk.dim(time)}  ${chalk.bold(title)}  ${chalk.dim(id)}\n`)
        }
      } catch (err) {
        printError(err, asJson)
        process.exit(exitCodeFor(err))
      }
    })

  group.command('newsletter <id>')
    .description('查看单期周刊详情')
    .option('--json', 'JSON 输出')
    .action(async (id: string, opts: { json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const data = await newsletters.get(id)
        if (asJson) return writeJson(data)
        const anyData = data as any
        process.stdout.write(chalk.bold(`\n${anyData?.title ?? '(untitled)'}\n`))
        process.stdout.write(chalk.dim(`${anyData?.publishTime ?? ''}\n\n`))
        if (anyData?.summary) process.stdout.write(`${anyData.summary}\n\n`)
        const articles = anyData?.articles ?? anyData?.items ?? []
        if (Array.isArray(articles) && articles.length > 0) {
          for (const a of articles) {
            process.stdout.write(`  · ${a.title ?? '-'}\n`)
          }
        }
      } catch (err) {
        printError(err, asJson)
        process.exit(exitCodeFor(err))
      }
    })
}

function extractList(raw: unknown): unknown[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  const any = raw as any
  return any.dataList ?? any.items ?? any.results ?? []
}
