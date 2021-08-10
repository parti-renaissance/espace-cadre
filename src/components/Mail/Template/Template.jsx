import React from 'react';

import { Grid } from '@material-ui/core';
import Editor from './Editor';
import TemplateSelect from './TemplateSelect';
import SendForm from './SendForm';

const Template = () => (
    <>
        <Grid container className="dc-container row-above-editor">
            <Grid item xs={12}>
                <TemplateSelect />
            </Grid>
            <Grid item xs={12}>
                <SendForm />
            </Grid>

        </Grid>

        <Editor />
    </>
);

export default Template;
