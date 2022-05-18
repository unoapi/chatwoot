import { getWhatsappClient } from './whatsappClient.js'
import { numberToId } from './utils.js'
import chatwootConsumer from './chatwootConsumer.js'
import Queue from 'bull'
const queue = new Queue(process.env.QUEUE_CHATWOOT_NAME || 'chatwoot', process.env.REDIS_URL || 'redis://localhost:6379')
const retries = process.env.QUEUE_CHATWOOT_RETRIES || 3
queue.process(async (job, done) => {
  const payload = job.data
  console.info('Process whatsapp -> chatwoot message %s', payload)
  try {
    await chatwootConsumer(payload)
    done()
  } catch (error) {
    if (payload.count >= retries) {
      console.warn('Reject %s retries', payload.count)
      throw error
    } else {
      payload.count++
      queue.add(payload)
    }
  }
})

import { getChatwootClient } from './chatwootClient.js'

export default async (token, config) => {
  let chatwootClient = getChatwootClient(token, config)
  const id = numberToId(chatwootClient.mobile_number)
  try {
    const onQrCode = async qrCode => {
      const id = numberToId(chatwootClient.mobile_number)
      return chatwootClient.sendMessage({
        key: {
          remoteJid: id,
          fromMe: false,
        },
        messageTimestamp: new Date().getTime(),
        message: {
          qrCodeMessage: {
            url: qrCode,
            mimetype: 'image/png',
            fileName: 'qrcode.png'
          }
        }
      })
    }
    const onConnecionChange = async message => {
      const id = numberToId(chatwootClient.mobile_number)
      return chatwootClient.sendMessage({
        chatId: id,
        key: {
          remoteJid: id
        },
        message: {
          conversation: message
        }
      })
    }
    const onMessage = async ({ messages = [] } = messages) => {
      console.debug(`${messages.length} new message(s) received from Whatsapp`)
      console.log('messages', messages)
      for (var i = 0, j = messages.length; i < j; i++) {
        const payload = messages[i]
        console.debug('whatsapp message', payload)
        const { key: { remoteJid, fromMe } } = payload
        if (!payload.message || remoteJid.indexOf('@g.us') > 0 || remoteJid.indexOf('@broadcast') > 0 || fromMe) {
          console.debug('ignore message')
          continue;
        }
        payload.chatId = remoteJid
        await queue.add({ token, content: payload, count: 0 })
      }
    }
    const whatsappClient = await getWhatsappClient(token, onQrCode, onConnecionChange, onMessage)
    return { whatsappClient, chatwootClient }
  } catch (error) {
    console.error('error on bridge function', error)
    throw error
  }
}