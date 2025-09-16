<script setup lang="ts">
defineProps({
  festival: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <NuxtLink 
    :to="`/festivals/${festival.slug}`" 
    class="block group border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
  >
    <div class="aspect-w-1 aspect-h-1 bg-gray-100">
      <NuxtImg
        v-if="festival.mainImage"
        :src="festival.mainImage.asset._ref"
        provider="sanity"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        :alt="`Image de ${festival.name}`"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
        <Icon name="heroicons:musical-note" class="w-12 h-12 text-gray-400" />
      </div>
    </div>

    <!-- Les Informations textuelles -->
    <div class="p-4 bg-white">
      <h3 class="font-bold text-lg truncate">{{ festival.name }}</h3>
      
      <!-- Informations sur le lieu -->
      <div v-if="festival.location?.city" class="mt-2">
        <span class="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
          {{ festival.location.city }}{{ festival.location.department ? ` (${festival.location.department})` : '' }}
        </span>
      </div>

      <!-- Styles musicaux (limité à 2 pour les vignettes) -->
      <div v-if="festival.musicalStyles && festival.musicalStyles.length > 0" class="flex flex-wrap gap-1 mt-2">
        <span 
          v-for="style in festival.musicalStyles.slice(0, 2)" 
          :key="style.slug"
          class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full"
        >
          {{ style.title }}
        </span>
        <span v-if="festival.musicalStyles.length > 2" class="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
          +{{ festival.musicalStyles.length - 2 }}
        </span>
      </div>

      <!-- Informations complémentaires -->
      <!-- <div class="mt-2 text-xs text-gray-500 space-y-1">
        <div v-if="festival.duration" class="flex items-center">
          <Icon name="heroicons:calendar-days" class="h-3 w-3 mr-1" />
          <span>{{ festival.duration.days }} jour{{ festival.duration.days > 1 ? 's' : '' }}</span>
        </div>
        <div v-if="festival.foundedYear" class="flex items-center">
          <Icon name="heroicons:clock" class="h-3 w-3 mr-1" />
          <span>Depuis {{ festival.foundedYear }}</span>
        </div>
      </div> -->
    </div>
  </NuxtLink>
</template>
