import { mostActive } from '../../api/dynamodb'
import _ from 'lodash'

export default async (req, res) => {
  try {
    let dbResults = await mostActive()
    let parsed = JSON.parse(dbResults.body)
    let filter = parsed.Items.filter(f => {
      return f.averageTweetsPerDay
    })
    let activeTweeters = _.orderBy(filter, ['averageTweetsPerDay'], ['desc'])
    res.status = 200
    res.json({ active: activeTweeters.slice(0, 20) })
  } catch (e) {
    console.log(e)
  }
}
