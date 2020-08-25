import dotenv from 'dotenv'
import AWS from 'aws-sdk'
dotenv.config({ path: '../../.env' })

AWS.config.update({
  region: 'eu-west-1',
  accessKeyId: '',
  secretAccessKey: ''
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
      AttributeName: 'SK',
      AttributeType: 'S'
    },
    { AttributeName: 'activeTweeterCount', AttributeType: 'S' },
    { AttributeName: 'toxicTweeterCount', AttributeType: 'S' }
  ],
  KeySchema: [
    {
      AttributeName: 'PK',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'SK',
      KeyType: 'RANGE'
    }
  ],
  // create global secondary indexes to a) get toxic/active tweets and b) latest version
  GlobalSecondaryIndexes: [
    {
      IndexName: 'AverageTweetsPerDayIndex',
      KeySchema: [
        { AttributeName: 'activeTweeterCount', KeyType: 'HASH' },
        { AttributeName: 'SK', KeyType: 'RANGE' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    },
    {
      IndexName: 'ToxicityPercentageIndex',
      KeySchema: [
        { AttributeName: 'toxicTweeterCount', KeyType: 'HASH' },
        { AttributeName: 'SK', KeyType: 'RANGE' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: 'TWEETERSv3'
}

// Call DynamoDB to create the table
client.createTable(params, (err, data) => {
  if (err) {
    console.log('Error', err)
  } else {
    console.log('Table Created', data)
  }
})
