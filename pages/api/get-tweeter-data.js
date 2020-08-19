import { tweeter, getUser } from '../../api/tweeter'
import { addItem, findItem } from '../../api/dynamodb'
import moment from 'moment'

export default async (req, res) => {
  let { username } = JSON.parse(req.body)
  try {
    let user = await getUser(username)
    let existingResults = await findItem(user.id)
    if (existingResults && existingResults.body !== '{}') {
      let o = JSON.parse(existingResults.body)
      let refreshAvailable = checkRefresh(o.Item.createdAt)
      res.statusCode = 200
      res.json({ ...o.Item, refreshAvailable })
    } else {
      let results = await tweeter(username)
      let save = { ...results, ...user }
      await addItem(user.id, save)
      res.statusCode = 200
      res.json({ ...results, ...user })
    }
  } catch (e) {
    let error = e[0] ? e[0].message : e.message
    console.log(error)
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
