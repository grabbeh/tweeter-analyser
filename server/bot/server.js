import cron from 'node-cron'
import express from 'express'
import tweetMentionedUser from './tweetMentionedUser'

const app = express()

// schedule tasks to be run on the server
cron.schedule('* * * * *', function () {
  tweetMentionedUser()
})

app.listen('3128')
