import {useEffect} from "react";
import {useSelector} from "react-redux";
import {Route, Switch, useLocation} from "react-router-dom";

import {getCurrentUser, isUserLogged} from "../../redux/user/selectors";

import Sidebar from '../Sidebar/Sidebar';
import Home from "../Home/Home";
import Contacts from "../Contacts/Contacts";
import Mail from "../Mail/Mail";
import Auth from "../Auth/Auth";
import {useGetUserData, useInitializeAuth} from "../../redux/auth/hooks";

const Root = ({children}) => {
    const isUserLoggedIn = useSelector(isUserLogged);
    const initializeAuth = useInitializeAuth();
    const {pathname} = useLocation();
    const currentUser = useSelector(getCurrentUser);
    const [, updateUserData] = useGetUserData();

    useEffect(() => {
        if (isUserLoggedIn) {
            if (currentUser === null) {
                updateUserData();
            }
        } else {
            if (pathname !== '/auth') {
                initializeAuth()
            }
        }
    }, [isUserLoggedIn]);

    return (
        <div>
            {isUserLoggedIn ?
                <>
                    <Sidebar/>
                    <div className="page-content p-3" id="content">
                        <div>
                            <button
                                id="sidebarCollapse"
                                type="button"
                                className="btn btn-light bg-white rounded-pill shadow-sm mb-4"
                            >
                                <i className="fa fa-bars"/>
                            </button>
                            {currentUser && <div>Hello {currentUser.firstName}!</div>}
                        </div>

                        <Switch>
                            <Route path="/" exact component={Home}/>
                            <Route path="/contacts" component={Contacts}/>
                            <Route path="/mail" component={Mail}/>
                        </Switch>
                    </div>
                </>
            :
                <Switch>
                    <Route path="/auth" component={Auth}/>
                </Switch>
            }
        </div>
    )
}

export default Root;
