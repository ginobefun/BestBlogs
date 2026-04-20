/**
 * `discover today` 编排：Pro → my_brief → (回退) for_you → (回退) following → public_brief 兜底。
 *
 * 返回归一化的候选列表 + 本次是否命中降级路径。失败的单条链路会被捕获（403/404 场景下继续回退），
 * 其他错误向外抛出由命令层统一处理。
 */

import { briefs, feeds, me } from '../api/endpoints.js'
import { CliApiError } from '../api/client.js'
import { BriefContentItemSchema, ResourceMetaSchema } from '../api/types.js'
import { fromBriefItem, fromResourceMeta, type NormalizedCandidate } from '../utils/normalize.js'

export interface DiscoverTodayResult {
  candidates: NormalizedCandidate[]
  primarySource: 'my_brief' | 'public_brief' | null
  fallbackApplied: boolean
  details: {
    proChecked: boolean
    triedSources: string[]
  }
}

export async function discoverToday(options: { limit: number }): Promise<DiscoverTodayResult> {
  const limit = Math.max(1, Math.min(50, options.limit))
  const tried: string[] = []
  let fallbackApplied = false
  let primarySource: DiscoverTodayResult['primarySource'] = null

  const isPro = await detectPro()

  const candidates: NormalizedCandidate[] = []

  // Step 1: 首选 my_brief (Pro) 或 public_brief (non-Pro)
  if (isPro) {
    primarySource = 'my_brief'
    tried.push('my_brief')
    const items = await tryBriefItems(() => briefs.myToday())
    candidates.push(...items.map((i) => fromBriefItem(i)))
  } else {
    primarySource = 'public_brief'
    tried.push('public_brief')
    const items = await tryBriefItems(() => briefs.publicToday())
    candidates.push(...items.map((i) => fromBriefItem(i)))
  }

  // Step 2: 若不足则回退到 for_you
  if (candidates.length < limit) {
    tried.push('for_you')
    try {
      const page = await feeds.forYou({ page: 1, pageSize: limit })
      const dataList = (page?.dataList ?? []).map((r) => ResourceMetaSchema.parse(r))
      if (dataList.length > 0) {
        fallbackApplied = true
      }
      candidates.push(...dataList.map((r) => fromResourceMeta(r, fallbackApplied)))
    } catch (err) {
      if (!(err instanceof CliApiError) || (err.httpStatus !== 403 && err.httpStatus !== 404)) {
        throw err
      }
      // Pro 权限不足 / 未启用，继续回退
    }
  }

  // Step 3: 若仍不足再回退到 following
  if (candidates.length < limit) {
    tried.push('following')
    try {
      const page = await feeds.subscriptions({ page: 1, pageSize: limit })
      const dataList = (page?.dataList ?? []).map((r) => ResourceMetaSchema.parse(r))
      if (dataList.length > 0) {
        fallbackApplied = true
      }
      candidates.push(...dataList.map((r) => fromResourceMeta(r, fallbackApplied)))
    } catch (err) {
      if (!(err instanceof CliApiError) || (err.httpStatus !== 403 && err.httpStatus !== 404)) {
        throw err
      }
    }
  }

  // 去重 + 截断
  const seen = new Set<string>()
  const deduped: NormalizedCandidate[] = []
  for (const c of candidates) {
    const key = c.resourceId ?? ''
    if (!key || seen.has(key)) continue
    seen.add(key)
    deduped.push(c)
    if (deduped.length >= limit) break
  }

  return {
    candidates: deduped,
    primarySource,
    fallbackApplied,
    details: { proChecked: true, triedSources: tried },
  }
}

async function detectPro(): Promise<boolean> {
  try {
    const raw = await me.proStatus()
    if (raw && typeof raw === 'object' && 'isPro' in raw) {
      return !!(raw as { isPro?: boolean }).isPro
    }
    if (raw && typeof raw === 'object' && 'data' in raw) {
      const nested = (raw as { data?: { isPro?: boolean } }).data
      return !!nested?.isPro
    }
    return false
  } catch (err) {
    // 未登录 / 获取失败时视作非 Pro，不中断主流程
    if (err instanceof CliApiError) return false
    throw err
  }
}

async function tryBriefItems(fetcher: () => Promise<unknown>): Promise<ReturnType<typeof BriefContentItemSchema.parse>[]> {
  try {
    const data = await fetcher()
    if (!data || typeof data !== 'object') return []
    const items = (data as { contentItems?: unknown }).contentItems
    if (!Array.isArray(items)) return []
    return items.map((it) => BriefContentItemSchema.parse(it))
  } catch (err) {
    if (err instanceof CliApiError && (err.httpStatus === 403 || err.httpStatus === 404)) {
      return []
    }
    throw err
  }
}
