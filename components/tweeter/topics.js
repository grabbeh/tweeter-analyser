/** @jsx jsx */
import { jsx, Box, Flex, Text, Link } from 'theme-ui'
import Toggle from 'components/toggle'
import ScrollAnimation from 'components/animations/scrollanimation'

const Topics = ({ topics }) => (
  <ScrollAnimation>
    <Box sx={{ mt: 4 }}>
      {topics.length > 0 && (
        <Box sx={{ borderRadius: '20px', bg: 'light-purple', px: 3, pt: 3 }}>
          <Toggle title='Topics'>
            <Flex sx={{ pb: 3, flexWrap: 'wrap' }}>
              {topics.map((t, i) => (
                <Link
                  sx={{
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'white'
                    }
                  }}
                  target='_blank'
                  href={`https://twitter.com/search?q=${t}`}
                >
                  <Box
                    key={i}
                    sx={{
                      mr: 3,
                      mb: 1
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: 4,
                        color: 'white'
                      }}
                    >
                      {t}
                    </Text>
                  </Box>
                </Link>
              ))}
            </Flex>
          </Toggle>
        </Box>
      )}
    </Box>
  </ScrollAnimation>
)

export default Topics
