import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/main.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  outDir: './dist',
  platform: 'neutral',
  treeshake: 'safest',
  cjsInterop: true,
  dts: true,
  shims: true,
  format: ['cjs', 'esm'],
  // target: ['deno', 'node', 'chrome', 'edge', 'firefox', 'safari']
})