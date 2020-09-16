/** @jsx jsx */
import { useState, useEffect } from 'react'
import Form from 'components/GenericForm'
import { format } from 'date-fns'
import Layout from 'components/Layout'
import Header from 'components/Header'
import ScrollAnimation from 'components/animations/scrollanimation'
import { jsx, Box, Flex, Text, Image, Link } from 'theme-ui'
import Loading from 'components/LoadingSpinner'
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
                  <Box
                    sx={{
                      borderStyle: '1px dark-gray solid',
                      borderRadius: 3,
                      mb: 4,
                      p: 3,
                      bg: 'light-gray'
                    }}
                  >
                    <Flex sx={{ flexWrap: 'wrap' }}>
                      <Flex sx={{ flexBasis: '0 1 auto' }}>
                        <Box sx={{ mr: 3 }}>
                          <Image
                            sx={{ width: '35px', borderRadius: '999px' }}
                            src={tweet.user.profile_image_url_https}
                          />
                        </Box>
                      </Flex>
                      <Box sx={{ width: '90%' }}>
                        <Text sx={{ fontSize: 3, fontWeight: 'bold' }}>
                          <Link
                            sx={{ textDecoration: 'none' }}
                            href={`https://twitter.com/${tweet.user.screen_name}`}
                          >
                            @{tweet.user.screen_name}
                          </Link>
                        </Text>
                        <Box sx={{ mt: 2 }}>
                          <Text sx={{ fontSize: 4, color: 'black' }}>
                            {tweet.text}
                          </Text>
                          <Box sx={{ pt: 2 }}>
                            <Text
                              sx={{
                                color: 'dark-gray',
                                fontSize: 2
                              }}
                            >
                              {format(
                                new Date(tweet.created_at),
                                'dd MMMM yyy HH:mm'
                              )}
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
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
