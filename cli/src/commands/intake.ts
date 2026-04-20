/**
 * intake 命令：setup（冷启动）+ show（查看画像）。
 *
 * setup 走 Playbook A 的 5 个步骤：interests.tags → interests.replace → onboarding.recommendedSources → onboarding.follow → onboarding.complete。
 * 默认交互模式；`--non-interactive` + `--tags/--lang` 给脚本化用。
 */

import { Command } from 'commander'
import chalk from 'chalk'
import prompts from 'prompts'
import { interests, me, onboarding } from '../api/endpoints.js'
import { resolveJsonMode, renderKeyValue, writeJson } from '../render/output.js'
import { exitCodeFor, printError } from '../render/errors.js'

export function registerIntakeCommands(parent: Command): void {
  const group = parent.command('intake').description('冷启动：建立兴趣画像与推荐源')

  group.command('setup')
    .description('引导完成 onboarding（兴趣 → 推荐源 → 完成）')
    .option('--non-interactive', '非交互模式（与 --tags 配合使用）')
    .option('--tags <tagIds>', '逗号分隔的 tagId 列表（非交互）')
    .option('--lang <pref>', '语言偏好：en_first | both | zh_first', 'both')
    .option('--source-limit <n>', '关注推荐源数量', '10')
    .option('--json', 'JSON 输出')
    .action(async (opts: {
      nonInteractive?: boolean
      tags?: string
      lang?: string
      sourceLimit?: string
      json?: boolean
    }) => {
      const asJson = resolveJsonMode(opts)
      try {
        let tagIds: string[] = []
        if (opts.nonInteractive) {
          tagIds = (opts.tags ?? '').split(',').map((s) => s.trim()).filter(Boolean)
          if (tagIds.length === 0) throw new Error('非交互模式需要 --tags 参数')
        } else {
          const tagLibrary = await interests.tags({ limit: 60 })
          const choices = flattenTags(tagLibrary).slice(0, 40).map((t) => ({
            title: `${t.tagName}${t.category ? ` · ${t.category}` : ''}`,
            value: t.tagId,
          }))
          if (choices.length === 0) throw new Error('兴趣标签库为空，请稍后重试')
          const answers = await prompts([
            {
              type: 'multiselect',
              name: 'tagIds',
              message: '选择感兴趣的主题（3-8 个）',
              choices,
              min: 1,
              hint: '- 空格选择，回车确认',
            },
          ])
          tagIds = answers.tagIds ?? []
        }

        await interests.replaceMine({
          mode: 'REPLACE',
          interests: tagIds.map((id) => ({ tagId: id, weight: 1 })),
          languagePreference: opts.lang ?? 'both',
        })

        const recs = await onboarding.recommendedSources({ limit: Number(opts.sourceLimit ?? 10) })
        const sourceIds = extractSourceIds(recs)
        if (sourceIds.length > 0) {
          await onboarding.follow(sourceIds)
        }
        await onboarding.complete()

        const payload = {
          onboardingCompleted: true,
          interestTagCount: tagIds.length,
          followedSources: sourceIds.length,
          languagePreference: opts.lang ?? 'both',
        }
        if (asJson) return writeJson(payload)
        renderKeyValue('Intake 完成', [
          ['兴趣标签', `${tagIds.length} 个`],
          ['已关注源', `${sourceIds.length} 个`],
          ['语言偏好', payload.languagePreference],
          ['下一步', '运行 `bestblogs discover today` 查看今日推荐'],
        ])
      } catch (err) {
        if (asJson) process.stderr.write(JSON.stringify({ success: false, error: { message: (err as Error).message } }) + '\n')
        else printError(err, false)
        process.exit(exitCodeFor(err))
      }
    })

  group.command('show')
    .description('查看当前画像与 onboarding 状态')
    .option('--json', 'JSON 输出')
    .action(async (opts: { json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      try {
        const profile = await me.profile()
        if (!profile) {
          throw new Error('无法获取用户信息，请检查 API Key 是否有效（运行 `bestblogs auth status`）')
        }

        const [interestData, status] = await Promise.all([
          interests.getMine().catch((e: unknown) => { void e; return null }),
          onboarding.status().catch((e: unknown) => { void e; return null }),
        ])

        const payload = { profile, interests: interestData, onboarding: status }
        if (asJson) return writeJson(payload)

        const summary = (interestData as any) ?? {}
        const onboardingStatus = (status as any) ?? {}
        renderKeyValue('Intake · 当前画像', [
          ['登录用户', getDeep<string>(profile, ['displayName', 'userName', 'email', 'userId']) ?? '-'],
          ['Onboarding 完成', String(onboardingStatus.onboardingCompleted ?? (profile as any).onboardingCompleted ?? '-')],
          ['显式兴趣数', String((summary.explicitInterests ?? []).length)],
          ['隐式兴趣数', String((summary.implicitInterests ?? []).length)],
          ['语言偏好', formatLanguagePreference(summary.languagePreference)],
          ['活跃主题', (summary.recentActiveTopics ?? []).slice(0, 5).join(', ') || '-'],
        ])
      } catch (err) {
        if (asJson) process.stderr.write(JSON.stringify({ success: false, error: { message: (err as Error).message } }) + '\n')
        else printError(err, false)
        process.exit(exitCodeFor(err))
      }
    })
}

function flattenTags(library: unknown): Array<{ tagId: string; tagName: string; category?: string }> {
  if (!library || typeof library !== 'object') return []
  const anyLib = library as Record<string, unknown>
  const categories = (anyLib.categories ?? anyLib.groups ?? anyLib.dataList) as unknown[] | undefined
  if (Array.isArray(categories)) {
    const out: Array<{ tagId: string; tagName: string; category?: string }> = []
    for (const group of categories) {
      if (!group || typeof group !== 'object') continue
      const categoryName = (group as any).category ?? (group as any).categoryName ?? (group as any).name
      const tags = (group as any).tags ?? (group as any).items ?? []
      for (const t of tags) {
        const tagId = t?.id ?? t?.tagId
        const tagName = t?.zhName ?? t?.enName ?? t?.tagName
        if (tagId && tagName) out.push({ tagId, tagName, category: categoryName })
      }
    }
    if (out.length > 0) return out
  }
  const direct = (anyLib.tags ?? anyLib.items) as unknown[] | undefined
  if (Array.isArray(direct)) {
    return direct
      .filter((t): t is Record<string, string> => !!t && typeof t === 'object' && ('id' in t || 'tagId' in t))
      .map((t) => ({ tagId: t.id ?? t.tagId, tagName: t.zhName ?? t.enName ?? t.tagName }))
      .filter((t) => t.tagId && t.tagName)
  }
  return []
}

function extractSourceIds(raw: unknown): string[] {
  if (!raw) return []
  const list = Array.isArray(raw) ? raw : ((raw as any)?.dataList ?? (raw as any)?.sources ?? [])
  if (!Array.isArray(list)) return []
  return list
    .map((s: unknown) => {
      if (typeof s === 'string') return s
      if (typeof s === 'object' && s) return (s as any).id ?? (s as any).sourceId ?? null
      return null
    })
    .filter(Boolean) as string[]
}

function formatLanguagePreference(pref: string | undefined): string {
  const map: Record<string, string> = {
    en_first: '英文优先',
    zh_first: '中文优先',
    both: '中英文均可',
  }
  return pref ? (map[pref] ?? pref) : '-'
}

function getDeep<T>(obj: unknown, keys: string[]): T | undefined {
  if (!obj || typeof obj !== 'object') return undefined
  for (const k of keys) {
    const v = (obj as any)[k]
    if (v !== undefined && v !== null && v !== '') return v as T
  }
  return undefined
}
