import { RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { Provider as StorageProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store'
import { NotifyProvider, QueryProvider, ThemeProvider } from './providers'
import { SettingsProvider } from '~/mui/settings'
import AppRoutes from './components/AppRoutes'
import PrivateRoutes from './providers/routes'
import ErrorBoundary from '~/providers/errorboundary'

import './style/index.scss'

const Router = AppRoutes({ children: <PrivateRoutes /> })

const App = () => (
  <StorageProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ErrorBoundary>
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
                <RouterProvider router={Router} />
              </NotifyProvider>
            </ThemeProvider>
          </SettingsProvider>
        </QueryProvider>
      </ErrorBoundary>
    </PersistGate>
  </StorageProvider>
)

export default App
