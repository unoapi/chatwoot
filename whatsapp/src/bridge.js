import connect from './connect.js'
import { numberToId } from './utils.js'
import { amqpConnect, amqpCreateChannel, amqpEnqueue } from './amqp.js'
import { getChatwootClient } from './chatwootClient.js'

const connection = await amqpConnect()
const queue = process.env.QUEUE_CHATWOOT_NAME || 'chatwoot'
const channel = await amqpCreateChannel(connection, queue)

export default async (token, config) => {
  let chatwootClient = getChatwootClient(token, config)
  try {
    const onQrCode = async qrCode => {
      return chatwootClient.sendMessage({
        key: {
          remoteJid: numberToId(chatwootClient.mobile_number),
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
      return chatwootClient.sendMessage({
        key: {
          remoteJid: numberToId(chatwootClient.mobile_number)
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
        await amqpEnqueue(channel, queue, JSON.stringify({ token, content: payload }), 3)
      }
    }
    const whatsappClient = await connect(token, onQrCode, onConnecionChange, onMessage)
    return { whatsappClient, chatwootClient }
  } catch (error) {
    console.error('error on bridge function', error)
    throw error
  }
}