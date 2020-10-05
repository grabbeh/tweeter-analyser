import styled from '@emotion/styled'
import {
  layout,
  space,
  shadow,
  position,
  color,
  border,
  typography
} from 'styled-system'
import * as React from 'react'
import propTypes from '@styled-system/prop-types'

const StyledButton = styled.button`
  outline: 1px solid transparent;
  border: none;
  cursor: pointer;
  &:hover {
    background: #137752;
  }
  ${layout} ${space} ${shadow} ${position} ${color} ${border} ${typography}
`

const Button = ({ children, ...props }) => (
  <StyledButton {...props}>{children}</StyledButton>
)

Button.displayName = 'Button'

Button.defaultProps = {
  px: 3,
  py: 2,
  fontSize: 4,
  width: '100px',
  fontWeight: 'bold',
  disabled: false,
  bg: 'green',
  color: 'white',
  borderRadius: 2
}

Button.propTypes = {
  ...propTypes.space,
  ...propTypes.border,
  ...propTypes.color,
  ...propTypes.layout,
  ...propTypes.position,
  ...propTypes.typography
}

export default Button
