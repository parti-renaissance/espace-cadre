import React from 'react';
import { render } from '@testing-library/react';
import ActiveUsers from './ActiveUsers';

describe('ActiveUsers graph', () => {
    test('renders without crashing', () => {
        render(<ActiveUsers />);
    });
});
