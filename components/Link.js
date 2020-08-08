import styled from '@emotion/styled'
import PropTypes from 'prop-types'

const InternalLink = styled('a')`
  cursor: pointer;
  text-decoration: none;
  color: #357edd;
`

InternalLink.displayName = 'Link'

InternalLink.propTypes = {
  color: PropTypes.string
}

export default InternalLink
