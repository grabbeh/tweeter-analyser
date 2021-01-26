import { getActive } from '../../server/api/dynamodb'

export default async (req, res) => {
  try {
    let active = await getActive()
    res.status = 200
    res.json({ active })
  } catch (e) {
    let error = e[0] ? e[0].message : e.message
    res.statusCode = 500
    res.json({ errorMessage: error })
  }
}
