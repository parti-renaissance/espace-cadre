import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import Template from '../components/Mail/Template/Template';

describe('Behaviour for template block', () => {
    test('When the user arrives on the page, save and send buttons are disabled', () => {
        render(
            <Provider store={configureStore()({
                template: {
                    content: null,
                },
            })}
            >
                <Template />
            </Provider>,
        );

        const saveButton = screen.getByRole('button', { name: 'Sauvegarder' });
        const sendButton = screen.getByRole('button', { name: 'Envoyer e-mail' });

        expect(saveButton).toHaveClass('disabled');
        expect(sendButton).toHaveClass('disabled');
    });
});
