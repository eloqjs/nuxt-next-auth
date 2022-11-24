import { BroadcastChannel, BroadcastMessage } from 'next-auth/client/_utils'

/**
 * Inspired by [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
 * Only not using it directly, because Safari does not support it.
 *
 * https://caniuse.com/?search=broadcastchannel
 */
export function useBroadcastChannel (name?: string) {
  // We don't have access to `window` on server-side
  if (process.server) {
    return {
      /** Get notified by other tabs/windows. */
      receive: (onReceive: (message: BroadcastMessage) => void) => () => {},
      /** Notify other tabs/windows. */
      post: (message: Record<string, unknown>) => {}
    }
  }

  return BroadcastChannel(name)
}
