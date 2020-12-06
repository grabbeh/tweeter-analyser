import { getSearchResults, newTweet } from './tweet.js'
import { sub, isAfter } from 'date-fns'
import _ from 'lodash'
import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' })

const withinTimePeriod = (tweet, startTime) => {
  return isAfter(new Date(tweet.created_at), startTime)
}

const oneMinuteAgo = sub(new Date(), { minutes: 1 })

const searchTerms = [
  process.env.SCREEN_NAME,
  "Even Conservative MPs are speaking out against Boris Johnson's tyrannical Covid restrictions",
  'The arbitrary coronavirus restrictions will achieve nothing, they will make us poorer',
  'The new normal (in which Boris J dictates how many humans you can interact with) is dystopian. Our country has become a police state.',
  'None of these individuals were fined. Why should the public continue to follow the dystopian rules?',
  'Boris Johnson seems to be determined to destroy the economy. Sweden never imposed a national lockdown/mask wearing.'
]

const getAllSearchResults = searchTerms => {
  let promises = searchTerms.map(async query => {
    let tweets = await getSearchResults(query)
    return tweets
  })
  return Promise.all(
    promises.map(p =>
      p.catch(e => {
        return e
      })
    )
  )
}

const tweetSearchResults = async () => {
  let batch = await getAllSearchResults(searchTerms)
  let flat = _.flatten(batch)
  let lastMinute = flat.filter(t => withinTimePeriod(t, oneMinuteAgo))
  let withoutBot = lastMinute.filter(
    t => t.user.screen_name !== process.env.BOT_NAME
  )
  let withoutMain = withoutBot.filter(
    t => t.user.screen_name !== process.env.SCREEN_NAME
  )
  console.log(withoutMain)
  await checkTweets(withoutMain)
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
  let status = `@${user.screen_name} Hey there, sadly ${process.env.SCREEN_NAME} is a bot that spams out the same tweets multiple times during the course of the day! He needs to work on his algorithms. Please ignore.`
  let content = { status, in_reply_to_status_id: id_str }
  try {
    await newTweet(content)
  } catch (e) {
    console.log(e)
  }
}

tweetSearchResults()

export default tweetSearchResults
