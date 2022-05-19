import Queue from 'bull'
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

export const createQueue = async (name, process) => {
  const queue = new Queue(name, REDIS_URL)
  queue.process(async (job, done) => {
    try {
      const payload = job.data
      console.debug('Process message %s', payload.token, payload.content)
      await process(payload)
      await done()
    } catch (e) {
      console.log(`Error on process message`, e)
    }
  })
  return queue
}

export const addToQueue = async (queue, payload, attempts) => {
  queue.add(payload, { attempts, backoff: 10000 })
  console.debug('Enqueued message %s', payload.content)
} 