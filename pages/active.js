import { useState, useEffect } from 'react'
import Form from 'components/Form'
import Layout from 'components/Layout'
import { Grid, Box, Flex, Image, Text, Link } from 'theme-ui'
import ScrollAnimation from 'components/animations/scrollanimation'
import { server } from 'config/index'
import { ResponsiveBar } from '@nivo/bar'
import RefreshForm from 'components/RefreshForm'
import Loading from 'components/LoadingSpinner'
import Rating from 'components/rating'

const Active = props => {
  console.log(props)
  return (
    <Layout>
      <Flex sx={{ justifyContent: 'center' }}>
        <Box sx={{ mt: 4, mx: 3, width: 600 }}>
          <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>
            Most active tweeters
          </Text>
          {props.data.active.map((account, i) => (
            <Box key={i}>
              <Text as='span'>{i + 1}</Text>

              {account.averageTweetsPerDay}
            </Box>
          ))}
        </Box>
      </Flex>
    </Layout>
  )
}

export default Active

Active.getInitialProps = async props => {
  const res = await fetch(`${server}/get-most-active`)
  const data = await res.json()
  return { data }
}
