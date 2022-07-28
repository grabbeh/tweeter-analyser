/** @jsxRuntime classic /
/** @jsx jsx */
import React from 'react'
import Layout from 'components/layout'
import {
	jsx,
	Box,
	Flex,
	Image,
	Text,
	Link as ThemeLink,
	Container
} from 'theme-ui'
import Link from 'components/link'
import ScrollAnimation from 'components/animations/scrollanimation'
import { basicFetcher as fetcher } from 'utils/fetcher'
import Header from 'components/header'

const Active = ({ data }) => {
	console.log(data)
	return (
		<Layout>
			<Header />
			<Flex sx={{ justifyContent: 'center' }}>
				<Container sx={{ mt: 4, mx: 3 }}>
					<Text sx={{ fontSize: 6, fontWeight: 'bold' }}>
						Most active tweeters
					</Text>
					{data.active.map((account, i) => (
						<ScrollAnimation key={i}>
							<Box sx={{ my: 3, borderRadius: '20px', p: 3, bg: 'blue' }}>
								<Flex sx={{ flexWrap: 'wrap' }}>
									<Box sx={{ mr: 3 }}>
										<Image
											sx={{ width: '50px', borderRadius: '999px' }}
											src={account.profile_image_url_https}
										/>
									</Box>
									<Text
										sx={{
											color: 'white',
											fontSize: [3, 5],
											fontWeight: 'bold'
										}}
									>
										<Link href={`/search?username=${account.screen_name}`}>
											@{account.screen_name}
										</Link>
									</Text>
								</Flex>
								<Box>
									<Text
										as='span'
										sx={{
											fontSize: 6,
											fontWeight: 'bold',
											color: 'white'
										}}
									>
										{account.averageTweetsPerDay}
									</Text>
									<Text
										sx={{
											ml: 2,
											fontSize: 5,
											color: 'white',
											fontWeight: 'bold'
										}}
										as='span'
									>
										per day
									</Text>
								</Box>
								<Box>
									<Text sx={{ color: 'white', fontSize: 3 }}>
										{account.timePeriod}
									</Text>
								</Box>
							</Box>
						</ScrollAnimation>
					))}
				</Container>
			</Flex>
		</Layout>
	)
}

export default Active

export async function getServerSideProps() {
	const data = await fetcher('/get-most-active')
	return { props: { data } }
}
