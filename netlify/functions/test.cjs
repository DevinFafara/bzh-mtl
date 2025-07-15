exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'Hello from Netlify function! Salut depuis la fonction Netlify !',
      timestamp: new Date().toISOString(),
      query: event.queryStringParameters
    })
  }
}
