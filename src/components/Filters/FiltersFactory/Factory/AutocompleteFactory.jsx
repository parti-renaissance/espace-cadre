/* eslint-disable class-methods-use-this */
import React from 'react';
import { createStyles, FormControl, makeStyles } from '@material-ui/core';
import Autocomplete from '../../Element/Autocomplete';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        fontFamily: 'Poppins',
        width: '100%',
    },
    filterBasicStyle: {
        background: theme.palette.whiteCorner,
        borderRadius: '8px',
    },
    select: {
        '&:focus': {
            background: theme.palette.whiteCorner,
            borderRadius: '8px',
        },
    },
}));

class AutocompleteFactory {
    getType() {
        return 'autocomplete';
    }

    create({ filter, onChange, value }) {
        const classes = useStyles();

        return (
            <FormControl
                variant="outlined"
                size="small"
                classes={{ root: classes.root }}
            >
                <Autocomplete
                    placeholder={filter.label}
                    uri={filter.options.url}
                    value={value}
                    onChange={onChange}
                    queryParam={filter.options.query_param}
                    valueParam={filter.options.value_param}
                    labelParam={filter.options.label_param}
                    multiple={filter.options.multiple}
                />
            </FormControl>
        );
    }
}

export default AutocompleteFactory;
