import { v4 as uuidv4 } from 'uuid'
import express from 'express'
import { createServer } from 'http'
import webhook from './webhook.js'
import save from './save.js'
import validate from './validate.js'

const app = express()
app.use(express.json())
const server = createServer(app)

const port = process.env.PORT || 8888

const http = async (req, res) => {
  console.info('Received token: ', req.params.token, req.body)
  const token = req.params.token
  const config = req.body
  try {
    await validate(config)
  } catch (error) {
    console.warn('Config is invalid', error)
    return res.status(422).send(error)
  }
  try {
    await save(token, config)
    res.status(200).send('Success connected Chatwoot to WhatsApp')
  } catch (error) {
    return res.status(400).send(error)
  }
}

/**
{
  "autoConnect": true,
  "mobile_name": "Me",
  "mobile_number": "+5549988290955",
  "baseURL": "http://localhost:3000",
  "token": "KLo3Lupshver3GFTks4eRBjh",
  "account_id": "2",
  "inbox_id": "3"
}
 */
app.post('/connect', async (req, res) => {
  const token = uuidv4()
  console.info('Generated token: ', token)
  req.params.token = token
  await http(req, res)
})

app.post('/connect/:token([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})', async (req, res) => {
  await http(req, res)
})

app.post('/webhook/:token([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})', webhook)

app.get('/ping', async (_req, res) => {
  res.send('pong!')
})

server.listen(port, () => {
  console.log(`Listening on *:${port}`)
})