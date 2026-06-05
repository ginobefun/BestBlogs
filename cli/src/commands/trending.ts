/**
 * trending 命令：热门内容（今日 / 本周 / 本月）。
 *
 * 独立顶级命令，也可通过 `discover trending` 访问（两者底层共享同一 endpoint）。
 */

import { Command } from 'commander'
import { trending } from '../api/endpoints.js'
import { ResourceMetaSchema } from '../api/types.js'
import { fromResourceMeta } from '../utils/normalize.js'
import { renderCandidateList, resolveJsonMode, writeJson } from '../render/output.js'
import { exitCodeFor, printError } from '../render/errors.js'

function parseLimit(val: string | undefined, def = 20): number {
  const n = Number(val ?? def)
  return Number.isFinite(n) && n > 0 ? n : def
}

export function registerTrendingCommand(parent: Command): void {
  parent.command('trending')
    .description('热门精选内容（today / week / month）')
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
        renderCandidateList(candidates, `热门精选 · ${periodLabel(validPeriod)}`)
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

function periodLabel(period: string): string {
  switch (period) {
    case 'today': return '今日'
    case 'month': return '本月'
    default: return '本周'
  }
}
