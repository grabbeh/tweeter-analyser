import cron from 'node-cron'
import tweetUser from './tweetUser.js'

// schedule tasks to be run on the server
cron.schedule('* * * * *', function () {
  tweetUser()
})
