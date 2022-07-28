/** @jsxRuntime classic /
/** @jsx jsx */
import React from 'react'
import { jsx, Box, Flex, Text, Container } from 'theme-ui'
import Link from './link'
import List from './list'
import ListItem from './listItem'

const RecentSearches = ({ recent }) => (
	<Box sx={{ mt: 4, bg: 'white', p: 3, borderRadius: 3 }}>
		<Text as='h3' sx={{ fontWeight: 'bold', fontSize: 4 }}>
			Recent searches
		</Text>
		<List>
			{recent.map((r, i) => (
				<ListItem key={i}>
					<Link href={`/search?username=${r.screen_name}`}>
						{r.screen_name}
					</Link>
				</ListItem>
			))}
		</List>
	</Box>
)

export default RecentSearches
