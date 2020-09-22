/** @jsx jsx */
import { jsx, Box, BaseStyles } from 'theme-ui'
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
        <BaseStyles>
           <Box>{props.children}</Box>
        </BaseStyles>
      </ThemeProvider>
    </div>
  )
}

export default Layout
