import { tweeter, getUser } from '../../api/tweeter'
import { addItem } from '../../api/dynamodb'

export default async (req, res) => {
  let { username } = JSON.parse(req.body)
  let user = await getUser(username)
  let results = await tweeter(username)
  let response = await addItem(user.id, results)
  // console.log(response)
  res.statusCode = 200
  res.json({ ...results, user })
}