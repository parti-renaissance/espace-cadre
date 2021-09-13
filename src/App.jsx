import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { ThemeProvider } from '@material-ui/core/styles';
import { persistor, store } from './redux/store';
import Layout from './components/Layout';
import Routes from './Routes';

import './style/index.scss';

import { theme } from './stylesheet';

const App = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <Layout>
                        <Routes />
                    </Layout>
                </ThemeProvider>
            </BrowserRouter>
        </PersistGate>
    </Provider>
);

export default App;
