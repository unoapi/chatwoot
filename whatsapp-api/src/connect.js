import saveStateRedis from './saveState.js'
import baileys, { DisconnectReason } from '@adiwajshing/baileys'
const makeWASocket = baileys.default

const connect = async (token) => {
  try {
    const { state, saveState, clearState } = await saveStateRedis(token)
    const sock = makeWASocket({
      printQRInTerminal: true,
      auth: state
    })
    sock.ev.on('creds.update', saveState)
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect = { error: { output: {}, data: { content: [] } } } } = update

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
        console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
        if (shouldReconnect) {
          return connect()
        }

        const isUnauthorized = lastDisconnect.error.output.statusCode === DisconnectReason.loggedOut
        const isDeviceRemoved = lastDisconnect.error.data.content.find((item) => item.attrs.type === 'device_removed') !== undefined
        // clear stored auth if logout / unauthorized
        if (isUnauthorized && isDeviceRemoved) {
          console.info('Clearing state redis')
          clearState()
        }
      } else if (connection === 'open') {
        console.debug('Connected to user', state.creds.me)
        console.info('Connection ready!')
        // await sock.sendMessage(m.messages[0].key.remoteJid, { text: 'Hello there!' })
      }
    })
    return sock
  } catch (error) {
    console.error('Error on connect function', error)
    throw error
  }
}

export default connect