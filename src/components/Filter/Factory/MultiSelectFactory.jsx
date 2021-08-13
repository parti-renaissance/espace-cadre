/* eslint-disable class-methods-use-this */
import React from 'react';
import {
    MenuItem, Input, Checkbox, ListItemText,
} from '@material-ui/core';
import Select from '../Field/Select';

class MultiSelectFactory {
    getType() {
        return 'multiselect';
    }

    create({ column, onChange, value }) {
        return (
            <Select
                key={column.key}
                label={column.label}
                onChange={onChange}
                className="filter-basic-style"
                input={<Input />}
                multiple
                renderValue={(selected) => selected.join(', ')}
            >
                {Object.entries(column.filter.options.choices).map((option) => (
                    <MenuItem key={option} value={option[0]}>
                        <Checkbox checked={value.indexOf(option[0]) > -1} />
                        <ListItemText primary={option[1]} />
                    </MenuItem>
                ))}
            </Select>
        );
    }
}

export default MultiSelectFactory;
