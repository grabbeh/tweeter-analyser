import { getBatch, getUser } from '../../server/api/tweeter'
import { addTweets, addPeriodicallySavedUser } from '../../server/api/dynamodb'

export default async (req, res) => {
  let { username } = JSON.parse(req.body)
  try {
    let user = await getUser(username)
    let tweets = await getBatch(username)
    await addTweets(tweets)
    await addPeriodicallySavedUser(user.id)
    res.statusCode = 200
    res.json({ tweets })
  } catch (e) {
    let error = e[0] ? e[0].message : e.message
    res.statusCode = 500
    res.json({ errorMessage: error })
  }
}
