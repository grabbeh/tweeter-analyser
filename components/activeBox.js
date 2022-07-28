/** @jsxRuntime classic /
/** @jsx jsx */
import React from 'react'
import { jsx, Box, Flex, Text } from 'theme-ui'
import Link from './link'
import List from './list'
import ListItem from './listItem'

const ActiveBox = ({ active }) => (
	<Box sx={{ mt: 4, bg: 'white', p: 3, borderRadius: 3 }}>
		<Text as='h3' sx={{ fontWeight: 'bold', fontSize: 4 }}>
			Most active
		</Text>
		<List>
			{active.map((r) => (
				<ListItem key={r.screen_name}>
					<Link href={`/search?username=${r.screen_name}`}>
						<Box>{r.screen_name}</Box>
					</Link>
				</ListItem>
			))}
		</List>
	</Box>
)

export default ActiveBox
