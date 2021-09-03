/* eslint-disable class-methods-use-this */
import React from 'react';
import { TextField, Grid } from '@material-ui/core';

class TextFactory {
    getType() {
        return 'string';
    }

    create(props) {
        const { column, onChange, value } = props;

        return (
            <Grid item xs={12} sm={6} md={4} lg>
                <TextField
                    placeholder={column.label}
                    variant="outlined"
                    value={value}
                    size="small"
                    key={column.key}
                    onChange={onChange}
                    className="filter-basic-style"
                />
            </Grid>
        );
    }
}

export default TextFactory;
