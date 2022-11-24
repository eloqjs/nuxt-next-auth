import defu from 'defu'
import type { NitroFetchRequest } from 'nitropack'
import type { FetchOptions } from 'ofetch'
import { getURLWithBasePath } from '../utils'

export const _fetch = <T = unknown, R extends NitroFetchRequest = NitroFetchRequest>(request: R, opts?: FetchOptions) => {
  return $fetch<T, R>(request, defu<FetchOptions, FetchOptions[]>(opts, {
    baseURL: getURLWithBasePath()
  }))
}

_fetch.raw = <T = unknown, R extends NitroFetchRequest = NitroFetchRequest>(request: R, opts?: FetchOptions) => {
  return $fetch.raw(request, defu<FetchOptions, FetchOptions[]>(opts, {
    baseURL: getURLWithBasePath()
  }))
}
