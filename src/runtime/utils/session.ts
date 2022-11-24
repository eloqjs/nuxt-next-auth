import { useState } from '#app'
import type { Session } from 'next-auth'
import { SessionData, SessionStatus } from '../types'

export const isValidSessionData = (data: unknown): data is Session => !!data && Object.keys(data as Record<string, unknown>).length > 0

export const getSession = <R extends boolean = false>() => {
  const data = useState<SessionData>('auth:session:data', () => undefined)
  const status = useState<SessionStatus>('auth:session:status', () => 'unauthenticated')

  return {
    data,
    status
  }
}

export const setSession = (session: { data?: SessionData; status?: SessionStatus }) => {
  const { data, status } = getSession()

  if (session.data !== undefined) {
    data.value = session.data
  }

  if (session.status !== undefined) {
    status.value = session.status
  }

  return {
    data,
    status
  }
}

export function now () {
  return Math.floor(Date.now() / 1000)
}
