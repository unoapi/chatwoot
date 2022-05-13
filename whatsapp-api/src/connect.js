import saveStateRedis from './saveState.js'
import { default as makeWASocket, DisconnectReason } from '@adiwajshing/baileys'
import whatsappClients from './session.js'

const df = async () => {}

const connect = async (token, onQrCode = df, onConnecionChange = df) => {
  try {
    if (whatsappClients[token]) {
      return whatsappClients[token]
    }
    const { state, saveState, clearState } = await saveStateRedis(token)
    const sock = makeWASocket({
      printQRInTerminal: true,
      auth: state
    })
    sock.ev.on('creds.update', saveState)
    sock.ev.on('connection.update', async (update) => {
      const { connection, qr, lastDisconnect = { error: { output: {}, data: { content: [] } } } } = update

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
        console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
        if (shouldReconnect) {
          await onConnecionChange('Whatsapp connection is changed, try reconnecting!')
          return connect()
        }

        const isUnauthorized = lastDisconnect.error.output.statusCode === DisconnectReason.loggedOut
        const isDeviceRemoved = lastDisconnect.error.data.content.find((item) => item.attrs.type === 'device_removed') !== undefined
        // clear stored auth if logout / unauthorized
        if (isUnauthorized && isDeviceRemoved) {
          console.log('connection is removed')
          await onConnecionChange(lastDisconnect.error.output.statusCode)
          await onConnecionChange('Whatsapp is unauthorized or device is removed, you need read a qrcode again!')
          console.info('Clearing state redis')
          delete whatsappClients[token]
          await clearState()
          return connect()
        }
      } else if (connection === 'open') {
        console.debug('Connected to user', state.creds.me)
        whatsappClients[token] = sock
        await client.sendMessage(state.creds.me.id, { text: `Success connected Chatwoot to WhatsApp!` })
      } else if (qr) {
        console.info('Received qrcode')
        await onQrCode(qr)
      }
    })
    return sock
  } catch (error) {
    console.error('Error on connect function', error)
    throw error
  }
}

export default connect