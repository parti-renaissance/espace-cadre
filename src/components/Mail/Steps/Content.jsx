import React, { useState } from 'react';
import Template from './Template';
import Filters from './Filters';

const STEP_TEMPLATE = 'template';
const STEP_FILTER = 'filter';

const EMAIL_INITIAL_STATE = { synchronized: false };

function Content() {
    const [step, setStep] = useState(STEP_TEMPLATE);
    const [email, setEmail] = useState(EMAIL_INITIAL_STATE);
    const [emailSubject, setEmailSubject] = useState();

    switch (step) {
    case STEP_FILTER:
        return (
            <Filters
                previousStepCallback={() => setStep(STEP_TEMPLATE)}
                email={email}
            />
        );
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
}

export default Content;
