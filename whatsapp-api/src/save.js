import bridge from './bridge.js'
import { redisConnect, redisDisconnect, setConfig } from './redis.js'

export default async (token, config) => {
    console.info('Brigding Chatwoot/Whatsappp token', token)
    await bridge(token, config)
    const redisClient = await redisConnect()
    await setConfig(redisClient, token, config)
    await redisDisconnect(redisClient)
}