/* eslint-disable class-methods-use-this */
import React from 'react';
import {
    makeStyles, Grid, TextField,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    agePicker: {
        background: theme.palette.whiteCorner,
        width: '100%',
        borderRadius: '8px',
    },
}));

class DateIntervalFactory {
    getType() {
        return 'integer_interval';
    }

    create(props) {
        const { filter, onChange, value } = props;
        const classes = useStyles();

        return (
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label={`${filter.label} minimum`}
                        type="number"
                        variant="outlined"
                        className={classes.agePicker}
                        onChange={(e) => {
                            onChange({ ...value, ...{ min: e.target.value } });
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label={`${filter.label} maximum`}
                        type="number"
                        variant="outlined"
                        className={classes.agePicker}
                        onChange={(e) => {
                            onChange({ ...value, ...{ max: e.target.value } });
                        }}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default DateIntervalFactory;
