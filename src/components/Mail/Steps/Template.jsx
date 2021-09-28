/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import { createStyles, makeStyles, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import Editor from '../Template/Editor';
import StepButton from '../StepButton';
import { useTemplateContent } from '../../../redux/template/hooks';
import { clearBody } from '../utils';
import { apiClient } from '../../../services/networking/client';
import { useUserScope } from '../../../redux/user/hooks';

const useStyles = makeStyles((theme) => createStyles({
    mailObject: {
        width: '100%',
        border: `1px solid ${theme.palette.gray200}`,
        borderRadius: '8px',
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

            <TextField
                size="small"
                label="Objet du mail"
                variant="outlined"
                className={classes.mailObject}
                // error={buttonState.inputError}
                defaultValue={emailSubject}
                onChange={(event) => updateEmailSubjectCallback(event.target.value)}
            />

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
