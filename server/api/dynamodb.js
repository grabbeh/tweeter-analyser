import { Tweeter, TweeterTable, TweeterMetadata } from './table.js'
import KSUID from 'ksuid'

const getKSUIDstring = async () => {
  return KSUID.random()
}

const getActive = async () => {
  let active = await TweeterTable.query('#TWEETER', {
    index: 'GSI1',
    reverse: true,
    filters: { attr: 'averageTweetsPerDay', gt: 100 }
  })
  return active.Items
}

const getRecent = async () => {
  let recent = await TweeterTable.query('#TWEETER', {
    index: 'GSI1',
    reverse: true,
    limit: 5
  })
  return recent.Items
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
  let dbContent = {
    id,
    summary,
    averageTweetsPerDay: summary.averageTweetsPerDay
  }

  let newVersion = 'v_0'
  let versionNumber = 0
  if (meta.Item) {
    newVersion = `v_${meta.Item.version + 1}`
    versionNumber = meta.Item.version + 1
  }

  await updateLatest({ ...dbContent, GSI1pk: `#TWEETER`, GSI1sk: ksuid.string })
  await saveNewVersion(dbContent, newVersion)
  await TweeterMetadata.update({
    id,
    sk: '#META',
    version: versionNumber
  })
}

export { addSummary, getLatestSummary, getActive, getRecent }
