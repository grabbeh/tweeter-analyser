import styled from '@emotion/styled'
import { layout, space, shadow, position, color, border } from 'styled-system'
import propTypes from '@styled-system/prop-types'
import * as React from 'react'
import PropTypes from 'prop-types'

const boxShadow = props => {
  const boxShadows = {
    sm: {
      boxShadow: props.theme.boxShadows[0]
    },
    md: {
      boxShadow: props.theme.boxShadows[1]
    },
    lg: {
      boxShadow: props.theme.boxShadows[2]
    },
    xl: {
      boxShadow: props.theme.boxShadows[3]
    }
  }
  return boxShadows[props.boxShadowSize]
}

const StyledBox = styled('div')(
  {
    boxSizing: 'border-box'
  },
  space,
  shadow,
  layout,
  color,
  border,
  position,
  boxShadow
)

// To recognise propTypes, we have to create new Box to wrap StyledBox
const Box = props => {
  return <StyledBox {...props}>{props.children}</StyledBox>
}

Box.displayName = 'Box'

const numberStringOrArray = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string,
  PropTypes.array
])

Box.propTypes = {
  ...propTypes.space,
  ...propTypes.border,
  ...propTypes.color,
  ...propTypes.layout,
  ...propTypes.position,
  boxShadow: numberStringOrArray
}

export default Box
