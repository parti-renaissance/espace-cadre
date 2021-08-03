import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { ErrorBoundary } from 'react-error-boundary';
import { persistor, store } from './redux/store';
import Root from './components/Root/Root';
import Routes from './Routes';
import Fallback from './components/ErrorComponent/Fallback';

import './style/index.scss';

const App = () => {
    const errorHandler = (error, errorInfo) => {
        console.log('Logging!!!', error, errorInfo);
    };

    return (
        <ErrorBoundary FallbackComponent={Fallback} onError={errorHandler}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                        <Root>
                            <Routes />
                        </Root>
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </ErrorBoundary>
    );
};

export default App;
