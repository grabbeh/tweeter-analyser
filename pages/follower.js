/** @jsx jsx */
import Layout from 'components/Layout'
import { jsx, Box, Flex } from 'theme-ui'
import { useState, useEffect } from 'react'
import GenericUsernameForm from 'components/GenericForm'
import ScrollAnimation from 'components/animations/scrollanimation'
import { server } from 'config/index'
import Loading from 'components/LoadingSpinner'
import Header from 'components/Header'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import User from 'components/user'
import { format } from 'date-fns'

const Follower = props => {
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
        <Box sx={{ my: 4, mx: 3, width: ['100%', '600px'] }}>
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
        </Box>
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
