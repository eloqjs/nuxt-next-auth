import {
  appendHeader,
  defineEventHandler,
  isMethod,
  sendRedirect,
  setCookie,
  readBody,
  parseCookies,
  getQuery
} from 'h3'
import type { H3Event } from 'h3'

import { NextAuthHandler } from 'next-auth/core'
import { getToken as _getToken } from 'next-auth/jwt'
import type { RequestInternal } from 'next-auth/core'
import type { NextAuthAction, NextAuthOptions, Session } from 'next-auth'
import type { GetTokenParams } from 'next-auth/jwt'

import getURL from 'requrl'

export function NuxtAuthHandler (options: NextAuthOptions) {
  return defineEventHandler(async (event) => {
    // Catch-all route params in Nuxt goes to the underscore property
    const nextauth = event.context.params._.split('/')
    const { error, ...query } = getQuery(event)

    const req: RequestInternal | Request = {
      host: getURL(event.node.req),
      body: undefined,
      query,
      headers: event.node.req.headers,
      method: event.node.req.method,
      cookies: parseCookies(event),
      action: nextauth[0] as NextAuthAction,
      providerId: nextauth[1],
      error: error ?? nextauth[1]
    }

    if (isMethod(event, 'POST')) {
      req.body = await readBody(event)
    }

    const response = await NextAuthHandler({ req, options })

    const { headers, cookies, body, redirect, status = 200 } = response
    event.node.res.statusCode = status

    headers?.forEach((header) => {
      appendHeader(event, header.key, header.value)
    })

    cookies?.forEach((cookie) => {
      setCookie(event, cookie.name, cookie.value, cookie.options)
    })

    if (redirect) {
      if (isMethod(event, 'POST')) {
        const body = await readBody(event)
        if (body?.json !== true) { await sendRedirect(event, redirect, 302) }

        return {
          url: redirect
        }
      } else {
        await sendRedirect(event, redirect, 302)
      }
    }

    return body
  })
}

export async function getServerSession (
  event: H3Event,
  options: NextAuthOptions
): Promise<Session | null> {
  const session = await NextAuthHandler<Session>({
    req: {
      host: getURL(event.node.req),
      action: 'session',
      method: 'GET',
      cookies: parseCookies(event),
      headers: event.node.req.headers
    },
    options
  })

  const { body } = session

  if (body && Object.keys(body).length) {
    return body
  }
  return null
}

/**
 * Get the decoded JWT token either from cookies or header (both are attempted).
 *
 * The only change from the original `getToken` implementation is that the `req` is not passed in, in favor of `event`
 * being passed in. See https://next-auth.js.org/tutorials/securing-pages-and-api-routes#using-gettoken for further
 * documentation.
 *
 * @param eventAndOptions Omit<GetTokenParams, 'req'> & { event: H3Event } The event to get the cookie or authorization
 *   header from that contains the JWT Token and options you want to alter token getting behavior.
 */
export const getToken = ({ event, secureCookie, ...rest }: Omit<GetTokenParams, 'req'> & { event: H3Event }) => _getToken({
  req: {
    cookies: parseCookies(event),
    headers: event.node.req.headers
  },
  // see https://github.com/nextauthjs/next-auth/blob/8387c78e3fef13350d8a8c6102caeeb05c70a650/packages/next-auth/src/jwt/index.ts#L73
  secureCookie: secureCookie || getURL(event.node.req).startsWith('https://'),
  ...rest
})
