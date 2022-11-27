<script setup lang="ts">
import { useSession, useFetch, useRequestHeaders } from '#imports'
import AccessDenied from '~/components/AccessDenied.vue'

const { data: session } = useSession()

const { data } = await useFetch('/api/examples/protected', {
  // @ts-expect-error See https://github.com/nuxt/framework/issues/7549
  headers: useRequestHeaders(['cookie'])
})
</script>

<template>
  <div>
    <AccessDenied v-if="!session" />
    <template v-else>
      <h1>Protected Page</h1>
      <p><strong>{{ data?.content || "\u00a0" }}</strong></p>
    </template>
  </div>
</template>
