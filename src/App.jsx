import { BrowserRouter as Router } from 'react-router-dom'
import { Provider as StorageProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store'
import { NotifyProvider, QueryProvider, ThemeProvider } from './providers'
import AppRoutes from './components/AppRoutes'
import PrivateRoutes from './providers/routes'
import ErrorBoundary from 'providers/errorboundary'

import './style/index.scss'

const App = () => (
  <StorageProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ErrorBoundary>
        <Router>
          <QueryProvider>
            <ThemeProvider>
              <NotifyProvider>
                <AppRoutes>
                  <PrivateRoutes />
                </AppRoutes>
              </NotifyProvider>
            </ThemeProvider>
          </QueryProvider>
        </Router>
      </ErrorBoundary>
    </PersistGate>
  </StorageProvider>
)

export default App
