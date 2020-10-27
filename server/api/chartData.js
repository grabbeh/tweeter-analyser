import { format, differenceInMinutes } from 'date-fns'
import { timePeriodBetweenTwo } from './tweeter'
import map from 'lodash/fp/map'
import values from 'lodash/fp/values'
import groupBy from 'lodash/fp/groupBy'
import max from 'lodash/fp/max'
import flatten from 'lodash/fp/flatten'
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
    map(([k, v], i) => {
      return Object.assign(
        { time: Number(k), indexValue: i },
        ...convertDates(v)
      )
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

const mostActiveHour = tweets => {
  const supplemented = supplementBase(tweets)
  return flow(
    groupBy('date'),
    values,
    map(groupBy('hour')),
    map(values),
    flatten,
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

const mostActiveDay = tweets => {
  const supplemented = supplementBase(tweets)
  return flow(
    groupBy('date'),
    values,
    map(i => i.length),
    max
  )(supplemented)
}

const longestStreak = tweets => {
  let formatted = tweets.map(t => {
    return { ...t, createdAt: new Date(t.created_at) }
  })

  let arr = []
  let counter = 0
  arr[counter] = []
  let arrs = formatted.map((t, i) => {
    if (i < formatted.length - 1) {
      let next = formatted[i + 1]
      let diff = differenceInMinutes(t.createdAt, next.createdAt)
      if (diff > 30) {
        counter++
        arr[counter] = []
      } else {
        arr[counter].push(t)
      }

      return arr
    }
  })
  let flattened = flatten(arrs)

  let sorted = flattened.sort((a, b) => {
    return b.length - a.length
  })
  let longestStreak = sorted[0]
  let longestStreakLength = sorted[0].length
  let oldest = longestStreak.pop()
  let earliest = longestStreak[0]
  let longestStreakDuration = timePeriodBetweenTwo(
    oldest.created_at,
    earliest.created_at
  )
  return { length: longestStreakLength, timePeriod: longestStreakDuration }
}

export { chartData, mostActiveHour, mostActiveDay, longestStreak }
