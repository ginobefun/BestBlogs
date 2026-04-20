/**
 * 路径集中管理：所有 `/openapi/v2/*` 端点在这里声明，
 * commands/ 里只引用这里的函数，禁止硬编码路径。
 */

import { request } from './client.js'
import type { Bookmark, DailyBrief, Highlight, ResourceMeta } from './types.js'

// ========== Identity ==========

export const me = {
  profile: () => request<unknown>('/openapi/v2/me'),
  proStatus: () => request<unknown>('/openapi/v2/me/pro/status'),
}

// ========== Intake / Onboarding ==========

export const interests = {
  tags: (params?: { category?: string; keyword?: string; limit?: number }) =>
    request<unknown>('/openapi/v2/interests/tags', { query: params, anonymous: true }),
  getMine: () => request<unknown>('/openapi/v2/me/interests'),
  replaceMine: (body: { mode: 'REPLACE' | 'MERGE'; interests: Array<{ tagId: string; weight?: number }>; languagePreference?: string }) =>
    request<unknown>('/openapi/v2/me/interests', { method: 'PUT', body }),
}

export const onboarding = {
  status: () => request<unknown>('/openapi/v2/me/onboarding/status'),
  recommendedSources: (params?: { limit?: number; language?: string }) =>
    request<unknown>('/openapi/v2/me/onboarding/recommended-sources', { query: params }),
  follow: (sourceIds: string[]) =>
    request<unknown>('/openapi/v2/me/onboarding/follow', { method: 'POST', body: { sourceIds } }),
  complete: () =>
    request<unknown>('/openapi/v2/me/onboarding/complete', { method: 'POST' }),
}

// ========== Discover ==========

export const briefs = {
  myToday: () => request<DailyBrief>('/openapi/v2/me/briefs/today'),
  publicToday: (params?: { locale?: 'zh' | 'en' }) =>
    request<DailyBrief>('/openapi/v2/briefs/public/today', { query: params, anonymous: true }),
  latest: () => request<DailyBrief>('/openapi/v2/briefs/latest', { anonymous: true }),
  history: (params: { page?: number; pageSize?: number }) =>
    request<unknown>('/openapi/v2/me/briefs/history', { query: params }),
}

export const feeds = {
  forYou: (params: { page?: number; pageSize?: number; language?: string; uiLang?: string }) =>
    request<{ dataList: ResourceMeta[]; totalCount?: number; currentPage?: number; pageSize?: number }>(
      '/openapi/v2/me/feeds/for-you',
      { query: params },
    ),
  subscriptions: (params: { page?: number; pageSize?: number; language?: string; uiLang?: string }) =>
    request<{ dataList: ResourceMeta[]; totalCount?: number; currentPage?: number; pageSize?: number }>(
      '/openapi/v2/me/feeds/subscriptions',
      { query: params },
    ),
}

export const search = {
  resources: (params: { q: string; type?: string; language?: string; sort?: string; page?: number; pageSize?: number }) => {
    const { q, ...rest } = params
    const body = { query: q, ...rest }
    return request<unknown>('/openapi/v2/resources/search', { method: 'POST', body })
  },
}

export const newsletters = {
  list: (params?: { page?: number; pageSize?: number }) =>
    request<unknown>('/openapi/v2/newsletters', { query: params, anonymous: true }),
  get: (id: string) => request<unknown>(`/openapi/v2/newsletters/${encodeURIComponent(id)}`, { anonymous: true }),
}

export const trending = {
  list: (params?: { period?: 'today' | 'week' | 'month'; limit?: number; language?: string }) =>
    request<unknown>('/openapi/v2/resources/trending', { query: params, anonymous: true }),
}

// ========== Read ==========

export const resources = {
  meta: (id: string, params?: { language?: string }) =>
    request<ResourceMeta>(`/openapi/v2/resources/${encodeURIComponent(id)}/meta`, { query: params, anonymous: true }),
  markdown: (id: string) =>
    request<string>(`/openapi/v2/resources/${encodeURIComponent(id)}/markdown`, { anonymous: true }),
  content: (id: string) =>
    request<unknown>(`/openapi/v2/resources/${encodeURIComponent(id)}/content`, { anonymous: true }),
  markRead: (id: string) =>
    request<void>(`/openapi/v2/resources/${encodeURIComponent(id)}/read`, { method: 'POST' }),
  marginNotes: (id: string) =>
    request<unknown>(`/openapi/v2/resources/${encodeURIComponent(id)}/margin-notes`),
}

// ========== Capture ==========

export const bookmarks = {
  list: (params: { page?: number; pageSize?: number; tagId?: string; folderId?: string; keyword?: string }) =>
    request<{ dataList: Bookmark[]; totalCount?: number }>('/openapi/v2/me/bookmarks', { query: params }),
  create: (body: { resourceId: string; note?: string; tagIds?: string[]; folderId?: string }) =>
    request<Bookmark>('/openapi/v2/me/bookmarks', { method: 'POST', body }),
  update: (resourceId: string, body: { note?: string; tagIds?: string[] }) =>
    request<Bookmark>(`/openapi/v2/me/bookmarks/${encodeURIComponent(resourceId)}`, { method: 'PUT', body }),
  delete: (resourceId: string) =>
    request<void>(`/openapi/v2/me/bookmarks/${encodeURIComponent(resourceId)}`, { method: 'DELETE' }),
  check: (resourceId: string) =>
    request<{ bookmarked: boolean }>(`/openapi/v2/me/bookmarks/${encodeURIComponent(resourceId)}/check`),
}

export const highlights = {
  list: (params: { page?: number; pageSize?: number; entryType?: 'all' | 'highlight' | 'note'; resourceId?: string; tagId?: string; folderId?: string; keyword?: string }) =>
    request<{ dataList: Highlight[]; totalCount?: number }>('/openapi/v2/me/highlights', { query: params }),
  create: (body: { resourceId: string; highlightedText: string; note?: string; color?: string }) =>
    request<Highlight>('/openapi/v2/me/highlights', { method: 'POST', body }),
  update: (highlightId: string, body: { note?: string; color?: string }) =>
    request<Highlight>(`/openapi/v2/me/highlights/${encodeURIComponent(highlightId)}`, { method: 'PUT', body }),
  delete: (highlightId: string) =>
    request<void>(`/openapi/v2/me/highlights/${encodeURIComponent(highlightId)}`, { method: 'DELETE' }),
  byResource: (resourceId: string) =>
    request<Highlight[]>(`/openapi/v2/me/highlights/resource/${encodeURIComponent(resourceId)}`),
}

export const history = {
  list: (params: { page?: number; pageSize?: number }) =>
    request<unknown>('/openapi/v2/me/history', { query: params }),
  delete: (resourceId: string) =>
    request<void>(`/openapi/v2/me/history/${encodeURIComponent(resourceId)}`, { method: 'DELETE' }),
  clear: () => request<void>('/openapi/v2/me/history', { method: 'DELETE' }),
}

// ========== Explain ==========

export const explain = {
  profile: () => request<unknown>('/openapi/v2/me/interests'),
  sourceContributions: (days = 7) =>
    request<unknown[]>('/openapi/v2/me/subscriptions/contributions', { query: { days } }),
  resourceScore: (id: string) =>
    request<ResourceMeta>(`/openapi/v2/resources/${encodeURIComponent(id)}/meta`, { anonymous: true }),
}
