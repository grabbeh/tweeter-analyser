/** @jsx jsx */

import { jsx, Box, Flex, Grid, Text } from 'theme-ui'
import Rating from '../Rating'

const Summary = ({ totalTweets, averageTweetsPerDay }) => (
  <Grid gap={[3, 4]} sx={{ mt: 3 }} columns={[1, 2, 2]}>
    <Box sx={{ borderRadius: 3, padding: 3, bg: 'blue' }}>
      <Text sx={{ color: 'white', fontSize: 4, fontWeight: 'bold' }}>
        Total tweets, likes, retweets
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
            color: 'white',
            fontSize: 4,
            fontWeight: 'bold'
          }}
        >
          Actions per day{' '}
        </Text>
        <Flex sx={{ width: '20%', justifyContent: 'flex-end' }}>
          <Rating rating={averageTweetsPerDay} />
        </Flex>
      </Flex>
      <Text sx={{ fontSize: 6, color: 'white', fontWeight: 'bold' }}>
        {averageTweetsPerDay}
      </Text>
    </Box>
  </Grid>
)

export default Summary
