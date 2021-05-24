import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ActiveUsers from './ActiveUsers';

describe('ActiveUsers graph', () => {
    test('renders without crashing', () => {
        render(
            <Provider store={configureStore()({
                dashboard: {
                    jemengage_users: null,
                },
            })}
            >
                <ActiveUsers />
            </Provider>,
        );
    });
});
