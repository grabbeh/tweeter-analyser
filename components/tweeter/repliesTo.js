/** @jsx jsx */
import { jsx, Box, Text, Flex, Link } from 'theme-ui'

const RepliesTo = ({ repliesTo }) => (
  <Box>
    {repliesTo.length > 0 && (
      <Box>
        <Text sx={{ fontSize: 4, fontWeight: 'bold' }}>Replies to</Text>
        {repliesTo.map((f, i) => (
          <Flex key={f.screen_name}>
            <Text
              sx={{
                fontSize: 3
              }}
            >
              <Link
                target='_blank'
                href={`https://twitter.com/${f.screen_name}`}
              >
                {f.screen_name}{' '}
              </Link>
              - {f.value}
            </Text>
          </Flex>
        ))}
      </Box>
    )}
  </Box>
)

export default RepliesTo
