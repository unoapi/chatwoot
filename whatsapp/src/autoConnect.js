import { redisConnect, redisDisconnect, configInfoKey, redisKeys, getAndCacheConfig } from './redis.js'
import { getQueue, whatsapp, addToQueue } from './queue.js'

const queue = await getQueue()

export default async () => {
  try {
    const redisClient = await redisConnect()
    const pattern = configInfoKey('*')
    const toReplace = configInfoKey('')
    const keys = await redisKeys(redisClient, pattern)
    await redisDisconnect(redisClient, true)
    console.info(`${keys.length} keys to verify is auto connect`)
    for (let i = 0, j = keys.length; i < j; i++) {
      const key = keys[i]
      const token = key.replace(toReplace, '')
      const config = await getAndCacheConfig(token)
      if (config.auto_connect) {
        console.info(`Auto connect key ${token}`)
        try {
          await addToQueue(queue, whatsapp, {
            token,
            content: {
              conversation: {
                meta: {
                  sender: {
                    phone_number: config.mobile_number
                  }
                },
                messages: [
                  {
                    sender: {
                      available_name: config.mobile_name
                    },
                    content: 'Whatsapp auto connected on start server!'
                  }
                ]
              }
            }
          })
        } catch (error) {
          console.error(`Error on connect Whatsapp for token ${token}`, error)
        }
      } else {
        console.info(`No auto connect key ${token}`)
      }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}