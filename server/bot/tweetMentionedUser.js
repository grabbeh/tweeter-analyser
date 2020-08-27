import { getMentions, newTweet } from './tweet.js'
import getAnalysis from './getAnalysis.js'

let testMentions = [
  { text: '@grabbeh I am impressed! @bot_detector_', id_str: '123456789' },
  {
    text: 'this is the one https://t.co/ywUHRHBu47',
    id_str: '770241796844691456',
    user: { screen_name: 'grabbeh' }
  },
  { text: 'This tweet does not contain a URL', id_str: '432423423' },
  { text: 'HELLO WORLD', id_str: '987654321' }
]

const tweetMentionedUser = async () => {
  let mentions = await getMentions()
  checkMentions(mentions)
}

const checkMentions = async mentions => {
  if (mentions.length > 0) {
    for (var i = 0, l = mentions.length; i < l; i++) {
      try {
        await replyToMention(mentions[i])
      } catch (e) {
        console.log(e)
      }
    }
  } else {
    console.log('No mentions')
  }
}

const replyToMention = async mention => {
  let { id_str } = mention
  let summary = await getAnalysis(mention)
  let status = `@${mention.user.screen_name} ${summary}`
  status = status.slice(0, 270)
  let content = { status, in_reply_to_status_id: id_str }
  try {
    await newTweet(content)
    console.log('Tweet posted')
  } catch (e) {
    console.log(e)
  }
}

export default tweetMentionedUser
