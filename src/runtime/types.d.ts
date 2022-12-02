import type { ComputedRef, Ref } from '@vue/reactivity'
import type { Session } from 'next-auth'
import type { BuiltInProviderType, ProviderType } from 'next-auth/providers'

/**
 * Util type that matches some strings literally, but allows any other string as well.
 * @source https://github.com/microsoft/TypeScript/issues/29729#issuecomment-832522611
 */
export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & Record<never, never>)

export interface ClientSafeProvider {
  id: LiteralUnion<BuiltInProviderType>
  name: string
  type: ProviderType
  signinUrl: string
  callbackUrl: string
}
export type SupportedProviders =  'default' | LiteralUnion<BuiltInProviderType>

export interface SignInOptions extends Record<string, unknown> {
  /**
   * Defaults to the current URL.
   * @docs https://next-auth.js.org/getting-started/client#specifying-a-callbackurl
   */
  callbackUrl?: string
  /** @docs https://next-auth.js.org/getting-started/client#using-the-redirect-false-option */
  redirect?: boolean
}

/** Match `inputType` of `new URLSearchParams(inputType)` */
export type SignInAuthorizationParams =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams

export interface SignOutParams<R extends boolean = true> {
  /** @docs https://next-auth.js.org/getting-started/client#specifying-a-callbackurl-1 */
  callbackUrl?: string
  /** @docs https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
  redirect?: R
}

export type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading'
export type SessionData = Session | null | undefined

export type SessionContextValue<R extends boolean = false> = R extends true
  ?
  | { data: Readonly<Ref<Session>>; readonly status: ComputedRef<'authenticated'> }
  | { data: Readonly<Ref<null>>; readonly status: ComputedRef<'loading'> }
  :
  | { data: Readonly<Ref<Session>>; readonly  status: ComputedRef<'authenticated'> }
  | { data: Readonly<Ref<null>>; readonly  status: ComputedRef<'unauthenticated' | 'loading'> }
