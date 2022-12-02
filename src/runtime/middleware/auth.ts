import { defineNuxtRouteMiddleware, navigateTo, useState } from '#app'
import type { NavigationFailure, RouteLocationRaw } from 'vue-router'
import { useSession } from '../composables/session'
import { signIn } from '../composables/sign'

export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.auth === false) {
    return
  }

  const pageIsInGuestMode = to.meta.auth === 'guest'
  const { status } = useSession()

  if (status.value === 'unauthenticated' && !pageIsInGuestMode) {
    // Update loading state
    const loading = useState<boolean>('auth:loading')
    loading.value = true

    // Redirect to signIn
    return signIn(undefined, {
      callbackUrl: to.path,
      redirect: true
    }, {
      error: 'SessionRequired'
    }) as RouteLocationRaw | Promise<void | NavigationFailure>
  }

  if (status.value === 'authenticated' && pageIsInGuestMode) {
    // Redirect to home
    return navigateTo('/')
  }
})
