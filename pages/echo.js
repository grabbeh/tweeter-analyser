/** @jsx jsx */
import { useState, useEffect } from 'react'
import Form from 'components/GenericForm'
import { format } from 'date-fns'
import Layout from 'components/Layout'
import Header from 'components/Header'
import ScrollAnimation from 'components/animations/scrollanimation'
import { jsx, Box, Flex, Text, Image, Link } from 'theme-ui'
import Loading from 'components/LoadingSpinner'
import Tweet from 'components/tweet'
import { server } from '../config/index'

const MainForm = props => {
  let { serverData } = props
  let [data, setData] = useState()
  console.log(data)
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
              {data.tweets.map(tweet => (
                <ScrollAnimation key={tweet.id}>
                  <Tweet {...tweet} />
                </ScrollAnimation>
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
