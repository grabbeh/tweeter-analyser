var moment = require('moment')

let now = new Date()
let dateFormat = 'D MMMM YYYY'
let today = moment(now, 'day').format(dateFormat)
let sevenDaysAgo = moment(now)
  .subtract(7, 'days')
  .format(dateFormat)
let timePeriod = `${sevenDaysAgo} - ${today}`
console.log(timePeriod)

const checkRefresh = createdAt => {
  let dateNow = moment(new Date(), 'x')
  let createdDate = moment(createdAt, 'x')
  let duration = moment.duration(dateNow.diff(createdDate)).days()
  let refreshAvailable = false
  if (duration > 1) {
    refreshAvailable = true
  }
  return refreshAvailable
}

let res = checkRefresh(1597363200000)

console.log(res)
