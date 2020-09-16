import pkg from 'date-fns'
const { format, sub, isAfter, parseISO, differenceInDays } = pkg

const twitterDateFormat = () => {
  return 'EEE MMM dd HH:mm:ss zz yyyy'
}

let twitterDate = new Date('Tue Jun 02 22:18:12 +0000 2020')

let o = format(twitterDate, 'd MMMM yyyy')
console.log(o)

/*
let dateFormat = 'd MMMM yyyy'
console.log(dateFormat)
let today = format(new Date(), dateFormat)
let sevenDaysAgo = format(sub(new Date(), { days: 7 }), dateFormat)

let timePeriod = `${sevenDaysAgo} - ${today}`
console.log(timePeriod)
/*
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
*/
