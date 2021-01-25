/** @jsxRuntime classic /
/** @jsx jsx */
import { jsx, Box, Flex, Text, Link } from 'theme-ui'
import Toggle from 'components/toggle'
import ScrollAnimation from 'components/animations/scrollanimation'
import Image from 'next/image'

const Media = ({ media }) => {
  return (
    <ScrollAnimation>
      <Box sx={{ mt: 4 }}>
        {media.length > 0 && (
          <Box sx={{ borderRadius: '20px', bg: 'light-purple', px: 3, pt: 3 }}>
            <Toggle title='Media'>
              <Flex sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {media.map((m, i) => (
                  <Box sx={{ p: 2 }}>
                    <Link target='noblank' key={i} href={m.tweetUrl}>
                      <Image height={m.height} width={m.width} src={m.imgUrl} />
                    </Link>
                  </Box>
                ))}
              </Flex>
            </Toggle>
          </Box>
        )}
      </Box>
    </ScrollAnimation>
  )
}

export default Media
