import React from 'react';
import Editor from './Editor';
import TemplateSelect from './TemplateSelect';
import SendForm from './SendForm';

const Template = () => (
    <>
        <SendForm />
        <TemplateSelect />
        <Editor />
    </>
);

export default Template;
