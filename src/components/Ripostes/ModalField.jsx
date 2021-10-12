/* eslint-disable react/forbid-prop-types */
import React from 'react';
import {
    makeStyles, createStyles, TextField, Box,
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => createStyles({
    textField: {
        border: `1px solid ${theme.palette.gray200}`,
        borderRadius: '8px',
        margin: '8px 0',
    },
    errorMessage: {
        color: 'red',
        fontSize: '10px',
        background: theme.palette.statusError,
        padding: '6px 16px',
    },
}));

const ModalField = ({ formik, label }) => {
    const classes = useStyles();

    return (
        <>
            <TextField
                fullWidth
                className={classes.textField}
                size="small"
                variant="outlined"
                id={label}
                name={label}
                inputProps={{
                    maxLength: 255,
                }}
                value={formik.values.label}
                onChange={formik.handleChange}
            />
            {formik.touched.label && <Box className={classes.errorMessage}> {formik.errors.label} </Box>}
        </>
    );
};

export default ModalField;

ModalField.propTypes = {
    formik: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
};
