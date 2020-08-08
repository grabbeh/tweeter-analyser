import { useState } from 'react'
import Form from 'components/Form'
import Layout from 'components/Layout'
import { Grid, Box, Flex, Text } from '@theme-ui/components'

const MainForm = () => {
  let [data, setData] = useState()
  let [loading, setLoading] = useState(false)
  console.log(data)
  return (
    <Layout>
      <Flex sx={{ justifyContent: 'center' }}>
        <Box sx={{ mt: 4, mx: 3, width: 600 }}>
          <Form setLoading={setLoading} setData={setData} />
          {loading && <div>Loading...</div>}
          {data && (
            <Box>
              <Text sx={{ fontSize: 7, fontWeight: 'bold' }}>Last 7 days</Text>
              <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>
                {data.filtered[0].user.screen_name}
              </Text>

              <Grid gap={[3, 4]} sx={{ mt: 4 }} columns={[1, 2, 2]}>
                <Box sx={{ borderRadius: 3, padding: 3, bg: 'blue' }}>
                  <Text>Total tweets, likes, retweets</Text>
                  <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>
                    {data.totalTweets}
                  </Text>
                </Box>
                <Box sx={{ borderRadius: 3, padding: 3, bg: 'blue' }}>
                  <Text>Actions per day </Text>
                  <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>
                    {data.averageTweetsPerDay}
                  </Text>
                </Box>
              </Grid>
            </Box>
          )}
        </Box>
      </Flex>
    </Layout>
  )
}

export default MainForm
