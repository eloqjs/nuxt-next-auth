import { useRequestEvent, useRuntimeConfig } from '#app'
import { navigateTo as _navigateTo, NavigateToOptions } from '#app/composables/router'
import _getURL from 'requrl'
import { joinURL, parseURL } from 'ufo'
import { RouteLocationRaw } from 'vue-router'

export const getURL = (includePath?: boolean) => _getURL(useRequestEvent()?.node.req, includePath)
export const getBasePath = () => useRuntimeConfig().public.auth.basePath
export const getURLWithBasePath = () => joinURL(getURL(), getBasePath())
export const joinPathToBase = (path: string) => joinURL(getURLWithBasePath(), path)

export const navigateTo = (to: RouteLocationRaw | undefined | null, options: NavigateToOptions = {}) => {
  if (typeof to !== 'string') {
    return _navigateTo(to, options)
  }

  // Set to external when `to` contains `host`
  return _navigateTo(to, { external: !!parseURL(to).host, ...options })
}
