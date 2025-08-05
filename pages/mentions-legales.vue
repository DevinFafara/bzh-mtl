<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- En-tête -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Mentions Légales</h1>
        <p class="text-xl text-gray-600">Informations légales relatives au site Breizh Metal Magazine</p>
      </div>

      <!-- Contenu -->
      <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <div class="space-y-8">
          
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">1. Informations sur l'éditeur</h2>
            <p class="text-gray-700 leading-relaxed">
              <strong>Nom du site :</strong> Breizh Metal Magazine<br>
              <strong>URL :</strong> {{ $config.public.siteUrl || 'https://bzh-mtl.netlify.app' }}<br>
              <strong>Nature :</strong> Site web d'information culturelle
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">2. Directeur de la publication</h2>
            <p class="text-gray-700 leading-relaxed">
              Le directeur de la publication est responsable du contenu éditorial du site.<br>
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">3. Hébergement</h2>
            <p class="text-gray-700 leading-relaxed">
              Ce site est hébergé par :<br>
              <strong>Netlify Inc.</strong><br>
              2325 3rd Street, Suite 296<br>
              San Francisco, CA 94107<br>
              États-Unis
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
            <p class="text-gray-700 leading-relaxed">
              L'ensemble du contenu de ce site (textes, images, vidéos, logos) est protégé par le droit d'auteur. 
              Toute reproduction, même partielle, est interdite sans l'autorisation expresse de l'éditeur.
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">5. Sources des contenus visuels</h2>
            <div class="text-gray-700 leading-relaxed space-y-4">
              <ul class="list-disc list-inside space-y-2 ml-4">
                <li><strong>Logos et images des groupes :</strong> Usage éditorial/promotionnel depuis leurs réseaux sociaux</li>
                <li><strong>Vidéos YouTube :</strong> Intégration légale via lecteur officiel</li>
                <li><strong>Contenus créés par l'éditeur :</strong> Photos de salles et vidéos live - propriété de Bruno Guézennec</li>
              </ul>
              <p class="text-gray-700 leading-relaxed mt-4">
                <strong>Procédure de retrait :</strong> Contact direct pour toute demande : breizh.webzine@gmail.com
              </p>
            </div>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">6. Protection des données personnelles</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général 
              sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, 
              de suppression et de portabilité des données vous concernant.
            </p>
            <p class="text-gray-700 leading-relaxed">
              Pour exercer ces droits, contactez-nous à : breizh.webzine@gmail.com
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
            <p class="text-gray-700 leading-relaxed">
              Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. 
              Aucun cookie de traçage ou publicitaire n'est utilisé sans votre consentement.
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">8. Responsabilité</h2>
            <p class="text-gray-700 leading-relaxed">
              L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. 
              Cependant, il ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises 
              à disposition sur ce site.
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">9. Liens externes</h2>
            <p class="text-gray-700 leading-relaxed">
              Ce site peut contenir des liens vers d'autres sites web. L'éditeur n'est pas responsable 
              du contenu de ces sites externes.
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">10. Contact</h2>
            <p class="text-gray-700 leading-relaxed">
              Pour toute question concernant ces mentions légales :<br>
              <strong>Email :</strong> breizh.webzine@gmail.com
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Configuration SEO
useHead({
  title: 'Mentions Légales - Breizh Metal Magazine',
  meta: [
    { name: 'description', content: 'Mentions légales et informations juridiques du site Breizh Metal Magazine' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
