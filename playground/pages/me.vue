<script lang="ts" setup>
import { definePageMeta, useSession } from '#imports'

const { data } = useSession()

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div>
    <pre>{{ data }}</pre>
  </div>
</template>
