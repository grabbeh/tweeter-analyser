/** @jsxRuntime classic /
/** @jsx jsx */
import React from 'react'
import { jsx } from 'theme-ui'

const List = (props) => <ol sx={{ ml: 3, p: 0 }}>{props.children}</ol>

export default List
