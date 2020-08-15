import _ from 'lodash'
import moment from 'dayjs'

const twitterDateFormat = () => 'ddd MMM DD HH:mm:ss ZZ YYYY'

const convertToHour = twitterDate => {
  let hour = moment(twitterDate, twitterDateFormat()).format('H')
  return hour
}

const chartData = tweets => {
  let hour = tweets.map(t => {
    return { ...t, hour: convertToHour(t.created_at) }
  })
  let timeRanges = _.groupBy(hour, 'hour')
  let hours = [...Array(Number(24))]
  let r = hours.map((v, i) => {
    return { time: i, value: 0 }
  })

  let response = Object.entries(timeRanges).map(([k, v]) => {
    return { time: Number(k), value: v.length }
  })

  return r.map(obj => response.find(o => o.time === obj.time) || obj)
}

export default chartData
