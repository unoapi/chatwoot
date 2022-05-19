import Queue from 'bull'
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

export const createQueue = async (name, process) => {
  const queue = new Queue(name, REDIS_URL)
  queue.process(process)
  return queue
}

export const addToQueue = async (queue, payload, attempts) => {
  return queue.add(payload, { attempts, backoff: 10000 })
}