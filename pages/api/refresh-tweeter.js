import { tweeter, getUser } from '../../api/tweeter'
import { addItem } from '../../api/dynamodb'

export default async (req, res) => {
  let { username } = JSON.parse(req.body)
  let user = await getUser(username)
  let results = await tweeter(username)
  let save = { ...results, ...user }
  let response = await addItem(user.id, save)
  // console.log(response)
  res.statusCode = 200
  res.json({ ...results, user })
}
