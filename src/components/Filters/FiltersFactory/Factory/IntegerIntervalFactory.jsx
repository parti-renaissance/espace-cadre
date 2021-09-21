/* eslint-disable class-methods-use-this */
import React from 'react';
import { makeStyles, Grid, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    integerInterval: {
        background: theme.palette.whiteCorner,
        width: '100%',
        borderRadius: '8px',
    },
}));

class IntegerIntervalFactory {
    getType() {
        return 'integer_interval';
    }

    create({ filter, onChange, value }) {
        const classes = useStyles();

        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label={`${filter.label} minimum`}
                        type="number"
                        size="small"
                        variant="outlined"
                        value={value === '' || (typeof value === 'object' && value.min === undefined) ? '' : value.min}
                        className={classes.integerInterval}
                        onChange={(e) => {
                            onChange({ ...value, ...{ min: parseInt(e.target.value, 10) } });
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label={`${filter.label} maximum`}
                        type="number"
                        size="small"
                        variant="outlined"
                        className={classes.integerInterval}
                        value={value === '' || (typeof value === 'object' && value.max === undefined) ? '' : value.max}
                        onChange={(e) => {
                            onChange({ ...value, ...{ max: parseInt(e.target.value, 10) } });
                        }}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default IntegerIntervalFactory;
