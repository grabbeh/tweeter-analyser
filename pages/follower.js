/** @jsx jsx */
import Layout from 'components/layout'
import { jsx, Box, Flex, Container } from 'theme-ui'
import { useEffect } from 'react'
import Form from 'components/genericForm'
import ScrollAnimation from 'components/animations/scrollanimation'
import Loading from 'components/loadingSpinner'
import Header from 'components/header'
import IntroBar from 'components/introBar'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import User from 'components/user'
import { format } from 'date-fns'
import useFetchData from 'hooks/useFetchData'
import { useRouter } from 'next/router'

const Follower = () => {
  const {
    query: { username }
  } = useRouter()

  const [{ loading, error, data }, doFetch] = useFetchData('/get-follower-data')

  useEffect(() => {
    if (!loading && !data && username) {
      doFetch({ username })
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
          <Form doFetch={doFetch} error={error} callbackUrl='/follower' />
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
