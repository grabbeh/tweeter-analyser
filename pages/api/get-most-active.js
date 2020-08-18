import { mostActive } from '../../api/dynamodb'
import _ from 'lodash'

export default async (req, res) => {
  try {
    let dbResults = await mostActive()
    let parsed = JSON.parse(dbResults.body)
    let activeTweeters = _.orderBy(
      parsed.Items,
      ['averageTweetsPerDay'],
      ['desc']
    )
    res.status = 200
    res.json({ active: activeTweeters.slice(0, 10) })
  } catch (e) {
    console.log(e)
  }
}
