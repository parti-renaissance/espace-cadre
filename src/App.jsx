import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux'
import {PersistGate} from "redux-persist/integration/react";

import {store, persistor} from "./redux/store";
import Root from './components/Root/Root';

import './App.scss';

const App = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Root />
                </BrowserRouter>
            </PersistGate>
        </Provider>
    )
}

export default App;
