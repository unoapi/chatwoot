import { amqpConnect, amqpCreateChannel, amqpConsume } from './amqp.js'
import { getAndCacheConfig } from './redis.js'
import { contactToArray } from './utils.js'
import bridge from './bridge.js'

const connection = await amqpConnect()
const queue = process.env.QUEUE_WHATSAPP_NAME || 'whatsapp'
const delay = parseInt(process.env.QUEUE_WHATSAPP_DELAY || '60')
const channel = await amqpCreateChannel(connection, queue, delay)

await amqpConsume(channel, queue, async (payload) => {
  const object = JSON.parse(payload.content)
  const { content, token } = object
  const phone = content.conversation.meta.sender.phone_number.replace('+', '')
  const message = content.conversation.messages[0]
  const senderName = content.sender.name

  const { whatsappClient } = await bridge(token)
  for (const contato of contactToArray(phone)) {
    const text = `*${senderName}*:\n${message.content}`
    const params = [contato]
    if (message.attachments) {
      const config = await getAndCacheConfig(token)
      let base_url = `${config.baseURL}/${message.attachments[0].data_url.substring(
        message.attachments[0].data_url.indexOf('/rails/') + 1
      )}`
      params.push({ url: base_url, caption: text })
    } else {
      params.push({ text })
    }
    console.debug('message to send to whatsapp', ...params)
    await whatsappClient.sendMessage(...params)
  }
})