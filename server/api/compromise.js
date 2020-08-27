import nlp from 'compromise'
import sw from 'stopword'
import uniq from 'lodash/uniq.js'
import ngrams from 'compromise-ngrams'
nlp.extend(ngrams)

const process = words => {
  let arrayOfWords = words.join(' ').split(' ')
  let removed = sw.removeStopwords(arrayOfWords).join(', ')

  let basehashTags = nlp(removed)
    .normalize()
    .hashTags()
    .json({ normal: true })

  let hashTags = uniq(basehashTags.map(d => d.text.replace(/,\s*$/, '')))

  const emojis = nlp(removed)
    .emojis()
    .json({ normal: true })
    .map(d => d.text.replace(/,\s*$/, ''))

  let baseTopics = nlp(removed)
    .topics()
    .json({ normal: true })
    .map(d => d.text)

  let topics = nlp(baseTopics)
    .ngrams()
    .filter(n => n.count > 2)
    .map(n => n.normal)

  //let topics = uniq(baseTopics.map(d => d.replace(/,\s*$/, '')))

  return { hashTags, emojis, topics }
}

export default process
