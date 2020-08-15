//require('@tensorflow/tfjs-node')
//import * as tf from '@tensorflow/tfjs-core'
// Adds the CPU backend to the global backend registry.
import '@tensorflow/tfjs-backend-cpu'

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

const predict = async tweets => {
  model = await toxicity.load()
  labels = model.model.outputNodes.map(d => d.split('/')[0])
  const predictions = await classify(tweets)
  return predictions
}

export default predict
