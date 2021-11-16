import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from '@material-ui/core/styles'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { persistor, store } from './redux/store'
import NotifyProvider from './notify'
import Layout from './components/Layout'
import Routes from './Routes'
import theme from './theme'
import './style/index.scss'

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <NotifyProvider>
              <Layout>
                <Routes />
              </Layout>
            </NotifyProvider>
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)

export default App
