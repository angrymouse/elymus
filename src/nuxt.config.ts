import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  target: 'static',
  mode: 'spa',
  ssr: false,
  modules: ['@nuxtjs/tailwindcss'],
      colorMode: {
    dataValue: 'forest'
    },
    app: {
        head: {
        htmlAttrs:{"data-theme": "forest",}
    }
    },
  buildModules: [
    // ...
    [
      '@pinia/nuxt',
      {
        autoImports: [
          // automatically imports `usePinia()`
          'defineStore',
          // automatically imports `usePinia()` as `usePiniaStore()`
          ['defineStore', 'definePiniaStore'],
        ],
      },
    ],
  ],
})
