import React, { useState } from 'react'
import styled, { css } from '@emotion/styled'

const Hide = props => {
  let [hidden, setHidden] = useState(false)

  return (
    <HideStyled
      onClick={() => {
        setHidden(!hidden)
      }}
      hidden={hidden}
    >
      x{props.children}
    </HideStyled>
  )
}

const HideStyled = styled.div`
  ${props =>
    css`
      visibility: hidden;
    `};
`

export default Hide
