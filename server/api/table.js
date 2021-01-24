// Require AWS SDK and instantiate DocumentClient
import { Table, Entity } from 'dynamodb-toolbox'
import dotenv from 'dotenv'
import AWS from 'aws-sdk'
dotenv.config({ path: '../../.env' })
AWS.config.update({
  region: 'eu-west-1',
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET
})

const DocumentClient = new AWS.DynamoDB.DocumentClient()

// Instantiate a table
const TweeterTable = new Table({
  name: 'tweeter-analyser',
  partitionKey: 'pk',
  sortKey: 'sk',
  indexes: {
    GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSI1sk' },
    GSI2: { partitionKey: 'GSI2pk', sortKey: 'GSI2sk' },
    GSI3: { partitionKey: 'GSI3pk', sortKey: 'GSI3sk' }
  },
  DocumentClient
})

const Tweeter = new Entity({
  name: 'Tweeter',
  attributes: {
    id: { partitionKey: true, prefix: '#TWEETER' },
    sk: { sortKey: true },
    summary: { type: 'map' },
    averageTweetsPerDay: { type: 'string' },
    GSI1pk: { type: 'string' },
    GSI1sk: { type: 'string' }
  },
  table: TweeterTable
})

const TweeterMetadata = new Entity({
  name: 'metaData',
  attributes: {
    id: { type: 'string', partitionKey: true, prefix: '#TWEETER' },
    sk: { sortKey: true, type: 'string' },
    version: { type: 'number', default: 0 }
  },
  table: TweeterTable
})

export { Tweeter, TweeterMetadata, TweeterTable }
