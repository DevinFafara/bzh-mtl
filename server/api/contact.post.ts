// server/api/contact.post.ts
// Ce fichier n'est plus utilisé pour l'envoi de formulaires.
// Les formulaires sont maintenant gérés par Netlify Forms (soumission directe côté client).
// Conservé comme fallback au cas où.

export default defineEventHandler(async (event) => {
  return { success: false, error: 'Les formulaires sont gérés par Netlify Forms. Cette API n\'est plus active.' }
})