import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/**/*.{test,e2e}.ts'],
    testTimeout: 60_000,
  },
})
