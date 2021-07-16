/* eslint-disable react/prop-types */
import React from 'react';

function ErrorComponent({ errorMessage }) {
    return (
        <div className="chart-error text-danger text-center">{errorMessage && errorMessage.message}</div>
    );
}

export default ErrorComponent;
