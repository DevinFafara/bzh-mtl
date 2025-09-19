<!-- app.vue -->
<script setup lang="ts">
import { useHead } from '#app'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()

if (config.public.cloudflareToken) {
  useHead({
    script: [
      {
        defer: true,
        src: 'https://static.cloudflareinsights.com/beacon.min.js',
        'data-cf-beacon': `{"token": "${config.public.cloudflareToken}"}`
      }
    ]
  })
}
</script>
<template>
  <div class="min-h-screen bg-stone-900">
    <AppHeader />

    <main class="">
      <div class="max-w-5xl mx-auto bg-white shadow-lg pb-20">
        <NuxtPage />
      </div>
    </main>
    
    <AppFooter />
  </div>
</template>