/** @jsx jsx */
import { jsx } from 'theme-ui'
import Link from 'next/link'

const InternalLink = props => {
  return (
    <Link
      {...props}
      sx={{ cursor: 'pointer', textDecoration: 'none', color: 'black' }}
    />
  )
}

export default InternalLink
