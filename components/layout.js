/** @jsxRuntime classic /
/** @jsx jsx */
import { jsx, Box, BaseStyles } from 'theme-ui'
import { Helmet } from 'react-helmet'
import { ThemeProvider } from 'theme-ui'
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
          <Box sx={{ bg: 'white', fontFamily: 'sansSerif' }}>
            {props.children}
          </Box>
        </BaseStyles>
      </ThemeProvider>
    </div>
  )
}

export default Layout
