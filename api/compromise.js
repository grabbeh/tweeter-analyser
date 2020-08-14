import nlp from 'compromise'
import sw from 'stopword'
nlp.extend(require('compromise-ngrams'))

const process = words => {
  let arrayOfWords = words.join(' ').split(' ')
  let removed = sw.removeStopwords(arrayOfWords).join(', ')

  return (
    nlp(removed)
      //.normalize()
      //.trim()
      //.ngrams({ min: 1 })
      .hashTags()
      .json({ normal: true })
  )
}

export default process
