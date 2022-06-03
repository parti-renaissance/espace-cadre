import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider as MuiThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { createGenerateClassName } from '@mui/styles'
import { createTheme } from '@mui/material'
import { frFR } from '@mui/material/locale'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { fr } from 'date-fns/locale'
import { styles } from './styles'

const classNamesOptions = createGenerateClassName({
  productionPrefix: 'em',
})

const ThemeProvider = ({ children }) => {
  const theme = useMemo(() => createTheme(styles, frFR), [])

  return (
    <StyledEngineProvider generateClassName={classNamesOptions} injectFirst>
      <MuiThemeProvider theme={theme}>
        <LocalizationProvider locale={fr} dateAdapter={AdapterDateFns}>
          {children}
        </LocalizationProvider>
      </MuiThemeProvider>
    </StyledEngineProvider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ThemeProvider
