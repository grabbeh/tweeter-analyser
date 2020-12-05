import { getSingleBatch, newTweet } from './tweet.js'
import { sub, isAfter } from 'date-fns'
import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' })

const checkIfWithinTimePeriod = (tweet, startTime) => {
  return isAfter(new Date(tweet.created_at), startTime)
}

const tweetUser = async () => {
  let batch = await getSingleBatch(process.env.SCREEN_NAME)
  let oneMinuteAgo = sub(new Date(), { minutes: 1 })
  let twentyMinutesAgo = sub(new Date(), { minutes: 20 })
  let lastMinute = batch.filter(t => {
    return checkIfWithinTimePeriod(t, oneMinuteAgo)
  })
  let lastTwenty = batch.filter(t => {
    return checkIfWithinTimePeriod(t, twentyMinutesAgo)
  })
  await checkTweets(lastMinute, lastTwenty.length)
}

const checkTweets = async (tweets, lastTwentyLength) => {
  if (tweets.length > 0) {
    for (var i = 0, l = tweets.length; i < l; i++) {
      try {
        await replyToTweet(tweets[i], lastTwentyLength)
      } catch (e) {
        console.log(e)
      }
    }
  } else {
    console.log('No tweets')
  }
}

const replyToTweet = async (tweet, lastTwentyLength) => {
  let { id_str } = tweet
  let status = `@${process.env.SCREEN_NAME} Bloody hell @${process.env.SCREEN_NAME}, you've tweeted ${lastTwentyLength} times in the last twenty minutes! Give it a rest!`
  let content = { status, in_reply_to_status_id: id_str }
  try {
    await newTweet(content)
  } catch (e) {
    console.log(e)
  }
}

tweetUser()

export default tweetUser
