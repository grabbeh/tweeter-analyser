/** @jsx jsx */
import { useState, useEffect } from 'react'
import Layout from 'components/Layout'
import { jsx, Box, Flex, Image, Text, Link } from 'theme-ui'
import ScrollAnimation from 'components/animations/scrollanimation'

const links = [
  { href: '/search', text: 'Search', bg: 'light-yellow' },
  { href: '/echo', text: 'Echo chamber', bg: 'light-purple' },
  { href: '/active', text: 'Active tweeters', bg: 'light-green' },
  { href: '/toxic', text: 'Toxic tweeters', bg: 'light-red' }
]
const Home = () => (
  <Layout>
    <Box className='gradient'>
      <Flex sx={{ justifyContent: 'center' }}>
        <Box sx={{ my: 4, mx: 3, width: 600 }}>
          <ScrollAnimation>
            <Text sx={{ fontSize: [4, 6], fontWeight: 'bold' }}>
              🕵🏼‍♀️ Last Seven Days
            </Text>
            <Box sx={{ my: 3 }}>
              <Text sx={{ fontSize: 4 }}>
                Tools to help analyse and understand tweeters and echo chambers
              </Text>
            </Box>
          </ScrollAnimation>
          <ScrollAnimation>
            {links.map(l => (
              <Box sx={{ mb: 2 }} key={l.href}>
                <Link href={l.href}>
                  <Text sx={{ fontWeight: 'bold', fontSize: [3, 5] }}>
                    {l.text}
                  </Text>
                </Link>
              </Box>
            ))}
          </ScrollAnimation>
        </Box>
      </Flex>
    </Box>
  </Layout>
)

export default Home
