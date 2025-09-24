<script setup lang="ts">
interface SanityBlock {
  _key: string;
  _type: string;
  children?: Array<{
    _key: string;
    _type: string;
    marks: string[];
    text: string;
  }>;
  markDefs?: any[];
  style?: string;
  listItem?: string;
  level?: number;
  asset?: {
    _ref: string;
    _type: string;
  };
  alt?: string;
  caption?: string;
}

defineProps<{
  blocks: SanityBlock[];
}>();

// État pour la modal de l'image
const selectedImage = ref<{
  src: string;
  alt: string;
  caption?: string;
} | null>(null);

// Fonctions pour gérer la modal
const openImageModal = (asset: any, alt: string, caption?: string) => {
  selectedImage.value = {
    src: asset._ref,
    alt,
    caption
  };
  // Empêcher le scroll du body quand la modal est ouverte
  document.body.style.overflow = 'hidden';
};

const closeImageModal = () => {
  selectedImage.value = null;
  // Rétablir le scroll du body
  document.body.style.overflow = '';
};

// Fermer avec la touche Escape
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && selectedImage.value) {
    closeImageModal();
  }
};

// Fonction pour appliquer les marques (gras, italique, liens, etc.)
const applyMarks = (text: string, marks: string[], markDefs: any[]) => {
  let result = text;
  
  // On applique les marques dans un ordre spécifique
  if (marks.includes('strong')) {
    result = `<strong>${result}</strong>`;
  }
  if (marks.includes('em')) {
    result = `<em>${result}</em>`;
  }
  
  // Gestion des liens
  marks.forEach(mark => {
    const markDef = markDefs.find(def => def._key === mark);
    if (markDef && markDef._type === 'link' && markDef.href) {
      const href = markDef.href;
      
      // Protection : vérifier que href est bien une chaîne de caractères
      if (typeof href !== 'string') {
        console.warn('Lien avec href invalide:', markDef);
        return;
      }
      
      // Vérifier si c'est un lien interne
      const isInternal = href.startsWith('/') || href.includes('breizhmetal.bzh');
      
      if (isInternal) {
        // Lien interne : ajouter une classe spéciale pour l'intercepter
        const path = href.replace('https://breizhmetal.bzh', '');
        result = `<a href="${path}" class="internal-link text-blue-600 hover:text-blue-800 underline" data-path="${path}">${result}</a>`;
      } else {
        // Lien externe classique
        result = `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${result}</a>`;
      }
    }
  });
  
  return result;
};

// Fonction pour regrouper et rendre les éléments
const processBlocks = (blocks: SanityBlock[]) => {
  const result: Array<string | 
    { type: 'image'; asset: any; alt: string; caption?: string; _key: string }
  > = [];
  let currentListHtml = '';
  let currentList: { type: string; level: number } | null = null;
  
  for (const block of blocks) {
    if (block._type === 'image') {
      // Fermer la liste courante si on a une image
      if (currentList) {
        currentListHtml += `</${currentList.type}>`;
        result.push(currentListHtml);
        currentListHtml = '';
        currentList = null;
      }
      
      // Ajouter l'image comme objet
      if (block.asset?._ref) {
        result.push({
          type: 'image',
          asset: block.asset,
          alt: block.alt || 'Image',
          caption: block.caption,
          _key: block._key
        });
      }
    } else if (block._type === 'block' && block.listItem) {
      // C'est un élément de liste
      const listType = block.listItem === 'bullet' ? 'ul' : 'ol';
      const level = block.level || 1;
      const content = block.children
        ?.map(child => applyMarks(child.text, child.marks, block.markDefs || []))
        .join('') || '';
      
      if (!currentList || currentList.type !== listType || currentList.level !== level) {
        // Fermer la liste précédente si elle existe
        if (currentList) {
          currentListHtml += `</${currentList.type}>`;
          result.push(currentListHtml);
          currentListHtml = '';
        }
        // Commencer une nouvelle liste
        const listClass = listType === 'ul' ? 'list-disc ml-8 mb-4' : 'list-decimal ml-8 mb-4';
        currentListHtml = `<${listType} class="${listClass}">`;
        currentList = { type: listType, level };
      }
      
      currentListHtml += `<li class="mb-1">${content}</li>`;
    } else {
      // Fermer la liste courante si on sort des éléments de liste
      if (currentList) {
        currentListHtml += `</${currentList.type}>`;
        result.push(currentListHtml);
        currentListHtml = '';
        currentList = null;
      }
      
      // Traiter le bloc normal
      result.push(renderBlock(block));
    }
  }
  
  // Fermer la dernière liste si nécessaire
  if (currentList) {
    currentListHtml += `</${currentList.type}>`;
    result.push(currentListHtml);
  }
  
  return result;
};

// Fonction pour rendre un bloc en HTML
const renderBlock = (block: SanityBlock) => {
  if (block._type !== 'block') return '';
  
  // Construire le contenu du bloc en assemblant tous les spans
  const content = block.children
    ?.map(child => applyMarks(child.text, child.marks, block.markDefs || []))
    .join('') || '';
  
  // Appliquer le style du bloc
  switch (block.style) {
    case 'h1':
      return `<h1>${content}</h1>`;
    case 'h2':
      return `<h2>${content}</h2>`;
    case 'h3':
      return `<h3>${content}</h3>`;
    case 'h4':
      return `<h4>${content}</h4>`;
    case 'blockquote':
      return `<blockquote>${content}</blockquote>`;
    case 'normal':
    default:
      return `<p>${content}</p>`;
  }
};

// Fonction pour intercepter les clics sur les liens internes
const handleLinkClick = (event: Event) => {
  const target = event.target as HTMLElement;
  const link = target.closest('a.internal-link') as HTMLAnchorElement;
  
  if (link) {
    event.preventDefault();
    const path = link.getAttribute('data-path');
    if (path) {
      navigateTo(path);
    }
  }
};

// Écouter les clics sur les liens
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('click', handleLinkClick);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('click', handleLinkClick);
  // S'assurer que le body retrouve son scroll
  document.body.style.overflow = '';
});

// Écouter les événements clavier
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  // S'assurer que le body retrouve son scroll
  document.body.style.overflow = '';
});
</script>

<template>
  <div class="sanity-content">
    <template v-for="(item, index) in processBlocks(blocks)" :key="index">
      <!-- Rendu des images avec NuxtImg -->
      <figure v-if="typeof item === 'object' && item.type === 'image'" class="my-6">
        <NuxtImg
          :src="item.asset._ref"
          :alt="item.alt"
          provider="sanity"
          class="mx-auto max-w-[600px] w-full h-auto rounded-lg shadow-md cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
          loading="lazy"
          @click="openImageModal(item.asset, item.alt, item.caption)"
        />
        <figcaption v-if="item.caption" class="text-sm text-gray-600 italic mt-2 text-center">
          {{ item.caption }}
        </figcaption>
      </figure>
      
      <!-- Rendu du HTML pour les autres éléments -->
      <div v-else v-html="item" />
    </template>

    <!-- Modal pour l'agrandissement des images -->
    <Teleport to="body">
      <div
        v-if="selectedImage"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
        @click="closeImageModal"
      >
        <div class="relative max-w-[90vw] max-h-[90vh] flex flex-col">
          <!-- Bouton de fermeture -->
          <button
            @click="closeImageModal"
            class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Fermer l'image agrandie"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Image agrandie -->
          <NuxtImg
            :src="selectedImage.src"
            :alt="selectedImage.alt"
            provider="sanity"
            class="max-w-full max-h-full object-contain rounded-lg"
            @click.stop
          />
          
          <!-- Légende si présente -->
          <p
            v-if="selectedImage.caption"
            class="text-white text-center mt-4 text-sm italic bg-black bg-opacity-50 px-4 py-2 rounded"
          >
            {{ selectedImage.caption }}
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.sanity-content :deep(p) {
  margin-bottom: 1rem;
}

.sanity-content :deep(h1) {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  margin-top: 2rem;
}

.sanity-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
}

.sanity-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

.sanity-content :deep(h4) {
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

.sanity-content :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #6b7280;
}

.sanity-content :deep(strong) {
  font-weight: bold;
}

.sanity-content :deep(em) {
  font-style: italic;
}

.sanity-content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.sanity-content :deep(a:hover) {
  color: #1d4ed8;
}

.sanity-content :deep(ul) {
  list-style-type: disc;
  margin-bottom: 1rem;
}

.sanity-content :deep(ol) {
  list-style-type: decimal;
  margin-bottom: 1rem;
}

.sanity-content :deep(li) {
  margin-bottom: 0.25rem;
}

.sanity-content :deep(figure) {
  margin: 1.5rem 0;
}

.sanity-content :deep(img) {
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.sanity-content :deep(figcaption) {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
  margin-top: 0.5rem;
  text-align: center;
}
</style>