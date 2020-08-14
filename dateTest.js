var moment = require('moment')
var _ = require('lodash')

const arr = [
  { toxicity: true, sex: false, random: false },
  { toxicity: false, sex: true, random: false },
  { toxicity: false, sex: false, random: false }
]

console.log(_.all(arr, 'toxicity', 'sex', 'random'))

var date = 'Wed Aug 05 12:33:51 +0000 2020'

function twitterDateFormat () {
  return 'ddd MMM DD HH:mm:ss ZZ YYYY'
}

//console.log(moment(new Date(), twitterDateFormat))
var sevenDaysAgo = moment(new Date(), twitterDateFormat()).subtract(7, 'days')
// console.log(sevenDaysAgo)

function checkIfWithinSevenDays (date) {
  let withinSevenDays = moment(date, twitterDateFormat()).isAfter(sevenDaysAgo)
  // console.log(withinSevenDays)
  return withinSevenDays
}

checkIfWithinSevenDays(date)
