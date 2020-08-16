var AWS = require('aws-sdk')
AWS.config.update({
  region: 'eu-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

const findItem = async id => {
  const params = {
    TableName: 'TWEETERS',
    Key: {
      PK: id
    }
  }

  try {
    const data = await docClient.get(params).promise()
    return { statusCode: 200, body: JSON.stringify(data) }
  } catch (error) {
    return {
      statusCode: 400,
      error: `Could not fetch: ${error.stack}`
    }
  }
}

// async await needed
const addItem = async (id, content) => {
  var params = {
    TableName: 'TWEETERS',
    Item: {
      PK: id,
      ...content
    }
  }

  try {
    const data = await docClient.put(params).promise()
    return { statusCode: 200, body: JSON.stringify(data) }
  } catch (error) {
    return {
      statusCode: 400,
      error: `Could not fetch: ${error.stack}`
    }
  }
}

export { addItem, findItem }
