/** @jsx jsx */

import { useRouter } from 'next/router'
import GenericUsernameForm from 'components/genericForm'
import Header from 'components/header'
import Layout from 'components/layout'
import { jsx, Flex, Container } from 'theme-ui'
import Results from 'components/results'
import useFetchData from 'hooks/useFetchData'
import Loading from 'components/LoadingSpinner'
import IntroBar from 'components/introBar'
import { useEffect } from 'react'

const SearchPage = () => {
  const {
    query: { username }
  } = useRouter()

  const [{ loading, error, data }, doFetch] = useFetchData('/get-tweeter-data')

  useEffect(() => {
    if (!loading && !data && username) {
      doFetch({ username })
    }
  })

  return (
    <Layout>
      <Header />
      <Flex sx={{ justifyContent: 'center' }}>
        <Container sx={{ mb: 3, mx: 3 }}>
          <IntroBar
            title='Search'
            subtitle="Get an overview of someone's activity on Twitter"
          />
          <GenericUsernameForm
            callbackUrl='/search'
            doFetch={doFetch}
            error={error}
          />
          {loading && <Loading />}
          {!loading && data && (
            <Results doFetch={doFetch} data={data} error={error} />
          )}
        </Container>
      </Flex>
    </Layout>
  )
}

export default SearchPage
