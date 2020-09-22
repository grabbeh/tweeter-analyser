import _ from 'lodash'
import { format } from 'date-fns'

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

const chartData = tweets => {
  // add hour
  let hour = tweets.map(t => {
    return {
      ...t,
      date: convertToDay(t.created_at),
      hour: convertToHour(t.created_at)
    }
  })
  let timeRanges = _.groupBy(hour, 'hour')
  let hours = [...Array(Number(24))]
  // empty object to fill with relevant results
  let r = hours.map((v, i) => {
    return { time: i }
  })

  let response = Object.entries(timeRanges).map(([k, v], i) => {
    return Object.assign({ time: Number(k), indexValue: i }, ...convertDates(v))
  })
  let keys = _.uniq(hour.map(i => i.date))

  // replace empty objects with entries where applicable
  let data = r.map(obj => response.find(o => o.time === obj.time) || obj)
  return { data, keys }
}

const convertDates = array => {
  let g = _.groupBy(array, 'date')
  return Object.entries(g).map(([k, v]) => {
    let o = { [k]: v.length }
    return o
  })
}

export default chartData
