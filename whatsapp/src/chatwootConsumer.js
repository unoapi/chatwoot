import { amqpConnect, amqpCreateChannel, amqpConsume } from './amqp.js'
import { getAndCacheConfig } from './redis.js'
import { getChatwootClient } from './chatwootClient.js'


const connection = await amqpConnect()
const queue = process.env.QUEUE_CHATWOOT_NAME || 'chatwoot'
const delay = parseInt(process.env.QUEUE_CHATWOOT_DELAY || '60')
const channel = await amqpCreateChannel(connection, queue, delay)

await amqpConsume(channel, queue, async (payload) => {
  const object = JSON.parse(payload.content)
  const { content, token } = object
  const config = await getAndCacheConfig(token)
  let chatwootClient = getChatwootClient(token, config)
  await chatwootClient.sendMessage(content)
})