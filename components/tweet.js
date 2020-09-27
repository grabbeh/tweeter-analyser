/** @jsx jsx */
import { format } from 'date-fns'
import { jsx, Box, Flex, Text, Image, Link } from 'theme-ui'

const Tweet = props => (
  <Box
    sx={{
      border: '1px solid #ddd',
      borderRadius: 3,
      boxShadow: '0 1px 5px 0 rgba(0,0,0,.14)',
      mb: 4,
      p: 3
    }}
  >
    <Flex sx={{ flexWrap: 'wrap' }}>
      <Flex sx={{ flexBasis: '0 1 auto' }}>
        <Box sx={{ mr: 3 }}>
          <Image
            sx={{ width: '35px', borderRadius: '999px' }}
            src={props.user.profile_image_url_https}
          />
        </Box>
      </Flex>
      <Box sx={{ width: '90%' }}>
        <Text sx={{ fontSize: 3, fontWeight: 'bold' }}>
          <Link
            sx={{ textDecoration: 'none' }}
            target='_blank'
            href={`https://twitter.com/${props.user.screen_name}`}
          >
            @{props.user.screen_name}
          </Link>
        </Text>
        <Box sx={{ mt: 2 }}>
          <Text sx={{ fontSize: 3, color: 'black' }}>{props.text}</Text>
          <Box sx={{ pt: 2 }}>
            <Text
              sx={{
                color: 'dark-gray',
                fontSize: 2
              }}
            >
              {format(new Date(props.created_at), 'dd MMMM yyy HH:mm')}
            </Text>
          </Box>
        </Box>
      </Box>
    </Flex>
  </Box>
)

export default Tweet
