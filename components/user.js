/** @jsxRuntime classic /
/** @jsx jsx */
import { jsx, Box, Text, Image, Flex, Link } from 'theme-ui'
import React from 'react'

const User = (props) => (
	<div sx={{ flexWrap: 'wrap' }}>
		<div sx={{ mr: 3 }}>
			<Image
				sx={{ width: '50px', borderRadius: '999px' }}
				src={props.profileImage}
			/>
		</div>
		<div sx={{ mr: 3 }}>
			<div sx={{ fontSize: [3, 5], fontWeight: 'bold' }}>
				<Link target='_blank' href={`https://twitter.com/${props.screenName}`}>
					@{props.screenName}
				</Link>
			</div>
		</div>
		<div sx={{ alignItems: 'center' }}>
			<div as='p'>
				Joined {props.accountCreated}, {props.timeSinceCreation} ago
			</div>
		</div>
	</div>
)

export default User
