import bridge from './bridge.js'
import { contactToArray } from './utils.js'
import { redisConnect, redisDisconnect, getConfig } from './redis.js'
const IGNORED_EVENTS = ['conversation_status_changed', 'conversation_resolved', 'conversation_updated']

export default async (req, res) => {
  const { token } = req.params
  const { whatsappClient } = await bridge(token)
  let redisClient
  console.debug('chatwoot message', req.body)
  if (!whatsappClient) {
    return res.status(400).json({ status: 'error', message: `Whatsapp client token ${token} is disconnected` })
  }
  try {
    const event = req.body.event
    if (IGNORED_EVENTS.includes(event) || req.body.private) {
      return res.status(200).json({ status: 'success', message: 'Success on receive chatwoot' })
    }
    const {
      message_type,
      phone = req.body.conversation.meta.sender.phone_number.replace('+', ''),
      message = req.body.conversation.messages[0]
    } = req.body
    const senderName = req.body.sender.name
    if (event != 'message_created' && message_type != 'outgoing') return res.status(200)
    for (const contato of contactToArray(phone, false)) {
      if (message_type == 'outgoing') {
        const content = `*${senderName}*\n${message.content}`
        if (message.attachments) {
          redisClient = await redisConnect()
          const config = await getConfig(redisClient, token)
          await redisDisconnect(redisClient)
          redisClient = null
          let base_url = `${config.chatWoot.baseURL}/${message.attachments[0].data_url.substring(
            message.attachments[0].data_url.indexOf('/rails/') + 1
          )}`
          await whatsappClient.sendMessage(contato, { url: base_url, caption: content })
        } else {
          console.debug('message to send to whatsapp', contato, { text: content })
          await whatsappClient.sendMessage(contato, { text: content })
        }
      }
    }
    return res.status(200).json({ status: 'success', message: 'Success on receive chatwoot' })
  } catch (e) {
    console.error('Error on message function', e)
    console.error('Error on message body', req.body)
    return res.status(400).json({ status: 'error', message: 'Error on receive chatwoot' })
  } finally {
    if(redisClient) {
      redisDisconnect(redisClient)
    }
  }
}