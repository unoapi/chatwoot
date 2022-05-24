import listener from './listener.js'
import { redisConnect, redisDisconnect, setConfig } from './redis.js'

export default async (token, config) => {
    console.info('Brigding Chatwoot/Whatsappp token', token)
    await listener(token, config)
    const redisClient = await redisConnect()
    await setConfig(redisClient, token, config)
    await redisDisconnect(redisClient)
}