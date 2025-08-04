<script setup lang="ts">
// On récupère la route actuelle pour avoir accès au paramètre 'slug' de l'URL
const route = useRoute();

// La requête pour UN seul article, en utilisant le slug comme filtre
// $slug est une variable que nous allons passer à la requête
const query = groq`*[_type == "post" && slug.current == $slug][0] {
  title,
  publishedAt,
  mainImage,
  body,
  articleType,
  "author": author->{ name, "slug": slug.current, image, citation },
  "relatedBand": relatedBand->{ name, "slug": slug.current, logoImage },
  "relatedVenue": relatedVenue->{ name, "slug": slug.current, city }
}`;

// Requête pour navigation (article précédent et suivant par date de publication)
const navigationQuery = groq`{
  "previous": *[_type == "post" && publishedAt < $currentDate] | order(publishedAt desc) [0] {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    articleType,
    publishedAt
  },
  "next": *[_type == "post" && publishedAt > $currentDate] | order(publishedAt asc) [0] {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    articleType,
    publishedAt
  }
}`;

interface NavigationPost {
  _id: string
  title: string
  slug: string
  mainImage?: { asset: { _ref: string } }
  articleType: string
  publishedAt: string
}

interface Navigation {
  previous?: NavigationPost
  next?: NavigationPost
}

// Définition du type Post pour typer correctement la donnée récupérée
interface Post {
  title?: string;
  publishedAt?: string;
  mainImage?: any;
  body?: any;
  articleType?: string;
  author?: {
    name?: string;
    slug?: string;
    image?: any;
    citation?: string;
  };
  relatedBand?: {
    name?: string;
    slug?: string;
    logoImage?: any;
  };
  relatedVenue?: {
    name?: string;
    slug?: string;
    city?: string;
  };
}

// On passe le slug de l'URL en paramètre à la requête
const { data: post, pending } = await useSanityQuery<Post>(query, { slug: route.params.slug });

// Requête pour la navigation (articles précédent et suivant)
const { data: navigation } = await useSanityQuery<Navigation>(navigationQuery, {
  currentDate: post.value?.publishedAt || ''
});

const formattedDate = computed(() => {
  if (!post.value?.publishedAt) return '';
  return new Date(post.value.publishedAt).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
});

</script>

<template>
  <div v-if="pending">
    <div class="text-center p-16">Chargement de l'article...</div>
  </div>
  
  <article v-else-if="post" class="article-page">
    <!-- 1. HEADER DE L'ARTICLE (avec image de fond) -->
    <header class="relative bg-stone-800 text-white py-20 md:py-32">
      <!-- Contenu du header -->
      <div class="container mx-auto px-4 relative text-center">
        <h1 class="text-4xl md:text-6xl font-extrabold">{{ post.title }}</h1>
        <p class="mt-4 text-lg text-gray-300">
          Publié le {{ formattedDate }} par 
          <NuxtLink v-if="post.author" :to="`/auteurs/${post.author.slug}`" class="font-semibold hover:underline">
            {{ post.author.name }}
          </NuxtLink>
        </p>
      </div>
    </header>

    <!-- 2. CORPS DE L'ARTICLE (Layout à 2 colonnes) -->
      <!-- Image de fond avec superposition sombre -->
      <div class="max-w-120 justify-center mx-auto mt-8">
        <NuxtImg
          v-if="post.mainImage"
          :src="post.mainImage.asset._ref"
          provider="sanity"
          class=""
        />
      </div>
    <div class="container mx-auto px-4 mt-8 md:mt-12">
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        <!-- Colonne Principale (Contenu de l'article) -->
        <div class="w-full lg:w-2/3">
          <div v-if="post.body" class="max-w-none text-justify">
            <CustomSanityContent :blocks="post.body" />
          </div>
        </div>
        <div v-if="post.author" class="bg-gray-50 p-6 rounded-lg">
          <div class="flex items-start gap-4">
            <NuxtImg
              v-if="post.author.image"
              :src="post.author.image.asset._ref"
              provider="sanity"
              class="h-16 w-16 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <p class="font-semibold">
                Article rédigé par 
                <NuxtLink :to="`/auteurs/${post.author.slug}`" class="text-blue-600 hover:underline">
                  {{ post.author.name }}
                </NuxtLink>
              </p>
              <div v-if="post.author.citation" class="text-gray-600 italic mt-2 prose prose-sm">
                <p>{{ post.author.citation }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Colonne Latérale (Infos contextuelles) -->
        <aside class="w-full lg:w-1/3 lg:sticky lg:top-28 self-start">
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-xl font-bold mb-4 border-b pb-2">En lien avec cet article</h3>
            
            <!-- Affichage conditionnel du Groupe -->
            <div v-if="post.relatedBand" class="mb-4">
              <h4 class="font-semibold text-gray-700">Groupe</h4>
              <NuxtLink :to="`/groupes/${post.relatedBand.slug}`" class="flex items-center gap-3 mt-2 group">
                <div v-if="post.relatedBand.logoImage" class="h-12 w-12 bg-white rounded-md flex-shrink-0 flex items-center justify-center p-1">
                  <NuxtImg :src="post.relatedBand.logoImage.asset._ref" provider="sanity" class="h-full w-full object-contain" />
                </div>
                <span class="text-lg text-black group-hover:underline">{{ post.relatedBand.name }}</span>
              </NuxtLink>
            </div>
            
            <!-- Affichage conditionnel de la Salle -->
            <div v-if="post.relatedVenue">
              <h4 class="font-semibold text-gray-700">Lieu</h4>
              <NuxtLink :to="`/salles/${post.relatedVenue.slug}`" class="flex items-center gap-3 mt-2 group">
                 <div class="h-12 w-12 bg-white rounded-md flex-shrink-0 flex items-center justify-center p-1 text-gray-400">
                  <Icon name="heroicons:map-pin-20-solid" class="h-8 w-8" />
                 </div>
                 <div>
                   <span class="text-lg text-black group-hover:underline">{{ post.relatedVenue.name }}</span>
                   <p class="text-sm text-gray-500">{{ post.relatedVenue.city }}</p>
                 </div>
              </NuxtLink>
            </div>

          </div>
        </aside>

      </div>
      
      <!-- Navigation entre articles -->
      <div v-if="navigation?.previous || navigation?.next" class="navigation-section mt-12">
        <div class="grid grid-cols-2 w-full border border-gray-300 rounded-lg overflow-hidden">
          <!-- Moitié gauche : Article précédent -->
          <NuxtLink 
            v-if="navigation.previous" 
            :to="`/articles/${navigation.previous.slug}`"
            class="flex flex-col items-center justify-center p-4 bg-white hover:bg-gray-50 transition-colors border-r border-gray-300 text-center"
          >
            <div class="flex items-center mb-1">
              <Icon name="heroicons:chevron-left" class="h-5 w-5 text-gray-600 mr-2" />
              <span class="text-gray-800 font-medium">Article précédent</span>
            </div>
            <span class="text-gray-800 font-semibold bg-blue-100 px-3 py-1 rounded-lg w-full text-center">{{ navigation.previous.title }}</span>
          </NuxtLink>
          <div v-else class="flex items-center justify-center p-4 bg-gray-100 border-r border-gray-300 text-center">
            <span class="text-gray-400">Pas d'article précédent</span>
          </div>
          
          <!-- Moitié droite : Article suivant -->
          <NuxtLink 
            v-if="navigation.next" 
            :to="`/articles/${navigation.next.slug}`"
            class="flex flex-col items-center justify-center p-4 bg-white hover:bg-gray-50 transition-colors text-center"
          >
            <div class="flex items-center mb-1">
              <span class="text-gray-800 font-medium">Article suivant</span>
              <Icon name="heroicons:chevron-right" class="h-5 w-5 text-gray-600 ml-2" />
            </div>
            <span class="text-gray-800 font-semibold bg-blue-100 px-3 py-1 rounded-lg w-full text-center">{{ navigation.next.title }}</span>
          </NuxtLink>
          <div v-else class="flex items-center justify-center p-4 bg-gray-100 text-center">
            <span class="text-gray-400">Pas d'article suivant</span>
          </div>
        </div>
      </div>
    </div>
  </article>

  <div v-else class="text-center p-16">
    <p>Article non trouvé.</p>
  </div>
</template>