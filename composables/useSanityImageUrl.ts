/**
 * Convertit une référence interne Sanity (_ref) en URL CDN publique.
 * Format _ref : image-{id}-{WxH}-{ext}
 * URL produite : https://cdn.sanity.io/images/{projectId}/{dataset}/{id}-{WxH}.{ext}
 */
export const sanityImageUrl = (
  ref: string | undefined | null,
  fallback = 'https://breizhmetal.bzh/BM-logo-large.png'
): string => {
  if (!ref) return fallback

  // Retire le préfixe "image-"
  const withoutPrefix = ref.replace(/^image-/, '')

  // Remplace le dernier tiret (séparateur d'extension) par un point
  const lastDash = withoutPrefix.lastIndexOf('-')
  if (lastDash === -1) return fallback

  const filename =
    withoutPrefix.substring(0, lastDash) + '.' + withoutPrefix.substring(lastDash + 1)

  return `https://cdn.sanity.io/images/k9f6iz8v/production/${filename}`
}

/**
 * Extrait le premier paragraphe de texte d'un champ blockContent Sanity.
 */
export const sanityBlockToText = (
  blocks: any[] | undefined | null,
  maxLength = 155
): string => {
  if (!blocks || !Array.isArray(blocks)) return ''

  const textBlock = blocks.find(
    (block: any) => block._type === 'block' && block.children
  )
  if (!textBlock) return ''

  const text = textBlock.children
    .filter((child: any) => child._type === 'span' && child.text)
    .map((child: any) => child.text)
    .join(' ')

  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}
