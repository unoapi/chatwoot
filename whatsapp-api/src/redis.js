import redis from 'redis'
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

export const redisConnect = async (redisUrl = REDIS_URL) => {
  console.debug(`Connecting redis`)
  const client = await redis.createClient({ url: redisUrl })
  await client.connect()
  client.on('error', error => console.log(`Redis Error: ${error}`))
  return client
}

export const redisDisconnect = async (client, force = false) => {
  console.debug(`Disconnecting redis`)
  return force ? client.disconnect() : client.quit()
}

export const redisGet = async (client, key) => {
  console.debug(`Getting ${key}`)
  return client.get(key)
}

export const redisKeys = async (client, pattern) => {
  console.debug(`Keys ${pattern}`)
  return client.keys(pattern)
}

export const redisSet = async (client, key, value) => {
  console.debug(`Setting ${key} => ${value}`)
  return client.set(key, value)
}

export const authInfoKey = (token) => {
  return `authInfo:${token}`
}

export const configInfoKey = (token) => {
  return `configInfo:${token}`
}

export const getConfig = async (redisClient, token) => {
  const key = configInfoKey(token)
  const configString = await redisGet(redisClient, key) || '{}'
  const config = JSON.parse(configString)
  return config
}

export const setConfig = async (redisClient, token, value) => {
  const currentConfig = await getConfig(redisClient, token)
  const key = configInfoKey(token)
  const config = { ...currentConfig, ...value }
  await redisSet(redisClient, key, JSON.stringify(config))
}

export const getAuth = async (redisClient, token, parse = value => JSON.parse(value)) => {
  const key = authInfoKey(token)
  const authString = await redisGet(redisClient, key) || '{}'
  const authJson = parse(authString)
  return authJson
}

export const setAuth = async (redisClient, token, value, stringify = value => JSON.stringify(value, null, '\t')) => {
  const key = authInfoKey(token)
  const authValue = stringify(value)
  await redisSet(redisClient, key, authValue)
}