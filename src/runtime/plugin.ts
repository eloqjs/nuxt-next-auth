import { defineNuxtPlugin, useRuntimeConfig, useState } from '#app'
import { _getSession } from './composables/session'
import { now, useBroadcastChannel } from './utils'
import type { SessionData } from './types'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { refetchOnWindowFocus, refetchInterval } = useRuntimeConfig().public.auth

  const session = useState<SessionData>('auth:session', () => undefined)

  /**
   * If session was `null`, there was an attempt to fetch it,
   * but it failed, but we still treat it as a valid initial value.
   */
  const hasInitialSession = session.value !== undefined

  /** If session was passed, initialize as already synced */
  const lastSync = useState<number>('auth:lastSync', () => hasInitialSession ? now() : 0)

  /** If session was passed, initialize as not loading */
  const loading = useState<boolean>('auth:loading', () => !hasInitialSession)

  console.log('[AUTH:SESSION]', process.server ? 'server' : 'client', session.value)

  await _getSession()

  // Listen for when the page is visible, if the user switches tabs
  // and makes our tab visible again, re-fetch the session, but only if
  // this feature is not disabled.
  const visibilityHandler = () => {
    if (refetchOnWindowFocus && document.visibilityState === 'visible') { _getSession({ event: 'visibilitychange' }) }
  }
  nuxtApp.hook('app:mounted', () => {
    document.addEventListener('visibilitychange', visibilityHandler, false)
  })

  // Subscribe to broadcast
  const broadcast = useBroadcastChannel()
  const unsubscribeFromBroadcast = broadcast.receive(() =>
    _getSession({ event: 'storage' })
  )

  // Refetch interval
  let refetchIntervalTimer: NodeJS.Timer

  if (refetchInterval) {
    refetchIntervalTimer = setInterval(() => {
      if (session.value) { _getSession({ event: 'poll' }) }
    }, refetchInterval * 1000)
  }

  const _unmount = nuxtApp.vueApp.unmount
  nuxtApp.vueApp.unmount = function () {
    // Clear visibility handler
    document.removeEventListener('visibilitychange', visibilityHandler, false)

    // Unsubscribe from broadcast
    unsubscribeFromBroadcast?.()

    // Clear refetch interval
    clearInterval(refetchIntervalTimer)

    // Clear session
    lastSync.value = 0
    session.value = undefined

    // Call original unmount
    _unmount()
  }
})
