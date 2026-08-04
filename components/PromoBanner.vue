<script setup lang="ts">
const { data: banner } = await usePartnerBanner();
</script>

<template>
  <a
    v-if="banner?.bannerImage"
    :href="banner.link"
    target="_blank"
    rel="noopener noreferrer sponsored"
    class="relative block overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
    :aria-label="`Partenariat ${banner.partnerName} — en savoir plus`"
  >
    <span class="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded">
      Partenaire
    </span>
    <NuxtImg
      :src="banner.bannerImage.asset._ref"
      provider="sanity"
      class="w-full h-auto object-cover"
      :alt="banner.bannerImage.alt || banner.partnerName"
    />
  </a>
</template>
