/** @jsxRuntime classic /
/** @jsx jsx */
import React from 'react'
import { jsx, Grid, Box } from 'theme-ui'
import Toggle from 'components/toggle'
import ScrollAnimation from 'components/animations/scrollanimation'
import { RepliesTo, Retweets } from './index'

const Interactions = ({ repliesTo, retweets, screenname }) => (
	<ScrollAnimation>
		<Box
			sx={{
				mt: 4,
				px: 3,
				pt: 3,
				pb: [3, 0],
				borderRadius: '20px',
				bg: 'orange'
			}}
		>
			<Toggle title='Popular interactions'>
				<Box sx={{ pb: 3 }}>
					<Grid gap={[3, 4]} columns={[1, 2, 2]}>
						{repliesTo && (
							<RepliesTo screenname={screenname} repliesTo={repliesTo} />
						)}
						{retweets && <Retweets retweets={retweets} />}
					</Grid>
				</Box>
			</Toggle>
		</Box>
	</ScrollAnimation>
)

export default Interactions
