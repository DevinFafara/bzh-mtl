// server/api/contact.post.ts
import { createClient } from '@sanity/client'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: 'production',
    useCdn: false,
    apiVersion: '2024-03-07',
    token: process.env.SANITY_WRITE_TOKEN, 
  })

  try {
    await client.create({
      _type: 'formSubmission',
      name: body.name,
      email: body.email,
      message: body.message,
    })

    return { success: true }
  } catch (error) {
    console.error('Erreur Sanity:', error)
    return { success: false, error: 'Erreur lors de la soumission' }
  }
})