import {Switch as ReactRouterSwitch, Route} from 'react-router-dom';
import PropTypes from "prop-types";

import Auth from "../Auth/Auth";
import Home from "../Home/Home";
import Contacts from "../Contacts/Contacts";
import Mail from "../Mail/Mail";

const Switch = ({isUserLogged}) => (
    <ReactRouterSwitch>
        {isUserLogged ?
            (
                <>
                    <Route path="/" exact component={Home}/>
                    <Route path="/contacts" component={Contacts}/>
                    <Route path="/mail" component={Mail}/>
                </>
            ) :
            (
                <Route path="/auth" component={Auth}/>
            )
        }
    </ReactRouterSwitch>
)

export default Switch;

Switch.propTypes = {
    isUserLogged: PropTypes.bool.isRequired,
}
