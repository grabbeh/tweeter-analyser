/** @jsx jsx */
import { jsx, Box, Flex, Text, Link } from 'theme-ui'
import Toggle from 'components/toggle'
import ScrollAnimation from 'components/animations/scrollanimation'

const Urls = ({ urls }) => (
  <ScrollAnimation>
    {urls && (
      <Box
        sx={{
          mt: 4,
          borderRadius: '20px',
          bg: 'light-gray',
          px: 3,
          pt: 3
        }}
      >
        <Toggle title='Urls'>
          <Flex sx={{ pb: 3, flexWrap: 'wrap' }}>
            {urls.map(([url, frequency]) => (
              <Box key={url} sx={{ mr: 3, mb: 1 }}>
                <Link
                  sx={{
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'black'
                    }
                  }}
                  target='_blank'
                  href={`https://${url}`}
                >
                  <Text
                    as='span'
                    sx={{
                      fontSize: 4
                    }}
                  >
                    {url} 
                  </Text>
                </Link>
                <Box  sx={{ml:2}}as='span'>
                  <Text sx={{fontSize:4, fontWeight:'bold'}}as='span'>{frequency}</Text>
                </Box>
              </Box>
            ))}
          </Flex>
        </Toggle>
      </Box>
    )}
  </ScrollAnimation>
)

export default Urls
