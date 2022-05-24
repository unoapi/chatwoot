import { contactToArray } from './utils.js'
import { getAndCacheConfig } from './redis.js'
import bridge from './bridge.js'
import mime from 'mime-types'

export default async (token, content) => {
  console.log(token, content)
  const phone = content.conversation.meta.sender.phone_number.replace('+', '')
  const message = content.conversation.messages[0]
  const senderName = message.sender.available_name || message.sender.senderName
  const { whatsappClient } = await bridge(token)
  console.log(token, content, phone)
  for (const contato of contactToArray(phone)) {
    const text = `*${senderName}*:\n${message.content || ''}`
    const params = [contato]
    if (message.attachments) {
      const config = await getAndCacheConfig(token)
      const attachment = message.attachments[0]
      const dataUrl = `${config.base_url}/${attachment.data_url.substring(attachment.data_url.indexOf('/rails/') + 1)}`;
      const fileType = attachment.file_type === 'file' ? 'document' : attachment.file_type
      const mimeType = mime.lookup(dataUrl)
      const object = { caption: text, mimeType }
      object[fileType] = { url: dataUrl }
      params.push(object)
    } else {
      params.push({ text })
    }
    params.push({ detectLinks: false })
    console.debug('message to send to whatsapp', ...params)
    await whatsappClient.sendMessage(...params)
  }
}