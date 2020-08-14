import { getSevenDaysTweets, filterSevenDays } from '../api/tweeter'

const getUser = async mention => {
  console.log(mention)
  // something like that
  let parentUsername = mention.in_reply_to_username
  let data = await getSevenDaysTweets(parentUsername)
  let filtered = filterSevenDays(data)
  return filtered
}

export default getUser
