/** @jsx jsx */
import { useState } from 'react'
import Form from 'components/genericForm'
import Layout from 'components/layout'
import Header from 'components/header'
import { jsx, Box, Flex } from 'theme-ui'
import Loading from 'components/loadingSpinner'

const MainForm = props => {
  let [data, setData] = useState()

  let [loading, setLoading] = useState(false)
  return (
    <Layout>
      <Header />
      <Flex sx={{ justifyContent: 'center' }}>
        <Box sx={{ mt: 4, mx: 3, width: 600 }}>
          <Form
            dataUrl='/save-tweets'
            callbackUrl='/save'
            setLoading={setLoading}
            setData={setData}
          />
          {loading && <Loading />}
          {!loading && data && <Box>Success</Box>}
        </Box>
      </Flex>
    </Layout>
  )
}

export default MainForm
