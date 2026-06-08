const db = require('../db/db')
const cron = require('node-cron')

const checkDate = () => {
  cron.schedule('* * * * *', async()=>{
    try {
      const today = new Date().toISOString()
      const updateStatus = await db('events')
      .where('event_start', '<', today)
      .whereIn('status', ['open', 'closed'])
      .update({status: 'expired'})
    } catch (error) {
      console.error('Error corn  job', error)
    }
  })
}

module.exports = {checkDate}