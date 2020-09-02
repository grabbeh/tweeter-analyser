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

var params = {
  TableName: 'TWEETERSv3'
}

docClient.scan(params, (err, data) => {
  if (err) {
    console.log('Error', err)
  } else {
    // console.log("Success", data.Items);
    data.Items.forEach(async (item, index, array) => {
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
})
