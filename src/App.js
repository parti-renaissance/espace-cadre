import { BrowserRouter as Router } from 'react-router-dom'
import { Provider as StorageProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store'
import { NotifyProvider, QueryProvider, ThemeProvider } from './providers'
import Layout from './components/Layout'
import Routes from './providers/routes'
import ErrorBoundary from './providers/errorboundary'
import './style/index.scss'

const App = () => (
  <ErrorBoundary>
    <StorageProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <QueryProvider>
            <ThemeProvider>
              <NotifyProvider>
                <Layout>
                  <Routes />
                </Layout>
              </NotifyProvider>
            </ThemeProvider>
          </QueryProvider>
        </Router>
      </PersistGate>
    </StorageProvider>
  </ErrorBoundary>
)

export default App
