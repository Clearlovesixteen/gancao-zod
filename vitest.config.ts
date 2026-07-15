import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/*/test/**/*.test.ts'],
    coverage: {
      include: ['packages/*/src/**/*.ts'],
      exclude: ['packages/*/src/types.ts'],
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 85,
        branches: 75,
        functions: 55,
        lines: 85,
      },
    },
  },
});
