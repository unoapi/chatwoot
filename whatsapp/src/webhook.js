import Queue from 'bull'
import whatsappConsumer from './whatsappConsumer.js'
const queue = new Queue(process.env.QUEUE_WHATSAPP_NAME || 'whatsapp', process.env.REDIS_URL || 'redis://localhost:6379')
const retries = process.env.QUEUE_WHATSAPP_RETRIES || 3
queue.process(async (job, done) => {
  const payload = job.data
  console.info('Process chatwoot -> whatsapp %s', payload)
  await whatsappConsumer(payload)
  await done()
})


export default async (req, res) => {
  const { token } = req.params
  try {
    const { event, message_type } = req.body
    if (event == 'message_created' && message_type == 'outgoing') {
      await queue.add(
        { token, content: req.body },
        { attempts: process.env.QUEUE_WHATSAPP_NAME || 3, backoff: 10000 }
      )
    }
    return res.status(200).json({ status: 'success', message: 'Success on receive chatwoot' })
  } catch (e) {
    console.error('Error on message function', e)
    return res.status(400).json({ status: 'error', message: 'Error on receive chatwoot' })
  }
}