/** @jsx jsx */

import { useRouter } from 'next/router'
import GenericUsernameForm from 'components/GenericForm'
import Header from 'components/Header'
import Layout from 'components/Layout'
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
  const [
    { loading, error, data },
    doFetch,
    setLoading,
    setData,
    setEndpoint
  ] = useFetchData('/get-tweeter-data')

  useEffect(() => {
    if (!loading && !data && username) {
      doFetch(username)
    }
  })

  return (
    <Layout>
      <Header />
      <Flex sx={{ justifyContent: 'center' }}>
        <Container sx={{ my: 4, mx: 3 }}>
          <IntroBar
            title='Search'
            subtitle="Get an overview of someone's activity on Twitter"
          />
          <GenericUsernameForm
            dataUrl='/get-tweeter-data'
            callbackUrl='/search'
            setLoading={setLoading}
            setData={setData}
            doFetch={doFetch}
            setEndpoint={setEndpoint}
            error={error}
          />
          {loading && <Loading />}
          {!loading && data && (
            <Results
              doFetch={doFetch}
              setLoading={setLoading}
              setEndpoint={setEndpoint}
              setData={setData}
              data={data}
              error={error}
            />
          )}
        </Container>
      </Flex>
    </Layout>
  )
}

export default SearchPage
