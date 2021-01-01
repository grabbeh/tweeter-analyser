import Twitter from 'twitter'
//import predict from '../../server/api/tensorflow'
import flow from 'lodash/fp/flow'
import sortBy from 'lodash/fp/sortBy'
import reverse from 'lodash/fp/reverse'
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_KEY,
  access_token_secret: process.env.ACCESS_SECRET
})

export default async (req, res) => {
  let username = JSON.parse(req.body).username
  try {
    let friendIds = await getAllFriends(username)
    let response = await getFriendTweets(friendIds.slice(0, 100))
    let filtered = response.filter(result => !(result instanceof Error))
    const unsorted = filtered.filter(result => !(result instanceof Array))
    if (unsorted.length > 0) {
      let tweets = flow(
        sortBy(o => new Date(o.created_at)),
        reverse
      )(unsorted)
      //  let toxicTweets = await predict(tweets)
      res.statusCode = 200
      res.json({ tweets, username })
    } else {
      res.statusCode = 500
      res.json({ errorMessage: 'Rate limit exceeded' })
    }
    // sort by date order
  } catch (e) {
    let error = e[0] ? e[0].message : e.message
    res.statusCode = 500
    res.json({ errorMessage: error })
  }
}

const getAllFriends = async (username, cursor) => {
  try {
    let fragment = await getFriendBatch(username, cursor)
    if (fragment && fragment.nextCursor) {
      return fragment.ids.concat(
        await getAllFriends(username, fragment.nextCursor)
      )
    } else {
      return fragment.ids
    }
  } catch (e) {
    throw e
  }
}

const getFriendBatch = async (username, cursor) => {
  try {
    let data = await client.get('friends/ids', {
      screen_name: username,
      cursor
    })
    let nextCursor = data.next_cursor
    return { ids: data.ids, nextCursor }
  } catch (e) {
    throw e
  }
}

const getFriendTweets = friendIds => {
  let promises = friendIds.map(async id => {
    let tweets = await getTweets(id.toString())
    if (tweets[0]) return tweets[0]
  })
  return Promise.all(
    promises.map(p =>
      p.catch(e => {
        return e
      })
    )
  )
}

const getTweets = async id => {
  try {
    return client.get('statuses/user_timeline', {
      user_id: id,
      count: 1
    })
  } catch (e) {
    throw e
  }
}
