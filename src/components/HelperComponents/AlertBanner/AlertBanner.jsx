/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Alert from '@material-ui/lab/Alert';
import {
    makeStyles, createStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => createStyles({
    errorMessage: {
        color: theme.palette.statusError,
        background: theme.palette.backgroundError,
        borderRadius: '8.35px',
        elevation: 'none',
    },
}));

function AlertBanner({ severity, message }) {
    const classes = useStyles();

    const formatMessage = () => {
        if (typeof message === 'object') {
            return (
                <Alert className={classes.errorMessage} elevation={0} variant="filled" severity={severity}>
                    {message.message}
                </Alert>
            );
        }
        return (
            <Alert className={classes.errorMessage} elevation={0} variant="filled" severity={severity}>
                {message}
            </Alert>
        );
    };

    return (
        <>
            {message && formatMessage()}
        </>
    );
}

export default AlertBanner;

AlertBanner.propTypes = {
    severity: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
};
