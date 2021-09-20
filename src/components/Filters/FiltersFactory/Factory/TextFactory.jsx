/* eslint-disable class-methods-use-this */
import React from 'react';
import { TextField, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        border: 'none',
    },
    filterBasicStyle: {
        height: '39px',
        background: theme.palette.whiteCorner,
        borderRadius: '8px',
    },
}));

class TextFactory {
    getType() {
        return 'string';
    }

    create(props) {
        const { filter, onChange, value } = props;
        const classes = useStyles();
        return (
            <TextField
                placeholder={filter.label}
                variant="outlined"
                value={value}
                size="small"
                key={filter.code}
                onChange={(e) => onChange(e.target.value)}
                className={classes.filterBasicStyle}
                classes={{ root: classes.root }}
            />
        );
    }
}

export default TextFactory;
