var AWS = require('aws-sdk')

AWS.config.update({
  region: 'eu-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

// for findItem both partition key and sort key have to be provided?
const findItem = async id => {
  const params = {
    TableName: 'TWEETERSv2',
    ExpressionAttributeNames: {
      '#pk': 'PK'
    },
    KeyConditionExpression: '#pk = :pk',
    ExpressionAttributeValues: {
      ':pk': id
    }
  }

  try {
    const data = await docClient.query(params).promise()
    return { statusCode: 200, body: JSON.stringify(data) }
  } catch (error) {
    return {
      statusCode: 400,
      error: `Could not fetch: ${error.stack}`
    }
  }
}

const addItem = async (id, content) => {
  let dbContent = { ...content }
  // TODO: improve conditional keys
  if (content.averageTweetsPerDay >= 100) {
    dbContent = {
      ...dbContent,
      activeTweeterCount: content.averageTweetsPerDay
    }
  }
  if (content.toxicityPercentage >= 5) {
    dbContent = { ...dbContent, toxicTweeterCount: content.toxicityPercentage }
  }
  var params = {
    TableName: 'TWEETERSv2',
    Item: {
      PK: id,
      SUMMARY_CREATED_AT: Date.now(),
      ...dbContent
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
/*
Old way using filter expressions
const mostActive = async () => {
  var params = {
    ExpressionAttributeValues: {
      ':num': 100
    },
    ExpressionAttributeNames: {
      '#a': 'averageTweetsPerDay'
    },
    FilterExpression: '#a > :num',
    TableName: 'TWEETERSv2'
  }
  try {
    let data = await docClient.scan(params).promise()
    return { statusCode: 200, body: JSON.stringify(data) }
  } catch (error) {
    return {
      statusCode: 400,
      error: `Could not fetch: ${error.stack}`
    }
  }
}*/

const mostActive = async () => {
  var params = {
    IndexName: 'AverageTweetsPerDayIndex',
    TableName: 'TWEETERSv2'
  }
  try {
    let data = await docClient.scan(params).promise()
    return { statusCode: 200, body: JSON.stringify(data) }
  } catch (error) {
    return {
      statusCode: 400,
      error: `Could not fetch: ${error.stack}`
    }
  }
}

export { addItem, findItem, mostActive }

// create local secondary index where value of tweets per day is key? Or only put items in with average > 100 and then query all items?
