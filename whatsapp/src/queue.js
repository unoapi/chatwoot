import Queue from 'bull'
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

export const createQueue = async (name, process) => {
  console.debug(`Create a queue with name ${name}`)
  const queue = new Queue(name, REDIS_URL)
  queue.process(async (job) => {
    try {
      const payload = job.data
      console.debug('Process message %s', payload.token, payload.content)
      await process('message', payload)
      job.moveToCompleted('done', true)
    } catch (e) {
      console.log(`Error on process message`, e)
      job.moveToFailed({message: 'job failed'})
    }
  })
  return queue
}

export const addToQueue = async (queue, payload, attempts) => {
  queue.add('message', payload, { attempts, backoff: 10000 })
  console.debug('Enqueued message %s', payload.content)
} 