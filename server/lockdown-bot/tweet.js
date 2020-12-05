import dotenv from 'dotenv'
import Twitter from 'twitter'
import { isAfter, sub } from 'date-fns'
dotenv.config({ path: '../../.env' })
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
    let oneMinuteAgo = sub(Date.now(), { minutes: 1 })
    return mentions.filter(m => {
      const creationDate = new Date(m.created_at)
      return isAfter(creationDate, oneMinuteAgo)
    })
  } catch (e) {
    console.log(e)
  }
}

const getTweet = async id => {
  return client.get('statuses/show/', { screen_name: id })
}

const getTweetsBatch = async (id, maximumId) => {
  let data = await client.get('statuses/user_timeline', {
    screen_name: id,
    max_id: maximumId,
    count: 200
  })
  let nextId = data.pop().id
  return { data, nextId }
}

const getAllTweets = async (id, maximumId) => {
  let fragment = await getTweetsBatch(id, maximumId)
  if (fragment.data.length > 1) {
    return fragment.data.concat(await getAllTweets(id, fragment.nextId))
  } else {
    return fragment.data
  }
}

const getSingleBatch = async screen_name => {
  let data = await client.get('statuses/user_timeline', {
    screen_name,
    count: 200
  })
  return data
}
export { newTweet, getSingleBatch, getMentions, getTweet, getAllTweets }
