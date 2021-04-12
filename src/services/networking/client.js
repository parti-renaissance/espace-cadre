import axios from "axios";

import {getAccessToken} from "../../redux/user/selectors";
import store from '../../redux/store';

const API_BASE_URL = `${process.env.REACT_APP_OAUTH_HOST}/api`;

class ApiClient {
    constructor(baseURL) {
        this.client = axios.create({baseURL})
    }

    async request(method, endpoint, data = null) {
        const config = {
            method: method,
            url: endpoint,
            headers: {
                Authorization: `Bearer ${this.getAccessToken()}`
            }
        };

        if (['post', 'put', 'patch'].includes(method) && data) {
            config.data = data;
        }

        const result = await this.client.request(config);
        console.log(result);

        return result.data;
    }

    get(endpoint) {
        return this.request('GET', endpoint);
    }

    getAccessToken() {
        return getAccessToken(store.getState());
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
