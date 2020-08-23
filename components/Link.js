/** @jsx jsx */
import { jsx } from 'theme-ui'
import Link from 'next/link'

const InternalLink = props => {
  return (
    <Link
      href={props.href}
      sx={{ cursor: 'pointer', textDecoration: 'none', color: 'black' }}
    >
      {props.children}
    </Link>
  )
}

export default InternalLink
