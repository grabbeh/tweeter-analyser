import { getRecent } from '../../server/api/dynamodb'

export default async (req, res) => {
  try {
    let results = await getRecent()
    let recentSearches = results.map(r => r.summary)
    res.json({ recentSearches })
  } catch (e) {
    let error = e[0] ? e[0].message : e.message || e
    res.statusCode = 500
    res.json({ errorMessage: error })
  }
}
