import _ from 'lodash'
import { format } from 'date-fns'
import map from 'lodash/fp/map'
import values from 'lodash/fp/values'
import groupBy from 'lodash/fp/groupBy'
import max from 'lodash/fp/max'
import flow from 'lodash/fp/flow'
import entries from 'lodash/fp/entries'
import uniq from 'lodash/fp/entries'

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
  const supplemented = supplementBase(tweets)
  const keys = flow(
    map(i => i.date),
    uniq
  )(supplemented)

  const timeRanges = flow(
    groupBy('hour'),
    entries,
    map(([k, v]) => {
      return Object.assign({ time: Number(k) }, ...convertDates(v))
    })
  )(supplemented)

  const twentyFourHours = [...Array(Number(24))].map((v, i) => {
    return { time: i }
  })

  const data = flow(
    map(obj => timeRanges.find(o => o.time === obj.time) || obj)
  )(twentyFourHours)
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
