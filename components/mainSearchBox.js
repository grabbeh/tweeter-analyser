/** @jsxRuntime classic /
/** @jsx jsx */
import React from 'react'
import { useState } from 'react'
import GenericUsernameForm from 'components/genericForm'
import Header from 'components/header'
import Layout from 'components/layout'
import { jsx, Box, Flex, Text, Container } from 'theme-ui'
import ScrollAnimation from 'components/animations/scrollanimation'

import RefreshForm from 'components/refreshForm'
import Loading from 'components/loadingSpinner'
import IntroBar from 'components/introBar'
import {
	Summary,
	Toxic,
	Emojis,
	Topics,
	Hashtags,
	Chart,
	Pie,
	Interactions
} from 'components/tweeter/'
import User from 'components/user'

const MainSearchBox = (props) => {
	let [data, setData] = useState(props.data)
	let [loading, setLoading] = useState(false)
	return (
		<Layout>
			<Header />
			<Flex sx={{ justifyContent: 'center' }}>
				<Container sx={{ my: 4, mx: 3 }}>
					<IntroBar
						title='Search'
						subtitle="Get an overview of someone's activity on Twitter"
					/>
					<GenericUsernameForm
						dataUrl='/get-tweeter-data'
						callbackUrl='/search'
						setLoading={setLoading}
						setData={setData}
					/>
					{loading && <Loading />}
					{!loading && data && (
						<Box sx={{ mt: 3 }}>
							<User
								screenName={data.screen_name}
								profileImage={data.profile_image_url_https}
								accountCreated={data.accountCreated}
								timeSinceCreation={data.timeSinceCreation}
							/>
							<ScrollAnimation>
								<Box sx={{ mt: 2 }}>
									<Text as='h2'>Overview</Text>
									<Flex sx={{ flexWrap: 'wrap' }}>
										<Text as='p'>{data.timePeriod}</Text>
										<Box>
											{data.refreshAvailable && (
												<Box>
													<RefreshForm
														setLoading={setLoading}
														setData={setData}
														username={data.screen_name}
													/>
												</Box>
											)}
										</Box>
									</Flex>
									<Summary
										averageTweetsPerDay={data.averageTweetsPerDay}
										totalTweets={data.totalTweets}
										mostActionsPerHour={data.mostTweetsPerHour}
									/>
								</Box>
							</ScrollAnimation>
							<Interactions
								retweets={data.likesToRetweet}
								repliesTo={data.likesToReplyTo}
							/>

							{data.tweetSplit && <Pie pieData={data.tweetSplit} />}
							<Chart chartData={data.chartData} />
							<Hashtags hashTags={data.hashTags} />
							<Toxic toxic={data.toxicTweets} />
							<Emojis emojis={data.emojis} />
							<Topics topics={data.topics} />
						</Box>
					)}
				</Container>
			</Flex>
		</Layout>
	)
}

export default MainSearchBox
