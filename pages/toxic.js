/** @jsx jsx */
import Layout from 'components/Layout'
import {
  jsx,
  Box,
  Flex,
  Image,
  Text,
  Link as ThemeLink,
  Container
} from 'theme-ui'
import Link from 'components/Link'
import ScrollAnimation from 'components/animations/scrollanimation'
import { basicFetcher as fetcher } from 'utils/fetcher'
import Header from 'components/Header'

const Toxic = ({ data }) => {
  return (
    <Layout>
      <Header />
      <Flex sx={{ justifyContent: 'center' }}>
        <Container sx={{ mt: 4, mx: 3 }}>
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
                    {Math.round(account.toxicPercentage)}%
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
        </Container>
      </Flex>
    </Layout>
  )
}

export default Toxic

export async function getServerSideProps () {
  const data = await fetcher('/get-most-toxic')
  return { props: { data } }
}
