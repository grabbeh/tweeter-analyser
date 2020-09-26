/** @jsx jsx */
import { jsx, Box, Flex, Grid, Text } from 'theme-ui'
import Rating from '../rating'

const Summary = ({ totalTweets, averageTweetsPerDay, mostActionsPerHour }) => (
  <Grid gap={[3, 4]} sx={{ mt: 3 }} columns={[1, 2, 2]}>
    <Box sx={{ borderRadius: 3, padding: 3, bg: 'blue' }}>
      <Text sx={{ color: 'light-gray', fontSize: 5, fontWeight: 'bold' }}>
        Total tweets, retweets and replies
      </Text>
      <Text sx={{ fontSize: 6, color: 'white', fontWeight: 'bold' }}>
        {totalTweets}
      </Text>
    </Box>
    <Box sx={{ borderRadius: 3, padding: 3, bg: 'blue' }}>
      <Flex sx={{ flexWrap: 'wrap' }}>
        <Text
          sx={{
            width: '80%',
            color: 'light-gray',
            fontSize: 4,
            fontWeight: 'bold'
          }}
        >
          Average actions per day
        </Text>
        <Flex sx={{ width: '20%', justifyContent: 'flex-end' }}>
          <Rating rating={averageTweetsPerDay} />
        </Flex>
      </Flex>
      <Text sx={{ fontSize: 5, color: 'white', fontWeight: 'bold' }}>
        {averageTweetsPerDay}
      </Text>
      <Box sx={{ mt: 2 }}>
        <Flex sx={{ flexWrap: 'wrap' }}>
          <Text
            sx={{
              color: 'light-gray',
              fontSize: 4,
              fontWeight: 'bold'
            }}
          >
            Most actions per hour
          </Text>
        </Flex>
        <Text sx={{ fontSize: 5, color: 'white', fontWeight: 'bold' }}>
          {mostActionsPerHour}
        </Text>
      </Box>
    </Box>
  </Grid>
)

export default Summary
