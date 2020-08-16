require('dotenv').config()
const Twitter = require('twitter')
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_KEY,
  access_token_secret: process.env.ACCESS_SECRET
})
console.log(client)
const newTweet = async content => {
  try {
    let result = await client.post('statuses/update', content)
  } catch (e) {
    console.log(e)
  }
}

newTweet('Hello world')
/*
AWS_ACCESS_KEY_ID='AKIAXD4TJVYNGQ6Q2QGE'
AWS_SECRET_ACCESS_KEY='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'
CONSUMER_KEY='KOPxtdx23tfRE7ObGwKCtYQmz'
CONSUMER_SECRET='GgkgCSlBbQJhQx6NetfzSUmBeDQxHjtGKrWgpoWu4eXL5vXeUr'
ACCESS_KEY='1285676634515832832-UkdOCVIR7f0v24zOMf299xNSHLFJFp'
ACCESS_SECRET='9uJcIp6JIlZAQvc679SXBBkOPn3gGPrIhiCxPsuYbWN42'*/
