<script setup>
// Page de test pour vérifier la connexion Sanity
const { data: posts, error } = await useSanityQuery(groq`
  *[_type == "post"] | order(_createdAt desc) [0...3] {
    _id,
    title,
    slug,
    _createdAt
  }
`)

const { data: bands, error: bandsError } = await useSanityQuery(groq`
  *[_type == "band"] | order(_createdAt desc) [0...3] {
    _id,
    name,
    slug,
    _createdAt
  }
`)
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Test de connexion Sanity</h1>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <strong>Erreur:</strong> {{ error }}
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 class="text-xl font-semibold mb-2">Articles ({{ posts?.length || 0 }})</h2>
        <div v-if="posts?.length" class="space-y-2">
          <div v-for="post in posts" :key="post._id" class="bg-white p-3 rounded shadow">
            <h3 class="font-medium">{{ post.title }}</h3>
            <p class="text-sm text-gray-600">{{ post.slug?.current }}</p>
            <p class="text-xs text-gray-500">{{ new Date(post._createdAt).toLocaleDateString() }}</p>
          </div>
        </div>
        <p v-else class="text-gray-500">Aucun article trouvé</p>
      </div>
      
      <div>
        <h2 class="text-xl font-semibold mb-2">Groupes ({{ bands?.length || 0 }})</h2>
        <div v-if="bands?.length" class="space-y-2">
          <div v-for="band in bands" :key="band._id" class="bg-white p-3 rounded shadow">
            <h3 class="font-medium">{{ band.name }}</h3>
            <p class="text-sm text-gray-600">{{ band.slug?.current }}</p>
            <p class="text-xs text-gray-500">{{ new Date(band._createdAt).toLocaleDateString() }}</p>
          </div>
        </div>
        <p v-else class="text-gray-500">Aucun groupe trouvé</p>
      </div>
    </div>
    
    <div class="mt-6">
      <NuxtLink to="/recherche?q=test" class="text-blue-600 hover:underline">
        → Tester la page de recherche
      </NuxtLink>
    </div>
  </div>
</template>
