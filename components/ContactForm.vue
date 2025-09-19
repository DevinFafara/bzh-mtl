<!-- components/ContactForm.vue -->

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '#app'

// On crée un objet réactif pour stocker les données du formulaire
// liées aux champs avec v-model
const formData = ref({
  name: '',
  email: '',
  message: '',
})

// On crée des variables pour gérer l'état de l'interface pendant l'envoi
const isSubmitting = ref(false)
const submissionError = ref<string | null>(null)

const router = useRouter()

// Notre fonction de soumission qui appelle notre propre API Nuxt
const handleSubmit = async () => {
  // On passe en mode "envoi en cours" pour désactiver le bouton
  isSubmitting.value = true
  submissionError.value = null

  try {
    // On appelle notre propre endpoint API situé dans /server/api/contact.post.ts
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // On envoie les données de notre objet réactif, converties en JSON
      body: JSON.stringify(formData.value),
    })

    const result = await response.json()

    // Si notre API a renvoyé une erreur, on l'affiche
    if (!result.success) {
      throw new Error(result.error || 'Une erreur inconnue est survenue.')
    }

    // Si tout s'est bien passé, on redirige l'utilisateur
    router.push('/merci')
  } catch (error: any) {
    console.error('Erreur côté client lors de la soumission :', error)
    submissionError.value = 'Impossible d\'envoyer le message. Veuillez réessayer plus tard.'
  } finally {
    // Dans tous les cas, on réactive le bouton à la fin
    isSubmitting.value = false
  }
}
</script>


<template>
  <div class="max-w-2xl mx-auto">
    <!-- 
      On a retiré tous les attributs `data-netlify`.
      La soumission est maintenant gérée par `@submit.prevent="handleSubmit"`.
    -->
    <form @submit.prevent="handleSubmit" class="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      
      <!-- Titre du formulaire -->
      <div class="mb-8 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Contactez-nous</h2>
        <p class="text-gray-600">Envoyez-nous un message, nous vous répondrons rapidement</p>
      </div>

      <div class="space-y-6">
        <!-- Champ Nom -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Votre Nom <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="formData.name"
            type="text" 
            id="name" 
            name="name" 
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
            name="email" 
            required 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-gray-400"
            placeholder="votre.email@exemple.com"
          />
        </div>

        <!-- Champ Message -->
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
            Votre Message <span class="text-red-500">*</span>
          </label>
          <textarea 
            v-model="formData.message"
            id="message" 
            name="message" 
            required 
            rows="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-gray-400 resize-vertical"
            placeholder="Décrivez votre demande ou votre message..."
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