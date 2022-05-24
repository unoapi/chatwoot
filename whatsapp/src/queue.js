import { redisConnect } from './redis.js'
import chatwootConsumer from './chatwootConsumer.js'
import whatsappConsumer from './whatsappConsumer.js'
import { Worker, Plugins, Queue } from 'node-resque'

export const chatwoot = process.env.QUEUE_CHATWOOT_NAME
export const whatsapp = process.env.QUEUE_WHATSAPP_NAME

let queue = null

const createQueue = async () => {
  const redisClient = await redisConnect()
  const connectionDetails = { redis: redisClient }
  const jobs = {}
  jobs[whatsapp] = {
    plugins: [Plugins.Retry],
    pluginOptions: {
      Retry: {
        retryLimit: process.env.QUEUE_WHATSAPP_RETRY,
        retryDelay: process.env.QUEUE_WHATSAPP_RETRY_DELAY || 10000,
      },
    },
    perform: async (token, content) => {
      console.debug('Process whatsapp message %s', token, content)
      await whatsappConsumer(token, content)
      return true
    }
  }

  jobs[chatwoot] = {
    plugins: [Plugins.Retry],
    pluginOptions: {
      Retry: {
        retryLimit: process.env.QUEUE_CHATWOOT_RETRY,
        retryDelay: process.env.QUEUE_CHATWOOT_RETRY_DELAY || 10000,
      },
    },
    perform: async (token, content) => {
      console.debug('Process chatwoot message %s', token, content)
      await chatwootConsumer(token, content)
      return true
    }
  }
  const queue = new Queue({ connection: connectionDetails }, jobs)
  queue.on('error', console.error)
  const worker = new Worker(
    { connection: connectionDetails, queues: ['message'] },
    jobs
  );
  await worker.connect();
  worker.start();
  await queue.connect()
  return queue
}

export const getQueue = async () => {
  if (!queue) {
    queue = await createQueue()
  }
  return queue
}

export const addToQueue = async (queue, job, token, content, _attempts) => {
  await queue.enqueue('message', job, [token, content])
  console.debug('Enqueued message %s', content)
} 