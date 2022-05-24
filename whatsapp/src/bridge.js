import { getWhatsappClient } from './whatsappClient.js'
import { getChatwootClient } from './chatwootClient.js'

export default async (token, config) => {
  try {
    const chatwootClient = getChatwootClient(token, config)
    const whatsappClient = await getWhatsappClient(token, config)
    return { whatsappClient, chatwootClient }
  } catch (error) {
    console.error('error on bridge function', error)
    throw error
  }
}