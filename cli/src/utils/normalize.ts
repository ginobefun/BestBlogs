/**
 * 响应归一化工具：把后端不同数据源的列表项统一为 CLI 渲染可用的形状。
 */

import type { BriefContentItem, ResourceMeta } from '../api/types.js'

export interface NormalizedCandidate {
  resourceId: string | null
  title: string | null
  readUrl: string | null
  resourceType: string | null
  resourceTypeDesc: string | null
  language: string | null
  languageDesc: string | null
  score: number | null
  sourceName: string | null
  candidateSource: string | null
  selectionReason: string | null
  fallbackApplied: boolean
  personalized: boolean
}

export function fromBriefItem(item: BriefContentItem, fallback = false): NormalizedCandidate {
  const any = item as any
  return {
    resourceId: item.resourceId ?? null,
    title: item.title ?? null,
    readUrl: any.readUrl ?? null,
    resourceType: item.contentType ?? null,
    resourceTypeDesc: any.contentTypeDesc ?? any.resourceTypeDesc ?? null,
    language: item.language ?? null,
    languageDesc: any.languageDesc ?? null,
    score: item.weightedScore ?? item.totalScore ?? null,
    sourceName: item.sourceName ?? null,
    candidateSource: item.candidateSource ?? null,
    selectionReason: item.selectionReason ?? item.matchReason ?? null,
    fallbackApplied: fallback || !!item.fallbackApplied,
    personalized: !!item.personalized,
  }
}

export function fromResourceMeta(meta: ResourceMeta, fallback = false): NormalizedCandidate {
  const any = meta as any
  return {
    resourceId: meta.resourceId ?? meta.id ?? null,
    title: meta.title ?? null,
    readUrl: any.readUrl ?? meta.url ?? null,
    resourceType: meta.resourceType ?? null,
    resourceTypeDesc: any.resourceTypeDesc ?? null,
    language: meta.language ?? null,
    languageDesc: any.languageDesc ?? null,
    score: meta.score ?? null,
    sourceName: meta.sourceName ?? null,
    candidateSource: meta.candidateSource ?? null,
    selectionReason: meta.selectionReason ?? meta.recommendReason ?? null,
    fallbackApplied: fallback || !!meta.fallbackApplied,
    personalized: !!meta.personalized,
  }
}
