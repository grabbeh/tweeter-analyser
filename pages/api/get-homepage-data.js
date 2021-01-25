import { getRecent, getActive } from '../../server/api/dynamodb'
import orderBy from 'lodash/orderBy'

export default async (req, res) => {
  try {
    let recentSearches = await getRecent()
    let activeResults = await getActive(10)
    let active = orderBy(activeResults, ['averageTweetsPerDay'], ['desc'])
    res.json({ recentSearches, active })
  } catch (e) {
    let error = e[0] ? e[0].message : e.message || e
    res.statusCode = 500
    res.json({ errorMessage: error })
  }
}
