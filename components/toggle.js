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
		<div>
			<div
				sx={{ cursor: 'pointer' }}
				onClick={() => {
					setHeight(height === 0 ? 'auto' : 0)
				}}
			>
				<div>
					<div sx={{ fontSize: 5, fontWeight: 'bold' }}>{title}</div>
				</div>
				<div>
					<Rotate height={height}>
						<div sx={{ fontSize: 6 }}>
							<MdKeyboardArrowRight />
						</div>
					</Rotate>
				</div>
			</div>
			<AnimateHeight duration={500} height={height}>
				{children}
			</AnimateHeight>
		</div>
	)
}

export default Toggle

const Rotate = styled('div')`
	transform: ${(props) =>
		props.height === 'auto' ? 'rotate(90deg)' : 'rotate(0deg'};
	transition: all 0.2s linear;
`
