<script lang="ts" setup>
import { definePageMeta } from '#imports'

definePageMeta({
  middleware: 'auth',
  auth: 'guest'
})
</script>

<template>
  <div>
    <h1>Guest Page</h1>
    <p>You can access this content because you are not signed in.</p>
  </div>
</template>
