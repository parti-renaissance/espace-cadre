import React, { useState } from 'react';
import {
    Grid, FormControl, InputLabel, MenuItem, Select,
} from '@material-ui/core';
import PropTypes from 'prop-types';

function SelectFilter({ column }) {
    const [gender, setGender] = useState('');
    const selectOptions = Object.values(column.filter.options.choices);

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    return (
        <Grid item className="filter-basic-style">
            <FormControl style={{ width: '100%' }}>
                <InputLabel id="contacts-single-select">{column.label}</InputLabel>
                <Select
                    labelId="contacts-single-select"
                    id="contacts-single-select-outlined"
                    value={gender}
                    onChange={handleGenderChange}
                    label={column.label}
                >
                    {
                        selectOptions.map((option, index) => (
                            <MenuItem value={option} key={index}>
                                <em>{option.charAt(0).toUpperCase() + option.slice(1)}</em>
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
