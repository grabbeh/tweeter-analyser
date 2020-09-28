import { tweeter, getUser } from '../../server/api/tweeter'
import { addSummary, findSummary } from '../../server/api/dynamodb'
import { differenceInHours, fromUnixTime } from 'date-fns'

export default async (req, res) => {
  let { username } = JSON.parse(req.body)
  try {
    let user = await getUser(username)
    let existingResults = await findSummary(user.id)
    let o = JSON.parse(existingResults.body)
    if (o && o.Items.length > 0) {
      const item = o.Items[0]
      res.statusCode = 200
      res.json({
        ...item,
        refreshAvailable: checkRefresh(item.SUMMARY_CREATED_AT)
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
    let error = e[0] ? e[0].message : e.message
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
