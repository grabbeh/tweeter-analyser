/** @jsx jsx */
import { useState } from 'react'
import { jsx, Box, Text, Flex } from 'theme-ui'
import styled from '@emotion/styled'

import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'

const Toggle = ({ title, children }) => {
  let [hide, setHide] = useState(true)
  return (
    <Box>
      <Flex
        onClick={() => {
          setHide(!hide)
        }}
      >
        <Box>
          <Text sx={{ fontSize: 6, fontWeight: 'bold' }}>{title}</Text>
        </Box>
        <Box>
          <Box>
            {hide ? (
              <Text sx={{ mt: 2, fontSize: 6 }}>
                <MdKeyboardArrowRight />
              </Text>
            ) : (
              <Text sx={{ mt: 2, fontSize: 6 }}>
                <MdKeyboardArrowDown />
              </Text>
            )}
          </Box>
        </Box>
      </Flex>
      <HideBox hide={hide}>{children}</HideBox>
    </Box>
  )
}

export default Toggle

const HideBox = styled('div')`
  display: ${props => (props.hide ? 'none' : 'block')};
`
