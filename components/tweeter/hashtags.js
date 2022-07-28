/** @jsxRuntime classic /
/** @jsx jsx */
import React from 'react'
import { jsx, Box, Flex, Text, Link } from 'theme-ui'
import Toggle from 'components/toggle'
import ScrollAnimation from 'components/animations/scrollanimation'

const Hashtags = ({ hashTags }) => (
	<ScrollAnimation>
		{hashTags.length > 0 && (
			<Box
				sx={{
					mt: 4,
					borderRadius: '20px',
					bg: 'red',
					px: 3,
					pt: 3
				}}
			>
				<Toggle title='Hashtags'>
					<Flex sx={{ pb: 3, flexWrap: 'wrap' }}>
						{hashTags.map((f) => (
							<Box key={f} sx={{ mr: 3, mb: 1 }}>
								<Link
									sx={{
										'&:hover': {
											textDecoration: 'underline',
											color: 'black'
										}
									}}
									target='_blank'
									href={`https://twitter.com/hashtag/${f}`}
								>
									<Text
										sx={{
											fontSize: 4
										}}
									>
										#{f}
									</Text>
								</Link>
							</Box>
						))}
					</Flex>
				</Toggle>
			</Box>
		)}
	</ScrollAnimation>
)

export default Hashtags

const removeFirst = (str) => {
	return str.substr(1)
}
