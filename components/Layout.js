import React from 'react'
import { Helmet } from 'react-helmet'
import { ThemeProvider } from 'emotion-theming'
import theme from '../components/theme'

const Layout = props => {
  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width' />
        <title>License checker</title>
      </Helmet>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </div>
  )
}

export default Layout
