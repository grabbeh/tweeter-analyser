/** @jsxRuntime classic /
/** @jsx jsx */
import { jsx, Box, Text, Image, Flex, Link } from 'theme-ui'
import React from 'react'

const User = (props) => (
	<Box sx={{ flexWrap: 'wrap' }}>
		<Box sx={{ mr: 3 }}>
			<Image
				sx={{ width: '50px', borderRadius: '999px' }}
				src={props.profileImage}
			/>
		</Box>
		<Box sx={{ mr: 3 }}>
			<Box sx={{ fontSize: [3, 5], fontWeight: 'bold' }}>
				<Link target='_blank' href={`https://twitter.com/${props.screenName}`}>
					@{props.screenName}
				</Link>
			</Box>
		</Box>
		<Box sx={{ alignItems: 'center' }}>
			<Box as='p'>
				Joined {props.accountCreated}, {props.timeSinceCreation} ago
			</Box>
		</Box>
	</Box>
)

export default User
