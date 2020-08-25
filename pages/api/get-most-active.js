import { mostActive } from '../../server/api/dynamodb'
import orderBy from 'lodash/orderBy'

export default async (req, res) => {
  try {
    let dbResults = await mostActive()
    let parsed = JSON.parse(dbResults.body)
    let activeTweeters = orderBy(
      parsed.Items,
      ['averageTweetsPerDay'],
      ['desc']
    )
    res.status = 200
    res.json({ active: activeTweeters })
  } catch (e) {
    let error = e[0] ? e[0].message : e.message
    res.statusCode = 500
    res.json({ errorMessage: error })
  }
}
