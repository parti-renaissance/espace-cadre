/* eslint-disable react/require-default-props */
import React from 'react';

import {
    Grid, Button, TextField, Box, makeStyles, createStyles, Paper,
} from '@material-ui/core';

import PropTypes from 'prop-types';
import Loader from '../../Loader';

const useStyles = makeStyles((theme) => createStyles({
    sendFormPaper: {
        padding: '16px',
        borderRadius: '12px 12px 0 0',
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

const SendForm = ({
    buttonState, setButtonState, handleClickSendButton, emailSubject, setEmailSubject, content,
}) => {
    const classes = useStyles();
    let sendButton;

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
                    Suivant
                </Button>
            </Box>
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

SendForm.propTypes = {
    buttonState: PropTypes.objectOf(Object).isRequired,
    setButtonState: PropTypes.func.isRequired,
    emailSubject: PropTypes.string.isRequired,
    setEmailSubject: PropTypes.func.isRequired,
    content: PropTypes.objectOf(Object),
    handleClickSendButton: PropTypes.func.isRequired,
};
