import whatsappConsumer from './whatsappConsumer.js'
import { createQueue, addToQueue } from './queue.js'

const queue = await createQueue(process.env.QUEUE_WHATSAPP_NAME || 'whatsapp', whatsappConsumer)


export default async (req, res) => {
  const { token } = req.params
  try {
    const { event, message_type } = req.body
    if (event == 'message_created' && message_type == 'outgoing') {
      await addToQueue(queue, { token, content: req.body }, process.env.QUEUE_WHATSAPP_RETRY || 3)
    }
    return res.status(200).json({ status: 'success', message: 'Success on receive chatwoot' })
  } catch (e) {
    console.error('Error on message function', e)
    return res.status(400).json({ status: 'error', message: 'Error on receive chatwoot' })
  }
}