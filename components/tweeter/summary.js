/** @jsxRuntime classic /
/** @jsx jsx */
import React from 'react'
import { jsx, Box, Flex, Grid, Text, Card } from 'theme-ui'
import Rating from '../rating'

const Summary = ({
	totalTweets,
	averageTweetsPerDay,
	mostActionsPerHour,
	mostActiveDay,
	longestStreak
}) => (
	<Box>
		<Grid gap={[3, 4]} sx={{ mt: 3 }} columns={[1, 2, 2]}>
			<Card variant='blue'>
				<Text sx={{ color: 'light-gray', fontSize: 5 }}>
					Total tweets, retweets and replies
				</Text>
				<Text as='div' sx={{ fontSize: 6, fontWeight: 'bold' }}>
					{totalTweets}
				</Text>
			</Card>
			<Card variant='blue'>
				<Flex sx={{ flexWrap: 'wrap' }}>
					<Text
						sx={{
							width: '80%',
							color: 'light-gray',
							fontSize: 3
						}}
					>
						Average actions per day
					</Text>
					<Flex sx={{ width: '20%', justifyContent: 'flex-end' }}>
						<Rating rating={averageTweetsPerDay} />
					</Flex>
				</Flex>
				<Text sx={{ fontSize: 4, fontWeight: 'bold' }}>
					{averageTweetsPerDay}
				</Text>
				<Box sx={{ mt: 2 }}>
					<Flex sx={{ flexWrap: 'wrap' }}>
						<Text
							sx={{
								color: 'light-gray',
								fontSize: 3
							}}
						>
							Most actions in a day
						</Text>
					</Flex>
					{mostActiveDay && (
						<Text sx={{ fontSize: 4, fontWeight: 'bold' }}>
							{mostActiveDay}
						</Text>
					)}
				</Box>
				<Box sx={{ mt: 2 }}>
					<Flex sx={{ flexWrap: 'wrap' }}>
						<Text
							sx={{
								color: 'light-gray',
								fontSize: 3
							}}
						>
							Most actions per hour
						</Text>
					</Flex>
					<Text sx={{ fontSize: 4, fontWeight: 'bold' }}>
						{mostActionsPerHour}
					</Text>
				</Box>
			</Card>
		</Grid>
		{longestStreak && longestStreak.length > 0 && (
			<Box
				sx={{
					borderRadius: '20px',
					mt: 4,
					px: 3,
					py: 2,
					bg: 'dark-gray',
					color: 'white'
				}}
			>
				<Box sx={{ mt: 2 }}>
					<Box sx={{ mr: 2 }}>
						<Text sx={{ fontWeight: 'bold', fontSize: 3, color: 'gray' }}>
							Longest streak
						</Text>
					</Box>
					<Text sx={{ fontSize: 4, fontWeight: 'bold', color: 'light-gray' }}>
						{longestStreak.length} actions over {longestStreak.timePeriod}
					</Text>
				</Box>
			</Box>
		)}
	</Box>
)

export default Summary
