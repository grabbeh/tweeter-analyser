import { useState, useEffect } from 'react'
import Form from 'components/Form'
import Layout from 'components/Layout'
import { Grid, Box, Flex, Image, Text, Link } from 'theme-ui'
import { server } from '../config/index'
import { ResponsiveBar } from '@nivo/bar'

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
        <Box sx={{ mt: 4, mx: 3, width: 600 }}>
          <Form setLoading={setLoading} setData={setData} />
          {loading && (
            <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>Loading...</Text>
          )}
          {data && (
            <Box>
              <Text sx={{ fontSize: 7, fontWeight: 'bold' }}>Last 7 days</Text>
              <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>
                <Link href={`https://twitter.com/${data.screenName}`}>
                  @{data.screenName}
                </Link>
              </Text>
              <Box>
                <Image
                  sx={{ width: '150px', borderRadius: '999px' }}
                  src={data.filtered[0].user.profile_image_url_https}
                />
              </Box>

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
              <Box sx={{ height: '800px' }}>
                <ResponsiveBar
                  enableGridY={false}
                  colors='#357edd'
                  data={data.chartData}
                  indexBy='time'
                  margin={{ top: 50, bottom: 50, left: 50 }}
                  padding={0.3}
                  axisTop={null}
                  axisRight={null}
                  layout='horizontal'
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 30,
                    legend: 'times (24 hour clock)',
                    legendPosition: 'middle',
                    legendOffset: -32
                  }}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'tweet volume',
                    legendPosition: 'middle',
                    legendOffset: 40
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor='white'
                  animate
                  motionStiffness={90}
                  motionDamping={15}
                />
              </Box>
              {data.hashTags && (
                <Box>
                  <Text as='p' sx={{ fontSize: 6, fontWeight: 'bold' }}>
                    Hashtags
                  </Text>
                  <Flex sx={{ flexWrap: 'wrap' }}>
                    {data.hashTags.map(f => (
                      <Box sx={{ p: 2, m: 2, bg: 'green' }}>
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
              <Box sx={{ my: 5 }}>
                <Text sx={{ fontSize: 5, fontWeight: 'bold' }}>
                  Toxic tweets
                </Text>
                <Text sx={{ fontSize: 5, fontWeight: 'bold' }}>
                  {(data.toxicityPercentage.length / 100) * 100}%
                </Text>
                <Box>
                  {data.filteredToxic.map(r => {
                    return (
                      <Box sx={{ p: 2, bg: 'red', my: 3 }}>
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
