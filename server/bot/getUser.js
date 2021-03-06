import { getSevenDaysTweets, filterSevenDays } from '../api/summarise.js'

const getUser = async mention => {
  let parentUsername = mention.in_reply_to_screen_name
  let data = await getSevenDaysTweets(parentUsername)
  let filtered = filterSevenDays(data)
  return { filtered, parentUsername }
}

export default getUser
