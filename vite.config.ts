/// <reference types="vitest" />
/// <reference types="vite/client" />

import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      //https://github.com/uiwjs/react-codemirror/issues/216#issuecomment-2046279796
      // '@codemirror/lang-markdown': path.resolve(
      //   __dirname,
      //   './node_modules/@codemirror/lang-markdown/dist/index.cjs',
      // ),
      // '@codemirror/state': path.resolve(
      //   __dirname,
      //   './node_modules/@codemirror/state/dist/index.cjs'
      // ),
      // '@codemirror/lang-yaml': path.resolve(
      //   __dirname,
      // ),
      // '@codemirror/lang-json': path.resolve(
      //   __dirname,
      //   './node_modules/@codemirror/lang-json/dist/index.cjs'
      // )
    },
  },
  test: {
    // 👋 add the line below to add jsdom to vite
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/testing/setup-tests.ts',
  },
});
