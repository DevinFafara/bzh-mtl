<!-- components/ContactForm.vue -->
<template>
  <form 
    name="contact" 
    method="POST" 
    data-netlify="true" 
    data-netlify-honeypot="bot-field"
    action="/merci"
  >
    <input type="hidden" name="form-name" value="contact" />

    <p class="hidden" style="display: none;">
      <label>
        Ne pas remplir si vous êtes humain : <input name="bot-field" />
      </label>
    </p>

    <div>
      <label for="name">Votre Nom :</label>
      <input type="text" id="name" name="name" required />
    </div>

    <div>
      <label for="email">Votre Email :</label>
      <input type="email" id="email" name="email" required />
    </div>

    <div>
      <label for="message">Votre Message :</label>
      <textarea id="message" name="message" required></textarea>
    </div>

    <div>
      <button type="submit">Envoyer le Message</button>
    </div>
  </form>
</template>