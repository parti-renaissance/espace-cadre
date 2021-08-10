/* eslint-disable react/prop-types */
import React from 'react';
import { Box } from '@material-ui/core';

function ErrorComponent({ errorMessage }) {
    return (
        <Box className="with-background error-box">
            <div className="chart-error">{errorMessage && errorMessage.message}</div>
        </Box>
    );
}

export default ErrorComponent;
