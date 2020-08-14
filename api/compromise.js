import nlp from 'compromise'
import sw from 'stopword'
import _ from 'lodash'
nlp.extend(require('compromise-ngrams'))

const process = words => {
  let arrayOfWords = words.join(' ').split(' ')
  let removed = sw.removeStopwords(arrayOfWords).join(', ')

  let basehashTags = nlp(removed)
    .hashTags()
    .json({ normal: true })

  let hashTags = _.uniq(basehashTags.map(d => d.text.replace(/,\s*$/, '')))

  const emojis = nlp(removed)
    .emojis()
    .json({ normal: true })
    .map(d => d.text)

  return { hashTags, emojis }
}

export default process
