import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store'
import Layout from './components/Layout'
import Routes from './Routes'
import { ThemeProvider } from './theme'
import './style/index.scss'

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <ThemeProvider>
          <Layout>
            <Routes />
          </Layout>
        </ThemeProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)

export default App
