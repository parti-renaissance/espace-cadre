import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import App from './App'
import { APP_ENVIRONMENT, APP_VERSION, SENTRY_DSN, NODE_ENV } from 'shared/environments'

if (NODE_ENV === 'production' || SENTRY_DSN) {
  const shouldSendError = hint => {
    const error = hint.originalException

    return error?.response?.status !== 401
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    release: APP_VERSION,
    environment: APP_ENVIRONMENT,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: APP_ENVIRONMENT === 'production' ? 0.05 : 0,
    ignoreErrors: [
      'ResizeObserver loop limit exceeded', // https://forum.sentry.io/t/resizeobserver-loop-limit-exceeded/8402/5
    ],
    beforeSend(event, hint) {
      if (shouldSendError(hint)) {
        return event
      }
      return null
    },
  })
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)
