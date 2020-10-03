/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import Loading from 'components/LoadingSpinner'
import useFetchData from 'hooks/useFetchData'
import Results from 'components/results'

const UrlResults = props => {
  const [
    { loading, error, data },
    doFetch,
    setLoading,
    setData,
    setEndpoint
  ] = useFetchData('/get-tweeter-data')
  return (
    <Box sx={{ my: 4, mx: 3, width: 600 }}>
      {isLoading && <Loading />}
      {!isLoading && data && (
        <Results setLoading={setLoading} setData={setData} data={data} />
      )}
    </Box>
  )
}

export default UrlResults
