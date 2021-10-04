/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import {
    Button, Box, makeStyles, createStyles,
} from '@material-ui/core';
import Loader from '../Loader';

const useStyles = makeStyles((theme) => createStyles({
    sendButton: {
        color: theme.palette.whiteCorner,
        background: theme.palette.blue600,
        '&:hover': {
            background: theme.palette.blue800,
        },
    },
    success: {
        color: `${theme.palette.successButton} !important`,
        background: `${theme.palette.whiteCorner} !important`,
    },
    error: {
        color: `${theme.palette.redError} !important`,
        background: `${theme.palette.redError} !important`,
    },
    buttonIcon: {
        marginRight: '8px',
    },
}));

const SendButton = ({
    loadingSendButton, audienceSegment, handleSendEmail,
}) => {
    const classes = useStyles();

    if (loadingSendButton.state === 'error') {
        return (
            <Button
                variant="contained"
                size="medium"
                className={classes.error}
                disabled
            >
                <Box>
                    <i className={`fa fa-bomb ${classes.buttonIcon}`} />
                </Box>
                Une erreur est survenue
            </Button>
        );
    }
    return (
        <Button
            variant="contained"
            size="medium"
            className={classes.sendButton}
            onClick={() => handleSendEmail()}
            disabled={!audienceSegment?.synchronized || audienceSegment?.recipient_count < 1}
        >
            <Box>
                {loadingSendButton.isLoading ? <Loader /> : <i className={`fa fa-paper-plane-o ${classes.buttonIcon}`} />}
            </Box>
            Envoyer l&apos;email
        </Button>
    );
};

export default SendButton;

SendButton.propTypes = {
    loadingSendButton: PropTypes.objectOf(Object).isRequired,
    audienceSegment: PropTypes.objectOf(Object),
    handleSendEmail: PropTypes.func.isRequired,
};
