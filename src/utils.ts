import { addImportsDir, addPlugin, addTemplate, createResolver } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import defu from 'defu'
import { joinURL } from 'ufo'
import type { ModuleOptions } from './module'

export function setupRuntimeConfig (nuxt: Nuxt, options: ModuleOptions) {
  nuxt.options.runtimeConfig.auth = options
  nuxt.options.runtimeConfig.public.auth = options
}

export function setupPlugin () {
  const { resolve } = createResolver(import.meta.url)
  addPlugin(resolve('./runtime/plugin'))
}

export function setupComposables (nuxt: Nuxt) {
  const { resolve } = createResolver(import.meta.url)

  const composables = resolve('./runtime/composables')
  addImportsDir(composables)
}

export function setupNitro (nuxt: Nuxt) {
  const { resolve } = createResolver(import.meta.url)

  nuxt.hook('nitro:config', (nitroConfig) => {
    nitroConfig.alias = nitroConfig.alias || {}

    // Inline module runtime in Nitro bundle
    nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
      inline: [resolve('./runtime')]
    })
    nitroConfig.alias['#auth'] = resolve('./runtime/server/handler')
  })
}

export function setupTypes (nuxt: Nuxt) {
  const { resolve } = createResolver(import.meta.url)

  addTemplate({
    filename: 'types/auth.d.ts',
    getContents: () => [
      'declare module \'#auth\' {',
      `  const getServerSession: typeof import('${resolve('./runtime/server/handler')}').getServerSession`,
      `  const getToken: typeof import('${resolve('./runtime/server/handler')}').getToken`,
      `  const NuxtAuthHandler: typeof import('${resolve('./runtime/server/handler')}').NuxtAuthHandler`,
      '}'
    ].join('\n')
  })

  nuxt.hook('prepare:types', (options) => {
    options.references.push({ path: resolve(nuxt.options.buildDir, 'types/auth.d.ts') })
  })
}

export function setupAliases (nuxt: Nuxt, options: ModuleOptions) {
  options.providers.forEach((provider) => {
    nuxt.options.alias[`next-auth/providers/${provider}`] = `node_modules/next-auth/providers/${provider}.js`
  })
}
