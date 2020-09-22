import * as tf from '@tensorflow/tfjs-node'
import * as toxicity from '@tensorflow-models/toxicity'

let model, labels

const classify = async inputs => {
  const results = await model.classify(inputs)
  return inputs.map((d, i) => {
    const obj = { text: d }
    results.forEach(classification => {
      obj[classification.label] = classification.results[i].match
    })
    return obj
  })
}

const convertToxic = (results) => {
  return results.filter(t => {
      return (
        t.toxicityResults ||
        t.identity_attack ||
        t.insult ||
        t.obscene ||
        t.severe_toxicity ||
        t.sexual_explicit ||
        t.threat ||
        t.toxicity
    )
  })
}


const predict = async tweets => {
  let text = tweets.map(f => f.text).flat().slice(0,100)
  model = await toxicity.load()
  labels = model.model.outputNodes.map(d => d.split('/')[0])
  const predictions = await classify(text)
  return convertToxic(predictions)
}

export default predict
