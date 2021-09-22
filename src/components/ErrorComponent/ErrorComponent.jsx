/* eslint-disable react/prop-types */
import React from 'react';
import { Box, makeStyles, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => createStyles({
    errorBox: {
        textAlign: 'center',
        color: theme.palette.redError,
        width: '100%',
        marginBottom: '16px',
        borderRadius: '6px',
    },
}));

function ErrorComponent({ errorMessage }) {
    const classes = useStyles();

    return (
        <Box className={`with-background ${classes.errorBox}`}>
            <div className="chart-error">{errorMessage && errorMessage.message}</div>
        </Box>
    );
}

export default ErrorComponent;
