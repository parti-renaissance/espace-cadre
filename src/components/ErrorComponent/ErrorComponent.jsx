/* eslint-disable react/prop-types */
import React from 'react';

function ErrorComponent({ errorMessage }) {
    return (
        <div className="with-background w-100" style={{ borderRadius: '6px' }}>
            <div className="chart-error text-danger text-center">{errorMessage && errorMessage.message}</div>
        </div>
    );
}

export default ErrorComponent;
