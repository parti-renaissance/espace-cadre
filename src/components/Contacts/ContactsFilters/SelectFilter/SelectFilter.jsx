import React, { useState } from 'react';
import {
    Grid, FormControl, InputLabel, MenuItem, Select,
} from '@material-ui/core';
import PropTypes from 'prop-types';

function SelectFilter({ column }) {
    const [value, setValue] = useState('');
    const selectOptions = Object.entries(column.messages);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <Grid item className="filter-basic-style">
            <FormControl style={{ width: '100%' }}>
                <InputLabel id="contacts-single-select">{column.label}</InputLabel>
                <Select
                    labelId="contacts-single-select"
                    id="contacts-single-select-outlined"
                    value={value}
                    onChange={handleChange}
                    label={column.label}
                >
                    {
                        selectOptions.map((option, index) => (
                            <MenuItem value={option[0]} key={index}>
                                {option[1]}
                            </MenuItem>
                        ))
                    }

                </Select>
            </FormControl>
        </Grid>
    );
}

export default SelectFilter;

SelectFilter.propTypes = {
    column: PropTypes.objectOf(Object).isRequired,
};
