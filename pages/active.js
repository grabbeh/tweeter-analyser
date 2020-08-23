/** @jsx jsx */
import Layout from 'components/Layout'
import { jsx, Box, Flex, Image, Text, Link as ThemeLink } from 'theme-ui'
import Link from 'components/Link'
import ScrollAnimation from 'components/animations/scrollanimation'
import { server } from 'config/index'

const Active = ({ data }) => {
  return (
    <Layout>
      <Flex sx={{ justifyContent: 'center' }}>
        <Box sx={{ mt: 4, mx: 3, width: 600 }}>
          <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>
            Most active tweeters
          </Text>
          {data.active.map((account, i) => (
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
                    <Link href={`/form?username=${account.screen_name}`}>
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
                    {account.averageTweetsPerDay}
                  </Text>
                  <Text
                    sx={{
                      ml: 2,
                      fontSize: 5,
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                    as='span'
                  >
                    per day
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

export default Active

Active.getInitialProps = async props => {
  const res = await fetch(`${server}/get-most-active`)
  const data = await res.json()
  return { data }
}
