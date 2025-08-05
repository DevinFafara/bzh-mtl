<script setup lang="ts">
const query = groq`*[_type == "author"] | order(name desc) {
  _id,
  name,
  "slug": slug.current,
  image,
  citation,
  bio
}`;

type Author = {
  _id: string;
  name: string;
  slug: string;
  image?: any;
  citation?: string;
  bio?: any;
};

const { data: authors, pending, error } = await useSanityQuery<Author[]>(query);

// Pour le SEO de la page
useHead({
  title: 'À Propos - Breizh Metal Magazine',
  meta: [
    { name: 'description', content: 'Découvrez l\'histoire et l\'équipe derrière Breizh Metal Magazine, le portail de la scène metal en Bretagne.' }
  ]
});
</script>

<template>
  <div class="bg-white">
    <div class="container mx-auto px-4 py-16 md:py-24">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900">Notre Histoire</h1>
        <p class="mt-4 text-xl text-gray-600">
          Forger le lien entre les fans et la scène metal bretonne.
        </p>
      </div>
      <div class="max-w-4xl mx-auto mt-12">
        <div class="space-y-6 text-lg leading-relaxed">
          <p class="text-gray-700">
            Breizh Metal Magazine est né d'une idée simple : créer un espace dédié à la richesse et à la diversité de la scène Metal / Punk / Hardcore en Bretagne. Des côtes du Finistère aux terres de Loire-Atlantique, notre région regorge de talents, de salles mythiques et de festivals qui méritent d'être mis en lumière.
          </p>
          <div class="border-l-4 border-yellow-600 pl-6 py-4 bg-gray-50 rounded-r-lg my-8">
            <p class="text-xl font-semibold text-gray-900 italic">
              Notre mission : être une boussole dans le Maelström de la scène locale et émergente en Bretagne.
            </p>
          </div>
          <p class="text-gray-700">
            Ce projet est porté par des passionnés, pour des passionnés. Chaque ligne de code, chaque chronique et chaque photo est le fruit de notre dévotion à cette musique qui nous anime.
          </p>
        </div>
      </div>
    </div>

    <div class="bg-gray-50">
      <div class="container mx-auto px-4 py-16 md:py-24">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">L'Équipe</h2>
          <p class="mt-2 text-lg text-gray-500">Ceux qui font tourner la machine.</p>
        </div>
        
        <div v-if="pending" class="text-center">Chargement de l'équipe...</div>
        <div v-else-if="error" class="text-center text-red-500">Erreur lors du chargement de l'équipe.</div>
        
        <div v-else-if="authors && authors.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <NuxtLink 
            v-for="author in authors" 
            :key="author._id"
            :to="`/auteurs/${author.slug}`"
            class="group text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <NuxtImg
              v-if="author.image"
              :src="author.image.asset._ref"
              provider="sanity"
              class="h-24 w-24 rounded-full object-cover mx-auto mb-4 border-4 border-white group-hover:border-yellow-400 transition-colors shadow-lg"
              :alt="`Photo de ${author.name}`"
            />
            <h3 class="text-xl font-bold text-gray-900">{{ author.name }}</h3>
            <p v-if="author.citation" class="text-yellow-600 font-semibold text-sm italic">{{ author.citation }}</p>
            <div v-if="author.bio" class="text-gray-500 mt-2 text-sm">
               <CustomSanityContent :blocks="author.bio.slice(0, 1)" />
            </div>
          </NuxtLink>
        </div>

      </div>
    </div>

    <div class="bg-white">
      <div class="container mx-auto px-4 py-16 md:py-24">
        <div class="text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nous Contacter</h2>
          <p class="text-lg text-gray-600 mb-8">
            Une question, une suggestion, ou envie de nous rejoindre ?
          </p>
          <div class="bg-gray-50 rounded-lg p-8 max-w-2xl mx-auto">
            <div class="flex items-center justify-center space-x-4">
              <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <a 
                href="mailto:breizh.webzine@gmail.com" 
                class="text-xl font-semibold text-gray-900 hover:text-yellow-600 transition-colors"
              >
                breizh.webzine@gmail.com
              </a>
            </div>
            <p class="text-gray-600 mt-4">
              Nous répondons généralement sous 48h. Tous les messages sont les bienvenus !
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>