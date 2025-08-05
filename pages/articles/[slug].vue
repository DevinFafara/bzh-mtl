<script setup lang="ts">
// On récupère la route actuelle pour avoir accès au paramètre 'slug' de l'URL
const route = useRoute();

// La requête pour UN seul article, en utilisant le slug comme filtre
// $slug est une variable que nous allons passer à la requête
const query = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  publishedAt,
  mainImage,
  body,
  articleType,
  "author": author->{ name, "slug": slug.current, image, citation },
  "relatedBand": relatedBand->{ _id, name, "slug": slug.current, logoImage, pressPhoto, "styles": styles[]->{ _id, title, "slug": slug.current } },
  "relatedVenue": relatedVenue->{ _id, name, "slug": slug.current, city }
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

// Requête pour les articles liés (même groupe ou même lieu)
const relatedPostsQuery = groq`*[_type == "post" && _id != $currentPostId && (
  (defined($bandId) && relatedBand._ref == $bandId) ||
  (defined($venueId) && relatedVenue._ref == $venueId)
)] | order(publishedAt desc) [0...6] {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  publishedAt,
  articleType,
  "author": author->name
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

interface RelatedPost {
  _id: string
  title: string
  slug: string
  mainImage?: { asset: { _ref: string } }
  articleType: string
  publishedAt: string
  author?: string
}

// Définition du type Post pour typer correctement la donnée récupérée
interface Post {
  _id?: string;
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
    _id?: string;
    name?: string;
    slug?: string;
    logoImage?: any;
    pressPhoto?: any;
    styles?: Array<{ _id: string; title: string; slug: string }>;
  };
  relatedVenue?: {
    _id?: string;
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

// Requête pour les articles liés
const { data: relatedPosts } = await useSanityQuery<RelatedPost[]>(relatedPostsQuery, {
  currentPostId: post.value?._id || '',
  bandId: post.value?.relatedBand?._id || null,
  venueId: post.value?.relatedVenue?._id || null
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
          Publié le {{ formattedDate }} 
          <!-- par 
          <NuxtLink v-if="post.author" :to="`/auteurs/${post.author.slug}`" class="font-semibold hover:underline">
            {{ post.author.name }}
          </NuxtLink> -->
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
        <AuthorSection 
          v-if="post.author && post.author.name && post.author.slug" 
          :author="post.author as any" 
          prefix="Article rédigé par" 
        />
        
        <!-- Colonne Latérale (Infos contextuelles) -->
        <aside class="w-full lg:w-1/3 lg:sticky lg:top-28 self-start">
          <div class="space-y-4">
            <h3 class="text-xl font-bold mb-4">En lien avec cet article</h3>
            
            <!-- Affichage conditionnel du Groupe -->
            <div v-if="post.relatedBand">
              <NuxtLink 
                :to="`/groupes/${post.relatedBand.slug}`" 
                class="group flex bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <!-- Image/Photo à gauche -->
                <div class="relative w-48 h-32 flex-shrink-0 overflow-hidden">
                  <div v-if="post.relatedBand.pressPhoto" class="w-full h-full">
                    <NuxtImg 
                      :src="post.relatedBand.pressPhoto.asset._ref" 
                      provider="sanity" 
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      :alt="`Photo de ${post.relatedBand.name}`"
                    />
                  </div>
                  <div v-else-if="post.relatedBand.logoImage" class="w-full h-full flex items-center justify-center bg-white p-2">
                    <NuxtImg 
                      :src="post.relatedBand.logoImage.asset._ref" 
                      provider="sanity" 
                      class="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      :alt="`Logo de ${post.relatedBand.name}`"
                    />
                  </div>
                  <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <Icon name="heroicons:musical-note" class="h-8 w-8 text-gray-400" />
                  </div>
                  
                  <!-- Overlay gradient -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <!-- Badge type -->
                  <div class="absolute top-2 left-2">
                    <span class="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      Groupe
                    </span>
                  </div>
                </div>

                <!-- Contenu à droite -->
                <div class="flex-1 p-4 flex flex-col justify-between">
                  <!-- Titre du groupe -->
                  <h4 class="text-lg font-bold text-gray-900 group-hover:text-yellow-600 transition-colors mb-2 line-clamp-2 leading-tight">
                    {{ post.relatedBand.name }}
                  </h4>

                  <!-- Métadonnées et indicateur -->
                  <div class="space-y-2">
                    <!-- Styles musicaux -->
                    <div v-if="post.relatedBand.styles && post.relatedBand.styles.length > 0" class="flex flex-wrap gap-1">
                      <span 
                        v-for="style in post.relatedBand.styles.slice(0, 3)" 
                        :key="style._id"
                        class="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {{ style.title }}
                      </span>
                      <span v-if="post.relatedBand.styles.length > 3" class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        +{{ post.relatedBand.styles.length - 3 }}
                      </span>
                    </div>

                    <!-- Indicateur de navigation -->
                    <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span class="text-sm text-gray-400">Voir la fiche</span>
                      <Icon name="heroicons:arrow-right" class="h-4 w-4 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>
            
            <!-- Affichage conditionnel de la Salle -->
            <div v-if="post.relatedVenue">
              <NuxtLink 
                :to="`/salles/${post.relatedVenue.slug}`" 
                class="group flex bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <!-- Image/Icône à gauche -->
                <div class="relative w-32 h-24 flex-shrink-0 overflow-hidden">
                  <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <Icon name="heroicons:map-pin" class="h-8 w-8 text-gray-400" />
                  </div>
                  
                  <!-- Overlay gradient -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <!-- Badge type -->
                  <div class="absolute top-1 left-1">
                    <span class="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      Lieu
                    </span>
                  </div>
                </div>

                <!-- Contenu à droite -->
                <div class="flex-1 p-4 flex flex-col justify-center">
                  <h4 class="text-base font-bold text-gray-900 group-hover:text-yellow-600 transition-colors leading-tight">
                    {{ post.relatedVenue.name }}
                  </h4>
                  <p class="text-sm text-gray-500 mb-1">{{ post.relatedVenue.city }}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-400">Voir la fiche</span>
                    <Icon name="heroicons:arrow-right" class="h-4 w-4 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </NuxtLink>
            </div>

          </div>
        </aside>

      </div>
      
      <!-- Articles connexes -->
      <div v-if="relatedPosts && Array.isArray(relatedPosts) && relatedPosts.length > 0" class="related-posts-section mt-12">
        <h2 class="font-bold text-xl mb-6">
          Articles connexes
          <span v-if="post.relatedBand">avec {{ post.relatedBand.name }}</span>
          <span v-else-if="post.relatedVenue">au {{ post.relatedVenue.name }}</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PostCard 
            v-for="relatedPost in relatedPosts" 
            :key="relatedPost._id"
            :post="relatedPost"
          />
        </div>
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