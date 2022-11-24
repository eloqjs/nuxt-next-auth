import type { BuiltInProviderType, RedirectableProviderType } from 'next-auth/providers'
import type { SearchParameters } from 'ofetch'
import { getQuery, withQuery } from 'ufo'
import type { LiteralUnion, SignInAuthorizationParams, SignInOptions, SignOutParams } from '../types'
import { _fetch, getURL, joinPathToBase, navigateTo } from '../utils'
import { useBroadcastChannel } from '../utils/broadcast'
import { getProviders } from './providers'
import { getCsrfToken, _getSession } from './session'

/**
 * Client-side method to initiate a signin flow
 * or send the user to the signin page listing all possible providers.
 * Automatically adds the CSRF token to the request.
 *
 * @see {@link https://next-auth.js.org/getting-started/client#signin|Documentation}
 */

export async function signIn<
  P extends RedirectableProviderType | undefined = undefined
  > (
  provider?: LiteralUnion<
    P extends RedirectableProviderType
      ? P | BuiltInProviderType
      : BuiltInProviderType
    >,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams
) {
  const { callbackUrl = getURL(true), redirect = true } = options ?? {}
  const providers = await getProviders()

  // 1. Lead to error page if no providers are available
  if (!providers) {
    return navigateTo(joinPathToBase('error'))
  }

  // 2. Redirect to the general sign-in page with all providers in case either no provider or no valid provider was selected
  if (!provider || !(provider in providers)) {
    return navigateTo(withQuery(joinPathToBase('signin'), { callbackUrl }), { external: true })
  }

  // 3. Perform a sign-in straight away with the selected provider
  const isCredentials = providers[provider].type === 'credentials'
  const isEmail = providers[provider].type === 'email'
  const isSupportingReturn = isCredentials || isEmail
  const action: 'callback' | 'signin' = isCredentials ? 'callback' : 'signin'

  const data = await _fetch<{ url: string }>(`${action}/${provider}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: authorizationParams as SearchParameters,
    // @ts-expect-error
    body: new URLSearchParams({
      ...options,
      csrfToken: await getCsrfToken(),
      callbackUrl,
      json: true
    })
  })

  const broadcast = useBroadcastChannel()
  broadcast.post({ event: 'session', data: { trigger: 'signin' } })

  if (redirect || !isSupportingReturn) {
    const href = data.url ?? callbackUrl
    return navigateTo(href)
  }

  // At this point the request succeeded (i.e., it went through)
  const { error } = getQuery(data.url)
  await _getSession({ event: 'storage' })

  return {
    error,
    status: 200,
    ok: true,
    url: error ? null : data.url
  }
}

/**
 * Signs the user out, by removing the session cookie.
 * Automatically adds the CSRF token to the request.
 *
 * @see {@link https://next-auth.js.org/getting-started/client#signout|Documentation}
 */
export async function signOut <R extends boolean = true> (options?: SignOutParams<R>) {
  const { callbackUrl = getURL(true), redirect = true } = options ?? {}

  const data = await _fetch<{ url: string }>('signout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // @ts-expect-error
    body: new URLSearchParams({
      csrfToken: await getCsrfToken(),
      callbackUrl,
      json: true
    })
  })

  const broadcast = useBroadcastChannel()
  broadcast.post({ event: 'session', data: { trigger: 'signout' } })

  if (redirect) {
    const url = data.url ?? callbackUrl
    return navigateTo(url)
  }

  await _getSession({ event: 'storage' })

  return data
}
