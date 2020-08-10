import Twitter from 'twitter'
import moment from 'moment'
import _ from 'lodash'
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_KEY,
  access_token_secret: process.env.ACCESS_SECRET
})

// rate limiter means we can only get last 3000 tweets
const twitterDateFormat = () => 'ddd MMM DD HH:mm:ss ZZ YYYY'

const convertToHour = twitterDate => {
  let hour = moment(twitterDate, twitterDateFormat()).format('H')
  return hour
}

export default async (req, res) => {
  let username = JSON.parse(req.body).username
  let tweets = await getSevenDaysTweets(username)

  let filtered = tweets.filter(t => {
    return checkIfWithinSevenDays(t)
  })

  let addedHour = filtered.map(t => {
    return { ...t, hour: convertToHour(t.created_at) }
  })

  let timeRanges = _.groupBy(addedHour, 'hour')

  let hours = [...Array(Number(24))]
  let r = hours.map((v, i) => {
    return { time: i, value: 0 }
  })

  let response = Object.entries(timeRanges).map(([k, v]) => {
    return { time: Number(k), value: v.length }
  })

  let chartData = r.map(obj => response.find(o => o.time === obj.time) || obj)

  res.statusCode = 200
  res.json({
    filtered,
    screenName: filtered[0].user.screen_name,
    averageTweetsPerDay: Math.round(filtered.length / 7),
    totalTweets: filtered.length,
    longestStreak: reducer(filtered),
    chartData
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
