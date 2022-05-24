import { getQueue, whatsapp, addToQueue } from './queue.js'

const queue = await getQueue()

export default async (req, res) => {
  const { token } = req.params
  const httpAuthToken = req.headers['chatwoot_whatsapp_server_auth_token']
  const envAuthToken = process.env.CHATWOOT_WHATSAPP_SERVER_AUTH_TOKEN
  if (httpAuthToken !== envAuthToken) {
    res.status(401).json({
      status: 'error',
      message: `Invalid header chatwoot_whatsapp_server_auth_token value ${httpAuthToken}`
    })
  }
  try {
    const { event, message_type } = req.body
    if (event == 'message_created' && message_type == 'outgoing') {
      await addToQueue(queue, whatsapp, token, req.body)
    }
    return res.status(200).json({ status: 'success', message: 'Success on receive chatwoot' })
  } catch (e) {
    console.error('Error on message function', e)
    return res.status(400).json({ status: 'error', message: 'Error on receive chatwoot' })
  }
}