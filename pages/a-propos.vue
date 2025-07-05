<script setup lang="ts">
// On va chercher TOUS les auteurs et les champs dont nous avons besoin.
const query = groq`*[_type == "author"] | order(name desc) {
  _id,
  name,
  "slug": slug.current,
  image,
  citation,
  bio
}`;

// Définir le type Author pour typer correctement les données
type Author = {
  _id: string;
  name: string;
  slug: string;
  image?: any;
  citation?: string;
  bio?: any;
};

// On exécute la requête pour récupérer les auteurs
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
    <!-- 1. Section Principale : Notre histoire (contenu statique, inchangé) -->
    <div class="container mx-auto px-4 py-16 md:py-24">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900">Notre Histoire</h1>
        <p class="mt-4 text-xl text-gray-600">
          Forger le lien entre les fans et la scène metal bretonne.
        </p>
      </div>
      <div class="prose lg:prose-xl mx-auto mt-12 text-justify">
        <p>
          Breizh Metal Magazine est né d'une idée simple : créer un espace dédié à la richesse et à la diversité de la scène metal en Bretagne. Des côtes du Finistère aux terres d'Ille-et-Vilaine, notre région regorge de talents, de salles mythiques et de festivals qui méritent d'être mis en lumière.
        </p>
        <blockquote>
          Notre mission : être votre boussole dans le Maelström du metal breton.
        </blockquote>
        <p>
          Ce projet est porté par des passionnés, pour des passionnés. Chaque ligne de code, chaque chronique et chaque photo est le fruit de notre dévotion à cette musique qui nous anime.
        </p>
      </div>
    </div>

    <!-- 2. Section Équipe (maintenant dynamique) -->
    <div class="bg-gray-50">
      <div class="container mx-auto px-4 py-16 md:py-24">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">L'Équipe</h2>
          <p class="mt-2 text-lg text-gray-500">Ceux qui font tourner la machine.</p>
        </div>
        
        <!-- On affiche le chargement ou une erreur si besoin -->
        <div v-if="pending" class="text-center">Chargement de l'équipe...</div>
        <div v-else-if="error" class="text-center text-red-500">Erreur lors du chargement de l'équipe.</div>
        
        <!-- Grille des membres de l'équipe, qui boucle sur les données de Sanity -->
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
            <!-- On utilise la citation de l'auteur ici -->
            <p v-if="author.citation" class="text-yellow-600 font-semibold text-sm italic">{{ author.citation }}</p>
            <!-- On affiche un extrait de la bio pour la description -->
            <div v-if="author.bio" class="text-gray-500 mt-2 text-sm">
               <CustomSanityContent :blocks="author.bio.slice(0, 1)" />
            </div>
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>