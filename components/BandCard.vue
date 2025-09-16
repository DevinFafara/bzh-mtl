<script setup lang="ts">
defineProps({
  band: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <NuxtLink 
    :to="`/groupes/${band.slug}`" 
    class="block group border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
  >
    <div class="aspect-w-1 aspect-h-1 bg-gray-100">
      <NuxtImg
        v-if="band.pressPhoto"
        :src="band.pressPhoto.asset._ref"
        provider="sanity"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        :alt="`Photo de ${band.name}`"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
        <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 010-2.828L14 8" />
        </svg>
      </div>
    </div>

    <div class="p-4 bg-white">
      <h3 class="font-bold text-lg truncate">{{ band.name }}</h3>
      
      <div v-if="band.styles && band.styles.length > 0" class="flex flex-wrap gap-1 mt-2">
        <span 
          v-for="(style, index) in band.styles" 
          :key="index"
          class="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs"
        >
          {{ style.title }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>