/** @jsx jsx */
import { jsx, Box, Text } from 'theme-ui'
import Toggle from 'components/toggle'
import ScrollAnimation from 'components/animations/scrollanimation'

const Toxic = ({ toxic }) => (
  <ScrollAnimation>
    <Box sx={{ mt: 4 }}>
      {toxic && toxic.length > 0 && (
        <Box sx={{ borderRadius: '20px', bg: 'light-red', px: 3, pt: 3 }}>
          <Toggle title='Toxic tweets'>
            <Box sx={{ pb: 3 }}>
              {toxic.map((r, i) => {
                return (
                  <Box
                    sx={{
                      borderRadius: '10px',
                      p: 2,
                      bg: 'red',
                      mb: 3
                    }}
                    key={i}
                  >
                    <Text
                      sx={{
                        fontSize: 4,
                        fontWeight: 'bold',
                        color: 'white'
                      }}
                    >
                      {r.text}
                    </Text>
                  </Box>
                )
              })}
            </Box>
          </Toggle>
        </Box>
      )}
    </Box>
  </ScrollAnimation>
)

export default Toxic
