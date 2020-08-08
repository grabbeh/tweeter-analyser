import { useState, useEffect } from 'react'
import Form from 'components/TweetForm'
import Layout from 'components/Layout'
import { Grid, Box, Flex, Text } from 'theme-ui'
import { server } from '../config/index'

const MainForm = props => {
  let { serverData } = props
  let [data, setData] = useState()
  let [loading, setLoading] = useState(false)
  console.log(data)
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
              <Text sx={{ fontSize: 7, fontWeight: 'bold' }}>Tweet</Text>
              <Text sx={{ fontSize: 5, fontWeight: 'bold' }}>
                {data.data.text}
              </Text>
              <Grid gap={[3, 4]} sx={{ mt: 4 }} columns={[1, 2, 2]}></Grid>
              <pre>{JSON.stringify(data.data, null, 2)}</pre>
            </Box>
          )}
        </Box>
      </Flex>
    </Layout>
  )
}

export default MainForm

MainForm.getInitialProps = async props => {
  if (props.query.id) {
    let { id } = props.query
    const res = await fetch(`${server}/get-tweet-data`, {
      body: JSON.stringify({ id }),
      method: 'POST'
    })
    const data = await res.json()
    return { serverData: data }
  } else return {}
}
