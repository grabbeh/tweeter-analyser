import { mostToxic } from '../../api/dynamodb'
import orderBy from 'lodash/orderBy'

export default async (req, res) => {
  try {
    let dbResults = await mostToxic()
    let parsed = JSON.parse(dbResults.body)
    let filter = parsed.Items.filter(f => {
      return f.averageTweetsPerDay
    })
    let toxicTweeters = orderBy(filter, ['toxicPercentage'], ['desc'])
    res.status = 200
    res.json({ toxic: toxicTweeters })
  } catch (e) {
    let error = e[0] ? e[0].message : e.message
    res.statusCode = 500
    res.json({ errorMessage: error })
  }
}
