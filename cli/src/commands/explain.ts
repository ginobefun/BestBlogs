/**
 * explain 命令组：profile / sources / score。
 *
 * 把 BestBlogs 的判断力暴露给外部：
 * - profile: 画像摘要（兴趣标签 + 语言偏好 + 活跃主题）
 * - sources: 近 7 天各订阅源对早报的贡献
 * - score:   某条资源的质量评分摘要
 */

import { Command } from 'commander'
import chalk from 'chalk'
import { explain } from '../api/endpoints.js'
import { ResourceMetaSchema } from '../api/types.js'
import { resolveJsonMode, renderKeyValue, writeJson } from '../render/output.js'
import { exitCodeFor, printError } from '../render/errors.js'

export function registerExplainCommands(parent: Command): void {
  const group = parent.command('explain').description('解释层：画像 / 来源贡献 / 评分')

  group.command('profile')
    .description('查看兴趣画像摘要')
    .option('--json', 'JSON 输出')
    .action(async (opts: { json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const profile = (await explain.profile()) as any
        if (asJson) return writeJson(profile)
        const explicit = (profile?.explicitInterests ?? []).slice(0, 10)
        const active = (profile?.recentActiveTopics ?? []).slice(0, 8)
        renderKeyValue('兴趣画像', [
          ['冷启动完成', profile?.onboardingCompleted ? '是' : '否'],
          ['语言偏好', profile?.languagePreference ?? '-'],
          ['漂移检测', profile?.driftDetected ? '⚠ 有漂移' : '稳定'],
          ['显式兴趣', explicit.length > 0 ? explicit.map((t: any) => t.tagName ?? t.name ?? t.tagId).join(', ') : '-'],
          ['近期活跃', active.length > 0 ? active.join(', ') : '-'],
        ])
      } catch (err) { printError(err, asJson); process.exit(exitCodeFor(err)) }
    })

  group.command('sources')
    .description('近 N 天关注源对早报的贡献')
    .option('-d, --days <n>', '天数 1-30', '7')
    .option('--json', 'JSON 输出')
    .action(async (opts: { days?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const days = Math.max(1, Math.min(30, Number(opts.days ?? 7)))
        const list = (await explain.sourceContributions(days)) ?? []
        if (asJson) return writeJson({ days, contributions: list })
        process.stdout.write(chalk.bold(`\n近 ${days} 天 · 关注源贡献\n`))
        if (list.length === 0) {
          process.stdout.write(chalk.dim('  暂无数据\n\n'))
          return
        }
        for (const c of list as any[]) {
          const count = c.count ?? c.briefCount ?? 0
          const name = c.sourceName ?? c.sourceId ?? '-'
          process.stdout.write(`  ${chalk.cyan(String(count).padStart(4))}  ${chalk.bold(name)}\n`)
        }
        process.stdout.write('\n')
      } catch (err) { printError(err, asJson); process.exit(exitCodeFor(err)) }
    })

  group.command('score <resourceId>')
    .description('查看资源评分摘要')
    .option('--json', 'JSON 输出')
    .action(async (id: string, opts: { json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const raw = await explain.resourceScore(id)
        const meta = raw ? ResourceMetaSchema.parse(raw) : null
        const payload = {
          resourceId: id,
          score: meta?.score ?? null,
          title: meta?.title ?? null,
          resourceType: meta?.resourceType ?? null,
          language: meta?.language ?? null,
          qualified: (meta as any)?.qualified ?? null,
          sourceName: meta?.sourceName ?? null,
        }
        if (asJson) return writeJson(payload)
        renderKeyValue(`Resource Score · ${meta?.title ?? id}`, [
          ['Resource ID', id],
          ['总分', payload.score ?? '-'],
          ['类型', payload.resourceType ?? '-'],
          ['语言', payload.language ?? '-'],
          ['合格', payload.qualified === null ? '-' : payload.qualified ? '是' : '否'],
          ['来源', payload.sourceName ?? '-'],
        ])
      } catch (err) { printError(err, asJson); process.exit(exitCodeFor(err)) }
    })
}
