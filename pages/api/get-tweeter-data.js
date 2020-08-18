import { tweeter, getUser } from '../../api/tweeter'
import { addItem, findItem } from '../../api/dynamodb'
import moment from 'moment'

export default async (req, res) => {
  let { username } = JSON.parse(req.body)
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
    let response = await addItem(user.id, save)
    // console.log(response)
    res.statusCode = 200
    res.json({ ...results, ...user })
  }
}

const checkRefresh = createdAt => {
  let dateNow = moment(new Date(), 'x')
  let createdDate = moment(createdAt, 'x')
  let duration = moment.duration(dateNow.diff(createdDate)).hours()
  let refreshAvailable = false
  if (duration > 12) {
    refreshAvailable = true
  }
  return refreshAvailable
}
