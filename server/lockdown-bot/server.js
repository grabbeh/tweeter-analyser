import cron from 'node-cron'
import tweetSearchResults from './tweetSearchResults.js'

// schedule tasks to be run on the server
cron.schedule('* * * * *', function () {
  tweetSearchResults()
})
