import dotenv from 'dotenv'
import Twitter from 'twitter'
import map from 'lodash/fp/map'
import entries from 'lodash/fp/entries'
import filter from 'lodash/fp/filter'
import flow from 'lodash/fp/flow'
import countBy from 'lodash/fp/countBy'
import sortBy from 'lodash/fp/sortBy'
import reverse from 'lodash/fp/reverse'
import slice from 'lodash/fp/slice'
import identity from 'lodash/fp/identity'
import groupBy from 'lodash/fp/groupBy'
import {
  format,
  sub,
  isAfter,
  differenceInDays,
  formatDistanceToNow
} from 'date-fns'
import predict from './tensorflow.js'
import compromise from './compromise.js'
import {
  chartData,
  mostActiveHour,
  mostActiveDay,
  longestStreak
} from './chartData.js'
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
    let filtered = filterSevenDays(tweets)
    if (!filtered.length > 0 || !tweets) {
      throw new Error('No tweets in the last 7 days')
    }
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
      likesToReplyTo: likesToReplyTo(filtered, user.screen_name),
      likesToRetweet: likesToRetweet(filtered, user.screen_name),
      longestStreak: longestStreak(filtered),
      totalTweets: filtered.length,
      chartData: chartData(filtered),
      mostTweetsPerHour: mostActiveHour(filtered),
      mostActiveDay: mostActiveDay(filtered),
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

const timePeriod = (oldestTweet, latestTweet, dateFormat = 'd MMMM yyyy') => {
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

const getUser = async username => {
  try {
    return client.get('users/show', {
      screen_name: username
    })
  } catch (e) {
    throw new Error(e)
  }
}

const calculateAverage = tweets => {
  let latest = tweets[0]
  let oldest = tweets.pop()
  let difference = calculateDuration(oldest, latest)
  if (difference < 1) difference = 1
  let average = Math.round(tweets.length / difference)
  let limitExceeded = !!difference < 7 && !!tweets.length > 3000
  return { average, difference, limitExceeded }
}

const calculateDuration = (oldest, latest) => {
  let latestDate = new Date(latest.created_at)
  let oldestDate = new Date(oldest.created_at)
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
  return flow(
    groupBy('category'),
    entries,
    map(([k, v]) => {
      return { id: k, label: k, value: v.length }
    })
  )(tweets)
}

const likesToReplyTo = (tweets, screenName) => {
  let replies = groupBy('category')(tweets).REPLY
  if (replies) {
    return flow(
      map(r => r.in_reply_to_screen_name),
      filter(i => i !== screenName),
      countBy(identity),
      entries,
      map(([k, v]) => {
        return { screen_name: `@${k}`, value: v }
      }),
      sortBy(o => o.value),
      reverse,
      slice(0, 10)
    )(replies)
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

const likesToRetweet = (tweets, screenName) => {
  let retweets = groupBy('category')(tweets).RETWEET
  if (retweets) {
    return flow(
      map(r => extractFirstScreenname(r.text)),
      filter(i => i !== `@${screenName}`),
      countBy(identity),
      entries,
      map(([k, v]) => {
        return { screen_name: k, value: v }
      }),
      sortBy(o => o.value),
      reverse,
      slice(0, 10)
    )(retweets)
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
  timeSinceCreation,
  timePeriod
}
