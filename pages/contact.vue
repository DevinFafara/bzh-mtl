<script setup lang="ts">
// Pour le SEO de la page
useHead({
  title: 'Contact - Breizh Metal',
  meta: [
    { name: 'description', content: 'Contactez l\'équipe de Breizh Metal. Envoyez-nous un message, une proposition de chronique ou une suggestion.' }
  ]
});

const contactEmail = 'contact@breizhmetal.bzh';
</script>

<template>
  <div class="bg-white">
    <div class="container mx-auto px-4 flex items-center justify-center min-h-[70vh]">
      
      <div class="max-w-3xl mx-auto text-center py-16">
        
        <h1 class="text-3xl md:text-3xl font-extrabold text-gray-900 leading-tight">
          Nous Contacter
        </h1>
        <p class="mt-4 text-xl text-gray-600">
          Votre voix est essentielle à la vitalité de la scène locale.
        </p>

        <div class="prose prose-lg mx-auto mt-10 text-justify border-t border-b border-gray-200 py-8">
          <p>
            Avant de nous contacter, sachez que nous lisons attentivement chaque message. Nous sommes une petite équipe de passionnés, alors un peu de patience est parfois nécessaire, mais chaque mail reçoit une réponse.
          </p>
          <p>
            Que ce soit pour partager une découverte, annoncer un concert, suggérer une interview ou simplement échanger, n'hésitez pas. Toutes les contributions sont les bienvenues.
          </p>
        </div>
        
        <div class="mt-12 mb-12">
          <h3 class="text-lg font-semibold text-gray-500 uppercase tracking-widest">
            Nous écrire
          </h3>
          <a 
            :href="`mailto:${contactEmail}`" 
            class="mt-2 inline-block text-2xl md:text-3xl font-bold text-yellow-600 hover:text-yellow-700 transition-colors duration-300 group"
          >
            <span>{{ contactEmail }}</span>
            <div class="mt-1 h-0.5 bg-yellow-600 w-0 group-hover:w-full transition-all duration-300"></div>
          </a>
        </div>
        <ContactForm />

      </div>

    </div>
  </div>
</template>