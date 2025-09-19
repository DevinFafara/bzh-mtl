<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <!-- Card principale -->
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
        
        <!-- Logo -->
        <div class="mb-6">
          <img 
            src="/assets/img/logo2.png" 
            alt="Breizh Metal Logo" 
            class="w-24 h-24 mx-auto object-contain"
          />
        </div>

        <!-- Icône de succès -->
        <div class="mb-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Icon name="heroicons:check" class="w-8 h-8 text-green-600" />
          </div>
        </div>

        <!-- Titre principal -->
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Merci !
        </h1>

        <!-- Message de confirmation -->
        <p class="text-gray-600 mb-2 leading-relaxed">
          Votre message a bien été envoyé.
        </p>
        
        <p class="text-gray-600 mb-8 leading-relaxed">
          Nous vous répondrons dès que possible.
        </p>

        <!-- Boutons d'action -->
        <div class="space-y-3">
          <!-- Bouton retour accueil -->
          <NuxtLink 
            to="/"
            class="w-full inline-flex items-center justify-center gap-2 bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Icon name="heroicons:home" class="w-5 h-5" />
            Retour à l'accueil
          </NuxtLink>

          <!-- Bouton contact -->
          <NuxtLink 
            to="/contact"
            class="w-full inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Icon name="heroicons:envelope" class="w-5 h-5" />
            Nouveau message
          </NuxtLink>
        </div>

        <!-- Informations supplémentaires -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <p class="text-sm text-gray-500">
            <Icon name="heroicons:clock" class="w-4 h-4 inline mr-1" />
            Nous répondons généralement sous 48h
          </p>
        </div>
      </div>

      <!-- Message additionnel -->
      <div class="mt-6 text-center">
        <p class="text-gray-500 text-sm">
          En attendant, découvrez nos derniers articles et événements
        </p>
        <div class="flex justify-center gap-4 mt-3">
          <NuxtLink 
            to="/articles" 
            class="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
          >
            Articles
          </NuxtLink>
          <NuxtLink 
            to="/evenements" 
            class="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
          >
            Événements
          </NuxtLink>
          <NuxtLink 
            to="/groupes" 
            class="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
          >
            Groupes
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuration SEO
useSeoMeta({
  title: 'Merci pour votre message - Breizh Metal',
  description: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
  ogTitle: 'Message envoyé - Breizh Metal',
  ogDescription: 'Merci pour votre message, nous vous répondrons rapidement.',
})
</script>