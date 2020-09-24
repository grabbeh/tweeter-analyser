/** @jsx jsx */
import { jsx, Box, Flex, Text } from 'theme-ui'
import Toggle from 'components/toggle'
import ScrollAnimation from 'components/animations/scrollanimation'

const Emojis = ({ emojis }) => (
  <ScrollAnimation>
    <Box sx={{ mt: 4 }}>
      {emojis.length > 0 && (
        <Box sx={{ borderRadius: '20px', bg: 'yellow', px: 3, pt: 3 }}>
          <Toggle title='Emojis'>
            <Flex sx={{ pb: 3, flexWrap: 'wrap' }}>
              {emojis.map((emoji, i) => (
                <Box key={i}>
                  <Text
                    sx={{
                      fontSize: 4,
                      fontWeight: 'bold'
                    }}
                  >
                    {emoji}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Toggle>
        </Box>
      )}
    </Box>
  </ScrollAnimation>
)

export default Emojis
