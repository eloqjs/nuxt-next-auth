import { now } from './date'

export interface BroadcastMessage {
  event?: 'session'
  data?: { trigger?: 'signout' | 'getSession' }
  clientId: string
  timestamp: number
}

/**
 * Inspired by [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
 * Only not using it directly, because Safari does not support it.
 *
 * https://caniuse.com/?search=broadcastchannel
 */
export function useBroadcastChannel (name = 'nextauth.message') {
  return {
    /** Get notified by other tabs/windows. */
    receive (onReceive: (message: BroadcastMessage) => void) {
      if (process.server) { return () => {} }

      const handler = (event: StorageEvent) => {
        if (event.key !== name) { return }
        const message: BroadcastMessage = JSON.parse(event.newValue ?? '{}')
        if (message?.event !== 'session' || !message?.data) { return }

        onReceive(message)
      }
      window.addEventListener('storage', handler)
      return () => window.removeEventListener('storage', handler)
    },
    /** Notify other tabs/windows. */
    post (message: Record<string, unknown>) {
      if (process.server) { return }

      try {
        localStorage.setItem(
          name,
          JSON.stringify({ ...message, timestamp: now() })
        )
      } catch {
        /**
         * The localStorage API isn't always available.
         * It won't work in private mode prior to Safari 11 for example.
         * Notifications are simply dropped if an error is encountered.
         */
      }
    }
  }
}
