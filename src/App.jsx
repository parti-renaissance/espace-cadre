import {BrowserRouter, Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux'

import Root from './components/Root/Root';
import Home from './components/Home/Home';
import Contacts from './components/Contacts/Contacts';
import Mail from './components/Mail/Mail';
import AuthProvider from './components/Auth/AuthProvider';

import './App.scss';

const App = (props) => (
    <Provider store={props.store}>
        <BrowserRouter>
            <AuthProvider>
                <Root>
                    <Switch>
                        <Route path="/" exact component={Home}/>
                        <Route path="/contacts" component={Contacts}/>
                        <Route path="/mail" component={Mail}/>
                    </Switch>
                </Root>
            </AuthProvider>
        </BrowserRouter>
    </Provider>
)

export default App;

App.propTypes = {
    store: PropTypes.object.isRequired,
}
