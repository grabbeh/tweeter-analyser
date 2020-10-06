/** @jsx jsx */
import { useEffect } from 'react'
import Form from 'components/genericForm'
import Layout from 'components/layout'
import Header from 'components/header'
import ScrollAnimation from 'components/animations/scrollanimation'
import { jsx, Box, Flex, Text, Container } from 'theme-ui'
import Loading from 'components/loadingSpinner'
import Tweet from 'components/tweet'
import { Toxic } from 'components/tweeter/index'
import IntroBar from 'components/introBar'
import useFetchData from 'hooks/useFetchData'
import { useRouter } from 'next/router'

const Echo = props => {
  const {
    query: { username }
  } = useRouter()

  const [{ loading, error, data }, doFetch] = useFetchData('/get-followed-view')

  useEffect(() => {
    if (!loading && !data && username) {
      doFetch({ username })
    }
  })

  return (
    <Layout>
      <Header />
      <Flex sx={{ justifyContent: 'center' }}>
        <Container sx={{ mt: 3, mx: 3 }}>
          <IntroBar
            title='Echo chamber'
            subtitle='See what other people see when they log onto Twitter, for better or worse'
          />
          <Form error={error} doFetch={doFetch} callbackUrl='/echo' />
          {loading && <Loading />}
          {!loading && data && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Text sx={{ fontSize: 5, fontWeight: 'bold' }}>
                  {data.username}'s timeline
                </Text>
              </Box>
              <Toxic toxic={data.toxicTweets} />
              <Box sx={{ mt: 3 }}>
                {data.tweets.map(tweet => (
                  <ScrollAnimation key={tweet.id}>
                    <Tweet {...tweet} />
                  </ScrollAnimation>
                ))}
              </Box>
            </Box>
          )}
        </Container>
      </Flex>
    </Layout>
  )
}

export default Echo
