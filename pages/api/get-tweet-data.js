import Twitter from 'twitter'

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_KEY,
  access_token_secret: process.env.ACCESS_SECRET
})

// recursively call for retweets until has all retweets of retweets
export default async (req, res) => {
  console.log(req.body)
  let id = JSON.parse(req.body).id
  try {
    let tweet = await client.get('statuses/show', {
      id,
      count: 200
    })
    let retweets = await client.get('statuses/retweets', {
      id
    })
    //  let earliestTweet = filtered.pop()
    res.statusCode = 200
    res.json({ tweet, retweets })
  } catch (e) {
    console.log(e)
  }
}
