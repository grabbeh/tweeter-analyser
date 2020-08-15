import { tweeter } from '../../api/tweeter'

// rate limiter means we can only get last 3000 tweets
export default async (req, res) => {
  let username = JSON.parse(req.body).username
  let results = await tweeter(username)
  res.statusCode = 200
  res.json({
    ...results
  })
}
/*
const getTweets = async username => {
  try {
    let data = await client.get('statuses/user_timeline', {
      screen_name: username,
      count: 200
    })
    return data
  } catch (e) {
    console.log(e)
  }
}

// recursive until get all friends

const getFriends = async username => {
  try {
    let data = await client.get('friends/ids', {
      screen_name: username
    })
    return data
  } catch (e) {
    console.log(e)
  }
}

const getUser = async username => {
  try {
    let data = await client.get('users/show', {
      screen_name: username
    })
    return data
  } catch (e) {
    console.log(e)
  }
}

// check dates of tweet - stop when last tweet is more than 8 days old

/*
const averageTweetsPerDay = (latestTweet, earliestTweet, totalTweets) => {
  let duration = moment(latestTweet,twitterDateFormat()).diff(
    moment(earliestTweet, twitterDateFormat()),
    'days'
  )
  return Math.round(totalTweets / duration)
}
*/
