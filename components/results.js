/** @jsxRuntime classic /
/** @jsx jsx */
import { jsx, Box, Flex, Text } from 'theme-ui'
import ScrollAnimation from 'components/animations/scrollanimation'
import RefreshForm from 'components/refreshForm'
import {
  Summary,
  // Toxic,
  //  Emojis,
  //  Topics,
  Hashtags,
  Chart,
  Pie,
  Urls,
  Media,
  Interactions
} from 'components/tweeter/'
import User from 'components/user'

const Results = ({ data, doFetch, error }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <User
        screenName={data.screen_name}
        profileImage={data.profile_image_url_https}
        accountCreated={data.accountCreated}
        timeSinceCreation={data.timeSinceCreation}
      />
      <ScrollAnimation>
        <Box sx={{ mt: 2 }}>
          <Text as='h2'>Overview</Text>
          <Flex sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ width: ['100%', '75%'] }}>
              <Text as='p'>{data.timePeriod}</Text>
            </Box>
            <Box sx={{ width: ['100%', '25%'] }}>
              {data.refreshAvailable && (
                <Box>
                  <RefreshForm
                    error={error}
                    doFetch={doFetch}
                    username={data.screen_name}
                  />
                </Box>
              )}
            </Box>
          </Flex>
          <Summary
            averageTweetsPerDay={data.averageTweetsPerDay}
            totalTweets={data.totalTweets}
            mostActionsPerHour={data.mostTweetsPerHour}
            mostActiveDay={data.mostActiveDay}
            longestStreak={data.longestStreak}
          />
        </Box>
      </ScrollAnimation>
      <Interactions
        screenname={data.screen_name}
        retweets={data.likesToRetweet}
        repliesTo={data.likesToReplyTo}
      />
      {data.tweetSplit && <Pie pieData={data.tweetSplit} />}
      <Chart chartData={data.chartData} />
      <Hashtags hashTags={data.hashTags} />
      <Urls urls={data.urls} />
      <Media media={data.media} />
    </Box>
  )
}
export default Results

/*

    <Box sx={{ mt: 4 }}>
      <Toxic toxic={data.toxicTweets} />
    </Box>
    <Emojis emojis={data.emojis} />
    <Topics topics={data.topics} />
*/
