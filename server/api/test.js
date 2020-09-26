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

const chartData = tweets => {
  // add hour
  let hour = supplementBase(tweets)
  let timeRanges = _.groupBy(hour, 'hour')
  let hours = [...Array(Number(24))]
  let r = hours.map((v, i) => {
    return { time: i }
  })
  let response = Object.entries(timeRanges).map(([k, v], i) => {
    return Object.assign({ time: Number(k), indexValue: i }, ...convertDates(v))
  })
  let keys = _.uniq(hour.map(i => i.date))
  let data = r.map(obj => response.find(o => o.time === obj.time) || obj)
  return { data, keys }
}

const getMostActiveHour = tweets => {
  const supplemented = supplementBase(tweets)
  let result = fp.flow(
    fp.groupBy('date'),
    fp.map(fp.groupBy('hour')),
    fp.map(fp.values),
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
