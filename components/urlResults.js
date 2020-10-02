/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import Loading from 'components/LoadingSpinner'
import useFetchData from 'hooks/useFetchData'
import Results from 'components/results'

const UrlResults = props => {
  const [{ data, isLoading }, doFetch, setData, setLoading] = useFetchData(
    '/get-tweeter-data',
    props.username
  )
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
