/** @jsx jsx */
import Layout from 'components/Layout'
import { jsx, Box, Flex, Container } from 'theme-ui'
import { useState, useEffect } from 'react'
import GenericUsernameForm from 'components/GenericForm'
import ScrollAnimation from 'components/animations/scrollanimation'
import { server } from 'config/index'
import Loading from 'components/LoadingSpinner'
import Header from 'components/Header'
import IntroBar from 'components/introBar'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import User from 'components/user'
import { format } from 'date-fns'

const Follower = props => {
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
        <Container sx={{ my: 4, mx: 3 }}>
          <IntroBar
            title='Followers'
            subtitle="View the date of creation of an account's followers. Accounts with multiple followers created on the same day may indicate presence in a bot network"
          />
          <GenericUsernameForm
            dataUrl='/get-follower-data'
            callbackUrl='/follower'
            setLoading={setLoading}
            setData={setData}
          />
          {loading && <Loading />}
          {!loading && data && (
            <Box sx={{ mt: 3 }}>
              <User
                screenName={data.user.screen_name}
                profileImage={data.user.profile_image_url_https}
                accountCreated={data.user.accountCreated}
                timeSinceCreation={data.user.timeSinceCreation}
              />
              <ScrollAnimation>
                <Box sx={{ height: '1000px' }}>
                  <ResponsiveScatterPlot
                    data={data.graphData}
                    colors='#357edd'
                    margin={{ top: 20, right: 10, bottom: 20, left: 10 }}
                    blendMode='multiply'
                    yScale={{
                      type: 'time',
                      format: '%Y-%m-%d',
                      precision: 'day'
                    }}
                    xScale={{
                      type: 'linear'
                    }}
                    axisBottom={{
                      tickValues: 5,
                      format: c => `${c}`
                    }}
                    axisLeft={{
                      format: '20%y'
                    }}
                    yFormat={c => format(c, 'dd-MM-yyyy')}
                    xFormat={c => `${c}`}
                  />
                </Box>
              </ScrollAnimation>
            </Box>
          )}
        </Container>
      </Flex>
    </Layout>
  )
}

export default Follower

Follower.getInitialProps = async props => {
  if (props.query.username) {
    let { username } = props.query
    const res = await fetch(`${server}/get-follower-data`, {
      body: JSON.stringify({ username }),
      method: 'POST'
    })
    const data = await res.json()
    return { serverData: data }
  } else return {}
}
