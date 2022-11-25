import { useRequestHeaders, useState } from '#app'
import { computed, readonly } from 'vue'
import type { Session } from 'next-auth'
import { _fetch, now, useBroadcastChannel } from '../utils'
import type { SessionContextValue, SessionData, SessionStatus } from '../types'

type GetSessionEvent = 'storage' | 'visibilitychange' | 'poll' | 'initialize'

export async function _getSession ({ event }: { event?: GetSessionEvent } = {}) {
  const session = useState<SessionData>('auth:session')
  const loading = useState<boolean>('auth:loading')
  const lastSync = useState<number>('auth:lastSync')

  try {
    const storageEvent = event === 'storage'
    // We should always update if we don't have a client session yet
    // or if there are events from other tabs/windows
    if (storageEvent || session.value === undefined) {
      lastSync.value = now()
      session.value = await getSession()

      return
    }

    if (
      // If there is no time defined for when a session should be considered
      // stale, then it's okay to use the value we have until an event is
      // triggered which updates it
      !event ||
      // If the client doesn't have a session then we don't need to call
      // the server to check if it does (if they have signed in via another
      // tab or window that will come through as a "storage" event anyway)
      session.value === null ||
      // Bail out early if the client session is not stale yet
      now() < lastSync.value
    ) { return }

    const initializeEvent = event === 'initialize'
    // If the session was fetched on server-side, the original event couldn't be triggered,
    // so we should replicate it in order to update other tabs/windows.
    if (initializeEvent && process.client) {
      const broadcast = useBroadcastChannel()
      broadcast.post({ event: 'session', data: { trigger: 'getSession' } })
      return
    }

    // An event or session staleness occurred, update the client session.
    lastSync.value = now()
    session.value = await getSession()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('CLIENT_SESSION_ERROR', error as Error)
  } finally {
    loading.value = false
  }
}

/**
 * Vue Composable that gives you access
 * to the logged-in user's session data.
 *
 * @see {@link https://next-auth.js.org/getting-started/client#usesession|Documentation}
 */
export function useSession <R extends boolean = false> (): SessionContextValue<R> {
  const session = useState<SessionData>('auth:session')
  const loading = useState<boolean>('auth:loading')
  const status = computed<SessionStatus>(() => loading.value ? 'loading' : session.value ? 'authenticated' : 'unauthenticated')

  return { data: readonly(session), status } as SessionContextValue<R>
}

export type GetSessionParams = {
  event?: 'storage' | 'timer' | 'hidden' | string
  triggerEvent?: boolean
  broadcast?: boolean
}

export function getSession (params?: GetSessionParams) {
  return _fetch<Session>('session', {
    headers: useRequestHeaders(['cookie']) as HeadersInit
  }).then((data) => {
    if (params?.broadcast ?? true) {
      const broadcast = useBroadcastChannel()
      broadcast.post({ event: 'session', data: { trigger: 'getSession' } })
    }

    return Object.keys(data).length > 0 ? data : null
  })
}

/**
 * Returns the current Cross Site Request Forgery Token (CSRF Token)
 * required to make POST requests (e.g. for signing in and signing out).
 * You likely only need to use this if you are not using the built-in
 * `signIn()` and `signOut()` methods.
 *
 * @see {@link https://next-auth.js.org/getting-started/client#getcsrftoken|Documentation}
 */
export function getCsrfToken () {
  return _fetch<{ csrfToken: string }>('csrf', {
    headers: useRequestHeaders(['cookie']) as HeadersInit
  }).then(response => response.csrfToken)
}
