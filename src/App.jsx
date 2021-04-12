import {BrowserRouter, Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux'

import Root from './components/Root/Root';

import './App.scss';

const App = (props) => {
    return (
        <Provider store={props.store}>
            <BrowserRouter>
                <Root />
            </BrowserRouter>
        </Provider>
    )
}

export default App;

App.propTypes = {
    store: PropTypes.object.isRequired,
}
