/* eslint-disable class-methods-use-this */
import React from 'react';
import {
    Checkbox, ListItemText, MenuItem, Select, InputLabel, FormControl,
} from '@material-ui/core';

class SelectFactory {
    getType() {
        return 'select';
    }

    create(props) {
        const { column, onChange, value } = props;
        const multiple = column.filter.options && !!column.filter.options.multiple;
        const selectValue = multiple && !Array.isArray(value) ? [value].filter((element) => element !== '') : value;

        return (
            <FormControl variant="outlined" size="small">
                <InputLabel id="simple-select">{column.label}</InputLabel>
                <Select
                    labelId="simple-select"
                    onChange={onChange}
                    className="filter-basic-style"
                    value={selectValue}
                    multiple={multiple}
                    renderValue={(selected) => {
                        if (Array.isArray(selected)) {
                            return `${column.messages[selected[0]]}${selected.length > 1 ? ` +${selected.length - 1}` : ''}`;
                        }

                        return column.messages[selected];
                    }}
                >
                    {!multiple && (
                        <MenuItem value="">
                            <ListItemText primary="Aucun" />
                        </MenuItem>
                    )}
                    {Object.entries(column.messages).map((option) => (
                        <MenuItem key={option[0]} value={option[0]}>
                            {multiple && <Checkbox checked={value.indexOf(option[0]) > -1} color="primary" />}
                            <ListItemText primary={option[1]} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
}

export default SelectFactory;
