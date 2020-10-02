import { useState, useEffect } from 'react'
import Form from 'components/TweetForm'
import Layout from 'components/Layout'
import { Grid, Box, Flex, Text } from 'theme-ui'

const TweetPage = props => {
  let { serverData } = props
  let [data, setData] = useState()
  let [loading, setLoading] = useState(false)

  useEffect(() => {
    if (serverData) {
      setData(serverData)
    }
  })
  return (
    <Layout>
      <Flex sx={{ justifyContent: 'center' }}>
        <Box sx={{ mt: 4, mx: 3, width: 600 }}>
          <Form setLoading={setLoading} setData={setData} />
          {loading && (
            <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>Loading...</Text>
          )}
          {data && (
            <Box>
              <Text sx={{ fontSize: 7, fontWeight: 'bold' }}>Tweet</Text>
              <Box sx={{ bg: 'light-yellow', p: 3 }}>
                <Text sx={{ fontSize: 5, fontWeight: 'bold' }}>
                  {data.tweet.text}
                </Text>
              </Box>
              <Grid gap={[3, 4]} sx={{ mt: 4 }} columns={[1, 2, 2]}></Grid>
              <Box sx={{ overflow: 'scroll', mb: 5, p: 4, bg: 'light-gray' }}>
                <pre>{JSON.stringify(data.tweet, null, 2)}</pre>
              </Box>
              <Box sx={{ overflow: 'scroll', p: 4, bg: 'light-gray' }}>
                <pre>{JSON.stringify(data.retweets, null, 2)}</pre>
              </Box>
            </Box>
          )}
        </Box>
      </Flex>
    </Layout>
  )
}

export default TweetPage
