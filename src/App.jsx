import { BrowserRouter as Router } from 'react-router-dom'
import { Provider as StorageProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store'
import { NotifyProvider, QueryProvider, ThemeProvider } from './providers'
import { SettingsProvider } from 'src/mui/settings'
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
            <SettingsProvider
              defaultSettings={{
                themeMode: 'light', // 'light' | 'dark'
                themeDirection: 'ltr', //  'rtl' | 'ltr'
                themeContrast: 'default', // 'default' | 'bold'
                themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                themeStretch: false,
              }}
            >
              <ThemeProvider>
                <NotifyProvider>
                  <AppRoutes>
                    <PrivateRoutes />
                  </AppRoutes>
                </NotifyProvider>
              </ThemeProvider>
            </SettingsProvider>
          </QueryProvider>
        </Router>
      </ErrorBoundary>
    </PersistGate>
  </StorageProvider>
)

export default App
