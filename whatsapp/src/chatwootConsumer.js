import { getAndCacheConfig } from './redis.js'
import { getChatwootClient } from './chatwootClient.js'

export default async (payload) => {
  const { content, token } = payload
  const config = await getAndCacheConfig(token)
  let chatwootClient = getChatwootClient(token, config)
  await chatwootClient.sendMessage(content)
}