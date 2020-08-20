/** @jsx jsx */
import { useState, useEffect } from 'react'
import Form from 'components/Form'
import Layout from 'components/Layout'
import { jsx, Box, Flex, Image, Text, Link } from 'theme-ui'
import ScrollAnimation from 'components/animations/scrollanimation'
import { server } from 'config/index'
import { ResponsiveBar } from '@nivo/bar'
import RefreshForm from 'components/RefreshForm'
import Loading from 'components/LoadingSpinner'
import Summary from 'components/tweeter/summary'
import Toxic from 'components/tweeter/toxic'
import Emojis from 'components/tweeter/emojis'
import Topics from 'components/tweeter/topics'
import Hashtags from 'components/tweeter/hashtags'

const theme = {
  axis: {
    textColor: 'red',
    fontSize: '30px',
    fontFamily: 'Georgia',
    tickColor: 'red'
  }
}
const MainForm = props => {
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
          {data && (
            <Box>
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
              <ScrollAnimation>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '30px',
                    bg: 'light-gray',
                    mt: 4,
                    height: '900px'
                  }}
                >
                  <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>Hours</Text>
                  <ResponsiveBar
                    theme={theme}
                    enableGridY={false}
                    colors='#357edd'
                    data={data.chartData}
                    indexBy='time'
                    margin={{ top: 20, bottom: 150, left: 65 }}
                    padding={0.3}
                    axisTop={null}
                    axisRight={null}
                    layout='horizontal'
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 20,
                      tickRotation: 30,
                      legend: 'times (24 hour clock)',
                      legendPosition: 'middle',
                      legendOffset: -50
                    }}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 20,
                      tickRotation: 0,
                      legend: 'tweet volume',
                      legendPosition: 'middle',
                      legendOffset: 50
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor='white'
                  />
                </Box>
              </ScrollAnimation>
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
