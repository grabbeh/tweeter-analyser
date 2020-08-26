/** @jsx jsx */
import Layout from 'components/Layout'
import { jsx, Box, Flex, Image, Text, Link as ThemeLink } from 'theme-ui'
import Link from 'components/Link'
import ScrollAnimation from 'components/animations/scrollanimation'
import { server } from 'config/index'

const Toxic = ({ data }) => {
  return (
    <Layout>
      <Flex sx={{ justifyContent: 'center' }}>
        <Box sx={{ mt: 4, mx: 3, width: 600 }}>
          <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>
            Most toxic tweeters
          </Text>
          {data.toxic.map((account, i) => (
            <ScrollAnimation key={i}>
              <Box sx={{ my: 3, borderRadius: '20px', p: 3, bg: 'blue' }}>
                <Flex sx={{ flexWrap: 'wrap' }}>
                  <Box sx={{ mr: 3 }}>
                    <Image
                      sx={{ width: '50px', borderRadius: '999px' }}
                      src={account.profile_image_url_https}
                    />
                  </Box>
                  <Text
                    sx={{
                      color: 'white',
                      fontSize: [3, 5],
                      fontWeight: 'bold'
                    }}
                  >
                    <Link href={`/search?username=${account.screen_name}`}>
                      <ThemeLink>@{account.screen_name}</ThemeLink>
                    </Link>
                  </Text>
                </Flex>
                <Box>
                  <Text
                    as='span'
                    sx={{
                      fontSize: 6,
                      fontWeight: 'bold',
                      color: 'white'
                    }}
                  >
                    {account.toxicPercentage}%
                  </Text>
                </Box>
                <Box>
                  <Text sx={{ color: 'white', fontSize: 3 }}>
                    {account.timePeriod}
                  </Text>
                </Box>
              </Box>
            </ScrollAnimation>
          ))}
        </Box>
      </Flex>
    </Layout>
  )
}

export default Toxic

Toxic.getInitialProps = async props => {
  const res = await fetch(`${server}/get-most-toxic`)
  const data = await res.json()
  return { data }
}
