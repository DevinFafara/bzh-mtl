<template>
  <div v-if="author" class="flex justify-end">
    <div class="bg-gray-100 p-4 rounded-lg max-w-md">
      <div class="flex items-start gap-3">
        <NuxtImg
          v-if="author.image"
          :src="author.image.asset._ref"
          provider="sanity"
          class="h-10 w-10 rounded-full object-cover flex-shrink-0"
          :alt="`Photo de ${author.name}`"
        />
        <div class="flex-1 text-right">
          <p class="text-sm text-gray-600">
            {{ prefix || 'Fiche rédigée par' }}
            <NuxtLink :to="`/auteurs/${author.slug}`" class="text-blue-600 hover:underline font-medium">
              {{ author.name }}
            </NuxtLink>
          </p>
          <div v-if="author.citation" class="text-gray-500 italic mt-1 text-xs">
            <p>{{ author.citation }}</p>
          </div>
          <div v-if="author.bio && showBio" class="text-gray-600 mt-2 text-xs prose prose-xs">
            <CustomSanityContent :blocks="author.bio" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Author {
  name: string
  slug: string
  image?: { asset: { _ref: string } }
  bio?: any
  citation?: string
}

interface Props {
  author?: Author
  prefix?: string
  showBio?: boolean
}

withDefaults(defineProps<Props>(), {
  prefix: 'Fiche rédigée par',
  showBio: false
})
</script>
