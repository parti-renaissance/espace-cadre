import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { persistor, store } from './redux/store'
import Layout from './components/Layout'
import Routes from './Routes'
import theme from './theme'
import './style/index.scss'

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Layout>
                <Routes />
              </Layout>
            </LocalizationProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)

export default App
