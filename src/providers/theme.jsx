import PropTypes from 'prop-types'
import { StyledEngineProvider } from '@mui/material/styles'
import MuiThemeProvider from './../theme'
import { createGenerateClassName } from '@mui/styles'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { fr } from 'date-fns/locale'

const classNamesOptions = createGenerateClassName({
  productionPrefix: 'em',
})

const ThemeProvider = ({ children }) => (
  <StyledEngineProvider generateClassName={classNamesOptions} injectFirst>
    <MuiThemeProvider>
      <LocalizationProvider adapterLocale={fr} dateAdapter={AdapterDateFns}>
        {children}
      </LocalizationProvider>
    </MuiThemeProvider>
  </StyledEngineProvider>
)

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ThemeProvider
