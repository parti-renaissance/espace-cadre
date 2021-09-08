/* eslint-disable class-methods-use-this */
import React from 'react';
import { TextField } from '@material-ui/core';

class TextFactory {
    getType() {
        return 'string';
    }

    create(props) {
        const { column, onChange, value } = props;

        return (
            <TextField
                placeholder={column.label}
                variant="outlined"
                value={value}
                size="small"
                key={column.key}
                onChange={onChange}
                className="filter-basic-style"
            />
        );
    }
}

export default TextFactory;
