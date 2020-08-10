import Twitter from 'twitter'
import axios from 'axios'

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_KEY,
  access_token_secret: process.env.ACCESS_SECRET
})

// recursively call for retweets until has all retweets of retweets
export default async (req, res) => {
  let username = JSON.parse(req.body).username
  try {
    /*let user = await client.get('users/show', {
      screen_name: username
    })*/

    let friendIds = await getAllFriends(username)
    let response = await getFriendTweets(friendIds.slice(0, 10))
    let filtered = response.filter(result => !(result instanceof Error))
    const tweets = filtered.filter(result => !(result instanceof Array))
    // sort by date order
    res.statusCode = 200
    res.json({ tweets, username })
  } catch (e) {
    console.log(e)
  }
}

const getAllFriends = async (username, cursor) => {
  let fragment = await getFriendBatch(username, cursor)
  if (fragment.nextCursor) {
    return fragment.ids.concat(
      await getAllFriends(username, fragment.nextCursor)
    )
  } else {
    return fragment.ids
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
    console.log(e)
  }
}

const getFriendTweets = friendIds => {
  let promises = friendIds.map(async id => {
    let tweets = await getTweets(id)
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
    console.log(e)
  }
}
