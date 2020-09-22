import dotenv from 'dotenv'
import Twitter from 'twitter'
import _ from 'lodash'
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
      accountCreated: format(new Date(user.created_at), 'd LLLL y'),
      timeSinceCreation: formatDistanceToNow(new Date(user.created_at)),
      averageTweetsPerDay: average,
      limitExceeded,
      likesToReplyTo: likesToReplyTo(filtered),
      likesToRetweet: likesToRetweet(filtered),
      totalTweets: filtered.length,
      chartData: chartData(filtered),
      hashTags,
      filteredToxic,
      tweetSplit: tweetSplit(filtered),
      toxicPercentage: Math.round((filteredToxic.length / 100) * 100),
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
      //  screen_name: id,
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
  let added = addCategories(tweets)
  let categories = _.groupBy(added, 'category')
  return Object.entries(categories).map(([k, v]) => {
    return { id: k, label: k, value: v.length }
  })
}

const likesToReplyTo = tweets => {
  let added = addCategories(tweets)
  let replies= _.groupBy(added, 'category').REPLY
   if (replies) {
    let repliedTo = replies.map(r => r.in_reply_to_screen_name)
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

const likesToRetweet = tweets => {
  let added = addCategories(tweets)
  let retweets = _.groupBy(added, 'category').RETWEET
  if (retweets) {
    let retweeted = retweets.map(r => extractFirstScreenname(r.text))
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

export {
  tweeter,
  calculateAverage,
  getSevenDaysTweets,
  getBatch,
  filterSevenDays,
  getUser,
  tweetSplit,
  likesToReplyTo,
  likesToRetweet
}
