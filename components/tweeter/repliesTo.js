/** @jsx jsx */
import { jsx, Box, Text, Link, Flex } from 'theme-ui'

const RepliesTo = ({ repliesTo }) => (
  <Box>
    {repliesTo.length > 0 && (
      <Box>
        <Text sx={{ fontSize: 4, fontWeight: 'bold' }}>Replies to</Text>
        {repliesTo.map((f, i) => {
          let twitterHandle = f.screen_name.substr(1)
          return (
            <Flex
              key={i}
              sx={{ pb: 1, justifyContent: 'space-between', flexWrap: 'wrap' }}
            >
              <Text
                sx={{
                  fontSize: 3
                }}
              >
                <Link
                  target='_blank'
                  href={`https://twitter.com/${twitterHandle}`}
                >
                  {f.screen_name}
                </Link>
              </Text>

              <Text as='span' sx={{ fontSize: 3, fontWeight: 'bold' }}>
                {f.value}
              </Text>
            </Flex>
          )
        })}
      </Box>
    )}
  </Box>
)

export default RepliesTo
