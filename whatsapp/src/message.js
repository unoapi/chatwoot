import { amqpConnect, amqpCreateChannel, amqpEnqueue } from './amqp.js'

const connection = await amqpConnect()
const queue = process.env.QUEUE_WHATSAPP_NAME || 'whatsapp'
const channel = await amqpCreateChannel(connection, queue)

export default async (req, res) => {
  const { token } = req.params
  try {
    const { event, message_type } = req.body
    if (event == 'message_created' && message_type == 'outgoing') {
      await amqpEnqueue(channel, queue, JSON.stringify({ token, content: req.body }), 3)
    }
    return res.status(200).json({ status: 'success', message: 'Success on receive chatwoot' })
  } catch (e) {
    console.error('Error on message function', e)
    return res.status(400).json({ status: 'error', message: 'Error on receive chatwoot' })
  }
}