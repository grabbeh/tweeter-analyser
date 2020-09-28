import fp from 'lodash/fp.js'
import _ from 'lodash'
import pkg from 'date-fns'
import tweets from '../../tweets.json'
const { format } = pkg

const convertToHour = twitterDate => {
  let date = new Date(twitterDate)
  let hour = format(date, 'H')
  return hour
}

const convertToDay = twitterDate => {
  let date = new Date(twitterDate)
  let day = format(date, 'dLLy')
  return day
}

const supplementBase = tweets => {
  return tweets.map(t => {
    return {
      ...t,
      date: convertToDay(t.created_at),
      hour: convertToHour(t.created_at)
    }
  })
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

const likesToReplyTo = (tweets, screenName) => {
  let updated = addCategories(tweets)
  let replies = _.groupBy(updated, 'category').REPLY
  if (replies) {
    return fp.flow(
      fp.map(r => r.in_reply_to_screen_name),
      fp.filter(i => i !== screenName),
      fp.countBy(fp.identity),
      fp.entries,
      fp.map(([k, v]) => {
        return { screen_name: `@${k}`, value: v }
      }),
      fp.sortBy(o => o.value),
      fp.reverse,
      fp.slice(0, 10)
    )(replies)
  } else {
    return false
  }
}

const iter = value => console.log(value)

const chartData = tweets => {
  let supplemented = supplementBase(tweets)
  let keys = fp.flow(
    fp.map(i => i.date),
    fp.uniq
  )(supplemented)

  let timeRanges = fp.flow(
    fp.groupBy('hour'),
    fp.entries,
    fp.map(([k, v], i) => {
      return Object.assign(
        { time: Number(k), indexValue: i },
        ...convertDates(v)
      )
    })
  )(supplemented)

  let twentyFourHours = [...Array(Number(24))].map((v, i) => {
    return { time: i }
  })

  let data = fp.flow(
    fp.map(obj => timeRanges.find(o => o.time === obj.time) || obj)
  )(twentyFourHours)
  return { data, keys }
}

const getMostActiveHour = tweets => {
  const supplemented = supplementBase(tweets)
  let result = fp.flow(
    fp.groupBy('date'),
    fp.values,
    fp.map(fp.groupBy('hour')),
    fp.map(fp.values),
    fp.flatten,
    fp.map(i => i.length),
    fp.max
  )(supplemented)
  return result
}

const convertDates = arr => {
  let g = _.groupBy(arr, 'date')
  return Object.entries(g).map(([k, v]) => {
    let o = { [k]: v.length }
    return o
  })
}

let r = getMostActiveHour(tweets)
console.log(r)

export { chartData, getMostActiveHour }
