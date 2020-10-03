/** @jsx jsx */
import Header from 'components/Header'
import Layout from 'components/Layout'
import { jsx, Container, Flex } from 'theme-ui'
import Results from 'components/results'
import { fetcher } from 'utils/fetcher'

const Tweeter = ({ data }) => (
  <Layout>
    <Header />
    <Flex sx={{ justifyContent: 'center' }}>
      <Container>
        <Results data={data} />
      </Container>
    </Flex>
  </Layout>
)

export default Tweeter

export async function getServerSideProps (context) {
  const data = await fetcher('/get-tweeter-data', context.query.username)
  return { props: { data } }
}
