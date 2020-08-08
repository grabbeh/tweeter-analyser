import React, { Children, cloneElement, Component } from 'react'
import * as PropTypes from 'prop-types'
import Flex from './Flex'

class TabList extends Component {
  static contextTypes = {
    activeIndex: PropTypes.number.isRequired,
    onSelectTab: PropTypes.func.isRequired
  }
  render () {
    const { activeIndex } = this.context
    const children = Children.map(this.props.children, (child, index) => {
      return cloneElement(child, {
        isActive: index === activeIndex,
        onSelect: () => this.context.onSelectTab(index)
      })
    })
    return <Flex flexWrap='wrap'>{children}</Flex>
  }
}

export default TabList
