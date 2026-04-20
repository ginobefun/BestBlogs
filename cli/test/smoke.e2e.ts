/**
 * E2E 最小闭环烟测。
 *
 * 需要一个可访问的 BestBlogs 后端（默认本地 `http://localhost:8090`，
 * 通过 BESTBLOGS_BASE_URL 覆盖；BESTBLOGS_API_KEY 必填）。
 *
 * 运行：
 *   BESTBLOGS_BASE_URL=http://localhost:8090 BESTBLOGS_API_KEY=bbk_xxx \
 *     npx vitest run test/smoke.e2e.ts
 *
 * 断言链路：intake setup (non-interactive) → discover today →
 *   read deep (first candidate) → capture bookmark add → capture notes list。
 * 若环境变量缺失则 skip。
 */

import { describe, it, expect } from 'vitest'
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'

const cli = 'node'
const binPath = new URL('../dist/bestblogs.js', import.meta.url).pathname

const apiKey = process.env.BESTBLOGS_API_KEY
const baseUrl = process.env.BESTBLOGS_BASE_URL ?? 'http://localhost:8090'
const hasEnv = !!apiKey
const hasBuild = existsSync(binPath)
if (hasEnv && !hasBuild) {
  // eslint-disable-next-line no-console
  console.warn('[smoke] dist/bestblogs.js 不存在，跳过 e2e（请先 `pnpm build`）')
}
const shouldRun = hasEnv && hasBuild

function run(args: string[]): { stdout: string; stderr: string; status: number } {
  try {
    const stdout = execFileSync(cli, [binPath, ...args], {
      env: { ...process.env, BESTBLOGS_API_KEY: apiKey, BESTBLOGS_BASE_URL: baseUrl },
      encoding: 'utf8',
      timeout: 30_000,
    })
    return { stdout, stderr: '', status: 0 }
  } catch (err) {
    const e = err as { stdout?: string; stderr?: string; status?: number }
    return { stdout: e.stdout ?? '', stderr: e.stderr ?? '', status: e.status ?? 1 }
  }
}

function parseJson(out: string): any {
  return JSON.parse(out.trim().split('\n').filter((l) => l.startsWith('{')).join('\n'))
}

describe.skipIf(!shouldRun)('bestblogs CLI E2E smoke', () => {
  it('auth status 可达', () => {
    const r = run(['auth', 'status', '--json'])
    expect(r.status).toBe(0)
    const data = parseJson(r.stdout).data
    expect(data.loggedIn).toBe(true)
  })

  it('discover today 返回带解释字段的候选', () => {
    const r = run(['discover', 'today', '--limit', '5', '--json'])
    expect(r.status, r.stderr).toBe(0)
    const data = parseJson(r.stdout).data
    expect(data.candidates).toBeTypeOf('object')
    if (Array.isArray(data.candidates) && data.candidates.length > 0) {
      const first = data.candidates[0]
      expect(first.resourceId).toBeTypeOf('string')
      // candidateSource 可能为 null（老数据尚未 enrich），但若存在必须是合法枚举
      if (first.candidateSource) {
        expect(['my_brief', 'public_brief', 'public_brief_fallback', 'for_you', 'following'])
          .toContain(first.candidateSource)
      }
    }
  })

  it('最小闭环：discover → read → bookmark → notes', () => {
    const discover = run(['discover', 'today', '--limit', '3', '--json'])
    expect(discover.status, discover.stderr).toBe(0)
    const candidates = parseJson(discover.stdout).data.candidates
    if (!Array.isArray(candidates) || candidates.length === 0) {
      console.warn('[smoke] 今日无候选，跳过深度闭环')
      return
    }
    const first = candidates[0]
    const rid: string = first.resourceId

    const read = run(['read', 'deep', rid, '--json'])
    expect(read.status, read.stderr).toBe(0)
    const readData = parseJson(read.stdout).data
    expect(readData.meta).toBeTruthy()

    const bookmark = run(['capture', 'bookmark', 'add', rid, '--note', 'smoke test', '--json'])
    expect(bookmark.status, bookmark.stderr).toBe(0)

    // 幂等：重复 add 仍 success
    const bookmarkAgain = run(['capture', 'bookmark', 'add', rid, '--json'])
    expect(bookmarkAgain.status).toBe(0)

    const highlight = run(['capture', 'highlight', 'add', '-r', rid, '-t', 'smoke text', '-n', 'smoke note', '--json'])
    expect(highlight.status, highlight.stderr).toBe(0)

    const notes = run(['capture', 'notes', '--limit', '5', '--json'])
    expect(notes.status, notes.stderr).toBe(0)
    const notesData = parseJson(notes.stdout).data
    expect(Array.isArray(notesData.highlights)).toBe(true)

    // 清理
    run(['capture', 'bookmark', 'remove', rid])
  })
})
