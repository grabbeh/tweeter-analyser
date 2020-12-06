import { getSingleBatch, getSearchResults, newTweet } from './tweet.js'
import { sub, isAfter } from 'date-fns'
import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' })

const withinTimePeriod = (tweet, startTime) => {
  return isAfter(new Date(tweet.created_at), startTime)
}

const oneMinuteAgo = sub(new Date(), { minutes: 1 })

const tweetSearchResults = async () => {
  let batch = await getSearchResults(process.env.SCREEN_NAME)
  let lastMinute = batch.filter(t => withinTimePeriod(t, oneMinuteAgo))
  await checkTweets(lastMinute)
}

const checkTweets = async tweets => {
  if (tweets.length > 0) {
    for (var i = 0, l = tweets.length; i < l; i++) {
      try {
        await replyToTweet(tweets[i])
      } catch (e) {
        console.log(e)
      }
    }
  } else {
    console.log('No tweets')
  }
}

const replyToTweet = async tweet => {
  let { id_str, user } = tweet
  let status = `@${user.screen_name} Hey there, sadly @${process.env.SCREEN_NAME} is a bot that spams out the same tweets multiple times during the course of the day! He needs to work on his algorithms. Please ignore.`
  let content = { status, in_reply_to_status_id: id_str }
  try {
    await newTweet(content)
  } catch (e) {
    console.log(e)
  }
}

tweetSearchResults()

export default tweetSearchResults
