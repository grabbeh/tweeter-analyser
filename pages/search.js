/** @jsx jsx */
import { useState, useEffect } from 'react'
import GenericUsernameForm from 'components/GenericForm'
import Header from 'components/Header'
import Layout from 'components/Layout'
import { jsx, Box, Flex, Text } from 'theme-ui'
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
import Pie from 'components/tweeter/pie'
import User from 'components/user'

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
      <Header />
      <Flex sx={{ justifyContent: 'center' }}>
        <Box sx={{ my: 4, mx: 3, width: 600 }}>
          <GenericUsernameForm
            dataUrl='/get-tweeter-data'
            callbackUrl='/search'
            setLoading={setLoading}
            setData={setData}
          />
          {loading && <Loading />}
          {!loading && data && (
            <Box sx={{ mt: 3 }}>
              <User
                screenName={data.screen_name}
                profileImage={data.profile_image_url_https}
              />
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
              <Pie pieData={data.tweetSplit} />
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
