/** @jsxRuntime classic /
/** @jsxRuntime classic /
/** @jsx jsx */
import Layout from 'components/layout'
import RecentSearches from 'components/recentSearches'
import { jsx, Box, Flex, Text, Link } from 'theme-ui'
import ScrollAnimation from 'components/animations/scrollanimation'
import Header from 'components/header'
import { basicFetcher as fetcher } from 'utils/fetcher'

const links = [
  { href: '/search', text: 'Tweeter analysis', bg: 'light-yellow' },
  { href: '/echo', text: 'Echo chamber', bg: 'light-purple' },
  { href: '/active', text: 'Active tweeters', bg: 'light-green' },
  { href: '/toxic', text: 'Toxic tweeters', bg: 'light-red' },
  { href: '/follower', text: 'Followers', bg: 'light-blue' }
]

const Home = ({ data: { recentSearches } }) => {
  console.log(recentSearches)
  return (
    <Layout>
      <Box className='gradient'>
        <Header />
        <Flex sx={{ justifyContent: 'center' }}>
          <Box sx={{ my: 4, mx: 3, width: 600 }}>
            <ScrollAnimation>
              <Text sx={{ fontSize: [5, 6], fontWeight: 'bold' }}>
                🕵🏼‍♀️ Last Seven Days
              </Text>
              <Box sx={{ my: 3 }}>
                <Text sx={{ fontSize: 5 }}>
                  Tools to help analyse and understand tweeters and echo
                  chambers
                </Text>
              </Box>
            </ScrollAnimation>
            <ScrollAnimation>
              {links.map(l => (
                <Box sx={{ mb: 2 }} key={l.href}>
                  <Link href={l.href}>
                    <Text as='span' sx={{ fontWeight: 'bold', fontSize: 4 }}>
                      {l.text}
                    </Text>
                  </Link>
                </Box>
              ))}
              <RecentSearches recent={recentSearches} />
            </ScrollAnimation>
          </Box>
        </Flex>
      </Box>
    </Layout>
  )
}

export default Home

export async function getServerSideProps () {
  const data = await fetcher('/get-recent-searches')
  return { props: { data } }
}
