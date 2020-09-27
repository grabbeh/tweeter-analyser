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

let r = chartData(tweets)
console.log(r.keys)

export { chartData, getMostActiveHour }
