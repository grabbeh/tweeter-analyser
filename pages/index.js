/** @jsx jsx */
import { useState, useEffect } from 'react'
import Layout from 'components/Layout'
import { jsx, Box, Flex, Image, Text, Link } from 'theme-ui'

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
          <Text sx={{ fontSize: [4, 6], fontWeight: 'bold' }}>
            Last Seven Days
          </Text>
          <Text sx={{ fontSize: 4 }}>
            Tools to help analyse and understand tweeters and echo chambers
          </Text>
          {links.map(l => (
            <Box key={l.href}>
              <Link href={l.href}>
                <Box sx={{ borderRadius: '20px', bg: l.bg, px: 3, my: 4 }}>
                  <Flex
                    sx={{
                      height: '150px',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text sx={{ fontWeight: 'bold', fontSize: 5 }}>
                      {l.text}
                    </Text>
                  </Flex>
                </Box>
              </Link>
            </Box>
          ))}
        </Box>
      </Flex>
    </Box>
  </Layout>
)

export default Home
