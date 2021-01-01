/** @jsx jsx */
import Form from 'components/genericForm'
import Header from 'components/header'
import Layout from 'components/layout'
import { jsx, Flex, Container } from 'theme-ui'
import Results from 'components/results'
import useFetchData from 'hooks/useFetchData'
import Loading from 'components/loadingSpinner'
import IntroBar from 'components/introBar'
import { useEffect } from 'react'

const SearchPage = ({ username }) => {
  const [{ loading, error, data }, doFetch] = useFetchData('/get-tweeter-data')
  console.log(data)
  console.log(error)
  useEffect(() => {
    if (!loading && !error && !data && username) {
      doFetch({ username })
    }
  }, [])

  return (
    <Layout>
      <Header />
      <Flex sx={{ justifyContent: 'center' }}>
        <Container sx={{ mb: 3, mx: 3 }}>
          <IntroBar
            title='Search'
            subtitle="Get an overview of someone's activity on Twitter"
          />
          <Form callbackUrl='/search' doFetch={doFetch} error={error} />
          {loading && <Loading />}
          {!loading && data && (
            <Results doFetch={doFetch} data={data} error={error} />
          )}
        </Container>
      </Flex>
    </Layout>
  )
}

SearchPage.getInitialProps = async ({ query }) => {
  return { username: query.username }
}

export default SearchPage
