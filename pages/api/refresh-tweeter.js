import { tweeter, getUser } from '../../server/api/tweeter'
import { addSummary, findSummary } from '../../server/api/dynamodb'

export default async (req, res) => {
  let { username } = JSON.parse(req.body)
  try {
    let user = await getUser(username)
    let results = await tweeter(username)
    let save = { ...results, ...user }
    let existingSummary = await findSummary(user.id)
    await addSummary(user.id, save)
    res.statusCode = 200
    res.json({ ...results, ...user })
  } catch (e) {
    res.status = 204
    res.json({ error: e })
    console.log(e)
  }
}
