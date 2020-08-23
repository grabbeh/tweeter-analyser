require('dotenv').config()
var AWS = require('aws-sdk')

AWS.config.update({
  region: 'eu-west-1',
  accessKeyId: 'AKIAXD4TJVYNID4ABSGT',
  secretAccessKey: '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'
})

// Create the DynamoDB service object
var client = new AWS.DynamoDB({ apiVersion: '2012-08-10' })
var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })
var params = {
  AttributeDefinitions: [
    {
      AttributeName: 'PK',
      AttributeType: 'N'
    },
    {
      AttributeName: 'SUMMARY_CREATED_AT',
      AttributeType: 'N'
    },
    { AttributeName: 'activeTweeterCount', AttributeType: 'N' },
    { AttributeName: 'toxicTweeterCount', AttributeType: 'N' }
  ],
  KeySchema: [
    {
      AttributeName: 'PK',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'SUMMARY_CREATED_AT',
      KeyType: 'RANGE'
    }
  ],
  LocalSecondaryIndexes: [
    {
      IndexName: 'AverageTweetsPerDayIndex',
      KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' },
        { AttributeName: 'activeTweeterCount', KeyType: 'RANGE' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      }
    },
    {
      IndexName: 'ToxicityPercentageIndex',
      KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' },
        { AttributeName: 'toxicTweeterCount', KeyType: 'RANGE' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      }
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: 'TWEETERSv2'
}

// Call DynamoDB to create the table
client.createTable(params, (err, data) => {
  if (err) {
    console.log('Error', err)
  } else {
    console.log('Table Created', data)
  }
})
