import Twitter from 'twitter'
import { getUser } from '../../server/api/tweeter'
import { format } from 'date-fns'
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_KEY,
  access_token_secret: process.env.ACCESS_SECRET
})

// recursively call for retweets until has all retweets of retweets
export default async (req, res) => {
  let username = JSON.parse(req.body).username
  let user = await getUser(username)
  try {
    let friendIds = await getAllFollowers(username)
    let response = await getUsers(friendIds)
    let filtered = response.flat().filter(result => !(result instanceof Error))
    let justUnixDate = filtered
      .map(f => format(new Date(f.created_at), 'x'))
      .sort((a, b) => a - b)

    const followers = justUnixDate.map((f, i) => {
      return {
        x: i + 1,
        y: format(new Date(f), 'yyyy-MM-dd')
      }
    })
    res.statusCode = 200
    res.json({ user, graphData: [{ data: followers, id: 'Followers' }] })
  } catch (e) {
    console.log(e)
    let error = e[0] ? e[0].message : e.message
    res.statusCode = 500
    res.json({ errorMessage: error })
  }
}

const getAllFollowers = async (username, cursor) => {
  let fragment = await getFollowersBatch(username, cursor)
  if (fragment.nextCursor) {
    return fragment.ids.concat(
      await getAllFollowers(username, fragment.nextCursor)
    )
  } else {
    return fragment.ids
  }
}

const getFollowersBatch = async (username, cursor) => {
  try {
    let data = await client.get('followers/ids', {
      screen_name: username,
      cursor
    })
    let nextCursor = data.next_cursor
    return { ids: data.ids, nextCursor }
  } catch (e) {
    throw e
    //console.log(e)
  }
}

const getUsers = followersIds => {
  //let ids = followersIds.slice(0, 150)
  let chunks = arrayChunks(followersIds, 100)
  let promises = chunks.map(async chunk => {
    // slice into 100 segments
    let user = await getFollowerData(chunk)
    return user
  })
  return Promise.all(
    promises.map(p =>
      p.catch(e => {
        return e
      })
    )
  )
}

const getFollowerData = async id => {
  try {
    return client.get('users/lookup', {
      user_id: id.toString()
    })
  } catch (e) {
    throw e
  }
}

const arrayChunks = (array, chunkSize) =>
  Array(Math.ceil(array.length / chunkSize))
    .fill()
    .map((_, index) => index * chunkSize)
    .map(begin => array.slice(begin, begin + chunkSize))
