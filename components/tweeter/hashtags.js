/** @jsx jsx */

import { jsx, Box, Flex, Text } from 'theme-ui'
import Toggle from 'components/toggle'
import ScrollAnimation from 'components/animations/scrollanimation'

const Hashtags = ({ hashTags }) => (
  <ScrollAnimation>
    {hashTags.length > 0 && (
      <Box
        sx={{
          mt: 4,
          borderRadius: '20px',
          bg: 'light-green',
          p: 3
        }}
      >
        <Toggle title='Hashtags'>
          <Flex sx={{ flexWrap: 'wrap' }}>
            {hashTags.map(f => (
              <Box
                key={f}
                sx={{
                  borderRadius: '10px',
                  p: 2,
                  mr: 3,
                  my: 2,
                  bg: 'green'
                }}
              >
                <Text
                  sx={{
                    fontSize: 4,
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {f}
                </Text>
              </Box>
            ))}
          </Flex>
        </Toggle>
      </Box>
    )}
  </ScrollAnimation>
)

export default Hashtags
