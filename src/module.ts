import { defineNuxtModule } from '@nuxt/kit'
import { name, version } from '../package.json'
import { setupAliases, setupComposables, setupNitro, setupPlugin, setupRuntimeConfig, setupTypes } from './utils'

export interface ModuleOptions {
  basePath: string
  providers: string[]
  /**
   * A time interval (in seconds) after which the session will be re-fetched.
   * If set to `0` (default), the session is not polled.
   */
  refetchInterval: number
  /**
   * `SessionProvider` automatically refetches the session when the user switches between windows.
   * This option activates this behaviour if set to `true` (default).
   */
  refetchOnWindowFocus: boolean
  globalMiddleware: boolean
  defaultProvider: string | undefined
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'auth'
  },
  defaults: {
    basePath: '/api/auth',
    providers: [],
    refetchInterval: 0,
    refetchOnWindowFocus: true,
    globalMiddleware: false,
    defaultProvider: undefined
  },
  setup (options, nuxt) {
    // Runtime config
    setupRuntimeConfig(nuxt, options)

    // Add plugin
    setupPlugin()

    // Add composables
    setupComposables()

    // Create virtual imports for server-side
    setupNitro(nuxt)

    // Generate types for server handler
    setupTypes(nuxt)

    // Register provider aliases
    setupAliases(nuxt, options)
  }
})
