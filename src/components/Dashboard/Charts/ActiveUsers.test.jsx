import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ActiveUsers from './ActiveUsers';

const data = [
    { date: '16/04', unique_user: 4, days_users: 56 },
    { date: '17/04', unique_user: 4, days_users: 43 },
    { date: '18/04', unique_user: 6, days_users: 41 },
    { date: '19/04', unique_user: 10, days_users: 42 },
];

afterEach(cleanup);

describe('ActiveUsers graph', () => {
    it('renders without crashing', () => {
        render(<ActiveUsers
            title="Évolution du nombre d'utilisateurs actifs"
            data={data}
        />);
    });
});
