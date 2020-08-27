/** @jsx jsx */
import { jsx, Text as BasicText } from 'theme-ui'

const Error = props => {
  const { children, innerRef } = props
  return (
    <div ref={innerRef}>
      <BasicText color='red' fontWeight='bold'>
        {children}
      </BasicText>
    </div>
  )
}
/*
const PosedError = posed(Text)({
  visible: { opacity: 1, x: 0, transition: { duration: 1000 } },
  hidden: { opacity: 0, x: -100 }
}) */
/*
const Error = ({ error, children }) => {
  return <PosedError pose={error ? 'visible' : 'hidden'}>{children}</PosedError>
} */

export default Error
