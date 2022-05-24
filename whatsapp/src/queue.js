import { redisConnect, delConversationId } from './redis.js'
import chatwootConsumer from './chatwootConsumer.js'
import whatsappConsumer from './whatsappConsumer.js'
import { Worker, Plugins, Queue } from 'node-resque'

export const chatwoot = process.env.QUEUE_CHATWOOT_NAME
export const whatsapp = process.env.QUEUE_WHATSAPP_NAME
export const cleanConversationIdCache = 'cleanConversationIdCache'

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
    perform: async (payload) => {
      const { token, content } = payload
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
    perform: async (payload) => {
      const { token, content } = payload
      console.debug('Process chatwoot message %s', token, content)
      await chatwootConsumer(token, content)
      return true
    }
  }

  jobs[cleanConversationIdCache] = {
    perform: async (payload) => {
      const { contact_inbox: { source_id } } = payload
      console.debug('Process clean conversationId cache %s', source_id)
      await delConversationId(source_id)
      return true
    }
  }
  const queue = new Queue({ connection: connectionDetails }, jobs)
  queue.on('error', console.error)
  const worker = new Worker(
    { connection: connectionDetails, queues: ['jobs'] },
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

export const addToQueue = async (queue, job, payload) => {
  await queue.enqueue('jobs', job, [payload])
  console.debug('Enqueued message %s', JSON.stringify(payload))
} 