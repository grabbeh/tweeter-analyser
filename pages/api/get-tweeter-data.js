import Twitter from 'twitter'
import moment from 'moment'
import _ from 'lodash'
import compromise from '../../api/compromise'
import predict from '../../api/tensorflow'
import chartData from '../../api/chartData'
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_KEY,
  access_token_secret: process.env.ACCESS_SECRET
})

const filterArray = (array, filters) => {
  const filterKeys = Object.keys(filters)
  return array.filter(item => {
    // validates all filter criteria
    return filterKeys.every(key => {
      // ignores non-function predicates
      if (typeof filters[key] !== 'function') return true
      return filters[key](item[key])
    })
  })
}

// rate limiter means we can only get last 3000 tweets
const twitterDateFormat = () => 'ddd MMM DD HH:mm:ss ZZ YYYY'

export default async (req, res) => {
  let username = JSON.parse(req.body).username
  let tweets = await getSevenDaysTweets(username)

  let filtered = tweets.filter(t => {
    return checkIfWithinSevenDays(t)
  })

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

  let { hashTags, emojis } = compromise(baseTweets)

  res.statusCode = 200
  res.json({
    filtered,
    screenName: filtered[0].user.screen_name,
    averageTweetsPerDay: Math.round(filtered.length / 7),
    totalTweets: filtered.length,
    longestStreak: reducer(filtered),
    chartData: chartData(filtered),
    hashTags,
    filteredToxic,
    emojis
  })
}

const getTweets = async username => {
  try {
    let data = await client.get('statuses/user_timeline', {
      screen_name: username,
      count: 200
    })
    return data
  } catch (e) {
    console.log(e)
  }
}

// recursive until get all friends

const getFriends = async username => {
  try {
    let data = await client.get('friends/ids', {
      screen_name: username
    })
    return data
  } catch (e) {
    console.log(e)
  }
}

const getUser = async username => {
  try {
    let data = await client.get('users/show', {
      screen_name: username
    })
    return data
  } catch (e) {
    console.log(e)
  }
}

// check dates of tweet - stop when last tweet is more than 8 days old

const sevenDaysAgo = moment(new Date(), twitterDateFormat()).subtract(7, 'days')

const checkIfWithinSevenDays = tweet => {
  return moment(new Date(tweet.created_at), twitterDateFormat()).isAfter(
    sevenDaysAgo
  )
}

const getSevenDaysTweets = async (username, maximumId) => {
  let fragment = await getTweetsBatch(username, maximumId)
  let earliestTweet = fragment.data.pop()
  if (checkIfWithinSevenDays(earliestTweet)) {
    return fragment.data.concat(
      await getSevenDaysTweets(username, fragment.nextId)
    )
  } else {
    return fragment.data
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
    console.log(e)
  }
}
/*
const averageTweetsPerDay = (latestTweet, earliestTweet, totalTweets) => {
  let duration = moment(latestTweet,twitterDateFormat()).diff(
    moment(earliestTweet, twitterDateFormat()),
    'days'
  )
  return Math.round(totalTweets / duration)
}
*/
const reducer = arr => {
  let i = 0
  return arr.reduce((stack, b) => {
    let cur = stack[i]
    let a = cur ? cur[cur.length - 1] : 0
    let earlierDate = moment(a.created_at, twitterDateFormat())
    let currentDate = moment(b.created_at, twitterDateFormat())
    let diff = earlierDate.diff(currentDate, 'days')
    if (diff > 1) {
      i++
    }
    if (!stack[i]) stack[i] = []
    stack[i].push(b)
    return stack
  }, [])
}
