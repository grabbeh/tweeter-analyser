import dotenv from 'dotenv'
import Twitter from 'twitter'
import _ from 'lodash'
import map from 'lodash/fp/map'
import filter from 'lodash/fp/filter'
import flow from 'lodash/fp/flow'
import countBy from 'lodash/fp/countBy'
import {
  format,
  sub,
  isAfter,
  differenceInDays,
  formatDistanceToNow
} from 'date-fns'
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

const tweeter = async user => {
  try {
    let tweets = await getSevenDaysTweets(user.id_str)
    if (!tweets.length > 0 || !tweets) {
      throw new Error('No tweets in the last 7 days')
    }
    let filtered = filterSevenDays(tweets)
    filtered = addCategories(filtered)
    let toxicTweets = await predict(filtered)
    let { hashTags, emojis, topics } = compromise(filtered)
    let { average, limitExceeded } = calculateAverage(filtered)
    let latestTweet = filtered[0]
    let oldestTweet = filtered.pop()
    return {
      accountCreated: accountCreated(user.created_at),
      timeSinceCreation: timeSinceCreation(user.created_at),
      averageTweetsPerDay: average,
      limitExceeded,
      likesToReplyTo: likesToReplyTo(filtered),
      likesToRetweet: likesToRetweet(filtered),
      totalTweets: filtered.length,
      chartData: chartData(filtered),
      hashTags,
      toxicTweets,
      tweetSplit: tweetSplit(filtered),
      toxicPercentage: Math.round((toxicTweets.length / 100) * 100),
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
  let dateFormat = 'd MMMM yyyy'
  let endDate = format(new Date(latestTweet.created_at), dateFormat)
  let startDate = format(new Date(oldestTweet.created_at), dateFormat)
  return `${startDate} - ${endDate}`
}

const sevenDaysAgo = sub(new Date(), { days: 7 })

const checkIfWithinSevenDays = tweet => {
  return isAfter(new Date(tweet.created_at), sevenDaysAgo)
}

const getSevenDaysTweets = async (id, maximumId) => {
  try {
    let fragment = await getTweetsBatch(id, maximumId)
    let earliestTweet = fragment.data.pop()
    if (
      fragment &&
      fragment.nextId &&
      earliestTweet &&
      checkIfWithinSevenDays(earliestTweet)
    ) {
      return fragment.data.concat(await getSevenDaysTweets(id, fragment.nextId))
    } else {
      return fragment.data
    }
  } catch (e) {
    throw e
  }
}

const getTweetsBatch = async (id, maximumId) => {
  try {
    let data = await client.get('statuses/user_timeline', {
      user_id: id,
      max_id: maximumId,
      count: 200
    })

    let oldest = data.pop()
    let nextId
    // sometimes gives error message "cannot find id of undefined"
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

const getBatch = async id => {
  try {
    return await client.get('statuses/user_timeline', {
      screen_name: id,
      count: 200
    })
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
  if (difference < 1) difference = 1
  let average = Math.round(tweets.length / difference)
  let limitExceeded = !!difference < 7 && !!tweets.length > 3000
  return { average, difference, limitExceeded }
}

const calculateDuration = (oldestTweet, latestTweet) => {
  let latestDate = new Date(latestTweet.created_at)
  let oldestDate = new Date(oldestTweet.created_at)
  return differenceInDays(latestDate, oldestDate)
}

const addCategory = tweet => {
  let category
  let firstTwo = tweet.text.slice(0, 2)
  if (tweet.text.charAt(0) === '@') {
    category = 'REPLY'
  } else if (firstTwo === 'RT') {
    category = 'RETWEET'
  } else {
    category = 'TWEET'
  }
  return category
}

const addCategories = tweets => {
  return tweets.map(t => {
    return { ...t, category: addCategory(t) }
  })
}

const tweetSplit = tweets => {
  let categories = _.groupBy(tweets, 'category')
  return Object.entries(categories).map(([k, v]) => {
    return { id: k, label: k, value: v.length }
  })
}

const likesToReplyTo = (tweets, screenName) => {
  let replies = _.groupBy(tweets, 'category').REPLY
  if (replies) {
    let repliedTo = flow([
      map(r => r.in_reply_to_screen_name),
      filter(i => i !== screenName)
    ])(replies)

    let grouped = _.countBy(repliedTo)
    let o = Object.entries(grouped).map(([k, v]) => {
      return { screen_name: `@${k}`, value: v }
    })
    let result = _.sortBy(o, function (o) {
      return o.value
    }).reverse()
    return result.slice(0, 5)
  } else {
    return false
  }
}

const extractFirstScreenname = str => {
  let removeFirstPart = str.slice(3)
  let nextSpace = removeFirstPart.indexOf(' ')
  let screenName = removeFirstPart.slice(0, nextSpace)
  let removeColon = screenName.slice(0, screenName.length - 1)
  return removeColon
}

const likesToRetweet = (tweets, userName) => {
  let retweets = _.groupBy(tweets, 'category').RETWEET
  if (retweets) {
    let retweeted = retweets
      .map(r => extractFirstScreenname(r.text))
      .filter(i => i !== `@${userName}`)
    let grouped = _.countBy(retweeted)
    let o = Object.entries(grouped).map(([k, v]) => {
      return { screen_name: k, value: v }
    })
    let result = _.sortBy(o, function (o) {
      return o.value
    }).reverse()

    return result.slice(0, 5)
  } else {
    return false
  }
}

const accountCreated = createdAt => {
  return format(new Date(createdAt), 'd LLLL y')
}

const timeSinceCreation = createdAt => {
  return formatDistanceToNow(new Date(createdAt))
}

export {
  tweeter,
  calculateAverage,
  getSevenDaysTweets,
  getBatch,
  filterSevenDays,
  getUser,
  tweetSplit,
  likesToReplyTo,
  likesToRetweet,
  accountCreated,
  timeSinceCreation
}
