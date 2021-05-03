import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import App from './App';
import makeServer from './api/mock';

if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_OAUTH_HOST) {
    makeServer({ environment: process.env.NODE_ENV });
}

if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_SENTRY_DSN) {
    Sentry.init({
        dsn: `${process.env.REACT_APP_SENTRY_DSN}`,
        release: 'master',
        environment: 'production',
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 0.5,
    });
}

ReactDOM.render(<App />, document.getElementById('root'));
