/** @jsx jsx */
import { useState, useEffect } from 'react'
import Form from 'components/EchoForm'
import Layout from 'components/Layout'
import Header from 'components/Header'
import { jsx, Box, Flex, Text } from 'theme-ui'
import Loading from 'components/LoadingSpinner'
import User from 'components/user'
import { server } from '../config/index'

const MainForm = props => {
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
        <Box sx={{ mt: 4, mx: 3, width: 600 }}>
          <Form setLoading={setLoading} setData={setData} />
          {loading && <Loading />}
          {!loading && data && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Text sx={{ fontSize: 5, fontWeight: 'bold' }}>
                  {data.username}'s timeline
                </Text>
              </Box>
              {data.tweets.map(tweet => (
                <Box
                  key={tweet.id}
                  sx={{ borderRadius: 3, mb: 4, p: 3, bg: 'light-gray' }}
                >
                  <User
                    profileImage={tweet.user.profile_image_url_https}
                    screenName={tweet.user.screen_name}
                  />
                  <Text sx={{ fontSize: 3, color: 'black' }}>{tweet.text}</Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Flex>
    </Layout>
  )
}

export default MainForm

MainForm.getInitialProps = async props => {
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
