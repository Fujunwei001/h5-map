import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pxtorem from 'postcss-pxtorem';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    postcss: {
      plugins: [
        pxtorem({
          rootValue(res) {
            return res.file.indexOf("vant") !== -1 ? 37.5 : 75;
          },
          propList: ['*'], // 需要转换的属性，默认转换所有属性
          selectorBlackList: [], // CSS选择器黑名单，防止部分选择器被转换
          exclude: /\/node_modules\//i, // 忽略包文件转换rem
        })
      ]
    }
  }
})
