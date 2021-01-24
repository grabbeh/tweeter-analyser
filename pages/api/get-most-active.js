import { getActive } from '../../server/api/dynamodb'
import orderBy from 'lodash/orderBy'

export default async (req, res) => {
  try {
    let summaries = await getActive()
    let activeTweeters = orderBy(summaries, ['averageTweetsPerDay'], ['desc'])
    res.status = 200
    res.json({ active: activeTweeters })
  } catch (e) {
    let error = e[0] ? e[0].message : e.message
    res.statusCode = 500
    res.json({ errorMessage: error })
  }
}
