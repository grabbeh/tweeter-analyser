/** @jsx jsx */
import { useState, useEffect } from 'react'
import Form from 'components/Form'
import Layout from 'components/Layout'
import { jsx, Box, Flex, Image, Text, Link } from 'theme-ui'
import ScrollAnimation from 'components/animations/scrollanimation'
import { server } from 'config/index'
import RefreshForm from 'components/RefreshForm'
import Loading from 'components/LoadingSpinner'
import Summary from 'components/tweeter/summary'
import Toxic from 'components/tweeter/toxic'
import Emojis from 'components/tweeter/emojis'
import Topics from 'components/tweeter/topics'
import Hashtags from 'components/tweeter/hashtags'
import Chart from 'components/tweeter/chart'

const MainForm = props => {
  let { serverData } = props
  let [data, setData] = useState()
  console.log(data)
  let [loading, setLoading] = useState(false)
  useEffect(() => {
    if (serverData) {
      setData(serverData)
    }
  })
  return (
    <Layout>
      <Flex sx={{ justifyContent: 'center' }}>
        <Box sx={{ my: 4, mx: 3, width: 600 }}>
          <Form setLoading={setLoading} setData={setData} />
          {loading && (
            <Flex
              sx={{
                mt: 5,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <Loading />
            </Flex>
          )}
          {!loading && data && (
            <Box sx={{ mt: 3 }}>
              <ScrollAnimation>
                <Flex sx={{ flexWrap: 'wrap' }}>
                  <Box sx={{ mr: 3 }}>
                    <Image
                      sx={{ width: '50px', borderRadius: '999px' }}
                      src={data.profile_image_url_https}
                    />
                  </Box>
                  <Text sx={{ fontSize: [3, 5], fontWeight: 'bold' }}>
                    <Link href={`https://twitter.com/${data.screen_name}`}>
                      @{data.screen_name}
                    </Link>
                  </Text>
                </Flex>
              </ScrollAnimation>
              <ScrollAnimation>
                <Box>
                  <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>Overview</Text>
                  <Flex sx={{ fleWrap: 'wrap' }}>
                    <Text sx={{ fontSize: [3, 5], fontWeight: 'bold' }}>
                      {data.timePeriod}
                    </Text>
                    <Box>
                      {data.refreshAvailable && (
                        <Box>
                          <RefreshForm
                            setLoading={setLoading}
                            setData={setData}
                            username={data.screen_name}
                          />
                        </Box>
                      )}
                    </Box>
                  </Flex>
                  <Summary
                    averageTweetsPerDay={data.averageTweetsPerDay}
                    totalTweets={data.totalTweets}
                  />
                </Box>
              </ScrollAnimation>
              <Chart chartData={data.chartData} />
              <Hashtags hashTags={data.hashTags} />
              <Toxic toxic={data.filteredToxic} />
              <Emojis emojis={data.emojis} />
              <Topics topics={data.topics} />
            </Box>
          )}
        </Box>
      </Flex>
    </Layout>
  )
}

export default MainForm

MainForm.getInitialProps = async props => {
  if (props.query.username) {
    let { username } = props.query
    const res = await fetch(`${server}/get-tweeter-data`, {
      body: JSON.stringify({ username }),
      method: 'POST'
    })
    const data = await res.json()
    return { serverData: data }
  } else return {}
}
