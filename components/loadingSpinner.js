/** @jsxRuntime classic /
/** @jsx jsx */
import React from 'react'
import { jsx, Flex, Box } from 'theme-ui'
import Spinner from 'react-svg-spinner'

const Loading = () => (
	<Flex
		sx={{
			mt: 5,
			justifyContent: 'center',

			width: '100%'
		}}
	>
		<Box>
			<Spinner thickness={4} size='80px' />
		</Box>
	</Flex>
)

export default Loading
