/* eslint-disable class-methods-use-this */
import React from 'react';
import { DatePicker } from '@material-ui/pickers';
import { makeStyles, Grid } from '@material-ui/core';
import { format } from 'date-fns';

const useStyles = makeStyles((theme) => ({
    datePicker: {
        background: theme.palette.whiteCorner,
        width: '100%',
        borderRadius: '8px',
    },
}));

class DateIntervalFactory {
    getType() {
        return 'date_interval';
    }

    create(props) {
        const { filter, onChange, value } = props;
        const classes = useStyles();

        return (
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <DatePicker
                        openTo="year"
                        disableToolbar
                        inputVariant="outlined"
                        variant="inline"
                        size="small"
                        label={`${filter.label} du`}
                        format="dd/MM/yyyy"
                        value={value === '' || value.start === undefined ? null : value.start}
                        onChange={(e) => {
                            onChange({ ...value, ...{ start: format(e, 'yyyy-MM-dd') } });
                        }}
                        className={classes.datePicker}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <DatePicker
                        openTo="year"
                        disableToolbar
                        inputVariant="outlined"
                        variant="inline"
                        size="small"
                        label={`${filter.label} au`}
                        format="dd/MM/yyyy"
                        value={value === '' || value.end === undefined ? null : value.end}
                        onChange={(e) => {
                            onChange({ ...value, ...{ end: format(e, 'yyyy-MM-dd') } });
                        }}
                        className={classes.datePicker}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default DateIntervalFactory;
