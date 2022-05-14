import bridge from './bridge.js'
import { redisConnect, redisDisconnect, configInfoKey, redisKeys, getConfig } from './redis.js'

export default async () => {
  let redisClient
  try {
    redisClient = await redisConnect()
    const pattern = configInfoKey('*')
    const toReplace = configInfoKey('')
    const keys = await redisKeys(redisClient, pattern)
    console.info(`${keys.length} keys to verify is auto connect`)
    for (let i = 0, j = keys.length; i < j; i++) {
      const key = keys[i]
      const token = key.replace(toReplace, '')
      const config = await getConfig(redisClient, token)
      if (config.autoConnect) {
        console.info(`Auto connect key ${token}`)
        try {
          bridge(token, config)
        } catch (error) {
          console.error(`Error on brigde Whatsapp/Chatwoot for token ${token}`, error)
        }
      } else {
        console.info(`No auto connect key ${token}`)
      }
    }
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    if (redisClient) {
      await redisDisconnect(redisClient, true)
    }
  }
}