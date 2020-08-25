import dotenv from 'dotenv'
import Twitter from 'twitter'
import moment from 'moment'
import predict from './tensorflow.js'
import compromise from './compromise.js'
import chartData from './chartData.js'
dotenv.config({ path: '../../.env' })
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_KEY,
  access_token_secret: process.env.ACCESS_SECRET
})

const twitterDateFormat = () => 'ddd MMM DD HH:mm:ss ZZ YYYY'

const tweeter = async username => {
  try {
    let tweets = await getSevenDaysTweets(username)
    if (!tweets.length > 0 || !tweets) {
      throw new Error('No tweets in the last 7 days')
    }
    let filtered = filterSevenDays(tweets)
    let baseTweets = filtered.map(f => f.text).flat()
    let toxicityResults = await predict(baseTweets.slice(0, 100))
    let filteredToxic = toxicityResults.filter(t => {
      return (
        t.toxicityResults ||
        t.identity_attack ||
        t.insult ||
        t.obscene ||
        t.severe_toxicity ||
        t.sexual_explicit ||
        t.threat ||
        t.toxicity
      )
    })

    let { hashTags, emojis, topics } = compromise(baseTweets)
    let { average, limitExceeded } = calculateAverage(filtered)
    let latestTweet = filtered[0]
    let oldestTweet = filtered.pop()
    return {
      averageTweetsPerDay: average,
      limitExceeded,
      totalTweets: filtered.length,
      chartData: chartData(filtered),
      hashTags,
      filteredToxic,
      toxicPercentage: (filteredToxic.length / 100) * 100,
      emojis,
      topics,
      timePeriod: timePeriod(oldestTweet, latestTweet)
    }
  } catch (e) {
    throw e
  }
}

const filterSevenDays = tweets => {
  return tweets.filter(t => {
    return checkIfWithinSevenDays(t)
  })
}

const timePeriod = (oldestTweet, latestTweet) => {
  let dateFormat = 'D MMMM YYYY'
  let endDate = moment(latestTweet.created_at, twitterDateFormat()).format(
    dateFormat
  )
  let startDate = moment(oldestTweet.created_at, twitterDateFormat()).format(
    dateFormat
  )
  return `${startDate} - ${endDate}`
}

const sevenDaysAgo = moment(new Date(), twitterDateFormat()).subtract(7, 'days')

const checkIfWithinSevenDays = tweet => {
  return moment(new Date(tweet.created_at), twitterDateFormat()).isAfter(
    sevenDaysAgo
  )
}

const getSevenDaysTweets = async (username, maximumId) => {
  try {
    let fragment = await getTweetsBatch(username, maximumId)
    let earliestTweet = fragment.data.pop()
    if (
      fragment &&
      fragment.nextId &&
      earliestTweet &&
      checkIfWithinSevenDays(earliestTweet)
    ) {
      return fragment.data.concat(
        await getSevenDaysTweets(username, fragment.nextId)
      )
    } else {
      return fragment.data
    }
  } catch (e) {
    throw e
  }
}

const getTweetsBatch = async (username, maximumId) => {
  try {
    let data = await client.get('statuses/user_timeline', {
      screen_name: username,
      max_id: maximumId,
      count: 200
    })
    let oldest = data.pop()
    let nextId
    if (oldest) {
      nextId = oldest.id
      return { data, nextId }
    } else {
      return { data: data.filter(d => d) }
    }
  } catch (e) {
    throw new Error(e)
  }
}

const getUser = username => {
  return client.get('users/show', {
    screen_name: username
  })
}

const calculateAverage = tweets => {
  let latestTweet = tweets[0]
  let oldestTweet = tweets.pop()
  let difference = calculateDuration(oldestTweet, latestTweet)
  let average = Math.round(tweets.length / difference)
  let limitExceeded = !!difference < 7 && !!tweets.length > 3000
  return { average, limitExceeded }
}

const calculateDuration = (oldestTweet, latestTweet) => {
  let latestDate = moment(latestTweet.created_at, twitterDateFormat())
  let oldestDate = moment(oldestTweet.created_at, twitterDateFormat())
  return latestDate.diff(oldestDate, 'days')
}

export { tweeter, getSevenDaysTweets, filterSevenDays, getUser }
