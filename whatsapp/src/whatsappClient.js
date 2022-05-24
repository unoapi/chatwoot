import saveStateRedis from './saveState.js'
import baileys, { DisconnectReason } from '@adiwajshing/baileys'
const makeWASocket = baileys.default
import { whatsappClients } from './session.js'
import { numberToId, idToNumber } from './utils.js'
import { getQueue, whatsapp, chatwoot, addToQueue } from './queue.js'
import QRCode from 'qrcode'

export const getWhatsappClient = async (token, config) => {
  if (whatsappClients[token] && Object.keys(whatsappClients[token]).length > 0) {
    console.info('Whatsapp client already exist for token', token)
  } else {
    const queue = await getQueue()
    let isIgnoreMessage = (payload) => {
      const { key: { remoteJid } } = payload
      return !payload.message || remoteJid.indexOf('@broadcast') > 0
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
        return !payload.message || remoteJid.indexOf('@g.us') > 0 || remoteJid.indexOf('@broadcast') > 0
      }
    }

    const onQrCode = async qrCode => {
      const id = numberToId(config.mobile_number)
      await addToQueue(queue, chatwoot, token, {
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
      })
    }
    const onConnecionChange = async message => {
      const id = numberToId(config.mobile_number)
      await addToQueue(queue, chatwoot, token, {
        key: {
          remoteJid: id,
          fromMe: true
        },
        message: {
          conversation: message
        },
        messageTimestamp: new Date().getTime(),
        chatId: id
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
        await addToQueue(queue, whatsapp, token, payload)
      }
    }
    const whatsappClient = await connect(token, onQrCode, onConnecionChange, onMessage)
    whatsappClients[token] = whatsappClient
  }
  return whatsappClients[token]
}

const connect = async (token, onQrCode, onConnecionChange, onMessage) => {
  try {
    console.info('Create new Whatsapp client for token', token)
    const { state, saveState, clearState } = await saveStateRedis(token)
    return new Promise((resolve) => {
      console.info('Connecting token', token)
      const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        browser: 'Chatwoot'
      })
      sock.ev.on('creds.update', saveState)
      sock.ev.on('messages.upsert', onMessage)
      sock.ev.on('connection.update', async (update) => {
        const { connection, qr, lastDisconnect = { error: { output: {}, data: { content: [] } } } } = update
        if (!lastDisconnect.error.output) {
          lastDisconnect.error.output = {}
        }
        if (!lastDisconnect.error.data) {
          lastDisconnect.error.data = { content: [] }
        }
        if (connection === 'close') {
          const shouldReconnect = lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
          console.warn('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect, 'token', token)
          if (shouldReconnect) {
            await onConnecionChange('Whatsapp connection is changed, try reconnecting!')
            return connect(token, onQrCode, onConnecionChange, onMessage)
          }

          const isUnauthorized = lastDisconnect.error.output.statusCode === DisconnectReason.loggedOut
          const isDeviceRemoved = lastDisconnect.error.data.content.find((item) => item.attrs.type === 'device_removed') !== undefined
          // clear stored auth if logout / unauthorized
          if (isUnauthorized && isDeviceRemoved) {
            console.error('connection is removed')
            await onConnecionChange(lastDisconnect.error.output.statusCode)
            await onConnecionChange('Whatsapp is unauthorized or device is removed, you need read a qrcode again!')
            console.info('Clearing state redis')
            delete whatsappClients[token]
            await clearState()
            return connect(token, onQrCode, onConnecionChange, onMessage)
          }
        } else if (connection === 'open') {
          console.debug('Connected to user', state.creds.me)
          const number = idToNumber(state.creds.me.id)
          const id = numberToId(number)
          try {
            await sock.sendMessage(id, { text: `Success Whatsapp connected in Chatwoot` })
          } catch (error) {
            console.warn('Error on welcome message', e)
          }
          resolve(sock)
        } else if (qr) {
          console.info('Received qrcode for token', token, qr)
          const qrCodeUrl = await QRCode.toDataURL(qr)
          await onQrCode(qrCodeUrl)
        }
      })
    })
  } catch (error) {
    console.error('Error on connect function', error)
    throw error
  }
}