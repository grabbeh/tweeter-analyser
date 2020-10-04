/** @jsx jsx */
import { useState, useEffect } from 'react'
import Form from 'components/genericForm'
import Layout from 'components/layout'
import Header from 'components/header'
import ScrollAnimation from 'components/animations/scrollanimation'
import { jsx, Box, Flex, Text, Container } from 'theme-ui'
import Loading from 'components/LoadingSpinner'
import Tweet from 'components/tweet'
import { Toxic } from 'components/tweeter/index'
import IntroBar from 'components/introBar'
import { server } from '../config/index'

const Echo = props => {
  let { serverData } = props
  let [data, setData] = useState()
  let [loading, setLoading] = useState(false)
  useEffect(() => {
    if (serverData) {
      setData(serverData)
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
          <Form
            dataUrl='/get-followed-view'
            callbackUrl='/echo'
            setLoading={setLoading}
            setData={setData}
          />
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

Echo.getInitialProps = async props => {
  if (props.query.username) {
    let { username } = props.query
    const res = await fetch(`${server}/get-followed-view`, {
      body: JSON.stringify({ username }),
      method: 'POST'
    })
    const data = await res.json()
    return { serverData: data }
  } else return {}
}
