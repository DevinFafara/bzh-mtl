<script setup lang="ts">
// On définit que ce composant attend une "prop" appelée "venue"
// qui doit être un objet. C'est une bonne pratique de typer ses props.
defineProps({
  venue: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <!-- La vignette est un lien vers la page de détail du groupe -->
  <NuxtLink 
    :to="`/salles/${venue.slug}`" 
    class="block group border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
  >
    <!-- La Photo de Presse -->
    <div class="aspect-w-1 aspect-h-1 bg-gray-100">
      <NuxtImg
        v-if="venue.image"
        :src="venue.image.asset._ref"
        provider="sanity"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        :alt="`Photo de ${venue.name}`"
      />
      <!-- Une image par défaut si le groupe n'a pas de photo -->
      <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
        <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 010-2.828L14 8" />
        </svg>
      </div>
    </div>

    <!-- Les Informations textuelles -->
    <div class="p-4 bg-white">
      <h3 class="font-bold text-lg truncate">{{ venue.name }}</h3>
      
      <!-- On fait une boucle pour afficher tous les styles -->
      <div v-if="venue.city && venue.city.length > 0" class="flex flex-wrap gap-1 mt-2">
        <span 
          class="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs"
        >
          {{ venue.city }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>