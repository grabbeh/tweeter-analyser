import { tweeter, getUser } from '../../api/tweeter'
import { addItem, findItem } from '../../api/dynamodb'

export default async (req, res) => {
  let username = JSON.parse(req.body).username
  let user = await getUser(username)
  let existingResults = await findItem(user.id)
  if (existingResults) {
    res.statusCode = 200
    res.json(existingResults.body)
  } else {
    let results = await tweeter(username)
    let response = await addItem(user.id, results)
    res.statusCode = 200
    res.json({
      ...results
    })
  }
}
