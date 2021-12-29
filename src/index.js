import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import App from './App'
import makeServer from 'api/mock'

if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_OAUTH_HOST) {
  makeServer({ environment: process.env.NODE_ENV })
}

if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_SENTRY_DSN) {
  const HTTP_UNAUTHORIZED = 401

  const shouldSendError = hint => {
    const error = hint.originalException
    if (error?.response?.status === HTTP_UNAUTHORIZED) return false
    return true
  }

  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: process.env.REACT_APP_VERSION,
    environment: process.env.REACT_APP_ENVIRONMENT,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.5,
    beforeSend(event, hint) {
      if (shouldSendError(hint)) {
        return event
      }
      return null
    },
  })
}

ReactDOM.render(<App />, document.getElementById('root'))
