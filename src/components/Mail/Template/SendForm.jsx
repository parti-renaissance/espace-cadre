import React, { useEffect, useState } from 'react';

import {
    Grid, Button, TextField, ButtonGroup, Box, makeStyles, createStyles, Paper,
} from '@material-ui/core';
import Loader from '../../Loader';
import { apiClient } from '../../../services/networking/client';
import { useTemplateContent } from '../../../redux/template/hooks';
import { useUserScope } from '../../../redux/user/hooks';

const useStyles = makeStyles((theme) => createStyles({
    buttonGroup: {
        width: '100%',
    },
    sendFormPaper: {
        padding: '16px',
        marginBottom: '16px',
        borderRadius: '12px',
    },
    mailObject: {
        width: '100%',
        border: `1px solid ${theme.palette.gray200}`,
        borderRadius: '8px',
    },
    materialButton: {
        width: '100%',
        color: `${theme.palette.whiteCorner}`,
        backgroundColor: theme.palette.blueCorner,
        '&:hover': {
            background: theme.palette.blueCornerHover,
        },
    },
    testButton: {
        color: theme.palette.blueCorner,
        border: `1px solid ${theme.palette.blueCorner}`,
        borderLeft: '0',
        background: theme.palette.whiteCorner,
        width: '100%',
    },
    successButton: {
        width: '100%',
        border: `1px solid ${theme.palette.successButton} !important`,
        color: `${theme.palette.successButton} !important`,
    },
    errorButton: {
        width: '100%',
        border: `1px solid ${theme.palette.redError} !important`,
        color: `${theme.palette.redError} !important`,
    },
    buttonIcon: {
        marginRight: '8px',
    },
    contactsLength: {
        margin: '8px auto 0',
        color: theme.palette.grayCorner3,
    },
}));

const BUTTON_INITIAL_STATE = { state: 'send', isLoading: false, inputError: false };
const EMAIL_INITIAL_STATE = { synchronized: false };

const SendForm = () => {
    const [content] = useTemplateContent();
    const [emailSubject, setEmailSubject] = useState('');
    const [buttonState, setButtonState] = useState(BUTTON_INITIAL_STATE);
    const [email, setEmail] = useState(EMAIL_INITIAL_STATE);
    const [currentScope] = useUserScope();
    const classes = useStyles();
    let sendButton;

    const resetEmailState = () => {
        setEmail((state) => ({ ...state, ...EMAIL_INITIAL_STATE }));
        setButtonState(BUTTON_INITIAL_STATE);
    };

    function clearBody(body) {
        return body.substring(body.indexOf('<table'), body.lastIndexOf('</table>') + 8);
    }

    useEffect(resetEmailState, [content]);

    const handleSendEmail = async (test = false) => {
        if (test) {
            await apiClient.post(`/v3/adherent_messages/${email.uuid}/send-test`);

            return;
        }

        if (!email.synchronized || email.recipient_count < 1) {
            throw new Error('Send not allowed');
        }

        setButtonState((state) => ({ ...state, ...{ isLoading: true } }));

        const response = await apiClient.post(`/v3/adherent_messages/${email.uuid}/send`);

        setEmail((state) => ({ ...state, ...{ synchronized: false } }));

        if (response === 'OK') {
            setButtonState((state) => ({ ...state, ...{ state: 'success', isLoading: false } }));
        } else {
            setButtonState((state) => ({ ...state, ...{ state: 'error', isLoading: false } }));
        }
    };

    const editEmail = async () => {
        const body = {
            type: currentScope.code,
            label: `DataCorner: ${emailSubject}`,
            subject: emailSubject,
            content: clearBody(content.chunks.body),
        };

        if (email.uuid) {
            return apiClient.put(`/v3/adherent_messages/${email.uuid}`, body);
        }

        return apiClient.post('/v3/adherent_messages', body);
    };

    const getEmailStatus = (uuid) => apiClient.get(`/v3/adherent_messages/${uuid}`);

    const handleClickSendButton = async () => {
        setButtonState((state) => ({ ...state, ...{ isLoading: true } }));

        // step 1: create email
        const response = await editEmail();
        setEmail((state) => ({ ...state, ...response }));

        // step 2: check email status
        let callCount = 0;
        const emailUuid = response.uuid || email.uuid;

        if (!emailUuid) {
            return;
        }

        const timer = setInterval(async () => {
            const emailStatusResponse = await getEmailStatus(emailUuid);

            // eslint-disable-next-line no-plusplus
            if (++callCount >= 10 || (emailStatusResponse.synchronized === true)) {
                clearInterval(timer);
                setEmail((state) => ({ ...state, ...emailStatusResponse }));
                setButtonState((state) => ({ ...state, ...{ state: 'confirme', isLoading: false } }));
            }
        }, 2000);
    };

    if (buttonState.state === 'send') {
        const disableState = !content || buttonState.isLoading || !emailSubject;
        sendButton = (
            <Box
                onMouseEnter={() => setButtonState((state) => ({ ...state, ...{ inputError: !emailSubject } }))}
                onMouseLeave={() => setButtonState((state) => ({ ...state, ...{ inputError: false } }))}
            >
                <Button
                    className={classes.materialButton}
                    onClick={disableState ? null : handleClickSendButton}
                    disabled={!!disableState}
                    size="large"
                >
                    <Box className={classes.buttonIcon}>
                        {buttonState.isLoading ? <Loader /> : <i className="fa fa-paper-plane-o" />}
                    </Box>
                    Préparer l’envoi
                </Button>
            </Box>
        );
    } else if (buttonState.state === 'confirme') {
        sendButton = (
            <>
                <ButtonGroup className={classes.buttonGroup}>
                    <Button
                        className={classes.materialButton}
                        type="button"
                        size="large"
                        onClick={() => handleSendEmail()}
                        disabled={!email.recipient_count || email.recipient_count < 1}
                    >
                        <Box className={classes.buttonIcon}>
                            {buttonState.isLoading ? <Loader /> : <i className="fa fa-paper-plane-o" />}
                        </Box>
                        Envoyer
                    </Button>
                    <Button
                        type="button"
                        size="large"
                        className={classes.testButton}
                        onClick={() => handleSendEmail(true)}
                    >
                        M’envoyer un test
                    </Button>
                </ButtonGroup>
                <Grid container>
                    <Grid item className={classes.contactsLength}>
                        {email.recipient_count} contact{email.recipient_count > 1 && 's'}
                    </Grid>
                </Grid>
            </>
        );
    } else if (buttonState.state === 'success') {
        sendButton = (
            <Button
                type="button"
                size="large"
                disabled
                className={classes.successButton}
            >
                <Box component="span" className={classes.buttonIcon}>
                    <i className="fa fa-check" />
                </Box>
                E-mail envoyé 🎉
            </Button>
        );
    } else if (buttonState.state === 'error') {
        sendButton = (
            <Button
                type="button"
                size="large"
                disabled
                className={classes.errorButton}
            >
                <Box component="span" className={classes.buttonIcon}>
                    <i className="fa fa-bomb" />
                </Box>
                Une erreur est survenue
            </Button>
        );
    }

    return (
        <Paper className={classes.sendFormPaper}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <TextField
                        size="small"
                        label="Objet du mail"
                        variant="outlined"
                        className={classes.mailObject}
                        error={buttonState.inputError}
                        value={emailSubject}
                        onChange={(event) => setEmailSubject(event.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    {sendButton}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default SendForm;
