import getUser from './getUser'

// Takes mention and return analysis of parent tweeter
const getAnalysis = async mention => {
  try {
    let content = await getUser(mention)
    let totalTweets = content.length
    let averagePerDay = content.length / 7
    let analysis = `${totalTweets} in the last 7 days, ${averagePerDay} per day`
    return analysis
  } catch (e) {
    console.log(e)
  }
}

export default getAnalysis
