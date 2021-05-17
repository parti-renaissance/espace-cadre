import React from 'react';

import Editor from './Editor';
import TemplateSelect from './TemplateSelect';
import SendForm from './SendForm';

const Template = () => (
    <>
        <div className="dc-container row-above-editor p-3 mb-3">
            <TemplateSelect />
            <SendForm />
        </div>

        <Editor />
    </>
);

export default Template;
