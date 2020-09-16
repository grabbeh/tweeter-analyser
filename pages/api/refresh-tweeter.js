import { tweeter, getUser } from '../../server/api/tweeter'
import { addSummary } from '../../server/api/dynamodb'

export default async (req, res) => {
  let { username } = JSON.parse(req.body)
  try {
    let user = await getUser(username)
    let results = await tweeter(user)
    await addSummary(user.id, { ...results, ...user })
    res.statusCode = 200
    res.json({ ...results, ...user })
  } catch (e) {
    res.status = 204
    res.json({ error: e })
    console.log(e)
  }
}
