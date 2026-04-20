/**
 * 归一化层单测：覆盖 BriefContentItem / ResourceMeta → NormalizedCandidate 的映射与兜底。
 */

import { describe, it, expect } from 'vitest'
import { fromBriefItem, fromResourceMeta } from '../src/utils/normalize.js'

describe('normalize · fromBriefItem', () => {
  it('完整字段透传', () => {
    const out = fromBriefItem({
      resourceId: 'RAW_1',
      title: 'Title',
      contentType: 'ARTICLE',
      language: 'en_US',
      weightedScore: 90,
      sourceName: 'Source A',
      candidateSource: 'my_brief',
      selectionReason: 'Pro 精选',
      personalized: true,
      fallbackApplied: false,
    })
    expect(out.resourceId).toBe('RAW_1')
    expect(out.candidateSource).toBe('my_brief')
    expect(out.score).toBe(90)
    expect(out.personalized).toBe(true)
    expect(out.fallbackApplied).toBe(false)
    expect(out.selectionReason).toBe('Pro 精选')
  })

  it('缺 selectionReason 时从 matchReason 派生', () => {
    const out = fromBriefItem({
      resourceId: 'RAW_2',
      title: 'T',
      matchReason: 'editor pick',
    })
    expect(out.selectionReason).toBe('editor pick')
  })

  it('没有 weightedScore 时回退到 totalScore', () => {
    const out = fromBriefItem({
      resourceId: 'RAW_3',
      title: 'T',
      totalScore: 82,
    })
    expect(out.score).toBe(82)
  })

  it('fallback 参数强制标记 fallbackApplied=true', () => {
    const out = fromBriefItem({ resourceId: 'RAW_4', title: 'T' }, true)
    expect(out.fallbackApplied).toBe(true)
  })

  it('BriefContentItem 不携带 url_默认为 null', () => {
    const out = fromBriefItem({ resourceId: 'RAW_5', title: 'T' })
    expect(out.url).toBeNull()
  })
})

describe('normalize · fromResourceMeta', () => {
  it('resourceId 优先，fallback 到 id', () => {
    const out = fromResourceMeta({ id: 'ID_1', title: 'T' })
    expect(out.resourceId).toBe('ID_1')
    const out2 = fromResourceMeta({ resourceId: 'RID_2', id: 'ID_2', title: 'T' })
    expect(out2.resourceId).toBe('RID_2')
  })

  it('缺 selectionReason 时从 recommendReason 派生', () => {
    const out = fromResourceMeta({
      resourceId: 'RAW_x',
      title: 'T',
      recommendReason: '匹配你的兴趣：AI Coding',
    })
    expect(out.selectionReason).toBe('匹配你的兴趣：AI Coding')
  })

  it('personalized / fallbackApplied null_归一为 false', () => {
    const out = fromResourceMeta({ resourceId: 'R', title: 'T' })
    expect(out.personalized).toBe(false)
    expect(out.fallbackApplied).toBe(false)
  })

  it('URL 字段透传', () => {
    const out = fromResourceMeta({ resourceId: 'R', title: 'T', url: 'https://x.com' })
    expect(out.url).toBe('https://x.com')
  })
})
