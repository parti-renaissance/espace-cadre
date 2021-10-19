/* eslint-disable react/forbid-prop-types */
import React from 'react';
import {
    makeStyles, createStyles, TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import AlertBanner from '../HelperComponents/AlertBanner';

const useStyles = makeStyles((theme) => createStyles({
    textField: {
        border: `1px solid ${theme.palette.gray200}`,
        borderRadius: '8px',
        margin: '8px 0',
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
                multiline={label === 'body'}
                id={label}
                name={label}
                inputProps={{ maxLength: 255 }}
                value={formik.values[label]}
                onChange={formik.handleChange}
            />
            {formik.touched[label] && formik.errors[label] && (<AlertBanner severity="error" message={formik.errors[label]} />)}
        </>
    );
};

export default ModalField;

ModalField.propTypes = {
    formik: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
};
