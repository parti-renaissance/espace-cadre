/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import {
    Grid, Box, createStyles, makeStyles, TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Editor from '../Template/Editor';
import StepButton from '../Template/StepButton';
import { useTemplateContent } from '../../../redux/template/hooks';
import { clearBody } from '../utils';
import { apiClient } from '../../../services/networking/client';
import { useUserScope } from '../../../redux/user/hooks';

const useStyles = makeStyles((theme) => createStyles({
    pageTitle: {
        fontSize: '24px',
        fontWeight: '400',
        color: theme.palette.blue600,
        marginBottom: '16px',
    },
    objectContainer: {
        background: theme.palette.whiteCorner,
        padding: '16px',
        borderRadius: '12px 12px 0 0',
    },
    mailObject: {
        width: '100%',
        border: `1px solid ${theme.palette.gray200}`,
        borderRadius: '8px',
    },
    buttonContainer: {
        justifyContent: 'spaceBetween',
        marginRight: '16px',
    },
}));

const Template = ({
    email, emailSubject, updateEmailSubjectCallback, nextStepCallback, updateEmailCallback,
}) => {
    const [emailContent] = useTemplateContent();
    const [loading, setLoading] = useState(false);
    const [currentScope] = useUserScope();
    const classes = useStyles();

    const editEmail = async () => {
        const body = {
            type: currentScope.code,
            label: `DataCorner: ${emailSubject}`,
            subject: emailSubject,
            content: clearBody(emailContent.chunks.body),
        };

        if (email.uuid) {
            return apiClient.put(`/v3/adherent_messages/${email.uuid}`, body);
        }

        return apiClient.post('/v3/adherent_messages', body);
    };
    return (
        <>
            <Box className={classes.pageTitle}>Messagerie &gt; Créer un message</Box>
            <Grid container className={classes.objectContainer}>
                <Grid item xs={9} className={classes.buttonContainer}>
                    <TextField
                        size="small"
                        label="Objet du mail"
                        variant="outlined"
                        className={classes.mailObject}
                        defaultValue={emailSubject}
                        onChange={(event) => updateEmailSubjectCallback(event.target.value)}
                    />
                </Grid>
                <Grid item xs>
                    <StepButton
                        label="Suivant"
                        loading={loading}
                        disabled={loading || !emailSubject || !emailContent}
                        onClick={() => {
                            setLoading(true);
                            editEmail().then((body) => {
                                updateEmailCallback(body);
                                nextStepCallback();
                            });
                        }}
                    />
                </Grid>
            </Grid>
            <Editor />
        </>
    );
};

export default Template;

Template.propTypes = {
    email: PropTypes.object.isRequired,
    emailSubject: PropTypes.string,
    updateEmailSubjectCallback: PropTypes.func.isRequired,
    nextStepCallback: PropTypes.func.isRequired,
    updateEmailCallback: PropTypes.func.isRequired,
};
