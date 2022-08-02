/** @jsxRuntime classic /
/** @jsxRuntime classic /
/** @jsx jsx */
import React from 'react'
import Layout from 'components/layout'
import RecentSearches from 'components/recentSearches'
import ActiveBox from 'components/activeBox'
import { jsx, Box, Flex, Grid, Text, Link } from 'theme-ui'
import ScrollAnimation from 'components/animations/scrollanimation'
import Header from 'components/header'
import { basicFetcher as fetcher } from 'utils/fetcher'

const links = [
	{ href: '/search', text: 'Tweeter analysis', bg: 'light-yellow' },
	{ href: '/echo', text: 'Echo chamber', bg: 'light-purple' },
	{ href: '/active', text: 'Active tweeters', bg: 'light-green' },
	{ href: '/follower', text: 'Followers', bg: 'light-blue' }
]

const Home = ({ data: { recentSearches, active } }) => {
	console.log(recentSearches)
	return (
		<Layout>
			<Box className='gradient'>
				<Header />
				<Flex sx={{ justifyContent: 'center' }}>
					<Box sx={{ my: 4, mx: 3, width: 600 }}>
						<ScrollAnimation>
							<Text sx={{ fontSize: [5, 6], fontWeight: 'bold' }}>
								🕵🏼‍♀️ Last Seven Days
							</Text>
							<Box sx={{ my: 3 }}>
								<Text sx={{ fontSize: 5 }}>
									Tools to help analyse and understand tweeters and echo
									chambers
								</Text>
							</Box>
						</ScrollAnimation>
						<ScrollAnimation>
							{links.map((l) => (
								<Box sx={{ mb: 2 }} key={l.href}>
									<Link href={l.href}>
										<Text as='span' sx={{ fontWeight: 'bold', fontSize: 4 }}>
											{l.text}
										</Text>
									</Link>
								</Box>
							))}
							<Grid gap={[3, 4]} columns={[1, 2, 2]}>
								<RecentSearches recent={recentSearches} />
								<ActiveBox active={active} />
							</Grid>
						</ScrollAnimation>
					</Box>
				</Flex>
			</Box>
		</Layout>
	)
}

export default Home

export async function getServerSideProps() {
	const data = await fetcher('/get-homepage-data')
	return { props: { data } }
}
