import axios from 'axios';
import qs from 'qs';

const authCall = async (payload) => {
    try {
        const result = await axios.post(
            `${process.env.REACT_APP_OAUTH_HOST}/oauth/v2/token`,
            qs.stringify(payload),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' } },
        );

        return result.data;
    } catch (error) {
        console.log(error);
    }

    return {};
};

const login = async (code) => {
    const result = await authCall({
        client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
        code,
        grant_type: 'authorization_code',
    });

    if (result.access_token) {
        return {
            accessToken: result.access_token,
            refreshToken: result.refresh_token,
            expiresIn: result.expires_in,
        };
    }

    throw new Error('Error!');
};

export default login;
