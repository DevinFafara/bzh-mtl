<!-- components/ContactForm.vue -->

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '#app'

const formEl = ref<HTMLFormElement | null>(null)
const router = useRouter()

const handleSubmit = async (event: Event) => {
  event.preventDefault()

  if (!formEl.value) return

  const formData = new FormData(formEl.value)

  try {
    await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as any).toString(),
    })

    router.push('/merci')
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire :', error)
  }
}
</script>


<template>
  <div class="max-w-2xl mx-auto">
    <form 
      ref="formEl"
      name="contact" 
      method="POST" 
      data-netlify="true" 
      data-netlify-honeypot="bot-field"
      @submit.prevent="handleSubmit"         
      class="bg-white p-8 rounded-lg shadow-lg border border-gray-200"
    >
      <input type="hidden" name="form-name" value="contact" />

      <div class="hidden">
        <label>
          Ne pas remplir si vous êtes humain : <input name="bot-field" />
        </label>
      </div>

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
            id="message" 
            name="message" 
            required 
            rows="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200 placeholder-gray-400 resize-vertical"
            placeholder="Décrivez votre demande ou votre message..."
          ></textarea>
        </div>

        <!-- Bouton d'envoi -->
        <div class="pt-4">
          <button 
            type="submit"
            class="w-full bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Icon name="heroicons:paper-airplane" class="h-5 w-5" />
            Envoyer le message
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