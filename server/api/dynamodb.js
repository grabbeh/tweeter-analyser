import { Tweeter, TweeterTable, TweeterMetadata } from './table.js'
import KSUID from 'ksuid'

const getKSUIDstring = async () => {
  return KSUID.random()
}

const getToxic = async () => {
  return 'Hello world'
}

const getActive = async amount => {
  let options = { index: 'GSI2' }
  if (amount) options = { ...options, limit: amount }
  let active = await TweeterTable.query('#ACTIVE', options)
  return active.Items.map(i => {
    return i.summary
  })
}

const getRecent = async () => {
  let recent = await TweeterTable.query('#TWEETER', {
    index: 'GSI1',
    reverse: true,
    limit: 10
  })
  return recent.Items.map(i => {
    return i.summary
  })
}

const updateLatest = async content => {
  return Tweeter.update({ ...content, sk: '#LATEST' })
}

const saveNewVersion = async (content, sk) => {
  return Tweeter.put({ ...content, sk })
}

const getMetadata = async id => {
  return TweeterMetadata.get({ id, sk: '#META' })
}

const getLatestSummary = async id => {
  return Tweeter.get({ id, sk: '#LATEST' })
}

const addSummary = async (id, summary) => {
  let meta = await getMetadata(id)
  let ksuid = await getKSUIDstring()
  let { averageTweetsPerDay } = summary

  let dbContent = {
    id,
    summary,
    averageTweetsPerDay
  }

  let newVersion = 'v_0'
  let versionNumber = 0
  if (meta.Item) {
    newVersion = `v_${meta.Item.version + 1}`
    versionNumber = meta.Item.version + 1
  }

  await updateLatest({
    ...dbContent,
    GSI1pk: `#TWEETER`,
    GSI1sk: ksuid.string,
    GSI2pk: '#ACTIVE',
    GSI2sk: averageTweetsPerDay
  })
  await saveNewVersion(dbContent, newVersion)
  await TweeterMetadata.update({
    id,
    sk: '#META',
    version: versionNumber
  })
}

export { addSummary, getToxic, getLatestSummary, getActive, getRecent }
