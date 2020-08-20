/** @jsx jsx */
import Layout from 'components/Layout'
import { jsx, Box, Flex, Image, Text, Link } from 'theme-ui'
import ScrollAnimation from 'components/animations/scrollanimation'
import { server } from 'config/index'

const Active = props => {
  return (
    <Layout>
      <Flex sx={{ justifyContent: 'center' }}>
        <Box sx={{ mt: 4, mx: 3, width: 600 }}>
          <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>
            Most active tweeters
          </Text>

          {props.data.active.map((account, i) => (
            <ScrollAnimation>
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
                    <Link
                      sx={{ color: 'white' }}
                      href={`https://twitter.com/${account.screen_name}`}
                    >
                      @{account.screen_name}
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
