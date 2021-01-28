import Twitter from 'twitter'
import {
  getUser,
  accountCreated,
  timeSinceCreation
} from '../../server/api/summarise'
import { format } from 'date-fns'
import sortBy from 'lodash/fp/sortBy'
import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import filter from 'lodash/fp/filter'
import flatten from 'lodash/fp/flatten'
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_KEY,
  access_token_secret: process.env.ACCESS_SECRET
})
const fullMap = map.convert({ cap: false })

const iter = (value, i) => console.log(value, i)

// recursively call for retweets until has all retweets of retweets
export default async (req, res) => {
  let username = JSON.parse(req.body).username
  let user = await getUser(username)
  user = {
    ...user,
    accountCreated: accountCreated(user.created_at),
    timeSinceCreation: timeSinceCreation(user.created_at)
  }
  try {
    let friendIds = await getAllFollowers(user.id)
    let response = await getUsers(friendIds)

    let followers = flow(
      flatten,
      filter(r => !(r instanceof Error)),
      sortBy(o => new Date(o.created_at)),
      fullMap((o, i) => {
        return {
          x: i + 1,
          y: format(new Date(o.created_at), 'yyyy-MM-dd')
        }
      })
    )(response)
    res.statusCode = 200
    res.json({ user, graphData: [{ data: followers, id: 'Followers' }] })
  } catch (e) {
    let error = e[0] ? e[0].message : e.message
    res.statusCode = 500
    res.json({ errorMessage: error })
  }
}

const getAllFollowers = async (id, cursor) => {
  let fragment = await getFollowersBatch(id, cursor)
  if (fragment.nextCursor) {
    return fragment.ids.concat(await getAllFollowers(id, fragment.nextCursor))
  } else {
    return fragment.ids
  }
}

const getFollowersBatch = async (id, cursor) => {
  try {
    let data = await client.get('followers/ids', {
      user_id: id,
      cursor
    })
    let nextCursor = data.next_cursor
    return { ids: data.ids, nextCursor }
  } catch (e) {
    throw e
  }
}

const getUsers = followersIds => {
  let chunks = arrayChunks(followersIds, 100)
  let promises = chunks.map(async chunk => {
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
