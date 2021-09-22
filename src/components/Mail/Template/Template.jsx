import React from 'react';
import { Container } from '@material-ui/core';
import Editor from './Editor';
import TemplateSelect from './TemplateSelect';
import SendForm from './SendForm';

const Template = () => (
    <Container maxWidth="xl">
        <SendForm />
        <TemplateSelect />
        <Editor />
    </Container>
);

export default Template;
