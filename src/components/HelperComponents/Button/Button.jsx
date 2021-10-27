/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { Button as MuiButton, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    root: {
        borderRadius: '8.35px',
        padding: '8px 16px',
    },
});

const Button = ({ text, buttonClasses, handleClick = () => {} }) => {
    const classes = useStyles();

    return (
        <MuiButton
            variant="contained"
            className={`${classes.root} ${buttonClasses}`}
            onClick={handleClick}
        >
            {text}
        </MuiButton>
    );
};

export default Button;

Button.propTypes = {
    text: PropTypes.string.isRequired,
    buttonClasses: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
};
