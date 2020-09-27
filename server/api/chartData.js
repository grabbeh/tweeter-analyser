import { format } from 'date-fns'
import map from 'lodash/fp/map'
import values from 'lodash/fp/values'
import groupBy from 'lodash/fp/groupBy'
import max from 'lodash/fp/max'
import flow from 'lodash/fp/flow'
import entries from 'lodash/fp/entries'
import uniq from 'lodash/fp/uniq'

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
  let keys = flow(
    map(i => i.date),
    uniq
  )(supplemented)

  let timeRanges = flow(
    groupBy('hour'),
    entries,
    map(([k, v]) => {
      return Object.assign({ time: Number(k) }, ...convertDates(v))
    })
  )(supplemented)

  let twentyFourHours = [...Array(Number(24))].map((v, i) => {
    return { time: i }
  })

  let data = flow(map(obj => timeRanges.find(o => o.time === obj.time) || obj))(
    twentyFourHours
  )
  return { data, keys }
}

const getMostActiveHour = tweets => {
  const supplemented = supplementBase(tweets)
  return flow(
    groupBy('date'),
    map(groupBy('hour')),
    map(values),
    map(i => i.length),
    max
  )(supplemented)
}

const convertDates = arr => {
  return flow(
    groupBy('date'),
    entries,
    map(([k, v]) => {
      return { [k]: v.length }
    })
  )(arr)
}

export { chartData, getMostActiveHour }
