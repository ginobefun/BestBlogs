/**
 * auth 命令：login / status / logout。
 *
 * login 为交互式：提示用户到 https://bestblogs.dev/settings/api-keys 复制 Key 粘贴回来。
 * 也支持通过 `--api-key` 传参（自动化脚本）。
 */

import { Command } from 'commander'
import chalk from 'chalk'
import prompts from 'prompts'
import { clearApiKey, getConfig, setApiKey, setBaseUrl, configPath } from '../config.js'
import { me } from '../api/endpoints.js'
import { renderKeyValue, writeJson, resolveJsonMode } from '../render/output.js'
import { printError, exitCodeFor } from '../render/errors.js'

export function registerAuthCommands(parent: Command): void {
  const group = parent.command('auth').description('API Key 登录与切换环境')

  group.command('login')
    .description('配置或刷新 BestBlogs API Key')
    .option('--api-key <key>', '直接传入 API Key，跳过交互')
    .option('--base-url <url>', '覆盖默认 API Base URL（如自建/staging）')
    .action(async (opts: { apiKey?: string; baseUrl?: string }) => {
      try {
        if (opts.baseUrl) setBaseUrl(opts.baseUrl)

        let key = opts.apiKey?.trim()
        if (!key) {
          process.stdout.write(
            `${chalk.bold('BestBlogs 登录')}\n` +
            `${chalk.dim('  1. 打开 https://bestblogs.dev/settings/api-keys')}\n` +
            `${chalk.dim('  2. 创建或复制现有 API Key')}\n` +
            `${chalk.dim('  3. 粘贴到下方输入框\n')}`,
          )
          const answers = await prompts({
            type: 'password',
            name: 'key',
            message: '粘贴 API Key',
            validate: (v: string) => (v && v.length > 8 ? true : 'Key 看起来太短'),
          })
          key = answers.key
        }
        if (!key) {
          throw new Error('未提供 API Key，登录取消')
        }
        setApiKey(key)

        // 校验 Key
        const profile = await me.profile()
        process.stdout.write(
          chalk.green('✓ 登录成功\n') +
          `  ${chalk.dim('Config:')} ${configPath()}\n`,
        )
        void profile // 鉴权通过即可，具体字段不强依赖
      } catch (err) {
        printError(err, false)
        process.exit(exitCodeFor(err))
      }
    })

  group.command('status')
    .description('查看当前登录状态与 API 端点')
    .option('--json', 'JSON 输出')
    .action(async (opts: { json?: boolean }) => {
      const asJson = resolveJsonMode(opts)
      const cfg = getConfig()
      const keySource = process.env.BESTBLOGS_API_KEY ? 'env' : 'config'
      try {
        if (!cfg.apiKey) {
          const payload = { loggedIn: false, baseUrl: cfg.baseUrl }
          if (asJson) return writeJson(payload)
          renderKeyValue('Auth Status', [
            ['状态', '未登录'],
            ['Base URL', cfg.baseUrl],
            ['提示', '运行 `bestblogs auth login`'],
          ])
          return
        }
        const profile = await me.profile()
        if (!profile) {
          const payload = { loggedIn: false, baseUrl: cfg.baseUrl, keySource, reason: 'API Key 无效或在当前环境中不存在' }
          if (asJson) return writeJson(payload)
          renderKeyValue('Auth Status', [
            ['状态', '未认证'],
            ['Key 来源', keySource === 'env' ? '环境变量 BESTBLOGS_API_KEY' : '配置文件'],
            ['Base URL', cfg.baseUrl],
            ['提示', 'API Key 无效或在当前环境不存在，请重新登录'],
          ])
          return
        }
        const payload = { loggedIn: true, baseUrl: cfg.baseUrl, keySource, profile }
        if (asJson) return writeJson(payload)
        renderKeyValue('Auth Status', [
          ['状态', '已登录'],
          ['用户', (profile as any).displayName ?? (profile as any).userName ?? (profile as any).email ?? '-'],
          ['Key 来源', keySource === 'env' ? '环境变量 BESTBLOGS_API_KEY' : '配置文件'],
          ['Base URL', cfg.baseUrl],
          ['Config', configPath()],
        ])
      } catch (err) {
        if (asJson) process.stderr.write(JSON.stringify({ success: false, error: { message: (err as Error).message } }) + '\n')
        else printError(err, false)
        process.exit(exitCodeFor(err))
      }
    })

  group.command('logout')
    .description('清空本地 API Key')
    .action(() => {
      clearApiKey()
      process.stdout.write(chalk.green('✓ 已清空配置文件中的 API Key\n'))
      if (process.env.BESTBLOGS_API_KEY) {
        process.stdout.write(
          chalk.yellow('⚠ 检测到环境变量 BESTBLOGS_API_KEY 仍然存在，CLI 将继续使用它。\n') +
          chalk.dim('  请在当前 shell 中执行：unset BESTBLOGS_API_KEY\n'),
        )
      }
    })
}
