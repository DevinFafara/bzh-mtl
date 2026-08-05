<!-- app.vue -->
<script setup lang="ts">
import { useHead } from '#app'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()

// Exécution côté client uniquement pour éviter les problèmes SSR
if (process.client && config.public.cloudflareToken) {
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

    <main class="relative">
      <!-- Suspense explicite : évite un flash à l'hydratation le temps que le
           composant (async, données Sanity) se résolve côté client.
           Transition en fondu pour lisser l'apparition une fois résolu. -->
      <Suspense>
        <template #default>
          <Transition
            enter-active-class="transition-opacity duration-500"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <PartnerSideRails />
          </Transition>
        </template>
        <template #fallback><span /></template>
      </Suspense>
      <div class="max-w-5xl mx-auto bg-white shadow-lg pb-20">
        <NuxtPage />
      </div>
    </main>

    <AppFooter />
  </div>
</template>