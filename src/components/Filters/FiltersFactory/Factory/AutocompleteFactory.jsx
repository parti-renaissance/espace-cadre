/* eslint-disable class-methods-use-this */
import React from 'react';
import { createStyles, FormControl, makeStyles } from '@material-ui/core';
import Autocomplete from '../../Element/Autocomplete';

const useStyles = makeStyles(() => createStyles({
    root: {
        fontFamily: 'Poppins',
        width: '100%',
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
                size="small"
                classes={{ root: classes.root }}
            >
                <Autocomplete
                    classeName={classes.autoComplete}
                    placeholder={filter.label}
                    uri={filter.options.url}
                    value={value}
                    onChange={onChange}
                    queryParam={filter.options.query_param}
                    valueParam={filter.options.value_param}
                    labelParam={filter.options.label_param}
                    required={filter.options.required || false}
                    multiple={filter.options.multiple}
                />
            </FormControl>
        );
    }
}

export default AutocompleteFactory;
