import { useState, useEffect } from 'react'
import Form from 'components/EchoForm'
import Layout from 'components/Layout'
import { Grid, Box, Flex, Text } from 'theme-ui'
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
      <Flex sx={{ justifyContent: 'center' }}>
        <Box sx={{ mt: 4, mx: 3, width: 600 }}>
          <Form setLoading={setLoading} setData={setData} />
          {loading && (
            <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>Loading...</Text>
          )}
          {data && (
            <Box>
              <Text sx={{ fontSize: 5, fontWeight: 'bold' }}>
                {data.username}'s timeline
              </Text>
              {data.tweets.map(tweet => (
                <Box
                  key={tweet.id}
                  sx={{ borderRadius: 3, my: 3, p: 3, bg: 'dark-blue' }}
                >
                  <Text
                    sx={{ color: 'white', fontSize: 5, fontWeight: 'bold' }}
                  >
                    @{tweet.user.screen_name}
                  </Text>
                  <Text sx={{ fontSize: 4, color: 'white' }}>{tweet.text}</Text>
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
