// server/api/contact.post.ts
import nodemailer from 'nodemailer'

// Labels pour les types de demande
const requestTypeLabels: Record<string, string> = {
  event: '📅 Communiquer sur un événement',
  venue: '🏠 Mettre en lumière un établissement',
  band: '🎸 Créer une fiche groupe',
  other: '💬 Autre / Message libre',
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validation basique
  if (!body.name || !body.email || !body.message || !body.requestType) {
    return { success: false, error: 'Champs obligatoires manquants.' }
  }

  // Construire le contenu de l'email
  const typeLabel = requestTypeLabels[body.requestType] || 'Non spécifié'
  let details = ''

  if (body.requestType === 'event') {
    details = [
      body.eventName && `Événement : ${body.eventName}`,
      body.eventDate && `Date : ${body.eventDate}`,
      body.eventVenue && `Lieu : ${body.eventVenue}`,
      body.eventLink && `Lien : ${body.eventLink}`,
    ].filter(Boolean).join('\n')
  } else if (body.requestType === 'venue') {
    details = [
      body.venueName && `Établissement : ${body.venueName}`,
      body.venueCity && `Ville : ${body.venueCity}`,
      body.venueDepartment && `Département : ${body.venueDepartment}`,
      body.venueWebsite && `Site web : ${body.venueWebsite}`,
    ].filter(Boolean).join('\n')
  } else if (body.requestType === 'band') {
    details = [
      body.bandName && `Groupe : ${body.bandName}`,
      body.bandDepartment && `Département : ${body.bandDepartment}`,
      body.bandStyle && `Style(s) : ${body.bandStyle}`,
      body.bandLink && `Lien : ${body.bandLink}`,
    ].filter(Boolean).join('\n')
  }

  const emailText = [
    `Type de demande : ${typeLabel}`,
    `Nom : ${body.name}`,
    `Email : ${body.email}`,
    '',
    details ? `--- Détails ---\n${details}\n` : '',
    `--- Message ---`,
    body.message,
  ].filter(line => line !== undefined).join('\n')

  // Objet de l'email selon le type
  const subjectMap: Record<string, string> = {
    event: `[BM Contact] Événement — ${body.eventName || 'Sans nom'}`,
    venue: `[BM Contact] Établissement — ${body.venueName || 'Sans nom'}`,
    band: `[BM Contact] Groupe — ${body.bandName || 'Sans nom'}`,
    other: `[BM Contact] Message de ${body.name}`,
  }
  const subject = subjectMap[body.requestType] || `[BM Contact] Message de ${body.name}`

  // Configuration du transporteur SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail1.netim.hosting',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // SSL/TLS sur port 465
    auth: {
      user: process.env.SMTP_USER || 'contact@breizhmetal.bzh',
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from: `"Breizh Metal" <${process.env.SMTP_USER || 'contact@breizhmetal.bzh'}>`,
      to: process.env.SMTP_USER || 'contact@breizhmetal.bzh',
      replyTo: body.email,
      subject,
      text: emailText,
    })

    return { success: true }
  } catch (error: any) {
    console.error('Erreur envoi email:', error)
    return { success: false, error: 'Erreur lors de l\'envoi du message.' }
  }
})