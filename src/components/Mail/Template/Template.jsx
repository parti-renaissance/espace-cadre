import React from 'react';
import { Container } from '@material-ui/core';
import Filters from './Filters';
import SendForm from './SendForm';
import TemplateSelect from './TemplateSelect';
import Editor from './Editor';

const Template = () => (
    <Container maxWidth="xl">
        <Filters />
        <SendForm />
        <TemplateSelect />
        <Editor />
    </Container>
);

export default Template;
