/** @jsx jsx */
import { jsx, Box, Text } from 'theme-ui'

const IntroBar = ({ title, subtitle }) => (
  <Box sx={{ mb: 3 }}>
    <Text as='h1'>{title}</Text>
    <Text sx={{ color: 'gray' }} as='p'>
      {subtitle}
    </Text>
  </Box>
)

export default IntroBar
