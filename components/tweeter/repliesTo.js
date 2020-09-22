/** @jsx jsx */
import { jsx, Box, Text, Flex } from 'theme-ui'
import ScrollAnimation from 'components/animations/scrollanimation'

const RepliesTo = ({ repliesTo }) => (
  <ScrollAnimation>
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
              {f.screen_name} - {f.value}
            </Text>
          </Flex>
        ))}
      </Box>
    )}
  </ScrollAnimation>
)

export default RepliesTo
