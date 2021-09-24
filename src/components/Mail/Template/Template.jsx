import React from 'react';
import { Container } from '@material-ui/core';
import SendForm from './SendForm';
import Editor from './Editor';

const Template = () => (
    <Container maxWidth="xl">
        <SendForm />
        <Editor />
    </Container>
);

export default Template;
