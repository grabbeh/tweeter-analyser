import cron from 'node-cron'
import express from 'express'
import tweetUser from './tweetUser.js'

// schedule tasks to be run on the server
cron.schedule('1 * * * * *', function () {
  tweetUser()
})
