import React from 'react';
import { render, screen } from '@testing-library/react';
import Template from '../components/Mail/Template/Template';

describe('Behaviour for template block', () => {
    test('When the user arrives on the page, save and send buttons are disabled', () => {
        render(<Template />);
        const saveButton = screen.getByRole('button', { name: 'Sauvegarder' });
        const sendButton = screen.getByRole('button', { name: 'Envoyer e-mail' });

        expect(saveButton).toBeDisabled();
        expect(sendButton).toBeDisabled();
    });
});
