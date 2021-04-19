import axios from 'axios';

import { getAccessToken as selectorGetAccessToken } from '../../redux/user/selectors';
import { store } from '../../redux/store';
import { userLogout } from '../../redux/auth';

const API_BASE_URL = `${process.env.REACT_APP_OAUTH_HOST}/api`;

function handleHttpError(error) {
    if (error.response.status === 401) {
        store.dispatch(userLogout());
    }

    throw error;
}

class ApiClient {
    constructor(baseURL) {
        this.client = axios.create({ baseURL });
    }

    static getAccessToken() {
        return selectorGetAccessToken(store.getState());
    }

    async request(method, endpoint, data = null) {
        const config = {
            method,
            url: endpoint,
            headers: {
                Authorization: `Bearer ${ApiClient.getAccessToken()}`,
            },
        };

        if (['post', 'put', 'patch'].includes(method) && data) {
            config.data = data;
        }

        try {
            const result = await this.client.request(config);

            return result.data;
        } catch (error) {
            return handleHttpError(error);
        }
    }

    get(endpoint) {
        return this.request('GET', endpoint);
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
export const apiClientProxy = new ApiClient(`${API_BASE_URL}/v3/internal/${process.env.REACT_APP_INTERNAL_APP_ID}`);
