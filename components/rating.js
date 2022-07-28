import styled from '@emotion/styled'
import React from 'react'
import { css } from '@emotion/core'
import { Box } from 'theme-ui'

const Rating = styled(Box)`
	background: #19a974;
	height: 40px;
	width: 40px;
	border-radius: 999px;
	${(props) =>
		props.rating > 25 &&
		css`
			background: #ff6300;
		`};

	${(props) =>
		props.rating > 50 &&
		css`
			background: #ff4136;
		`};
	${(props) =>
		props.rating > 100 &&
		css`
			background: #e7040f;
		`};
`

export default Rating
