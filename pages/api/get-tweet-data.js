import Twitter from 'twitter'

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_KEY,
  access_token_secret: process.env.ACCESS_SECRET
})

export default async (req, res) => {
  console.log(req.body)
  let id = JSON.parse(req.body).id
  try {
    let data = await client.get('statuses/show', {
      id,
      count: 200
    })
    //  let earliestTweet = filtered.pop()
    res.statusCode = 200
    res.json({ data })
  } catch (e) {
    console.log(e)
  }
}
