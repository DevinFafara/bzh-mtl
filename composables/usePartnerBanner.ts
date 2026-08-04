interface PartnerBanner {
  partnerName: string;
  link: string;
  bannerImage?: { asset: { _ref: string }; alt?: string };
  posterImage?: { asset: { _ref: string }; alt?: string };
}

/**
 * Récupère la bannière partenaire active (fenêtre startDate/endDate incluse).
 * Requête dédupliquée par Nuxt : partagée entre tous les composants qui l'appellent
 * sur une même page (même clé de query/params).
 */
export function usePartnerBanner() {
  const today = new Date().toISOString().split('T')[0];

  const query = groq`*[
    _type == "partnerBanner" &&
    active == true &&
    (!defined(startDate) || startDate <= $today) &&
    (!defined(endDate) || endDate >= $today)
  ] | order(_createdAt desc) [0] {
    partnerName,
    link,
    bannerImage,
    posterImage
  }`;

  return useSanityQuery<PartnerBanner | null>(query, { today });
}
