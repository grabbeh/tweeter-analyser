/** @jsxRuntime classic /
/** @jsx jsx */
import React from 'react'
import { useState } from 'react'
import { jsx, Box, Text, Flex } from 'theme-ui'
import styled from '@emotion/styled'
import AnimateHeight from 'react-animate-height'
import { MdKeyboardArrowRight } from 'react-icons/md'

const Toggle = ({ title, children }) => {
	let [height, setHeight] = useState(0)
	return (
		<Box>
			<Box
				sx={{ cursor: 'pointer' }}
				onClick={() => {
					setHeight(height === 0 ? 'auto' : 0)
				}}
			>
				<Box>
					<Box sx={{ fontSize: 5, fontWeight: 'bold' }}>{title}</Box>
				</Box>
				<Box>
					<Rotate height={height}>
						<div sx={{ fontSize: 6 }}>
							<MdKeyboardArrowRight />
						</div>
					</Rotate>
				</Box>
			</Box>
			<AnimateHeight duration={500} height={height}>
				{children}
			</AnimateHeight>
		</Box>
	)
}

export default Toggle

const Rotate = styled('div')`
	transform: ${(props) =>
		props.height === 'auto' ? 'rotate(90deg)' : 'rotate(0deg'};
	transition: all 0.2s linear;
`
