/** @jsx jsx */
import { jsx, Text, Box } from 'theme-ui'
import Link from 'components/link'

const Header = () => (
  <Box sx={{ p: 3 }} as='header'>
    <Link href='/'>
      <Text sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
        🏠 LAST SEVEN DAYS
      </Text>
    </Link>
  </Box>
)

export default Header
