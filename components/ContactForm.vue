<!-- components/ContactForm.vue -->

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from '#app'

// Types de demande disponibles
const requestTypes = [
  { value: '', label: 'Choisissez un motif…' },
  { value: 'event', label: '📅 Communiquer sur un événement' },
  { value: 'venue', label: '🏠 Mettre en lumière un établissement' },
  { value: 'band', label: '🎸 Créer une fiche groupe' },
  { value: 'other', label: '💬 Autre / Message libre' },
]

// Départements bretons
const departments = [
  'Côtes-d\'Armor (22)',
  'Finistère (29)',
  'Ille-et-Vilaine (35)',
  'Loire-Atlantique (44)',
  'Morbihan (56)',
]

// Données du formulaire
const formData = ref({
  requestType: '',
  name: '',
  email: '',
  message: '',
  // Champs événement
  eventName: '',
  eventDate: '',
  eventVenue: '',
  eventLink: '',
  // Champs salle/bar
  venueName: '',
  venueCity: '',
  venueDepartment: '',
  venueWebsite: '',
  // Champs groupe
  bandName: '',
  bandDepartment: '',
  bandStyle: '',
  bandLink: '',
})

// État du formulaire
const isSubmitting = ref(false)
const submissionError = ref<string | null>(null)

const router = useRouter()

// Labels dynamiques pour le champ message selon le type
const messagePlaceholder = computed(() => {
  switch (formData.value.requestType) {
    case 'event': return 'Décrivez votre événement : programmation, horaires, tarifs, informations utiles…'
    case 'venue': return 'Parlez-nous de votre établissement : ambiance, programmation, ce qui le rend unique…'
    case 'band': return 'Présentez votre groupe : histoire, membres, discographie, projets en cours…'
    default: return 'Décrivez votre demande ou votre message…'
  }
})

const messageLabel = computed(() => {
  switch (formData.value.requestType) {
    case 'event': return 'Détails de l\'événement'
    case 'venue': return 'Description de l\'établissement'
    case 'band': return 'Présentation du groupe'
    default: return 'Votre Message'
  }
})

// Soumission du formulaire
const handleSubmit = async () => {
  isSubmitting.value = true
  submissionError.value = null

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || 'Une erreur inconnue est survenue.')
    }

    router.push('/merci')
  } catch (error: any) {
    console.error('Erreur côté client lors de la soumission :', error)
    submissionError.value = 'Impossible d\'envoyer le message. Veuillez réessayer plus tard.'
  } finally {
    isSubmitting.value = false
  }
}
</script>


<template>
  <div class="max-w-2xl mx-auto">
    <form @submit.prevent="handleSubmit" class="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      
      <!-- Titre du formulaire -->
      <div class="mb-8 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Contactez-nous</h2>
        <p class="text-gray-600">Envoyez-nous un message, nous vous répondrons rapidement</p>
      </div>

      <div class="space-y-6">

        <!-- Sélecteur de type de demande -->
        <div>
          <label for="requestType" class="block text-sm font-medium text-gray-700 mb-2">
            Motif de votre message <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.requestType"
            id="requestType"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 bg-white"
          >
            <option v-for="type in requestTypes" :key="type.value" :value="type.value" :disabled="type.value === ''">
              {{ type.label }}
            </option>
          </select>
        </div>

        <!-- Champ Nom -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Votre Nom <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="formData.name"
            type="text" 
            id="name" 
            required 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-gray-400"
            placeholder="Votre nom complet"
          />
        </div>

        <!-- Champ Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Votre Email <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="formData.email"
            type="email" 
            id="email" 
            required 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-gray-400"
            placeholder="votre.email@exemple.com"
          />
        </div>

        <!-- ===================== -->
        <!-- CHAMPS : ÉVÉNEMENT    -->
        <!-- ===================== -->
        <template v-if="formData.requestType === 'event'">
          <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-200 space-y-4">
            <p class="text-sm font-semibold text-yellow-800">Informations sur l'événement</p>
            
            <div>
              <label for="eventName" class="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'événement <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="formData.eventName"
                type="text" 
                id="eventName" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-gray-400"
                placeholder="Ex : Metal Fest Rennes 2026"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="eventDate" class="block text-sm font-medium text-gray-700 mb-1">
                  Date prévue
                </label>
                <input 
                  v-model="formData.eventDate"
                  type="date" 
                  id="eventDate"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label for="eventVenue" class="block text-sm font-medium text-gray-700 mb-1">
                  Lieu (salle / ville)
                </label>
                <input 
                  v-model="formData.eventVenue"
                  type="text" 
                  id="eventVenue"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-gray-400"
                  placeholder="Ex : Le Liberté, Rennes"
                />
              </div>
            </div>

            <div>
              <label for="eventLink" class="block text-sm font-medium text-gray-700 mb-1">
                Lien (billetterie, page Facebook…)
              </label>
              <input 
                v-model="formData.eventLink"
                type="url" 
                id="eventLink"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-gray-400"
                placeholder="https://..."
              />
            </div>
          </div>
        </template>

        <!-- ===================== -->
        <!-- CHAMPS : SALLE / BAR  -->
        <!-- ===================== -->
        <template v-if="formData.requestType === 'venue'">
          <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-200 space-y-4">
            <p class="text-sm font-semibold text-yellow-800">Informations sur l'établissement</p>
            
            <div>
              <label for="venueName" class="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'établissement <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="formData.venueName"
                type="text" 
                id="venueName" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-gray-400"
                placeholder="Ex : Le Norulingus"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="venueCity" class="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input 
                  v-model="formData.venueCity"
                  type="text" 
                  id="venueCity"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-gray-400"
                  placeholder="Ex : Brest"
                />
              </div>
              <div>
                <label for="venueDepartment" class="block text-sm font-medium text-gray-700 mb-1">
                  Département
                </label>
                <select
                  v-model="formData.venueDepartment"
                  id="venueDepartment"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 bg-white"
                >
                  <option value="">— Sélectionner —</option>
                  <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
                </select>
              </div>
            </div>

            <div>
              <label for="venueWebsite" class="block text-sm font-medium text-gray-700 mb-1">
                Site web
              </label>
              <input 
                v-model="formData.venueWebsite"
                type="url" 
                id="venueWebsite"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-gray-400"
                placeholder="https://..."
              />
            </div>
          </div>
        </template>

        <!-- ===================== -->
        <!-- CHAMPS : GROUPE       -->
        <!-- ===================== -->
        <template v-if="formData.requestType === 'band'">
          <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-200 space-y-4">
            <p class="text-sm font-semibold text-yellow-800">Informations sur le groupe</p>
            
            <div>
              <label for="bandName" class="block text-sm font-medium text-gray-700 mb-1">
                Nom du groupe <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="formData.bandName"
                type="text" 
                id="bandName" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-gray-400"
                placeholder="Ex : Ar Braz"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="bandDepartment" class="block text-sm font-medium text-gray-700 mb-1">
                  Département d'origine
                </label>
                <select
                  v-model="formData.bandDepartment"
                  id="bandDepartment"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 bg-white"
                >
                  <option value="">— Sélectionner —</option>
                  <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
                </select>
              </div>
              <div>
                <label for="bandStyle" class="block text-sm font-medium text-gray-700 mb-1">
                  Style(s) musical(aux)
                </label>
                <input 
                  v-model="formData.bandStyle"
                  type="text" 
                  id="bandStyle"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-gray-400"
                  placeholder="Ex : Death Metal, Black Metal"
                />
              </div>
            </div>

            <div>
              <label for="bandLink" class="block text-sm font-medium text-gray-700 mb-1">
                Lien (Bandcamp, Spotify, site…)
              </label>
              <input 
                v-model="formData.bandLink"
                type="url" 
                id="bandLink"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-gray-400"
                placeholder="https://..."
              />
            </div>
          </div>
        </template>

        <!-- Champ Message (toujours visible) -->
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
            {{ messageLabel }} <span class="text-red-500">*</span>
          </label>
          <textarea 
            v-model="formData.message"
            id="message" 
            required 
            rows="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-gray-400 resize-vertical"
            :placeholder="messagePlaceholder"
          ></textarea>
        </div>

        <!-- Affichage conditionnel du message d'erreur -->
        <div v-if="submissionError" class="p-4 bg-red-100 text-red-700 rounded-lg">
          <p>{{ submissionError }}</p>
        </div>

        <!-- Bouton d'envoi -->
        <div class="pt-4">
          <button 
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Icon v-if="!isSubmitting" name="heroicons:paper-airplane" class="h-5 w-5" />
            {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer le message' }}
          </button>
        </div>
      </div>

      <!-- Note en bas -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <p class="text-sm text-gray-500 text-center">
          <Icon name="heroicons:shield-check" class="h-4 w-4 inline mr-1" />
          Vos données personnelles sont protégées et ne seront utilisées que pour répondre à votre demande.
        </p>
      </div>
    </form>
  </div>
</template>