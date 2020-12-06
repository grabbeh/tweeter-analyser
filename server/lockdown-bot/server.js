import cron from 'node-cron'
import express from 'express'
import tweetUser from './tweetUser.js'

const app = express()

// schedule tasks to be run on the server
cron.schedule('* * * * *', function () {
  tweetUser()
})

app.listen('3128')
