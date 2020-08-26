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
    <Box>
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

          {links.map(l => (
            <Box key={l.href}>
              <Link href={l.href}>
                <Text sx={{ fontWeight: 'bold', fontSize: 5 }}>{l.text}</Text>
              </Link>
            </Box>
          ))}
        </Box>
      </Flex>

      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
        <path
          fill='#0099ff'
          fill-opacity='1'
          d='M0,96L80,96C160,96,320,96,480,112C640,128,800,160,960,160C1120,160,1280,128,1360,112L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z'
        ></path>
      </svg>
    </Box>
  </Layout>
)

export default Home
