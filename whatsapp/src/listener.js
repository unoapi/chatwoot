import { getWhatsappClient } from './whatsappClient.js'
import { numberToId } from './utils.js'
import { getQueue, chatwoot, addToQueue } from './queue.js'

export default async (token, config) => {
  try {
    const queue = await getQueue()
    let isIgnoreMessage = (payload) => {
      const { key: { remoteJid } } = payload
      return !payload.message || remoteJid.indexOf('@g.us') > 0 || remoteJid.indexOf('@broadcast') > 0
    }
    let formatChatId = (payload) => {
      const { key: { remoteJid } } = payload
      return remoteJid
    }
    if (!config.ignore_group_messages) {
      formatChatId = (payload) => {
        const { key: { remoteJid, participant } } = payload
        if (remoteJid.indexOf('@g.us') > 0) {
          return `${remoteJid}#${participant}`
        } else {
          return remoteJid
        }
      }
      isIgnoreMessage = (payload) => {
        const { key: { remoteJid } } = payload
        return !payload.message || remoteJid.indexOf('@broadcast') > 0
      }
    }

    const onQrCode = async qrCode => {
      const id = numberToId(config.mobile_number)
      await addToQueue(queue, chatwoot, {
        token, 
        content: {
          key: {
            remoteJid: id,
            fromMe: true
          },
          message: {
            qrCodeMessage: {
              url: qrCode,
              mimetype: 'image/png',
              fileName: 'qrcode.png'
            }
          },
          messageTimestamp: new Date().getTime(),
          chatId: id
        }
      })
    }
    const onConnecionChange = async message => {
      const id = numberToId(config.mobile_number)
      await addToQueue(queue, chatwoot, {
        token, 
        content: {
          key: {
            remoteJid: id,
            fromMe: true
          },
          message: {
            conversation: message
          },
          messageTimestamp: new Date().getTime(),
          chatId: id
        }
      })
    }
    const onMessage = async ({ messages = [] } = messages) => {
      console.debug(`${messages.length} new message(s) received from Whatsapp`)
      for (var i = 0, j = messages.length; i < j; i++) {
        const payload = messages[i]
        console.debug('whatsapp message', payload)
        if (isIgnoreMessage(payload)) {
          console.debug('ignore message')
          continue
        }
        payload.chatId = formatChatId(payload)
        await addToQueue(queue, chatwoot, { token, content: payload })
      }
    }
    const whatsappClient = await getWhatsappClient(token, onQrCode, onConnecionChange, onMessage)
    return whatsappClient
  } catch (error) {
    console.error('error on listener function', error)
    throw error
  }
}