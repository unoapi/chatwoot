import { redisConnect, redisDisconnect, setAuth, getAuth } from './redis.js'
import { BufferJSON, initAuthCreds } from '@adiwajshing/baileys'


const KEY_MAP = {
  'pre-key': 'preKeys',
  'session': 'sessions',
  'sender-key': 'senderKeys',
  'app-state-sync-key': 'appStateSyncKeys',
  'app-state-sync-version': 'appStateVersions',
  'sender-key-memory': 'senderKeyMemory'
}

export default async (token) => {
  let redisClient
  try {
    redisClient = await redisConnect()
    let creds
    let keys = {}
    const auth = await getAuth(redisClient, token, value => JSON.parse(value, BufferJSON.reviver))
    await redisDisconnect(redisClient)
    redisClient = undefined
    if (Object.keys(auth).length > 0) {
      console.debug(`Retrieve Whatsapp connection for token ${token}`)
      creds = auth.creds
      keys = auth.keys
    } else {
      console.debug(`Create Whatsapp connection for token ${token}`)
      creds = initAuthCreds()
    }

    const saveState = async () => {
      redisClient = await redisConnect()
      const state = { creds, keys }
      await setAuth(redisClient, token, state, value => JSON.stringify(value, BufferJSON.replacer, 2))
      await redisDisconnect(redisClient)
      redisClient = undefined
    }

    const clearState = async () => {
      redisClient = await redisConnect()
      await setAuth(redisClient, token, {}, value)
      await redisDisconnect(redisClient)
      redisClient = undefined
    }

    return {
      state: {
        creds,
        keys: {
          get: (type, ids) => {
            const key = KEY_MAP[type]
            return ids.reduce(
              (dict, id) => {
                let value = keys[key]?.[id]
                if (value) {
                  // if (type === 'app-state-sync-key') {
                  //   value = proto.AppStateSyncKeyData.fromObject(value)
                  // }
                  dict[id] = value
                }
                return dict
              }, {}
            )
          },
          set: (data) => {
            for (const _key in data) {
              const key = KEY_MAP[_key]
              keys[key] = keys[key] || {}
              Object.assign(keys[key], data[_key])
            }

            saveState()
          }
        }
      },
      saveState,
      clearState,
    }
  } catch (error) {
    console.error('Error on saveState function', error)
    throw error
  } finally {
    if (redisClient) {
      await redisDisconnect(redisClient)
    }
  }
}