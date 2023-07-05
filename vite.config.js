import { defineConfig } from "vite"
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
        "^/bus": {
            target: "https://bus.mattschlosser.me/",
            secure: false
        }
    }
  }
})