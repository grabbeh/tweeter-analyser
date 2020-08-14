import Twitter from 'twitter'
import moment from 'moment'
import { tweeter } from '../../api/tweeter'
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_KEY,
  access_token_secret: process.env.ACCESS_SECRET
})

// rate limiter means we can only get last 3000 tweets
const twitterDateFormat = () => 'ddd MMM DD HH:mm:ss ZZ YYYY'

export default async (req, res) => {
  let username = JSON.parse(req.body).username
  let results = await tweeter(username)
  res.statusCode = 200
  res.json({
    ...results
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
