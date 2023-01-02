import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import vitePluginEslint from 'vite-plugin-eslint'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni(), vitePluginEslint({
    emitError: false,
    emitWarning: false,
  })],
})
