import Redis from 'ioredis'
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const configs = {}
const conversationIds = {}

export const redisConnect = async (redisUrl = REDIS_URL) => {
  console.debug(`Connecting redis`)
  const client = new Redis(redisUrl)
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
  console.debug(`Setting ${key} => ${(value + '').substring(0, 10)}...`)
  return client.set(key, value)
}

export const authInfoKey = (token) => {
  return `authInfo:${token}`
}

export const conversationIdKey = (sourceId) => {
  return `conversationId:${sourceId}`
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

export const getAndCacheConfig = async token => {
  if (!configs[token]) {
    const redisClient = await redisConnect()
    const config = await getConfig(redisClient, token)
    await redisDisconnect(redisClient, true)
    configs[token] = config
  }
  return configs[token]
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

export const getConversationId = async (redisClient, sourceId) => {
  const key = conversationIdKey(sourceId)
  return await redisGet(redisClient, key)
}

export const setConversationId = async (redisClient, sourceId, conversationId) => {
  const key = conversationIdKey(sourceId)
  await redisSet(redisClient, key, conversationId)
}

export const getAndCacheConversationId = async (redisClient, sourceId) => {
  if (!conversationIds[sourceId]) {
    const conversationId = await getConversationId(redisClient, sourceId)
    conversationIds[sourceId] = conversationId
  }
  return conversationIds[sourceId]
}

export const setAndCacheConversationId = async (redisClient, sourceId, conversationId) => {
  conversationIds[sourceId] = conversationId
  return setConversationId(redisClient, sourceId, conversationId)
}