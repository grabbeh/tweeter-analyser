import cron from 'node-cron'
import express from 'express'
import tweetMentionedUser from './bot/tweetMentionedUser'

const app = express()

// schedule tasks to be run on the server
cron.schedule('* * 21 * *', function () {
  console.log('---------------------')
  console.log('Running Cron Job')
  tweetMentionedUser()
})

app.listen('3128')
