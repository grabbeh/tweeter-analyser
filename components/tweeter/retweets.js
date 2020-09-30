/** @jsx jsx */
import { jsx, Box, Text, Link } from 'theme-ui'
import List from '../list'
import ListItem from '../listItem'

const RepliesTo = ({ retweets }) => (
  <Box>
    {retweets.length > 0 && (
      <Box>
        <Text sx={{ fontSize: 4, fontWeight: 'bold' }}>Retweets</Text>
        <List>
          {retweets.map((f, i) => (
            <ListItem key={f.screen_name}>
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
                <Text as='span' sx={{ fontWeight: 'bold' }}>
                  {' '}
                  - {f.value}
                </Text>
              </Text>
            </ListItem>
          ))}
        </List>
      </Box>
    )}
  </Box>
)

export default RepliesTo
