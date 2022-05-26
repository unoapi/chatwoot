import { getAndCacheConfig } from './redis.js'
import { getWhatsappClient } from './whatsappClient.js'

export default async (token, content) => {
  const config = await getAndCacheConfig(token)
  const whatsappClient = await getWhatsappClient(token, config)
  await whatsappClient.sendMessage(content)
}