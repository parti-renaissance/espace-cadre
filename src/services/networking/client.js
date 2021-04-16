import axios from 'axios';

import { getAccessToken } from '../../redux/user/selectors';
import { store } from '../../redux/store';
import {userLogout} from "../../redux/auth";

const API_BASE_URL = `${process.env.REACT_APP_OAUTH_HOST}/api`;

class ApiClient {
    constructor(baseURL) {
        this.client = axios.create({ baseURL });
    }

    async request(method, endpoint, data = null) {
        const config = {
            method,
            url: endpoint,
            headers: {
                Authorization: `Bearer ${this.getAccessToken()}`,
            },
        };

        if (['post', 'put', 'patch'].includes(method) && data) {
            config.data = data;
        }

        try {
            const result = await this.client.request(config);
            return result.data
        } catch (error) {
            handleHttpError(error);
        }
    }

    get(endpoint) {
        return this.request('GET', endpoint);
    }

    getAccessToken() {
        return getAccessToken(store.getState());
    }
}

export const apiClient = new ApiClient(API_BASE_URL);

function handleHttpError(error) {
    if (error.response.status === 401) {
        store.dispatch(userLogout());
    }

    throw error;
}
