import { useState, useEffect } from 'react'
import Form from 'components/Form'
import Layout from 'components/Layout'
import { Grid, Box, Flex, Image, Text, Link } from 'theme-ui'
import ScrollAnimation from 'components/animations/scrollanimation'
import { server } from 'config/index'
import { ResponsiveBar } from '@nivo/bar'
import RefreshForm from 'components/RefreshForm'
import Loading from 'components/LoadingSpinner'

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
        <Box sx={{ mt: 4, mx: 3, width: 600 }}>
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
                      src={data.user.profile_image_url_https}
                    />
                  </Box>
                  <Text sx={{ fontSize: [3, 5], fontWeight: 'bold' }}>
                    <Link href={`https://twitter.com/${data.screenName}`}>
                      @{data.user.screen_name}
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
                            username={data.user.screen_name}
                          />
                        </Box>
                      )}
                    </Box>
                  </Flex>

                  <Grid gap={[3, 4]} sx={{ mt: 3 }} columns={[1, 2, 2]}>
                    <Box sx={{ borderRadius: 3, padding: 3, bg: 'blue' }}>
                      <Text
                        sx={{ color: 'white', fontSize: 4, fontWeight: 'bold' }}
                      >
                        Total tweets, likes, retweets
                      </Text>
                      <Text
                        sx={{ fontSize: 6, color: 'white', fontWeight: 'bold' }}
                      >
                        {data.totalTweets}
                      </Text>
                    </Box>
                    <Box sx={{ borderRadius: 3, padding: 3, bg: 'blue' }}>
                      <Text
                        sx={{ color: 'white', fontSize: 4, fontWeight: 'bold' }}
                      >
                        Actions per day{' '}
                      </Text>
                      <Text
                        sx={{ fontSize: 6, color: 'white', fontWeight: 'bold' }}
                      >
                        {data.averageTweetsPerDay}
                      </Text>
                    </Box>
                  </Grid>
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
                  <Text as='p' sx={{ fontSize: 6, fontWeight: 'bold' }}>
                    Hours
                  </Text>
                  <ResponsiveBar
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
              <ScrollAnimation>
                {data.hashTags.length > 0 && (
                  <Box
                    sx={{
                      mt: 4,
                      borderRadius: '20px',
                      bg: 'light-green',
                      p: 3
                    }}
                  >
                    <Text as='p' sx={{ fontSize: 6, fontWeight: 'bold' }}>
                      Hashtags
                    </Text>
                    <Flex sx={{ flexWrap: 'wrap' }}>
                      {data.hashTags.map(f => (
                        <Box
                          sx={{
                            borderRadius: '10px',
                            p: 2,
                            mr: 3,
                            my: 2,
                            bg: 'green'
                          }}
                        >
                          <Text
                            sx={{
                              fontSize: 4,
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            {f}
                          </Text>
                        </Box>
                      ))}
                    </Flex>
                  </Box>
                )}
              </ScrollAnimation>
              <ScrollAnimation>
                <Box sx={{ mt: 4 }}>
                  {data.filteredToxic.length > 0 && (
                    <Box sx={{ borderRadius: '20px', bg: 'light-red', p: 3 }}>
                      <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>
                        Toxic tweets -{' '}
                        {Math.round((data.filteredToxic.length / 100) * 100)}%
                      </Text>

                      <Box>
                        {data.filteredToxic.map(r => {
                          return (
                            <Box
                              sx={{
                                borderRadius: '10px',
                                p: 2,
                                bg: 'red',
                                my: 3
                              }}
                            >
                              <Text
                                sx={{
                                  fontSize: 4,
                                  fontWeight: 'bold',
                                  color: 'white'
                                }}
                              >
                                {r.text}
                              </Text>
                            </Box>
                          )
                        })}
                      </Box>
                    </Box>
                  )}
                </Box>
              </ScrollAnimation>
              <ScrollAnimation>
                <Box sx={{ my: 4 }}>
                  {data.emojis.length > 0 && (
                    <Box
                      sx={{ borderRadius: '20px', bg: 'light-yellow', p: 3 }}
                    >
                      <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>
                        Emojis
                      </Text>

                      <Flex sx={{ flexWrap: 'wrap' }}>
                        {data.emojis.map(emoji => {
                          return (
                            <Box>
                              <Text
                                sx={{
                                  fontSize: 4,
                                  fontWeight: 'bold'
                                }}
                              >
                                {emoji}
                              </Text>
                            </Box>
                          )
                        })}
                      </Flex>
                    </Box>
                  )}
                </Box>
              </ScrollAnimation>
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
