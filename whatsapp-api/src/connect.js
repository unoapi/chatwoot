import saveStateRedis from './saveState.js'
import baileys, { DisconnectReason } from '@adiwajshing/baileys'
const makeWASocket = baileys.default
import { whatsappClients } from './session.js'

const df = async () => { }

const connect = async (token, onQrCode = df, onConnecionChange = df, onMessage = df) => {
  try {
    if (whatsappClients[token] && Object.keys(whatsappClients[token]).length > 0) {
      console.log(whatsappClients[token])
      console.info('Whatsapp client already exist for token', token)
      return whatsappClients[token]
    }
    console.info('Create new Whatsapp client for token', token)
    const { state, saveState, clearState } = await saveStateRedis(token)
    return new Promise((resolve) => {
      console.info('Connecting token', token)
      const sock = makeWASocket({
        printQRInTerminal: false,
        auth: state
      })
      sock.ev.on('creds.update', saveState)
      sock.ev.on('messages.upsert', onMessage)
      sock.ev.on('connection.update', async (update) => {
        const { connection, qr, lastDisconnect = { error: { output: {}, data: { content: [] } } } } = update

        if (connection === 'close') {
          const shouldReconnect = lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
          console.warn('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect, 'token', token)
          if (shouldReconnect) {
            await onConnecionChange('Whatsapp connection is changed, try reconnecting!')
            return connect()
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
            return connect()
          }
        } else if (connection === 'open') {
          console.debug('Connected to user', state.creds.me)
          whatsappClients[token] = sock
          await sock.sendMessage(state.creds.me.id, { text: `Success connected Chatwoot to WhatsApp!` })
          resolve(sock)
        } else if (qr) {
          console.info('Received qrcode for token', token)
          await onQrCode(qr)
        }
      })
    })
  } catch (error) {
    console.error('Error on connect function', error)
    throw error
  }
}

export default connect