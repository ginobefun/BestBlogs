/**
 * OpenAPI v2 关键响应的 Zod schema。
 *
 * 只覆盖 CLI 用到的字段；使用 `passthrough` 允许后端未来追加字段不破坏 CLI。
 */

import { z } from 'zod'

export const CandidateSourceEnum = z.enum([
  'my_brief',
  'public_brief',
  'public_brief_fallback',
  'for_you',
  'following',
])
export type CandidateSource = z.infer<typeof CandidateSourceEnum>

export const CandidateExplainSchema = z.object({
  candidateSource: CandidateSourceEnum.optional().nullable(),
  selectionReason: z.string().optional().nullable(),
  fallbackApplied: z.boolean().optional().nullable(),
  personalized: z.boolean().optional().nullable(),
})

export const ResourceMetaSchema = z
  .object({
    id: z.string().optional().nullable(),
    resourceId: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    url: z.string().optional().nullable(),
    resourceType: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
    score: z.number().optional().nullable(),
    publishTime: z.string().optional().nullable(),
    sourceName: z.string().optional().nullable(),
    sourceId: z.string().optional().nullable(),
    summary: z.string().optional().nullable(),
    bookmarked: z.boolean().optional().nullable(),
    recommendReason: z.string().optional().nullable(),
    recallSource: z.string().optional().nullable(),
  })
  .merge(CandidateExplainSchema)
  .passthrough()
export type ResourceMeta = z.infer<typeof ResourceMetaSchema>

export const BriefContentItemSchema = z
  .object({
    resourceId: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    contentType: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
    matchReason: z.string().optional().nullable(),
    sourceId: z.string().optional().nullable(),
    sourceName: z.string().optional().nullable(),
    totalScore: z.number().optional().nullable(),
    weightedScore: z.number().optional().nullable(),
    featured: z.boolean().optional().nullable(),
    deepRead: z.boolean().optional().nullable(),
  })
  .merge(CandidateExplainSchema)
  .passthrough()
export type BriefContentItem = z.infer<typeof BriefContentItemSchema>

export const DailyBriefSchema = z
  .object({
    briefDate: z.string().optional().nullable(),
    contentItems: z.array(BriefContentItemSchema).optional().nullable(),
    editorIntro: z.string().optional().nullable(),
    podcastTitle: z.string().optional().nullable(),
  })
  .passthrough()
export type DailyBrief = z.infer<typeof DailyBriefSchema>

export const PaginationSchema = <T extends z.ZodTypeAny>(item: T) =>
  z
    .object({
      currentPage: z.number().optional().nullable(),
      pageSize: z.number().optional().nullable(),
      totalCount: z.number().optional().nullable(),
      pageCount: z.number().optional().nullable(),
      dataList: z.array(item).optional().nullable(),
    })
    .passthrough()

export const BookmarkSchema = z
  .object({
    resourceId: z.string(),
    note: z.string().optional().nullable(),
    tagIds: z.array(z.string()).optional().nullable(),
    folderId: z.string().optional().nullable(),
    createdTime: z.union([z.string(), z.number()]).optional().nullable(),
    updatedTime: z.union([z.string(), z.number()]).optional().nullable(),
    title: z.string().optional().nullable(),
    summary: z.string().optional().nullable(),
  })
  .passthrough()
export type Bookmark = z.infer<typeof BookmarkSchema>

export const HighlightSchema = z
  .object({
    id: z.string().optional().nullable(),
    resourceId: z.string().optional().nullable(),
    highlightedText: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
    resourceTitle: z.string().optional().nullable(),
    resourceType: z.string().optional().nullable(),
    createdTime: z.union([z.string(), z.number()]).optional().nullable(),
  })
  .passthrough()
export type Highlight = z.infer<typeof HighlightSchema>

export const ProStatusSchema = z
  .object({
    isPro: z.boolean().optional().nullable(),
    status: z.string().optional().nullable(),
    plan: z.string().optional().nullable(),
  })
  .passthrough()

export const InterestTagSchema = z
  .object({
    tagId: z.string().optional().nullable(),
    tagName: z.string().optional().nullable(),
    weight: z.number().optional().nullable(),
  })
  .passthrough()

export const InterestProfileSchema = z
  .object({
    userId: z.string().optional().nullable(),
    explicitInterests: z.array(z.any()).optional().nullable(),
    implicitInterests: z.array(z.any()).optional().nullable(),
    recentActiveTopics: z.array(z.string()).optional().nullable(),
    onboardingCompleted: z.boolean().optional().nullable(),
    driftDetected: z.boolean().optional().nullable(),
    languagePreference: z.string().optional().nullable(),
  })
  .passthrough()

export const SourceContributionSchema = z
  .object({
    sourceId: z.string().optional().nullable(),
    sourceName: z.string().optional().nullable(),
    count: z.number().optional().nullable(),
  })
  .passthrough()

export const NewsletterSchema = z
  .object({
    id: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    summary: z.string().optional().nullable(),
    publishTime: z.string().optional().nullable(),
  })
  .passthrough()
