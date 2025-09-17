<!-- pages/salles/index.vue -->
<script setup lang="ts">
// Configuration SEO pour la page des salles
useSeoMeta({
  title: 'Salles de Concert - Breizh Metal',
  description: 'Découvrez toutes les salles de concert de Bretagne qui accueillent des événements metal. Informations, capacités et événements à venir.',
  ogTitle: 'Salles de Concert Metal - Breizh Metal',
  ogDescription: 'Toutes les salles de concert metal en Bretagne. Découvrez les lieux qui font vibrer la scène metal bretonne.',
  ogImage: '/bzh-mtl-mgz_logo.png',
  twitterCard: 'summary_large_image'
})

// 1. La requête GROQ reste simple : on récupère toutes les salles.
// IMPORTANT : on ajoute le champ 'department' à la requête !
const query = groq`*[_type == "venue"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  image,
  city,
  department // ON AJOUTE LE DÉPARTEMENT
}`;

// 2. On exécute la requête
interface Venue {
  _id: string;
  name: string;
  slug: string;
  image?: any;
  city?: string;
  department: string;
}

const { data: venues } = await useSanityQuery<Venue[]>(query);

// 3. On définit l'ordre et les noms des départements (pour un affichage correct)
const departmentOrder = [
  { value: '29', title: 'Finistère (29)' },
  { value: '22', title: 'Côtes-d\'Armor (22)' },
  { value: '56', title: 'Morbihan (56)' },
  { value: '35', title: 'Ille-et-Vilaine (35)' },
  { value: '44', title: 'Loire-Atlantique (44)' },
];

// 4. On crée une computed property pour grouper les salles
const groupedVenues = computed(() => {
  // On s'assure que venues.value est toujours un tableau
  const venuesArray = Array.isArray(venues.value) ? venues.value : [];

  // On utilise la méthode 'reduce' pour transformer le tableau en objet
  const groups = venuesArray.reduce<Record<string, Venue[]>>((acc, venue) => {
    // On récupère le département de la salle
    const department = venue.department;

    // Si ce département n'existe pas encore dans notre accumulateur (acc), on crée un tableau vide pour lui
    if (!acc[department]) {
      acc[department] = [];
    }

    // On ajoute la salle actuelle dans le tableau du bon département
    acc[department].push(venue);

    return acc;
  }, {});

  return groups;
});
</script>

<!-- pages/salles/index.vue -->
<template>
  <div class="container mx-auto p-4 md:p-8">
    <h1 class="text-2xl md:text-4xl font-bold mb-8">Les Salles de Concert</h1>
    <p class="text-lg text-gray-600 mb-12">Nous ajouterons des lieux de concert régulièrement.</p>

    <!-- 1. On fait une boucle sur notre ordre de départements défini dans le script -->
    <div v-for="dept in departmentOrder" :key="dept.value">
      
      <!-- On vérifie s'il y a des salles pour ce département avant d'afficher le titre -->
      <div v-if="groupedVenues[dept.value] && groupedVenues[dept.value].length > 0">
        
        <!-- Titre du département -->
        <h2 class="text-xl font-semibold border-b-2 border-gray-300 pb-2 mt-12 mb-6">
          {{ dept.title }}
        </h2>
        
        <!-- 2. On affiche la grille responsive, en bouclant sur les salles du département courant -->
        <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          <div v-for="venue in groupedVenues[dept.value]" :key="venue._id">
            <VenueCard :venue="venue" />
          </div>
        </div>

      </div>
    </div>

    <!-- Message si aucune salle n'est trouvée du tout -->
    <div v-if="!venues || venues.length === 0" class="text-center py-12">
      <p>Aucune salle trouvée. Ajoutez-en dans Sanity !</p>
    </div>
  </div>
</template>