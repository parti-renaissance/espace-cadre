import {useSelector} from 'react-redux';
import {OAUTH_CLIENT_ID, OAUTH_HOST} from '../../config';
import {getCurrentUser} from '../user/selectors';
import {useLocation} from 'react-router-dom';

const useAuth = () => {
    const user = useSelector(getCurrentUser);

    const {search} = useLocation();

    const params = new URLSearchParams(search);
    const code = params.get('code');

    if (typeof code === 'string' && code.length > 0) {
        console.log('get access token');
        return null;
    }

    if (user === null) {
        console.log('redirect to ' + buildAuthorizationUrl());
        //window.location.href = buildAuthorizationUrl();
        return null;
    }

    return user;
}

function buildAuthorizationUrl() {
    return `${OAUTH_HOST}?response_type=code&client_id=${OAUTH_CLIENT_ID}`;
}

export default useAuth;
