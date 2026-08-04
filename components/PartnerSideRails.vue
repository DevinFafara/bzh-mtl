<script setup lang="ts">
const { data: banner } = await usePartnerBanner();
</script>

<template>
  <template v-if="banner?.posterImage">
    <!--
      Positionnement en 2 niveaux :
      - le conteneur externe est "absolute", cadré sur la hauteur de <main> (grâce à main
        en position:relative dans app.vue) : il s'arrête donc avant le footer.
      - le lien interne est "sticky" à l'intérieur de ce conteneur : il reste visible au
        scroll tant qu'on est dans la zone de contenu, puis défile normalement (jamais
        par-dessus le footer).
    -->
    <div class="hidden [@media(min-width:1400px)]:block absolute inset-y-0 left-3 w-[clamp(140px,calc((100vw-64rem)/2-1.25rem),400px)] z-30">
      <a
        :href="banner.link"
        target="_blank"
        rel="noopener noreferrer sponsored"
        class="sticky top-20 block w-full h-[min(85vh,750px)] overflow-hidden shadow-lg"
        :aria-label="`Partenariat ${banner.partnerName} — en savoir plus`"
      >
        <span class="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded">
          Partenaire
        </span>
        <NuxtImg
          :src="banner.posterImage.asset._ref"
          provider="sanity"
          class="w-full h-full object-cover object-left"
          :alt="banner.posterImage.alt || banner.partnerName"
        />
      </a>
    </div>
    <div class="hidden [@media(min-width:1400px)]:block absolute inset-y-0 right-3 w-[clamp(140px,calc((100vw-64rem)/2-1.25rem),400px)] z-30">
      <a
        :href="banner.link"
        target="_blank"
        rel="noopener noreferrer sponsored"
        class="sticky top-20 block w-full h-[min(85vh,750px)] overflow-hidden shadow-lg"
        :aria-label="`Partenariat ${banner.partnerName} — en savoir plus`"
      >
        <span class="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded">
          Partenaire
        </span>
        <NuxtImg
          :src="banner.posterImage.asset._ref"
          provider="sanity"
          class="w-full h-full object-cover object-right"
          :alt="banner.posterImage.alt || banner.partnerName"
        />
      </a>
    </div>
  </template>
</template>
