import Twitter from 'twitter'
import moment from 'moment'
import predict from './tensorflow'
import compromise from './compromise'
import chartData from './chartData'
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

    return {
      averageTweetsPerDay: Math.round(filtered.length / 7),
      totalTweets: filtered.length,
      chartData: chartData(filtered),
      hashTags,
      filteredToxic,
      emojis,
      topics,
      timePeriod: timePeriod()
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

const timePeriod = () => {
  let now = new Date()
  let dateFormat = 'D MMMM YYYY'
  let today = moment(now, 'day').format(dateFormat)
  let sevenDaysAgo = moment(now)
    .subtract(7, 'days')
    .format(dateFormat)
  return `${sevenDaysAgo} - ${today}`
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
    if (earliestTweet && checkIfWithinSevenDays(earliestTweet)) {
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
    let nextId = data.pop().id
    return { data, nextId }
  } catch (e) {
    throw new Error(e)
  }
}

const getUser = username => {
  return client.get('users/show', {
    screen_name: username
  })
}

export { tweeter, getSevenDaysTweets, filterSevenDays, getUser }
