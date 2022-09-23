// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    target: "static",
    mode: "spa",
    generate: {
         
      
        fallback: "404.html",

    },
    ssr: false,
    sourcemap: true,
  
})
