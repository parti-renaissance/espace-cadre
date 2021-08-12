import React from 'react';
import {
    Grid, TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';

function TextFilter({ column }) {
    return (
        <Grid item className="filter-basic-style">
            <form noValidate autoComplete="off">
                <TextField
                    label={column.label}
                />
            </form>
        </Grid>
    );
}

export default TextFilter;

TextFilter.propTypes = {
    column: PropTypes.objectOf(Object).isRequired,
};
