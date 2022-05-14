import bridge from './bridge.js'
import { contactToArray } from './utils.js'

export default async (req, res) => {
  const { token } = req.params
  const { whatsappClient } = await bridge(token)
  if (!whatsappClient) {
    return res.status(400).json({ status: 'error', message: `Whatsapp client token ${token} is disconnected` })
  }
  try {
    const event = req.body.event
    if (event == 'conversation_status_changed' || event == 'conversation_resolved' || req.body.private) {
      return res.status(200).json({ status: 'success', message: 'Success on receive chatwoot' })
    }
    console.log('message to send do whatsapp', req.body)
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
          let base_url = `${client.config.chatWoot.baseURL}/${message.attachments[0].data_url.substring(
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
    return res.status(400).json({ status: 'error', message: 'Error on receive chatwoot' })
  }
}