<script setup>
// Le composant attend de savoir s'il doit être ouvert (`isOpen`)
// et il doit pouvoir dire au parent de se fermer (`@close`)
const props = defineProps({
  isOpen: Boolean
});
const emit = defineEmits(['close']);

const searchTerm = ref('');
const router = useRouter();

// Fonction pour gérer la recherche
const handleSearch = () => {
  if (searchTerm.value.trim()) {
    // On redirige vers une page de résultats avec le terme en paramètre
    router.push(`/recherche?q=${encodeURIComponent(searchTerm.value)}`);
    // On ferme la modale
    emit('close');
  }
};

// Fermer la modale avec la touche Échap
const onKeydown = (event) => {
  if (event.key === 'Escape') {
    emit('close');
  }
};

// On ajoute/supprime l'écouteur d'événement quand le composant est monté/démonté
onMounted(() => {
  document.addEventListener('keydown', onKeydown);
});
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <!-- La magie de la transition pour l'apparition -->
  <transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <!-- Le fond semi-transparent -->
    <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" @click="$emit('close')">
      <!-- Le conteneur de la modale (on clique dessus pour ne PAS fermer) -->
      <div class="fixed inset-y-0 right-0 flex max-w-full pl-10" @click.stop>
        <transition
          enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <!-- Le panneau de recherche lui-même -->
          <div v-if="isOpen" class="w-screen max-w-md">
            <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div class="px-4 py-6 sm:px-6">
                <div class="flex items-start justify-between">
                  <h2 class="text-lg font-medium text-gray-900">Rechercher</h2>
                  <div class="ml-3 flex h-7 items-center">
                    <button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500" @click="$emit('close')">
                      <Icon name="heroicons:x-mark" class="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
              <div class="relative mt-6 flex-1 px-4 sm:px-6">
                <!-- Le formulaire de recherche -->
                <form @submit.prevent="handleSearch">
                  <label for="search" class="block text-sm font-medium text-gray-700">Rechercher des articles, groupes, événements...</label>
                  <div class="mt-1 flex rounded-md shadow-sm">
                    <div class="relative flex-grow focus-within:z-10">
                      <input 
                        v-model="searchTerm"
                        type="search" 
                        name="search" 
                        id="search"
                        class="block w-full rounded-none rounded-l-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm" 
                        placeholder="Ex: Gojira, Le Ferrailleur..." 
                      />
                    </div>
                    <button type="submit" class="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                      <Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
                      <span>Rechercher</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>