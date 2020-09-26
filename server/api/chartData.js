import _ from 'lodash'
import { format } from 'date-fns'
import map from 'lodash/fp/map'
import values from 'lodash/fp/values'
import groupBy from 'lodash/fp/groupBy'
import max from 'lodash/fp/max'
import flow from 'lodash/fp/flow'

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
  let result = flow(
    groupBy('date'),
    map(groupBy('hour')),
    map(values),
    map(i => i.length),
    max
  )(supplemented)
  return result
}

const convertDates = arr => {
  let g = _.groupBy(arr, 'date')
  return Object.entries(g).map(([k, v]) => {
    return { [k]: v.length }
  })
}

export { chartData, getMostActiveHour }
