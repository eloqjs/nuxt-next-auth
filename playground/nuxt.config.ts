import { defineNuxtConfig } from 'nuxt/config'
import MyModule from '..'

export default defineNuxtConfig({
  runtimeConfig: {
    secret: process.env.NEXTAUTH_SECRET,
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }
  },
  modules: [
    MyModule
  ],
  auth: {
    providers: ['github', 'credentials']
  }
})
