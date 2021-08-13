/* eslint-disable class-methods-use-this */
import React from 'react';
import { MenuItem } from '@material-ui/core';
import Select from '../Field/Select';

class SelectFactory {
    getType() {
        return 'select';
    }

    create({ column, onChange }) {
        return (
            <Select
                key={column.key}
                label={column.label}
                onChange={onChange}
                className="filter-basic-style"
            >
                {Object.entries(column.filter.options.choices).map((option, index) => (
                    <MenuItem value={option[0]} key={index}>
                        {option[1]}
                    </MenuItem>
                ))}
            </Select>
        );
    }
}

export default SelectFactory;
