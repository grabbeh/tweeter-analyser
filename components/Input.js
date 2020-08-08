import React from 'react'
import Text from './Text'
import Box from './Box'
import {
  layout,
  space,
  shadow,
  position,
  color,
  border,
  typography
} from 'styled-system'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import propTypes from '@styled-system/prop-types'
import PropTypes from 'prop-types'

/*
const StyledInput = styled('input')(
  { border: 'none', boxSizing: 'border-box' },
  layout,
  space,
  shadow,
  position,
  color,
  border,
  typography
) */

const StyledInput = styled('input')`
  ${layout}
  ${space}
  ${shadow}
  ${position}
  ${color}
  ${border}
  ${typography}
  outline: 0;
  box-sizing: border-box;
  ${props =>
    props.error &&
    css`
      border-bottom: 1px solid red;
    `};
  &:focus {
    border-bottom: 3px solid #357edd;
  }
  `
class Input extends React.Component {
  render () {
    const {
      label,
      type,
      placeholder,
      name,
      onChange,
      value,
      onFocus,
      onBlur,
      readOnly,
      autoComplete
    } = this.props

    return (
      <Box borderRadius={2}>
        {label && (
          <Box mb={2}>
            <Text fontWeight='bold' fontSize={4}>
              <label htmlFor={value}>{label}</label>
            </Text>
          </Box>
        )}
        <StyledInput
          autoComplete={autoComplete}
          id={value}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          type={type}
          name={name}
          onFocus={onFocus}
          onBlur={onBlur}
          readOnly={readOnly}
          {...this.props}
        />
      </Box>
    )
  }
}

Input.defaultProps = {
  width: 1,
  border: 'none',
  borderBottom: '3px solid',
  borderColor: '#D6D7DE',
  fontSize: 4,
  p: 1
}

Input.propTypes = {
  ...propTypes.space,
  ...propTypes.border,
  ...propTypes.color,
  ...propTypes.typography,
  ...propTypes.layout,
  ...propTypes.position,
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

export default Input
