/**
 * read 命令组：deep（本地深读 — 拉取 meta + markdown 给本地 LLM / 阅读器消费，并回传 read 行为）。
 */

import { Command } from 'commander'
import chalk from 'chalk'
import { resources } from '../api/endpoints.js'
import { ResourceMetaSchema } from '../api/types.js'
import { resolveJsonMode, renderKeyValue, writeJson } from '../render/output.js'
import { exitCodeFor, printError } from '../render/errors.js'

export function registerReadCommands(parent: Command): void {
  const group = parent.command('read').description('阅读：深读 + 已读回传')

  group.command('deep <resourceId>')
    .description('本地深度阅读：拉取 meta + markdown，并回传阅读行为')
    .option('--no-mark-read', '不回传 read 行为（默认会回传）')
    .option('--markdown-only', '只输出正文 Markdown（适合管道喂给本地 LLM / 阅读器）')
    .option('--json', 'JSON 输出（meta + markdown + readMarked）')
    .action(async (resourceId: string, opts: { markRead?: boolean; markdownOnly?: boolean; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      const shouldMark = opts.markRead !== false
      try {
        const [metaRaw, markdown] = await Promise.all([
          resources.meta(resourceId),
          resources.markdown(resourceId),
        ])
        const meta = metaRaw ? ResourceMetaSchema.parse(metaRaw) : null

        let readMarked = false
        let markError: string | null = null
        if (shouldMark) {
          try {
            await resources.markRead(resourceId)
            readMarked = true
          } catch (err) {
            markError = (err as Error).message
          }
        }

        if (opts.markdownOnly) {
          if (markdown) process.stdout.write(markdown + '\n')
          return
        }
        if (asJson) {
          return writeJson({ meta, markdown, readMarked, markError })
        }
        renderKeyValue(`Deep Read · ${meta?.title ?? resourceId}`, [
          ['Resource ID', resourceId],
          ['Type', meta?.resourceType ?? '-'],
          ['Language', meta?.language ?? '-'],
          ['Score', meta?.score ?? '-'],
          ['Source', meta?.sourceName ?? '-'],
          ['URL', meta?.url ?? '-'],
          ['Read 已回传', readMarked ? '是' : '否'],
          markError ? ['Read 回传错误', chalk.yellow(markError)] : ['', ''],
        ].filter(([k]) => k !== '') as Array<[string, string]>)
        if (markdown) {
          process.stdout.write(chalk.dim('—— Markdown ——\n'))
          process.stdout.write(markdown + '\n')
        }
      } catch (err) {
        printError(err, asJson)
        process.exit(exitCodeFor(err))
      }
    })
}
