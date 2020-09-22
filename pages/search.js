/** @jsx jsx */
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import GenericUsernameForm from 'components/GenericForm'
import Header from 'components/Header'
import Layout from 'components/Layout'
import { jsx, Box, Flex, Text, Grid } from 'theme-ui'
import ScrollAnimation from 'components/animations/scrollanimation'
import { server } from 'config/index'
import RefreshForm from 'components/RefreshForm'
import Loading from 'components/LoadingSpinner'
import IntroBar from 'components/introBar'
import {
  Summary,
  Toxic,
  Emojis,
  Topics,
  Hashtags,
  Chart,
  Pie,
  Interactions
} from 'components/tweeter/index'
import User from 'components/user'

const MainForm = props => {
  const {
    query: { username }
  } = useRouter()
  let [data, setData] = useState()
  let [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`${server}/get-tweeter-data`, {
        body: JSON.stringify({ username }),
        method: 'POST'
      }).then(r => r.json())
      setData(result)
    }
    if (username) {
      fetchData()
    }
  }, [username])
  return (
    <Layout>
      <Header />
      <Flex sx={{ justifyContent: 'center' }}>
        <Box sx={{ my: 4, mx: 3, width: 600 }}>
        <IntroBar title='Search' subtitle="Get an overview of someone's activity on Twitter"/>
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
                accountCreated={data.accountCreated}
                timeSinceCreation={data.timeSinceCreation}
              />
              <ScrollAnimation>
                <Box sx={{ mt: 2 }}>
                  <Text sx={{ fontSize: [4, 6], fontWeight: 'bold' }}>
                    Overview
                  </Text>
                  <Flex sx={{ fleWrap: 'wrap' }}>
                    <Text
                      sx={{
                        fontSize: 4,
                        color: 'dark-gray'
                      }}
                    >
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
              <Interactions
                retweets={data.likesToRetweet}
                repliesTo={data.likesToReplyTo}
              />

              {data.tweetSplit && <Pie pieData={data.tweetSplit} />}
              <Chart chartData={data.chartData} />
              <Hashtags hashTags={data.hashTags} />
              <Toxic toxic={data.toxicTweets} />
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
