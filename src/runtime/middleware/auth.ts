import { defineNuxtRouteMiddleware, navigateTo, useState } from '#app'
import { withQuery } from 'ufo'
import { useSession } from '../composables/session'
import { joinPathToBase } from '../utils'

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
    const url = withQuery(joinPathToBase('signin'), {
      error: 'SessionRequired',
      callbackUrl: to.path
    })
    return navigateTo(url, { external: true })
  }

  if (status.value === 'authenticated' && pageIsInGuestMode) {
    // Redirect to home
    return navigateTo('/')
  }
})
