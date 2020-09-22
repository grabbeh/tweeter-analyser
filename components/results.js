/** @jsx jsx */
import { jsx, Box, Flex, Text } from 'theme-ui'
import ScrollAnimation from 'components/animations/scrollanimation'
import RefreshForm from 'components/RefreshForm'
import Loading from 'components/LoadingSpinner'
import useFetchData from 'hooks/useFetchData'
import {
  Summary,
  Toxic,
  Emojis,
  Topics,
  Hashtags,
  Chart,
  Pie
} from 'components/tweeter/index'
import User from 'components/user'

const Results = props => {
  console.log(props)
  const [
    { data, isLoading, isError },
    doFetch,
    setValue,
    setData,
    setIsLoading
  ] = useFetchData('/get-tweeter-data', props.username)

  return (
    <Box sx={{ my: 4, mx: 3, width: 600 }}>
      {isLoading && <Loading />}
      {data && (
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
                        setLoading={setIsLoading}
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
          {data.tweetSplit && <Pie pieData={data.tweetSplit} />}
          <Chart chartData={data.chartData} />
          <Hashtags hashTags={data.hashTags} />
          <Toxic toxic={data.filteredToxic} />
          <Emojis emojis={data.emojis} />
          <Topics topics={data.topics} />
        </Box>
      )}
    </Box>
  )
}

export default Results
