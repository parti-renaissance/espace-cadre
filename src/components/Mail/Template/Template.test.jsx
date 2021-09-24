import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import Template from './Template';

describe('Behaviour for template block', () => {
    it('When the user arrives on the page, save and send buttons are disabled', () => {
        render(
            <Provider store={configureStore()({
                auth: {},
                template: {
                    content: null,
                },
            })}
            >
                <Template />
            </Provider>,
        );

        const saveButton = screen.getByRole('button', { name: 'Sauvegarder' });
        const sendButton = screen.getByRole('button', { name: 'Préparer l’envoi' });

        expect(saveButton).toBeDisabled();
        expect(sendButton).toHaveClass('disabled');
    });
});
