#!/usr/bin/env node
/**
 * bestblogs CLI 入口。
 *
 * 三层分工：
 * - commands/*：声明 + action（薄）
 * - api/*：端点与 http client（对齐 openapi-v2.yaml）
 * - orchestration/*：多步编排（discover today 的回退链）
 */

import { Command } from 'commander'
import { registerAuthCommands } from '../commands/auth.js'
import { registerIntakeCommands } from '../commands/intake.js'
import { registerDiscoverCommands } from '../commands/discover.js'
import { registerReadCommands } from '../commands/read.js'
import { registerCaptureCommands } from '../commands/capture.js'
import { registerExplainCommands } from '../commands/explain.js'

declare const __CLI_VERSION__: string
// tsup injects __CLI_VERSION__ at build time; fall back gracefully in dev (tsx)
const cliVersion: string = (() => { try { return __CLI_VERSION__ } catch { return process.env.npm_package_version ?? '0.0.0-dev' } })()

const program = new Command()
  .name('bestblogs')
  .description('BestBlogs CLI — intake → discover → read → capture（Agent Native）')
  .version(cliVersion)
  .showHelpAfterError('（运行 `bestblogs <command> --help` 查看命令详情）')

registerAuthCommands(program)
registerIntakeCommands(program)
registerDiscoverCommands(program)
registerReadCommands(program)
registerCaptureCommands(program)
registerExplainCommands(program)

program.parseAsync(process.argv).catch((err) => {
  // 兜底：命令层已经 printError 过的不会到这里
  process.stderr.write(`\nUnhandled: ${(err as Error).stack ?? err}\n`)
  process.exit(1)
})
