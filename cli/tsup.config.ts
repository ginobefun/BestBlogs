import { defineConfig } from 'tsup'
import { readFileSync } from 'fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string }

export default defineConfig({
    entry: ['src/bin/bestblogs.ts'],
    format: ['cjs'],
    target: 'node20',
    clean: true,
    splitting: false,
    define: {
        __CLI_VERSION__: JSON.stringify(version),
    },
})
