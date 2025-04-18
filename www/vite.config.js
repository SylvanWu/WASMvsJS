import { defineConfig } from 'vite';
import path from 'path';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait()  // 支持 WASM 的 top-level await
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@wasm': path.resolve(__dirname, '../calculator/pkg')  // WASM 文件别名
    }
  },

  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    fs: {
      strict: true  // 限制文件系统访问
    }
  },

  optimizeDeps: {
    exclude: ['@wasm/calculator'],  // 排除 WASM 依赖优化
    esbuildOptions: {
      target: 'es2020'  // 支持 top-level await
    }
  },

  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          wasm: ['@wasm/calculator']  // 单独打包 WASM
        }
      }
    }
  },

  assetsInclude: ['**/*.wasm']  // 明确包含 WASM 文件类型
});