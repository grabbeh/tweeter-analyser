/** @jsx jsx */

import { jsx, Box, Flex, Text } from 'theme-ui'
import Toggle from 'components/toggle'
import ScrollAnimation from 'components/animations/scrollanimation'

const Topics = ({ topics }) => (
  <ScrollAnimation>
    <Box sx={{ mt: 4 }}>
      {topics.length > 0 && (
        <Box sx={{ borderRadius: '20px', bg: 'light-purple', p: 3 }}>
          <Toggle title='Topics'>
            <Flex sx={{ flexWrap: 'wrap' }}>
              {topics.map(t => (
                <Box
                  sx={{
                    borderRadius: '10px',
                    p: 2,
                    bg: 'purple',
                    my: 2,
                    mr: 2
                  }}
                >
                  <Text
                    sx={{
                      fontSize: 4,
                      fontWeight: 'bold',
                      color: 'white'
                    }}
                  >
                    {t}
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

export default Topics
