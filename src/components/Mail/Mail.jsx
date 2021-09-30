import React, { useState } from 'react';
import {
    Container,
} from '@material-ui/core';
import Template from './Steps/Template';
import Filters from './Steps/Filters';
import Confirmation from './Steps/Confirmation';

const STEP_TEMPLATE = 'template';
const STEP_FILTER = 'filter';
const STEP_CONFIRMATION = 'confirmation';

const EMAIL_INITIAL_STATE = { synchronized: false };

const Mail = () => {
    const [step, setStep] = useState(STEP_TEMPLATE);
    const [email, setEmail] = useState(EMAIL_INITIAL_STATE);
    const [emailSubject, setEmailSubject] = useState();

    const getContent = () => {
        switch (step) {
        case STEP_FILTER:
            return (
                <Filters
                    previousStepCallback={() => setStep(STEP_TEMPLATE)}
                    email={email}
                />
            );
        case STEP_CONFIRMATION:
            return <Confirmation />;
        default:
            return (
                <Template
                    emailSubject={emailSubject}
                    updateEmailSubjectCallback={setEmailSubject}
                    nextStepCallback={() => setStep(STEP_FILTER)}
                    updateEmailCallback={setEmail}
                    email={email}
                />
            );
        }
    };

    return (
        <Container maxWidth="xl">
            {getContent()}
        </Container>
    );
};

export default Mail;
