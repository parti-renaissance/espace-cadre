import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useInitializeAuth, useRequestAccessToken} from "../../redux/auth/hooks";
import {useDispatch} from "react-redux";
import {userLoggedIn} from '../../redux/auth/';

const Auth = () => {
    const {search} = useLocation();
    const initializeAuth = useInitializeAuth();
    const [, requestAccessToken] = useRequestAccessToken();

    const params = new URLSearchParams(search);
    const code = params.get('code');

    useEffect(() => {
        console.log('auth...');

        if (typeof code === 'string' && code.length > 0) {
            requestAccessToken(code);
            console.log('here 123');

        } else {
            initializeAuth();
        }
    }, [code]);

    return <div>Loading...</div>
}

export default Auth;
