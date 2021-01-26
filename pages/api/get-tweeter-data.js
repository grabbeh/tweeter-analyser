import { tweeter, getUser } from '../../server/api/tweeter'
import { addSummary, getLatestSummary } from '../../server/api/dynamodb'
import { differenceInHours } from 'date-fns'

export default async (req, res) => {
  let { username, refresh } = JSON.parse(req.body)
  try {
    let user = await getUser(username)
    let existing = await getLatestSummary(user.id)
    if (Object.keys(existing).length !== 0 && !refresh) {
      res.statusCode = 200
      res.json({
        ...existing.Item.summary,
        refreshAvailable: checkRefresh(existing.Item.created)
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

const checkRefresh = created => {
  let difference = differenceInHours(new Date(), new Date(created))
  return difference > 12 ? true : false
}
