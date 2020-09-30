/** @jsx jsx */
import { jsx, Text } from 'theme-ui'

const List = props => (
  <Text as='li' sx={{ fontSize: 3, px: 0, py: 1 }}>
    {props.children}
  </Text>
)

export default List
