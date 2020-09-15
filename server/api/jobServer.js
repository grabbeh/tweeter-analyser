import cron from 'node-cron'
import express from 'express'
import { getBatch } from './dynamodb.js'

const app = express()

// schedule tasks to be run on the server
cron.schedule('* 4 * * *', async function () {

})

app.listen('3128')
