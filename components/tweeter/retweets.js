/** @jsx jsx */
import { jsx, Box, Text, Link } from 'theme-ui'

const RepliesTo = ({ retweets }) => (
  <Box>
    {retweets.length > 0 && (
      <Box>
        <Text sx={{ fontSize: 4, fontWeight: 'bold' }}>Retweets</Text>
        {retweets.map((f, i) => (
          <Box key={f.screen_name}>
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
              </Link>{' '}
              - {f.value}
            </Text>
          </Box>
        ))}
      </Box>
    )}
  </Box>
)

export default RepliesTo
