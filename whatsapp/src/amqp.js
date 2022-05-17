import amqp from 'amqplib/callback_api.js'

const X_COUNT_RETRIES = process.env.X_COUNT_RETRIES || 'x-count-retries'
const X_MAX_RETRIES = process.env.X_MAX_RETRIES || 'x-max-retries'
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672'

const queueDelay = queue => `${queue}.delayed`
const queueDead = queue => `${queue}.dead`

export const amqpConnect = async (amqpUrl = RABBITMQ_URL, onStop = async () => { }) => {
  return new Promise((resolve, reject) => {
    amqp.connect(amqpUrl, (error, connection) => {
      if (error) {
        console.error('Error on connect at %s, details: %s', amqpUrl, error)
        reject(error)
      } else {
        process.once('SIGINT', () => {
          onStop()
          console.debug('Closing connection by SIGINT')
          connection.close()
        })
        process.once('SIGTERM', () => {
          onStop()
          console.debug('Closing connection by SIGTERM')
          connection.close()
        })
        console.debug('Successfull connected at RabbitMQ')
        resolve(connection)
      }
    })
  })
}

export const amqpDisconnect = async (connection) => {
  console.debug('Disconnecting RabbitMQ')
  return connection.close()
}

export const amqpCreateChannel = async (connection, queue, delay = 0) => {
  console.info('Creating channel %s ', queue)
  return new Promise((resolve, reject) => {
    connection.createChannel(async (error, channel) => {
      if (error) {
        console.error('Error on create channel %s', error)
        reject(error)
      } else {
        channel.prefetch(1)
        const queueDeadd = queueDead(queue)
        await channel.assertQueue(queueDeadd, {
          durable: true,
          arguments: {
            // 'x-single-active-consumer': true
          }
        })
        await channel.assertQueue(queue, {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': '',
            'x-dead-letter-routing-key': queueDeadd
          }
        })
        if (delay) {
          const queueDelayed = queueDelay(queue)
          console.info('Creating channel %s ', queueDelayed)
          await channel.assertQueue(queueDelayed, {
            durable: true,
            arguments: {
              // 'x-single-active-consumer': true,
              'x-dead-letter-exchange': '',
              'x-dead-letter-routing-key': queue,
              'x-message-ttl': delay * 1000
            }
          })
        }
        console.info('Created channel %s ', queue)
        resolve(channel)
      }
    })
  })
}

export const amqpEnqueue = async (channel, queue, payload, maxRetries = 0, delay = false, countRetries = 0) => {
  const headers = {}
  headers[X_COUNT_RETRIES] = countRetries
  headers[X_MAX_RETRIES] = maxRetries
  const queueName = delay ? queueDelay(queue) : queue
  await channel.sendToQueue(queueName, Buffer.from(payload), { persistent: true, deliveryMode: 2, headers })
  console.debug('Enqueued at %s with payload %s ', queue, JSON.stringify(payload))
}

export const amqpConsume = async (channel, queue, callback) => {
  console.info('Waiting for messages in queue %s', queue)
  channel.consume(queue, async (payload) => {
    console.info('Received %s with headers %s', payload.content, JSON.stringify(payload.properties.headers))
    try {
      await callback(payload)
      await channel.ack(payload)
    } catch (error) {
      console.error(error)
      const headers = payload.properties.headers || {}
      const countRetries = (parseInt(headers[X_COUNT_RETRIES] || '0')) + 1
      const maxRetries = parseInt(headers[X_MAX_RETRIES] || '0')
      if (countRetries >= maxRetries) {
        console.warn('Reject %s retries', countRetries)
        await amqpEnqueue(channel, `${queue}.dead`, payload.content.toString(), maxRetries, false, countRetries)
        await channel.ack(payload)
      } else {
        console.info('Enqueue retry %s of %s', countRetries, maxRetries)
        await amqpEnqueue(channel, queue, payload.content.toString(), maxRetries, true, countRetries)
        await channel.ack(payload)
      }
    }
  })
}