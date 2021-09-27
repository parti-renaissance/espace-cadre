import React, { useState, useEffect } from 'react';
import { Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import SendForm from './SendForm';
import Editor from './Editor';
import Filters from './Filters';
import Loader from '../../Loader';
import { apiClient } from '../../../services/networking/client';
import { useTemplateContent } from '../../../redux/template/hooks';
import { useUserScope } from '../../../redux/user/hooks';

const BUTTON_INITIAL_STATE = { state: 'send', isLoading: false, inputError: false };
const EMAIL_INITIAL_STATE = { synchronized: false };

const Template = () => {
    const [step, setStep] = useState('1');
    const [buttonState, setButtonState] = useState(BUTTON_INITIAL_STATE);
    const [content] = useTemplateContent();
    const [emailSubject, setEmailSubject] = useState('');
    const [email, setEmail] = useState(EMAIL_INITIAL_STATE);
    const [currentScope] = useUserScope();
    const history = useHistory();

    const resetEmailState = () => {
        setEmail((state) => ({ ...state, ...EMAIL_INITIAL_STATE }));
        setButtonState(buttonState);
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
            type: currentScope.code,
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
                setStep('2');
                history.push('filters');
            }
        }, 2000);
    };

    const templateContent = () => {
        if (step === '1') {
            return (
                <>
                    <SendForm
                        buttonState={buttonState}
                        handleClickSendButton={handleClickSendButton}
                        setButtonState={setButtonState}
                        content={content}
                        emailSubject={emailSubject}
                        setEmailSubject={setEmailSubject}
                    />
                    <Editor />
                </>
            );
        } if (step === '2') {
            return (
                <Filters
                    buttonState={buttonState}
                    email={email}
                    handleSendEmail={handleSendEmail}
                />
            );
        }
        return <Loader />;
    };

    return (
        <Container maxWidth="xl">
            {templateContent()}
        </Container>
    );
};

export default Template;
