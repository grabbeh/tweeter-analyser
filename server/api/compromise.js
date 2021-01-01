import nlp from 'compromise'
import sw from 'stopword'
import uniq from 'lodash/uniq.js'
import ngrams from 'compromise-ngrams'
nlp.extend(ngrams)

const process = fullTweets => {
  // compromise seems to jam with excessive text
  let tweets = fullTweets
  if (fullTweets.length > 3000) {
    tweets = fullTweets.slice(0, fullTweets.length / 2)
  }
  let words = tweets.map(f => f.text).flat()
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

  return { hashTags, emojis, topics }
}

export default process
