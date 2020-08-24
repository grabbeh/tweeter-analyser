import dotenv from 'dotenv'
import Twitter from 'twitter'
import moment from 'moment'
dotenv.config({ path: '../.env' })
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_KEY,
  access_token_secret: process.env.ACCESS_SECRET
})

const newTweet = async content => {
  try {
    return client.post('statuses/update', content)
  } catch (e) {
    console.log(e)
  }
}

const getMentions = async () => {
  try {
    let mentions = await client.get('statuses/mentions_timeline', {})
    let oneMinuteAgo = moment(Date.now()).subtract(1, 'minutes')
    // return mentions.filter(m => {
    // return moment(m.created_at, twitterDateFormat()).isAfter(oneMinuteAgo)
    //})
    return mentions
  } catch (e) {
    console.log(e)
  }
}

const getTweet = async id => {
  return client.get('statuses/show/', { id })
}

const getTweetsBatch = async (username, maximumId) => {
  let data = await client.get('statuses/user_timeline', {
    screen_name: username,
    max_id: maximumId,
    count: 200
  })
  let nextId = data.pop().id
  return { data, nextId }
}

// can we just get last 7 days of tweets?

const getAllTweets = async (username, maximumId) => {
  let fragment = await getTweetsBatch(username, maximumId)
  if (fragment.data.length > 1) {
    return fragment.data.concat(await getAllTweets(username, fragment.nextId))
  } else {
    return fragment.data
  }
}

const twitterDateFormat = () => 'ddd MMM DD HH:mm:ss ZZ YYYY'

export { newTweet, getMentions, getTweet, getAllTweets }
