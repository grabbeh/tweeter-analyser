/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import { Helmet } from 'react-helmet'
import { ThemeProvider } from 'emotion-theming'
import theme from '../theme-ui/theme'

const Layout = props => {
  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width' />
        <title>Tweet analyser</title>
      </Helmet>
      <ThemeProvider theme={theme}>
        <Box>{props.children}</Box>
      </ThemeProvider>
    </div>
  )
}

export default Layout
