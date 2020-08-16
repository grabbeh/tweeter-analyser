var dayjs = require('moment')

let now = new Date()
let dateFormat = 'D MMMM YYYY'
let today = dayjs(now, 'day').format(dateFormat)
let sevenDaysAgo = dayjs(now)
  .subtract(7, 'days')
  .format(dateFormat)
let timePeriod = `${sevenDaysAgo} - ${today}`
console.log(timePeriod)

const checkRefresh = createdAt => {
  let dateNow = dayjs(new Date(), 'x')
  let createdDate = dayjs(createdAt, 'x')
  let duration = dayjs.duration(dateNow.diff(createdDate)).days()
  let refreshAvailable = false
  if (duration > 1) {
    refreshAvailable = true
  }
  return refreshAvailable
}

let res = checkRefresh(1597363200000)

console.log(res)
