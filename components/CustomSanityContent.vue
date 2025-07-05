<script setup lang="ts">
interface SanityBlock {
  _key: string;
  _type: string;
  children: Array<{
    _key: string;
    _type: string;
    marks: string[];
    text: string;
  }>;
  markDefs: any[];
  style: string;
}

defineProps<{
  blocks: SanityBlock[];
}>();

// Fonction pour appliquer les marques (gras, italique, etc.)
const applyMarks = (text: string, marks: string[]) => {
  let result = text;
  
  // On applique les marques dans un ordre spécifique
  if (marks.includes('strong')) {
    result = `<strong>${result}</strong>`;
  }
  if (marks.includes('em')) {
    result = `<em>${result}</em>`;
  }
  
  return result;
};

// Fonction pour rendre un bloc en HTML
const renderBlock = (block: SanityBlock) => {
  if (block._type !== 'block') return '';
  
  // Construire le contenu du bloc en assemblant tous les spans
  const content = block.children
    .map(child => applyMarks(child.text, child.marks))
    .join('');
  
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
</script>

<template>
  <div class="sanity-content">
    <div 
      v-for="block in blocks" 
      :key="block._key" 
      v-html="renderBlock(block)"
    />
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
</style>
