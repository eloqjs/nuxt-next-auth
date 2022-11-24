<script lang="ts" setup>
import { useSession, signIn, signOut, getSession, _getSession, useFetch, useRequestHeaders } from '#imports'

// await getSession()
// await _getSession()
const { data, status } = useSession()

// const providers = await getProviders()
// const csrfToken = await getCsrfToken()

// const headers = useRequestHeaders(['cookie'])
// const { data: token } = useFetch('/api/token', { headers: { cookie: headers.cookie } })
</script>

<template>
  <div>
    <h3>Authentication Overview</h3>
    <p>See all available authentication & session information below. Navigate to different sub-pages to test out the app.</p>
    <pre>Status: {{ status }}</pre>
    <pre>Data: {{ data || 'no session data present, are you logged in?' }}</pre>
    <!--    <pre>Decoded JWT token: {{ token || 'no token present, are you logged in?' }}</pre>-->

    <h3>Sign In Methods</h3>
    <div>
      <button @click="signIn(undefined, { callbackUrl: '/' })">
        sign in
      </button>
      <br>
      <button @click="signIn('credentials', { callbackUrl: '/', username: 'jsmith', password: 'hunter2' })">
        sign in (credential)
      </button>
      <br>
      <button @click="signIn('github', { callbackUrl: '/' })">
        sign in (github)
      </button>
      <br>
      <button @click="signIn(undefined, { callbackUrl: '/protected/inline' })">
        sign in (with redirect to protected page)
      </button>
      <br>
      <button @click="signOut({ callbackUrl: '/signout' })">
        sign out
      </button>
      <br>
      <button @click="getSession({ required: false })">
        refresh session
      </button>
    </div>
  </div>
</template>
