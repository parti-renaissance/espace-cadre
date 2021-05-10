import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './redux/store';
import Root from './components/Root/Root';
import Routes from './Routes';

import './style/index.scss';

const App = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <Root>
                    <Routes />
                </Root>
            </BrowserRouter>
        </PersistGate>
    </Provider>
);

export default App;
