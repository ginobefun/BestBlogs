/**
 * BestBlogs OpenAPI v2 HTTP 客户端。
 *
 * 职责：
 * - 注入 X-API-KEY header
 * - 统一解包 `Response<T>` 包络 {success, code, message, data}
 * - 把 HTTP/业务错误转为 CliApiError，调用方一致处理
 * - 429 自动退避重试一次
 */

import { $fetch, FetchError } from 'ofetch'
import { getConfig } from '../config.js'

export interface ApiEnvelope<T = unknown> {
  success: boolean
  code?: string | null
  message?: string | null
  requestId?: string | null
  data: T
}

export class CliApiError extends Error {
  readonly kind = 'api' as const
  readonly httpStatus: number
  readonly code?: string | null
  readonly retryable: boolean
  readonly requestId?: string | null

  constructor(params: {
    httpStatus: number
    code?: string | null
    message: string
    retryable?: boolean
    requestId?: string | null
  }) {
    super(params.message)
    this.name = 'CliApiError'
    this.httpStatus = params.httpStatus
    this.code = params.code ?? null
    this.retryable = params.retryable ?? false
    this.requestId = params.requestId ?? null
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, unknown>
  /** 若为 true，即使没有 API Key 也允许调用（公开端点，如 /briefs/public/today） */
  anonymous?: boolean
}

async function requestOnce<T>(path: string, options: RequestOptions): Promise<T> {
  const config = getConfig()
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': `bestblogs-cli/${packageVersion}`,
  }
  if (config.apiKey) {
    headers['X-API-KEY'] = config.apiKey
  } else if (!options.anonymous) {
    throw new CliApiError({
      httpStatus: 401,
      code: 'AUTH_REQUIRED',
      message: '未登录或 API Key 未设置，请先运行 `bestblogs auth login`',
    })
  }

  const url = `${config.baseUrl.replace(/\/+$/, '')}${path}`
  const envelope = await $fetch<ApiEnvelope<T>>(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body as Record<string, unknown> | string | undefined,
    query: options.query,
    timeout: 30_000,
  })
  if (!envelope.success) {
    throw new CliApiError({
      httpStatus: 200,
      code: envelope.code,
      message: envelope.message ?? '业务处理失败',
      retryable: false,
    })
  }
  return envelope.data
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  try {
    return await requestOnce<T>(path, options)
  } catch (err) {
    if (err instanceof FetchError) {
      const status = err.status ?? 0
      if (status === 429) {
        await new Promise((r) => setTimeout(r, 1_500))
        try {
          return await requestOnce<T>(path, options)
        } catch (retryErr) {
          if (retryErr instanceof FetchError) {
            throw mapHttpError(retryErr)
          }
          throw retryErr
        }
      }
      throw mapHttpError(err)
    }
    throw err
  }
}

function mapHttpError(err: FetchError): CliApiError {
  const status = err.status ?? 0
  const data = err.data as ApiEnvelope | undefined
  const baseMessage = data?.message ?? err.message
  switch (status) {
    case 401:
      return new CliApiError({ httpStatus: 401, code: 'UNAUTHORIZED', message: 'API Key 无效或已过期，请重新运行 `bestblogs auth login`' })
    case 403:
      return new CliApiError({ httpStatus: 403, code: 'FORBIDDEN', message: baseMessage || '权限不足（部分能力需要 Pro 订阅）' })
    case 404:
      return new CliApiError({ httpStatus: 404, code: 'NOT_FOUND', message: baseMessage || '未找到指定资源' })
    case 409:
      return new CliApiError({ httpStatus: 409, code: 'CONFLICT', message: baseMessage || '操作冲突（可能已存在）' })
    case 429:
      return new CliApiError({ httpStatus: 429, code: 'RATE_LIMITED', message: '请求过于频繁，请稍后再试', retryable: true })
    default:
      if (status >= 500) {
        const detail = baseMessage && baseMessage !== err.message ? `：${baseMessage}` : ''
        return new CliApiError({ httpStatus: status, code: 'SERVER_ERROR', message: `服务暂时不可用，请稍后再试${detail}`, retryable: true, requestId: data?.requestId })
      }
      return new CliApiError({ httpStatus: status, code: 'HTTP_ERROR', message: baseMessage || 'HTTP 请求失败' })
  }
}

declare const __CLI_VERSION__: string
// tsup injects __CLI_VERSION__ at build time; fall back gracefully in dev (tsx)
export const packageVersion: string = (() => { try { return __CLI_VERSION__ } catch { return process.env.npm_package_version ?? '0.0.0-dev' } })()
