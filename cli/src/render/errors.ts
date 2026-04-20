/**
 * CLI 错误可读化。
 *
 * 两种输出模式：
 * - pretty：给人看的彩色中文，带修复建议
 * - json：严格 `{success:false,error:{code,httpStatus,message,retryable}}`，给 Skills/脚本消费
 */

import chalk from 'chalk'
import { CliApiError } from '../api/client.js'
import { CliAuthError } from '../config.js'

export interface StructuredError {
  success: false
  error: {
    code: string
    httpStatus?: number
    message: string
    retryable?: boolean
    requestId?: string | null
  }
}

export function toStructuredError(err: unknown): StructuredError {
  if (err instanceof CliApiError) {
    return {
      success: false,
      error: {
        code: err.code ?? 'API_ERROR',
        httpStatus: err.httpStatus,
        message: err.message,
        retryable: err.retryable,
        requestId: err.requestId,
      },
    }
  }
  if (err instanceof CliAuthError) {
    return {
      success: false,
      error: { code: 'AUTH_REQUIRED', message: err.message },
    }
  }
  const message = err instanceof Error ? err.message : String(err)
  return { success: false, error: { code: 'UNKNOWN', message } }
}

export function printError(err: unknown, asJson: boolean): void {
  const structured = toStructuredError(err)
  if (asJson) {
    process.stderr.write(JSON.stringify(structured) + '\n')
    return
  }
  const { code, message, httpStatus, requestId } = structured.error
  const statusTag = httpStatus ? chalk.dim(`[${httpStatus}]`) : ''
  const reqIdTag = requestId ? chalk.dim(` (requestId: ${requestId})`) : ''
  process.stderr.write(
    `${chalk.red('✗')} ${chalk.bold(code)} ${statusTag} ${message}${reqIdTag}\n`,
  )
}

export function exitCodeFor(err: unknown): number {
  if (err instanceof CliApiError) {
    if (err.httpStatus === 401 || err.code === 'AUTH_REQUIRED') return 2
    if (err.httpStatus === 403) return 3
    if (err.httpStatus === 404) return 4
    if (err.httpStatus === 429) return 5
    if (err.httpStatus >= 500) return 6
  }
  if (err instanceof CliAuthError) return 2
  return 1
}
