import { getSearchResults, newTweet } from './tweet.js'
import { sub, isAfter } from 'date-fns'
import _ from 'lodash'
import dotenv from 'dotenv'
import filter from 'lodash/fp/filter.js'
import flow from 'lodash/fp/flow.js'
import flatten from 'lodash/fp/flatten.js'
dotenv.config({ path: '../../.env' })

const withinTimePeriod = (tweet, startTime) => {
  return isAfter(new Date(tweet.created_at), startTime)
}

const oneMinuteAgo = sub(new Date(), { minutes: 20 })

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
  let tweets = flow(
    flatten,
    filter(t => t.user.screen_name !== process.env.BOT_NAME),
    filter(t => t.user.screen_name !== process.env.SCREEN_NAME),
    filter(t => withinTimePeriod(t, oneMinuteAgo))
  )(batch)
  console.log(tweets)
  await checkTweets(tweets)
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

const templateReplies = (replyTo, screenName) => {
  const options = [
    `@${replyTo} @${screenName} tweets the same old tweets in response to being using certain keywords in their tweets. He doesn't much care about the context. I'd ignore him.`,
    `@${replyTo} Hey there, sadly @${screenName} spams out the same tweets multiple times during the course of the day! Please ignore.`,
    `@${replyTo} Strongly advise you to just ignore whatever @${screenName} is saying. The account just pumps out the same series of tweets on an epic scale that no human could or would want to do without automating it.`
  ]
  let random = options[Math.floor(Math.random() * options.length)]
  return random
}

const replyToTweet = async tweet => {
  let { id_str, user } = tweet
  let status = templateReplies(user.screen_name, process.env.SCREEN_NAME)
  let content = { status, in_reply_to_status_id: id_str }
  try {
    // await newTweet(content)
  } catch (e) {
    console.log(e)
  }
}

tweetSearchResults()

export default tweetSearchResults
