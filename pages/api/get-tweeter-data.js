import { tweeter, getUser } from '../../server/api/tweeter'
import { addSummary, findSummary } from '../../server/api/dynamodb'
import moment from 'moment'

export default async (req, res) => {
  let { username } = JSON.parse(req.body)
  console.log(username)
  try {
    let user = await getUser(username)
    let existingResults = await findSummary(user.id)
    let o = JSON.parse(existingResults.body)
    if (o && o.Items.length > 0) {
      const item = o.Items[0]
      const refreshAvailable = checkRefresh(item.SUMMARY_CREATED_AT)
      res.statusCode = 200
      res.json({ ...item, refreshAvailable })
    } else {
      let results = await tweeter(username)
      let save = { ...results, ...user }
      await addSummary(user.id, save)
      res.statusCode = 200
      res.json({ ...results, ...user })
    }
  } catch (e) {
    let error = e[0] ? e[0].message : e.message
    res.statusCode = 500
    res.json({ errorMessage: error })
  }
}

const checkRefresh = createdAt => {
  let d = new Date()
  let dateNow = moment(d)
  let created = moment(createdAt, 'x')
  let difference = dateNow.diff(created, 'hours')
  let refreshAvailable = false
  if (difference > 12) {
    refreshAvailable = true
  }
  return refreshAvailable
}
