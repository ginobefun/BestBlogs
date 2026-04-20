/**
 * CLI 配置读写。
 *
 * 优先级：env 变量 > `~/.bestblogs/config.json` > 默认值。
 * 避免把 API Key 写到 shell history 或公共仓库。
 */

import Conf from 'conf'

export interface CliConfig {
  baseUrl: string
  apiKey?: string
  outputFormat: 'pretty' | 'json'
}

const DEFAULT_BASE_URL = 'https://api.bestblogs.dev'

const store = new Conf<CliConfig>({
  projectName: 'bestblogs',
  schema: {
    baseUrl: { type: 'string', default: DEFAULT_BASE_URL },
    apiKey: { type: 'string' },
    outputFormat: { type: 'string', enum: ['pretty', 'json'], default: 'pretty' },
  },
})

export function getConfig(): CliConfig {
  return {
    baseUrl: process.env.BESTBLOGS_BASE_URL ?? store.get('baseUrl', DEFAULT_BASE_URL),
    apiKey: process.env.BESTBLOGS_API_KEY ?? store.get('apiKey'),
    outputFormat: (process.env.BESTBLOGS_OUTPUT as CliConfig['outputFormat'])
      ?? store.get('outputFormat', 'pretty'),
  }
}

export function setApiKey(apiKey: string): void {
  store.set('apiKey', apiKey)
}

export function clearApiKey(): void {
  store.delete('apiKey')
}

export function setBaseUrl(baseUrl: string): void {
  store.set('baseUrl', baseUrl)
}

export function configPath(): string {
  return store.path
}

export function requireApiKey(): string {
  const { apiKey } = getConfig()
  if (!apiKey) {
    throw new CliAuthError('未登录或 API Key 未设置，请先运行 `bestblogs auth login`')
  }
  return apiKey
}

export class CliAuthError extends Error {
  readonly kind = 'auth' as const
  constructor(message: string) {
    super(message)
    this.name = 'CliAuthError'
  }
}
