import dotenv from 'dotenv'
import AWS from 'aws-sdk'
dotenv.config({ path: '../../.env' })
AWS.config.update({
  region: 'eu-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

const getPeriodicSaves = async () => {
  var params = {
    IndexName: 'PeriodicSaveIndex',
    TableName: 'TWEETERSv3',
    ExpressionAttributeNames: {
      '#pk': 'PK'
    },
    KeyConditionExpression: '#pk = :pk',
    ExpressionAttributeValues: {
      ':pk': 'PERIODICSAVE'
    },
    ScanIndexForward: false
  }
  try {
    let data = await docClient.query(params).promise()
    return { statusCode: 200, body: JSON.stringify(data) }
  } catch (error) {
    return {
      statusCode: 400,
      error: `Could not fetch: ${error.stack}`
    }
  }
}

const findMetadata = async id => {
  const params = {
    TableName: 'TWEETERSv3',
    // give nicknames to the partition and sort keys
    ExpressionAttributeNames: {
      '#pk': 'PK',
      '#sk': 'SK'
    },
    // use nicknames and values for nicknames
    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
    // define values for the actual values of the nicknames
    ExpressionAttributeValues: {
      ':pk': id,
      ':sk': 'meta'
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

const updateMetadta = async () => {}

const findSummary = async id => {
  // sort params to return the latest item
  const params = {
    TableName: 'TWEETERSv3',
    // give nicknames to the partition and sort keys
    ExpressionAttributeNames: {
      '#pk': 'PK',
      '#sk': 'SK'
    },
    // use nicknames and values for nicknames
    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
    // define values for the actual values of the nicknames
    ExpressionAttributeValues: {
      ':pk': id,
      ':sk': 'LATEST'
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

const addPeriodicallySavedUser = async id => {
  let params = {
    TableName: 'TWEETERSv3',
    Item: {
      PK: id,
      SK: `PERIODICSAVE`
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

const addTweets = async tweets => {
  let userId = tweets[0].user.id
  tweets.forEach(async tweet => {
    let params = {
      TableName: 'TWEETERSv3',
      Item: {
        PK: userId,
        SK: `TWEET#${tweet.id}`,
        ...tweet
      }
    }

    try {
      const data = await docClient.put(params).promise()
      return { statusCode: 200, body: JSON.stringify(data) }
    } catch (error) {
      console.log(error)
      return {
        statusCode: 400,
        error: `Could not fetch: ${error.stack}`
      }
    }
  })
}

const addSummary = async (id, content) => {
  // add item but also copy contents into new item beginning with 'latest'
  let metadata = await findMetadata(id)
  let dbContent = { ...content }
  // TODO: improve conditional keys
  // Conditional data attributes to power secondary indexes
  if (content.toxicPercentage > 2) {
    dbContent = { ...dbContent, toxicTweeterCount: 'TOXIC' }
  }
  if (content.averageTweetsPerDay >= 100) {
    dbContent = {
      ...dbContent,
      activeTweeterCount: 'ACTIVE'
    }
  }
  let latestVersion = (metadata.version + 1).toString() || '1'
  console.log(latestVersion)
  let addParams = {
    TableName: 'TWEETERSv3',
    Item: {
      PK: id,
      SK: latestVersion,
      SUMMARY_CREATED_AT: Date.now(),
      ...dbContent
    }
  }
  // replace item with sort key 'latest' with latest item
  let latestParams = {
    TableName: 'TWEETERSv3',
    Item: {
      PK: id,
      SK: 'LATEST',
      SUMMARY_CREATED_AT: Date.now(),
      ...dbContent
    }
  }

  let metaParams = {
    TableName: 'TWEETERSv3',
    Item: {
      PK: id,
      SK: 'meta',
      version: metadata.version + 1 || 1
    }
  }

  try {
    await docClient.put(addParams).promise()
    await docClient.put(metaParams).promise()
    const data = await docClient.put(latestParams).promise()
    return { statusCode: 200, body: JSON.stringify(data) }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 400,
      error: `Could not fetch: ${error.stack}`
    }
  }
}

const mostActive = async () => {
  var params = {
    IndexName: 'AverageTweetsPerDayIndex',
    TableName: 'TWEETERSv3',
    ExpressionAttributeNames: {
      '#pk': 'activeTweeterCount',
      '#sk': 'SK'
    },
    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': 'ACTIVE',
      ':sk': 'LATEST'
    },
    ScanIndexForward: false
  }

  try {
    let data = await docClient.query(params).promise()
    return { statusCode: 200, body: JSON.stringify(data) }
  } catch (error) {
    return {
      statusCode: 400,
      error: `Could not fetch: ${error.stack}`
    }
  }
}

const mostToxic = async () => {
  var params = {
    IndexName: 'ToxicityPercentageIndex',
    TableName: 'TWEETERSv3',
    ExpressionAttributeNames: {
      '#pk': 'toxicTweeterCount',
      '#sk': 'SK'
    },
    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': 'TOXIC',
      ':sk': 'LATEST'
    },
    ScanIndexForward: false
  }
  try {
    let data = await docClient.query(params).promise()
    return { statusCode: 200, body: JSON.stringify(data) }
  } catch (error) {
    return {
      statusCode: 400,
      error: `Could not fetch: ${error.stack}`
    }
  }
}

export {
  addSummary,
  addPeriodicallySavedUser,
  getPeriodicSaves,
  findSummary,
  addTweets,
  mostActive,
  mostToxic
}
