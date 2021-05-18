import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TextChart from './TextChart';

const adherentsCount = {
    adherentCount: 125185,
    zoneName: 'Île-de-France',
};

test('renders with the correct text and unmount correctly', () => {
    render(<TextChart adherentsCount={adherentsCount} />);
    expect(screen.getByText(`La région ${adherentsCount.zoneName} compte ${adherentsCount.adherentCount} adhérents`)).toBeInTheDocument();
});
