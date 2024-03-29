/** @jsxRuntime classic /
/** @jsx jsx */
import React from 'react'
import { jsx, Box, Text } from 'theme-ui'
import { ResponsivePie } from '@nivo/pie'
import ScrollAnimation from 'components/animations/scrollanimation'

const Pie = ({ pieData }) => (
	<ScrollAnimation>
		<Box
			sx={{
				p: [2, 3],
				borderRadius: '30px',
				bg: 'light-gray',
				mt: 4,
				height: '400px'
			}}
		>
			<Text sx={{ fontSize: 5, fontWeight: 'bold' }}>Split</Text>
			<Text as='p'>
				A mixture of retweets and replies only is suggestive of bot activity
			</Text>

			<ResponsivePie
				theme={theme}
				data={pieData}
				margin={{ right: 100, bottom: 100, left: 100 }}
				innerRadius={0.5}
				padAngle={5}
				cornerRadius={3}
				colors={{ scheme: 'category10' }}
				startAngle={90}
				endAngle={-90}
			/>
		</Box>
	</ScrollAnimation>
)

export default Pie

const theme = {
	background: 'transparent',
	fontFamily: 'Segoe UI',
	fontSize: 11,
	textColor: '#333333',
	axis: {
		domain: {
			line: {
				stroke: 'transparent',
				strokeWidth: 1
			}
		},
		ticks: {
			line: {
				stroke: '#777777',
				strokeWidth: 1
			},
			text: {}
		},
		legend: {
			text: {
				fontSize: 12
			}
		}
	},
	grid: {
		line: {
			stroke: '#dddddd',
			strokeWidth: 1
		}
	},
	legends: {
		text: {
			fill: '#333333'
		}
	},
	labels: {
		text: {}
	},
	markers: {
		lineColor: '#000000',
		lineStrokeWidth: 1,
		text: {}
	},
	dots: {
		text: {}
	},
	tooltip: {
		container: {
			background: 'white',
			color: 'inherit',
			fontSize: 'inherit',
			borderRadius: '2px',
			boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
			padding: '5px 9px'
		},
		basic: {
			whiteSpace: 'pre',
			display: 'flex',
			alignItems: 'center'
		},
		table: {},
		tableCell: {
			padding: '3px 5px'
		}
	},
	crosshair: {
		line: {
			stroke: '#000000',
			strokeWidth: 1,
			strokeOpacity: 0.75,
			strokeDasharray: '6 6'
		}
	},
	annotations: {
		text: {
			fontSize: 13,
			outlineWidth: 2,
			outlineColor: '#ffffff'
		},
		link: {
			stroke: '#000000',
			strokeWidth: 1,
			outlineWidth: 2,
			outlineColor: '#ffffff'
		},
		outline: {
			fill: 'none',
			stroke: '#000000',
			strokeWidth: 2,
			outlineWidth: 2,
			outlineColor: '#ffffff'
		},
		symbol: {
			fill: '#000000',
			outlineWidth: 2,
			outlineColor: '#ffffff'
		}
	}
}
