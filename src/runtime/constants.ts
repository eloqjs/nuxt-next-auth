import type { NextAuthAction } from 'next-auth'

export const SUPPORTED_ACTIONS: NextAuthAction[] = ['providers', 'session', 'csrf', 'signin', 'signout', 'callback', 'verify-request', 'error', '_log']
