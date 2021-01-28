import getUser from './getUser.js'
import { calculateAverage } from '../api/summarise.js'

// Takes mention and return analysis of parent tweeter
const getAnalysis = async mention => {
  try {
    let { filtered, parentUsername } = await getUser(mention)
    let totalTweets = filtered.length
    let { difference, average } = calculateAverage(filtered)
    let statement
    switch (average) {
      case average > 10:
        statement = 'Low volume. Nothing to see here'
        break
      case average > 25:
        statement = 'Quite active but nothing to worry about.'
        break
      case average > 50:
        statement = 'The account is one to watch. An up and comer.'
        break
      case average > 100:
        statement =
          'Lots of activity by this account. Potentially lost in an echo chamber.'
        break
      case average > 200:
        statement =
          'This is a high volume account - lots of activity. Approach with caution.'
        break
      case average > 500:
        statement =
          'Twitter is love, twitter is life. This person may need an intervention (or to be shut down).'
        break
    }
    let analysis = `Looks like @${parentUsername} has ${totalTweets} tweets/RTs in the last ${difference} days, roughly ${average} per day. ${statement}`
    return analysis
  } catch (e) {
    throw e
  }
}

export default getAnalysis
