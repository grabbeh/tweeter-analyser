/** @jsx jsx */
import { useRouter } from 'next/router'
import Header from 'components/Header'
import Layout from 'components/Layout'
import { jsx, Box, Flex } from 'theme-ui'
import Results from 'components/results'

const Holder = props => {
  const {
    query: { username }
  } = useRouter()
  return (
    <Layout>
      <Header />
      <Flex sx={{ justifyContent: 'center' }}>
        <Box>{username && <Results username={username} />}</Box>
      </Flex>
    </Layout>
  )
}

export default Holder
