import { summarise, getUser } from '../../server/api/summarise'
import { addSummary, getLatestSummary } from '../../server/api/dynamodb'
import { differenceInHours } from 'date-fns'

export default async (req, res) => {
	let { username, refresh } = JSON.parse(req.body)
	try {
		let result = await getUser(username)
		let user = result.data
		if (!user) throw new Error('Cannot find user - maybe suspended?')
		let existing = await getLatestSummary(user.id)
		if (Object.keys(existing).length !== 0 && !refresh) {
			res.statusCode = 200
			res.json({
				...existing.Item.summary,
				refreshAvailable: checkRefresh(existing.Item.created)
			})
		} else {
			let results = await summarise(user)
			let full = { ...results, ...user }
			await addSummary(user.id, full)
			res.statusCode = 200
			res.json({ ...full })
		}
	} catch (e) {
		console.log(e)
		let error = e[0] ? e[0].message : e.message || e
		res.statusCode = 500
		res.json({ errorMessage: error })
	}
}

const checkRefresh = (created) => {
	let difference = differenceInHours(new Date(), new Date(created))
	return difference > 12 ? true : false
}
