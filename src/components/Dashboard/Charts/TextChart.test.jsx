import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TextChart from './TextChart';

const adherentsCount = {
    adherentCount: 125185,
    zoneName: 'Île-de-France',
};

afterEach(cleanup);

it('renders with the correct text and unmount correctly', () => {
    const { getByText, unmount } = render(<TextChart adherentsCount={adherentsCount} />);
    expect(getByText('La région Île-de-France compte 125185 adhérents')).toBeInTheDocument();
    unmount();
});
