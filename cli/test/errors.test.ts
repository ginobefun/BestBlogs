/**
 * 错误格式化 + 退出码约定的单测。
 */

import { describe, it, expect } from 'vitest'
import { CliApiError } from '../src/api/client.js'
import { CliAuthError } from '../src/config.js'
import { exitCodeFor, toStructuredError } from '../src/render/errors.js'

describe('errors · toStructuredError', () => {
  it('CliApiError 完整透传字段', () => {
    const err = new CliApiError({ httpStatus: 429, code: 'RATE_LIMITED', message: 'too many', retryable: true })
    const out = toStructuredError(err)
    expect(out).toEqual({
      success: false,
      error: { code: 'RATE_LIMITED', httpStatus: 429, message: 'too many', retryable: true },
    })
  })

  it('CliAuthError_code=AUTH_REQUIRED', () => {
    const err = new CliAuthError('please login')
    const out = toStructuredError(err)
    expect(out.error.code).toBe('AUTH_REQUIRED')
    expect(out.error.message).toContain('please login')
  })

  it('普通 Error_降级为 UNKNOWN', () => {
    const out = toStructuredError(new Error('boom'))
    expect(out.error.code).toBe('UNKNOWN')
    expect(out.error.message).toBe('boom')
  })

  it('非 Error 字符串_安全降级', () => {
    const out = toStructuredError('just a string')
    expect(out.error.code).toBe('UNKNOWN')
    expect(out.error.message).toBe('just a string')
  })
})

describe('errors · exitCodeFor', () => {
  const cases: Array<[string, unknown, number]> = [
    ['401 → 2', new CliApiError({ httpStatus: 401, code: 'UNAUTHORIZED', message: 'm' }), 2],
    ['403 → 3', new CliApiError({ httpStatus: 403, code: 'FORBIDDEN', message: 'm' }), 3],
    ['404 → 4', new CliApiError({ httpStatus: 404, code: 'NOT_FOUND', message: 'm' }), 4],
    ['429 → 5', new CliApiError({ httpStatus: 429, code: 'RATE_LIMITED', message: 'm' }), 5],
    ['500 → 6', new CliApiError({ httpStatus: 500, code: 'SERVER_ERROR', message: 'm' }), 6],
    ['CliAuthError → 2', new CliAuthError('login'), 2],
    ['unknown Error → 1', new Error('x'), 1],
  ]
  for (const [label, err, code] of cases) {
    it(label, () => expect(exitCodeFor(err)).toBe(code))
  }
})
