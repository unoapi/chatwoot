import { v4 as uuidv4 } from 'uuid'
import express from 'express'
import { createServer } from 'http'
import connect from './connect.js'
import validate from './validate.js'
import { redisConnect, redisDisconnect, setConfig } from './redis.js'
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

const app = express()
const server = createServer(app)

const port = process.env.PORT || 8888

const run = async (req, res) => {
  const token = req.params.token
  const config = req.body
  try {
    validate(config)
  } catch (error) {
    res.status(422).send(error)
    return false
  }
  try {
    await connect(token)
    const redisClient = await redisConnect(REDIS_URL)
    await setConfig(redisClient, token, config)
    await redisDisconnect(redisClient, false)
    res.status(200).send('Success connect Chatwoot to WhatsApp')
  } catch (error) {
    res.status(400).send(error)
  }
}

/**
 * 
 * 
 * 
  {
    "baseURL": "http://localhost:3000"
    "token": "KLo3Lupshver3GFTks4eRBjh",
    "account_id": "2",
    "inbox_id": "3"
  }
 * 
 */
app.get('/connect', async (req, res) => {
  const token = uuidv4()
  console.info('Generated token: ', token)
  req.params.token = token
  run(req, res)
})

app.get('/connect/:token([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})', async (req, res) => {
  const token = req.params.token
  console.info('Received token: ', token)
  run(req, res)
})

app.get('/ping', async (_req, res) => {
  res.send('pong!')
})

server.listen(port, () => {
  console.log(`Listening on *:${port}`)
})