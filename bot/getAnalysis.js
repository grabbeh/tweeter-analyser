import getUser from './getUser.js'

// Takes mention and return analysis of parent tweeter
const getAnalysis = async mention => {
  try {
    let { filtered, parentUsername } = await getUser(mention)
    let totalTweets = filtered.length
    let averagePerDay = Math.round(filtered.length / 7)
    let analysis = `Looks like @${parentUsername} has ${totalTweets} tweets in the last 7 days, roughly ${averagePerDay} per day. DANGER DANGER`
    return analysis
  } catch (e) {
    console.log(e)
  }
}

export default getAnalysis
