/** @jsx jsx */
import { jsx, Box, Text, Image, Flex, Link } from 'theme-ui'
import ScrollAnimation from 'components/animations/scrollanimation'

const User = props => (
  <ScrollAnimation>
    <Flex sx={{ flexWrap: 'wrap' }}>
      <Box sx={{ mr: 3 }}>
        <Image
          sx={{ width: '50px', borderRadius: '999px' }}
          src={props.profileImage}
        />
      </Box>
      <Text sx={{ fontSize: [3, 5], fontWeight: 'bold' }}>
        <Link href={`https://twitter.com/${props.screenName}`}>
          @{props.screenName}
        </Link>
      </Text>
    </Flex>
  </ScrollAnimation>
)

export default User
