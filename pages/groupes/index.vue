<script setup lang="ts">
// 1. La requête GROQ pour récupérer tous les groupes
// On trie par nom (name asc)
// On récupère les champs dont on a besoin pour la vignette
const query = groq`*[_type == "band"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  pressPhoto,
  // On récupère le tableau complet des styles liés
  // et pour chaque style, on prend son titre.
  "styles": styles[]->{title}
}`;

// 2. On exécute la requête
const { data: bands } = await useSanityQuery<Array<any>>(query);
</script>

<template>
  <div class="container mx-auto p-4 md:p-8">
    <h1 class="text-2xl md:text-4xl font-bold mb-8">La Scène Bretonne</h1>

    <!-- 3. On crée la grille pour afficher les vignettes -->
    <div v-if="bands && bands.length > 0" class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <!-- On fait une boucle sur les groupes récupérés -->
      <div v-for="band in bands" :key="band._id">
        <!-- On utilise un composant pour la vignette (qu'on va créer juste après) -->
        <BandCard :band="band" />
      </div>
    </div>
    <div v-else>
      <p>Aucun groupe trouvé. Ajoutez-en dans Sanity !</p>
    </div>
  </div>
</template>