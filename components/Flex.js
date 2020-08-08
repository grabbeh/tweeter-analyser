import styled from '@emotion/styled'
import { flexbox } from 'styled-system'
import propTypes from '@styled-system/prop-types'

const Flex = styled('div')({ display: 'flex' }, flexbox)

Flex.propTypes = {
  ...propTypes.flexbox
}

Flex.displayName = 'Flex'

export default Flex
