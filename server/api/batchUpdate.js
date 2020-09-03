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

const scan = async nextKey => {
  let params = { TableName: 'TWEETERSv3' }
  if (nextKey) params = { ...params, ExclusiveStartKey: nextKey }
  try {
    const data = await docClient.scan(params).promise()
    if (data.LastEvaluatedKey) {
      return data.Items.concat(await scan(data.LastEvaluatedKey))
    } else {
      return data.Items
    }
  } catch (e) {
    console.log(e)
  }
}

const update = async () => {
  let items = await scan()
  items.forEach(async item => {
    let updateParams = {
      TableName: 'TWEETERSv3',
      Item: {
        SUMMARY_CREATED_AT: Date.now(),
        ...item
      }
    }
    await docClient.put(updateParams).promise()
  })
}

update()
