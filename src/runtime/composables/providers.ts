import { _fetch } from '../utils'
import type { ClientSafeProvider, SupportedProviders } from '../types'

/**
 * It calls `/api/auth/providers` and returns
 * a list of the currently configured authentication providers.
 * It can be useful if you are creating a dynamic custom sign in page.
 *
 * @see {@link https://next-auth.js.org/getting-started/client#getproviders|Documentation}
 */

export function getProviders () {
  return _fetch<Record<SupportedProviders, ClientSafeProvider>>('providers')
}
