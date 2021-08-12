import React, { useState } from 'react';
import {
    Grid, FormControl, InputLabel, Select, MenuItem,
} from '@material-ui/core';
import PropTypes from 'prop-types';

function BooleanFilter({ column }) {
    const [value, setValue] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <Grid item className="filter-basic-style">
            <FormControl style={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-label">{column.label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    onChange={handleChange}
                >
                    <MenuItem value>Oui</MenuItem>
                    <MenuItem value={false}>Non</MenuItem>
                </Select>
            </FormControl>
        </Grid>
    );
}

export default BooleanFilter;

BooleanFilter.propTypes = {
    column: PropTypes.objectOf(Object).isRequired,
};
