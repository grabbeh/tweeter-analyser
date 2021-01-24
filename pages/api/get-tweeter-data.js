import { tweeter, getUser } from '../../server/api/tweeter'
import { addSummary, getLatestSummary } from '../../server/api/dynamodb'
import { differenceInHours, fromUnixTime } from 'date-fns'

export default async (req, res) => {
  let { username, refresh } = JSON.parse(req.body)
  try {
    let user = await getUser(username)
    let existing = await getLatestSummary(user.id)
    if (Object.keys(existing).length !== 0 && !refresh) {
      res.statusCode = 200
      res.json({
        ...existing.Item.summary,
        refreshAvailable: checkRefresh(existing.created)
      })
    } else {
      let results = await tweeter(user)
      let full = { ...results, ...user }
      await addSummary(user.id, full)
      res.statusCode = 200
      res.json({ ...full })
    }
  } catch (e) {
    console.log(e)
    let error = e[0] ? e[0].message : e.message || e
    res.statusCode = 500
    res.json({ errorMessage: error })
  }
}

const checkRefresh = createdAt => {
  let created = fromUnixTime(createdAt / 1000)
  let now = new Date()
  let difference = differenceInHours(now, created)
  let refreshAvailable = false
  if (difference > 12) {
    refreshAvailable = true
  }
  return refreshAvailable
}
