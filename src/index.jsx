import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import makeServer from './api/mock';

if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_OAUTH_HOST) {
    makeServer({ environment: process.env.NODE_ENV });
}

ReactDOM.render(<App />, document.getElementById('root'));
