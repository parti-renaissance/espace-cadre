import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './redux/store';
import Layout from './components/Layout';
import Routes from './Routes';

import './style/index.scss';

const App = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <Layout>
                    <Routes />
                </Layout>
            </BrowserRouter>
        </PersistGate>
    </Provider>
);

export default App;
