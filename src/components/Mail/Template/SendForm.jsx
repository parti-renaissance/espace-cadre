import React, { useEffect, useState } from 'react';

import Loader from '../../Loader';
import { apiClient } from '../../../services/networking/client';
import { useTemplateContent } from '../../../redux/template/hooks';

const BUTTON_INITIAL_STATE = { state: 'send', isLoading: false, inputError: false };
const EMAIL_INITIAL_STATE = { synchronized: false };

const SendForm = () => {
    const [content] = useTemplateContent();
    const [emailSubject, setEmailSubject] = useState('');
    const [buttonState, setButtonState] = useState(BUTTON_INITIAL_STATE);
    const [email, setEmail] = useState(EMAIL_INITIAL_STATE);

    const resetEmailState = () => {
        setEmail((state) => ({ ...state, ...EMAIL_INITIAL_STATE }));
        setButtonState(BUTTON_INITIAL_STATE);
    };

    function clearBody(body) {
        return body.substring(body.indexOf('<table'), body.lastIndexOf('</table>') + 8);
    }

    useEffect(resetEmailState, [content]);

    const handleSendEmail = async (test = false) => {
        if (test) {
            await apiClient.post(`/v3/adherent_messages/${email.uuid}/send-test`);

            return;
        }

        if (!email.synchronized || email.recipient_count < 1) {
            throw new Error('Send not allowed');
        }

        setButtonState((state) => ({ ...state, ...{ isLoading: true } }));

        const response = await apiClient.post(`/v3/adherent_messages/${email.uuid}/send`);

        setEmail((state) => ({ ...state, ...{ synchronized: false } }));

        if (response === 'OK') {
            setButtonState((state) => ({ ...state, ...{ state: 'success', isLoading: false } }));
        } else {
            setButtonState((state) => ({ ...state, ...{ state: 'error', isLoading: false } }));
        }
    };

    const editEmail = async () => {
        const body = {
            type: 'candidate',
            label: `DataCorner: ${emailSubject}`,
            subject: emailSubject,
            content: clearBody(content.chunks.body),
        };

        if (email.uuid) {
            return apiClient.put(`/v3/adherent_messages/${email.uuid}`, body);
        }

        return apiClient.post('/v3/adherent_messages', body);
    };

    const getEmailStatus = (uuid) => apiClient.get(`/v3/adherent_messages/${uuid}`);

    const handleClickSendButton = async () => {
        setButtonState((state) => ({ ...state, ...{ isLoading: true } }));

        // step 1: create email
        const response = await editEmail();
        setEmail((state) => ({ ...state, ...response }));

        // step 2: check email status
        let callCount = 0;
        const emailUuid = response.uuid || email.uuid;

        if (!emailUuid) {
            return;
        }

        const timer = setInterval(async () => {
            const emailStatusResponse = await getEmailStatus(emailUuid);

            // eslint-disable-next-line no-plusplus
            if (++callCount >= 10 || (emailStatusResponse.synchronized === true)) {
                clearInterval(timer);
                setEmail((state) => ({ ...state, ...emailStatusResponse }));
                setButtonState((state) => ({ ...state, ...{ state: 'confirme', isLoading: false } }));
            }
        }, 2000);
    };

    let sendButton;

    if (buttonState.state === 'send') {
        const disableState = !content || buttonState.isLoading || !emailSubject;
        sendButton = (
            <button
                className={`btn ${disableState ? 'disabled' : null} btn-dc-primary btn-block`}
                type="button"
                onClick={disableState ? null : handleClickSendButton}
                onMouseEnter={() => setButtonState((state) => ({ ...state, ...{ inputError: !emailSubject } }))}
                onMouseLeave={() => setButtonState((state) => ({ ...state, ...{ inputError: false } }))}
            >
                <span className="mr-2">
                    {buttonState.isLoading ? <Loader /> : <i className="fa fa-paper-plane-o" />}
                </span>
                Préparer l’envoi
            </button>
        );
    } else if (buttonState.state === 'confirme') {
        sendButton = (
            <>
                <div className="btn-group btn-block" role="group">
                    <button
                        className="btn btn-dc-primary"
                        type="button"
                        onClick={() => handleSendEmail()}
                        disabled={!email.recipient_count || email.recipient_count < 1}
                    >
                        <span className="mr-2">
                            {buttonState.isLoading ? <Loader /> : <i className="fa fa-paper-plane-o" />}
                        </span>
                        Envoyer
                    </button>

                    <button
                        type="button"
                        className="btn btn-dc-outline-primary text-nowrap"
                        onClick={() => handleSendEmail(true)}
                    >
                        M’envoyer un test
                    </button>
                </div>
                <div className="text-center font-weight-light mt-2">
                    {email.recipient_count} contact{email.recipient_count > 1 && 's'}
                </div>
            </>
        );
    } else if (buttonState.state === 'success') {
        sendButton = (
            <button className="btn btn-outline-success btn-block" type="button" disabled>
                <span className="mr-2">
                    <i className="fa fa-check" />
                </span>
                E-mail envoyé 🎉
            </button>
        );
    } else if (buttonState.state === 'error') {
        sendButton = (
            <button className="btn btn-outline-danger btn-block" type="button" disabled>
                <span className="mr-2">
                    <i className="fa fa-bomb" />
                </span>
                Une erreur est survenue
            </button>
        );
    }

    return (
        <div className="row">
            <div className="col-12 col-md-8 mb-3 mb-md-0 mailObject">
                <input
                    type="text"
                    className={`form-control ${buttonState.inputError ? 'is-invalid' : ''}`}
                    placeholder="Objet du mail"
                    required
                    value={emailSubject}
                    onChange={(event) => setEmailSubject(event.target.value)}
                />
            </div>
            <div className="col-12 col-md-4 mb-md-0 no-gutters">
                {sendButton}
            </div>
        </div>
    );
};

export default SendForm;
