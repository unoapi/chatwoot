import { amqpConnect, amqpCreateChannel, amqpConsume } from './amqp.js'
import { contactToArray } from './utils.js'
import { getAndCacheConfig } from './redis.js'
import bridge from './bridge.js'
import mime from 'mime-types'

const connection = await amqpConnect()
const queue = process.env.QUEUE_WHATSAPP_NAME || 'whatsapp'
const delay = parseInt(process.env.QUEUE_WHATSAPP_DELAY || '60')
const channel = await amqpCreateChannel(connection, queue, delay)

await amqpConsume(channel, queue, async (payload) => {
  const object = JSON.parse(payload.content)
  const { content, token } = object
  const phone = content.conversation.meta.sender.phone_number.replace('+', '')
  const message = content.conversation.messages[0]
  const senderName = message.sender.available_name || message.sender.senderName
  const { whatsappClient } = await bridge(token)
  for (const contato of contactToArray(phone)) {
    const text = `*${senderName}*:\n${message.content || ''}`
    const params = [contato]
    if (message.attachments) {
      const config = await getAndCacheConfig(token)
      const attachment = message.attachments[0]
      const dataUrl = `${config.baseURL}/${attachment.data_url.substring(attachment.data_url.indexOf('/rails/') + 1)}`;
      const fileType = attachment.file_type
      const mimeType = mime.lookup(dataUrl)
      const m = { caption: text, mimeType }
      m[fileType] = { url: dataUrl }
      params.push(m)
    } else {
      params.push({ text })
    }
    params.push({ detectLinks: false })
    console.debug('message to send to whatsapp', ...params)
    await whatsappClient.sendMessage(...params)
  }
})