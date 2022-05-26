import { getWhatsappClient, delWhatsappClient } from './whatsappClient.js'
import { redisConnect, redisDisconnect, setConfig } from './redis.js'

export default async (token, config) => {
  console.info('Connection Whatsappp token', token)
  await delWhatsappClient(token)
  await getWhatsappClient(token, config)
  const redisClient = await redisConnect()
  await setConfig(redisClient, token, config)
  await redisDisconnect(redisClient)
}