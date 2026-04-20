/**
 * capture 命令组：bookmark / highlight / note / history 的 CRUD。
 *
 * 重点：
 * - bookmark add 是幂等的（后端保证）
 * - highlights list 和 notes list 用 entryType 切分
 */

import { Command } from 'commander'
import chalk from 'chalk'
import prompts from 'prompts'
import { bookmarks, highlights, history } from '../api/endpoints.js'
import { resolveJsonMode, renderKeyValue, writeJson } from '../render/output.js'
import { exitCodeFor, printError } from '../render/errors.js'

function parseLimit(val: string | undefined, def = 20): number {
  const n = Number(val ?? def)
  return Number.isFinite(n) && n > 0 ? n : def
}

function extractList(raw: unknown): any[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  return (raw as any).dataList ?? (raw as any).items ?? []
}

export function registerCaptureCommands(parent: Command): void {
  const group = parent.command('capture').description('收藏、划线、笔记、历史')

  // ========== bookmark ==========
  const bookmark = group.command('bookmark').description('收藏管理')

  bookmark.command('add <resourceId>')
    .description('添加收藏（幂等）')
    .option('-n, --note <text>', '收藏备注')
    .option('--tag <tagIds>', '逗号分隔的 tagId')
    .option('--folder <folderId>', 'folderId')
    .option('--json', 'JSON 输出')
    .action(async (resourceId: string, opts: { note?: string; tag?: string; folder?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const body = {
          resourceId,
          note: opts.note,
          tagIds: opts.tag ? opts.tag.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
          folderId: opts.folder,
        }
        const bookmark = await bookmarks.create(body)
        if (asJson) return writeJson(bookmark)
        process.stdout.write(chalk.green(`✓ 已收藏 ${chalk.bold(bookmark.resourceId)}\n`))
        if (bookmark.note) process.stdout.write(`  ${chalk.dim('Note:')} ${bookmark.note}\n`)
      } catch (err) { printError(err, asJson); process.exit(exitCodeFor(err)) }
    })

  bookmark.command('list')
    .description('查看收藏列表')
    .option('-l, --limit <n>', '返回条数', '20')
    .option('--tag <tagId>')
    .option('--folder <folderId>')
    .option('--keyword <kw>')
    .option('--json', 'JSON 输出')
    .action(async (opts: { limit?: string; tag?: string; folder?: string; keyword?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const page = await bookmarks.list({
          page: 1,
          pageSize: parseLimit(opts.limit),
          tagId: opts.tag,
          folderId: opts.folder,
          keyword: opts.keyword,
        })
        const list = page?.dataList ?? []
        if (asJson) return writeJson({ bookmarks: list, totalCount: page?.totalCount })
        process.stdout.write(chalk.bold(`\n收藏（${list.length}${page?.totalCount ? `/${page.totalCount}` : ''}）\n`))
        for (const b of list) {
          process.stdout.write(`\n  ${chalk.bold(b.title ?? '(无标题)')}\n`)
          process.stdout.write(`  ${chalk.dim(b.resourceId)}\n`)
          if (b.note) process.stdout.write(`  ${chalk.italic(b.note)}\n`)
        }
        process.stdout.write('\n')
      } catch (err) { printError(err, asJson); process.exit(exitCodeFor(err)) }
    })

  bookmark.command('update <resourceId>')
    .description('更新 note / tag')
    .option('-n, --note <text>')
    .option('--tag <tagIds>', '逗号分隔 tagId')
    .option('--json', 'JSON 输出')
    .action(async (resourceId: string, opts: { note?: string; tag?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const result = await bookmarks.update(resourceId, {
          note: opts.note,
          tagIds: opts.tag ? opts.tag.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
        })
        if (asJson) return writeJson(result)
        process.stdout.write(chalk.green(`✓ 已更新收藏 ${chalk.bold(resourceId)}\n`))
      } catch (err) { printError(err, asJson); process.exit(exitCodeFor(err)) }
    })

  bookmark.command('remove <resourceId>')
    .description('取消收藏')
    .option('--json', 'JSON 输出')
    .action(async (resourceId: string, opts: { json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        await bookmarks.delete(resourceId)
        if (asJson) return writeJson({ removed: true, resourceId })
        process.stdout.write(chalk.green(`✓ 已取消收藏 ${chalk.bold(resourceId)}\n`))
      } catch (err) { printError(err, asJson); process.exit(exitCodeFor(err)) }
    })

  // ========== highlight ==========
  const highlight = group.command('highlight').description('划线管理（可选附笔记）')

  highlight.command('add')
    .description('新增划线（可选附 note）')
    .requiredOption('-r, --resource <id>', '资源 ID')
    .option('-t, --text <text>', '划线原文（必填；未传时交互输入）')
    .option('-n, --note <note>', '笔记（可选）')
    .option('--color <hex>', '颜色 #FFEB3B', '#FFEB3B')
    .option('--json', 'JSON 输出')
    .action(async (opts: { resource: string; text?: string; note?: string; color: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        let text = opts.text
        if (!text) {
          const a = await prompts({ type: 'text', name: 'text', message: '划线原文' })
          text = a.text
        }
        if (!text) throw new Error('缺少划线原文')
        const result = await highlights.create({
          resourceId: opts.resource,
          highlightedText: text,
          note: opts.note,
          color: opts.color,
        })
        if (asJson) return writeJson(result)
        process.stdout.write(chalk.green(`✓ 已划线（${opts.note ? 'entryType=note' : 'entryType=highlight'}）\n`))
      } catch (err) { printError(err, asJson); process.exit(exitCodeFor(err)) }
    })

  highlight.command('update <highlightId>')
    .description('更新划线 note / color')
    .option('-n, --note <note>')
    .option('--color <hex>')
    .option('--json', 'JSON 输出')
    .action(async (id: string, opts: { note?: string; color?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const result = await highlights.update(id, { note: opts.note, color: opts.color })
        if (asJson) return writeJson(result)
        process.stdout.write(chalk.green(`✓ 已更新 ${chalk.bold(id)}\n`))
      } catch (err) { printError(err, asJson); process.exit(exitCodeFor(err)) }
    })

  highlight.command('remove <highlightId>')
    .description('删除划线/笔记')
    .option('--json', 'JSON 输出')
    .action(async (id: string, opts: { json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        await highlights.delete(id)
        if (asJson) return writeJson({ removed: true, highlightId: id })
        process.stdout.write(chalk.green(`✓ 已删除 ${chalk.bold(id)}\n`))
      } catch (err) { printError(err, asJson); process.exit(exitCodeFor(err)) }
    })

  group.command('highlights')
    .description('查看划线列表（entryType=highlight）')
    .option('-l, --limit <n>', '返回条数', '20')
    .option('--resource <id>')
    .option('--json', 'JSON 输出')
    .action(async (opts: { limit?: string; resource?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const page = await highlights.list({
          page: 1,
          pageSize: parseLimit(opts.limit),
          entryType: 'highlight',
          resourceId: opts.resource,
        })
        renderHighlightList(page, '划线列表', asJson)
      } catch (err) { printError(err, asJson); process.exit(exitCodeFor(err)) }
    })

  group.command('notes')
    .description('查看笔记列表（entryType=note）')
    .option('-l, --limit <n>', '返回条数', '20')
    .option('--resource <id>')
    .option('--json', 'JSON 输出')
    .action(async (opts: { limit?: string; resource?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const page = await highlights.list({
          page: 1,
          pageSize: parseLimit(opts.limit),
          entryType: 'note',
          resourceId: opts.resource,
        })
        renderHighlightList(page, '笔记列表', asJson)
      } catch (err) { printError(err, asJson); process.exit(exitCodeFor(err)) }
    })

  // ========== history ==========
  const historyCmd = group.command('history').description('阅读历史')

  historyCmd.command('list')
    .description('查看阅读历史')
    .option('-l, --limit <n>', '返回条数', '20')
    .option('--json', 'JSON 输出')
    .action(async (opts: { limit?: string; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const page = await history.list({ page: 1, pageSize: parseLimit(opts.limit) })
        const list = extractList(page)
        if (asJson) return writeJson({ history: list })
        process.stdout.write(chalk.bold(`\n阅读历史（${list.length}）\n`))
        for (const h of list) {
          const t = (h as any).resourceTitle ?? (h as any).title ?? '-'
          const id = (h as any).resourceId ?? '-'
          const time = (h as any).readTime ?? (h as any).createdTime ?? ''
          process.stdout.write(`  ${chalk.dim(time)}  ${chalk.bold(t)}  ${chalk.dim(id)}\n`)
        }
      } catch (err) { printError(err, asJson); process.exit(exitCodeFor(err)) }
    })

  historyCmd.command('remove <resourceId>')
    .description('删除单条阅读历史')
    .option('--json', 'JSON 输出')
    .action(async (resourceId: string, opts: { json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        await history.delete(resourceId)
        if (asJson) return writeJson({ removed: true, resourceId })
        process.stdout.write(chalk.green(`✓ 已删除历史 ${chalk.bold(resourceId)}\n`))
      } catch (err) { printError(err, asJson); process.exit(exitCodeFor(err)) }
    })

  historyCmd.command('clear')
    .description('清空全部阅读历史（危险）')
    .option('--yes', '跳过确认')
    .option('--json', 'JSON 输出')
    .action(async (opts: { yes?: boolean; json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        if (!opts.yes) {
          const a = await prompts({ type: 'confirm', name: 'ok', message: '确认清空全部阅读历史？', initial: false })
          if (!a.ok) { process.stdout.write(chalk.dim('已取消\n')); return }
        }
        await history.clear()
        if (asJson) return writeJson({ cleared: true })
        process.stdout.write(chalk.green('✓ 已清空阅读历史\n'))
      } catch (err) { printError(err, asJson); process.exit(exitCodeFor(err)) }
    })
}

function renderHighlightList(page: any, title: string, asJson: boolean): void {
  const list = page?.dataList ?? []
  if (asJson) {
    writeJson({ highlights: list, totalCount: page?.totalCount })
    return
  }
  process.stdout.write(chalk.bold(`\n${title}（${list.length}${page?.totalCount ? `/${page.totalCount}` : ''}）\n`))
  for (const h of list) {
    process.stdout.write(`\n  ${chalk.yellow('▎')} ${chalk.italic(h.highlightedText ?? '-')}\n`)
    if (h.note) process.stdout.write(`    ${chalk.cyan('📝')} ${h.note}\n`)
    process.stdout.write(`    ${chalk.dim('·')} ${chalk.dim(h.resourceTitle ?? h.resourceId ?? '-')}  ${chalk.dim(h.id)}\n`)
  }
  process.stdout.write('\n')
}
