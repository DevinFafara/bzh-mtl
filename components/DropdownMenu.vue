<!-- components/DropdownMenu.vue -->
<script setup>
// On définit les "props" que le composant attend de son parent
// 'title' est le texte du lien principal
// 'items' est un tableau d'objets pour les liens du sous-menu
defineProps({
  title: String,
  items: Array
});

// La variable qui contrôle si le menu est ouvert ou fermé
const isOpen = ref(false);
</script>

<template>
  <div 
    class="relative" 
    @mouseover="isOpen = true" 
    @mouseleave="isOpen = false"
    @focusin="isOpen = true"
    @focusout="isOpen = false"
  >
    <button class="relative font-medium text-white px-2 py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full flex items-center gap-1">
      {{ title }}
      <Icon name="heroicons:chevron-down-20-solid" class="h-5 w-5 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="isOpen" class="absolute left-0 w-56 origin-top-left bg-black shadow-lg ring-opacity-5 z-50">
        <div class="">
          <NuxtLink
            v-for="item in items"
            :key="item.label"
            :to="item.to"
            @click="isOpen = false"
            class="block px-4 py-2 text-md text-gray-300 hover:bg-gray-700 hover:text-white"
            active-class="bg-gray-700 text-white"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>
    </transition>
  </div>
</template>