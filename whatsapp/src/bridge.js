
import ChatwootClient from './chatwootClient.js'
import connect from './connect.js'
import { chatwootClients } from './session.js'

export default async (token, config) => {
  let chatwootClient
  if (chatwootClients[token] && Object.keys(chatwootClients[token]).length > 0) {
    console.info('Chatwoot client already exist for token', token)
    chatwootClient = chatwootClients[token]
  } else {
    console.info('Create new Chatwoot client for token', token)
    chatwootClient = new ChatwootClient(config)
    chatwootClients[token] = chatwootClient
  }
  try {
    const onQrCode = async qrCode => {
      return chatwootClient.sendQrCode(qrCode)
    }
    const onConnecionChange = async message => {
      await chatwootClient.sendMessage({
        sender: chatwootClient.sender,
        chatId: chatwootClient.mobile_number + '@s.whatsapp.net',
        content: message
      })
    }
    const onMessage = async ({ messages = [] } = messages) => {
      console.debug(`${messages.length} new message(s) received from Whatsapp`)
      // if (type === 'notify'){
      //   console.debug('ignore messages type notify')
      //   return;
      // }
      console.log('messages', messages)
      for (var i = 0, j = messages.length; i < j; i++) {
        const message = messages[i]
        console.debug('whatsapp message', message)
        const { key: { remoteJid, fromMe } } = message
        if (remoteJid.indexOf('@g.us') > 0 || remoteJid.indexOf('@broadcast') > 0 || fromMe) {
          console.debug('ignore message')
          continue;
        }
        await chatwootClient.sendMessage(message)
      }
    }
    const whatsappClient = await connect(token, onQrCode, onConnecionChange, onMessage)
    return { whatsappClient, chatwootClient }
  } catch (error) {
    console.error('error on bridge function', error)
    throw error
  }
}