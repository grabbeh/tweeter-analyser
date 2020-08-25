import { tweeter, getUser } from '../../server/api/tweeter'
import { addItem } from '../../server/api/dynamodb'

export default async (req, res) => {
  let { username } = JSON.parse(req.body)
  try {
    let user = await getUser(username)
    let results = await tweeter(username)
    let save = { ...results, ...user }
    await addItem(user.id, save)
    // console.log(response)
    res.statusCode = 200
    res.json({ ...results, ...user })
  } catch (e) {
    res.status = 204
    res.json({ error: e })
    console.log(e)
  }
}
