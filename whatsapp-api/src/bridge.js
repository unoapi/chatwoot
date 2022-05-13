
import ChatwootClient from './chatwootClient.js'
import connect from './connect.js'
import chatwootClients from './session.js'

export default async (token, config) => {
  let chatwootClient
  if (chatwootClients[token]) {
    chatwootClient = chatwootClients[token]
  } else {
    chatwootClient = new ChatwootClient(config, token)
    chatwootClients[token] = chatwootClient
  }
  try {
    const onQrCode = async qrCode => {
      return chatwootClient.sendQrCode(qrCode)
    }
    const onConnecionChange = async message => {
      await chatwootClient.sendMessage({
        sender: chatwootClient.sender,
        chatId: chatwootClient.mobile_number + '@c.us',
        content: message
      })
    }
    const whatsappClient = await connect(token, onQrCode, onConnecionChange)
    whatsappClient.ev.on('messages.upsert', async messages => {
      for (var i = 0, j = messages.length; i < j; i++) {
        const message = messages[i]
        await chatwootClient.sendMessage(message)
      }
    })
    return { whatsappClient, chatwootClient }
  } catch (error) {
    console.error('error on bridge function', error)
    throw error
  }
}