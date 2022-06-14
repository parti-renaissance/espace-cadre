import ReactDOM from 'react-dom'
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
    beforeSend(event, hint) {
      if (shouldSendError(hint)) return event
      return null
    },
  })
}

ReactDOM.render(<App />, document.getElementById('root'))
