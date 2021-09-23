/* eslint-disable class-methods-use-this */
import React from 'react';
import { Grid } from '@material-ui/core';
import DatePicker from '../../Element/DatePicker';

const updateValue = (prevValue, newValue, key, callback) => {
    let copy;

    if (typeof prevValue === 'object') {
        copy = { ...prevValue };
    } else {
        copy = {};
    }

    if (newValue === null) {
        if (copy[key] !== undefined) {
            delete copy[key];
        }
    } else {
        copy[key] = newValue;
    }

    callback(Object.keys(copy).length === 0 ? null : copy);
};

class DateIntervalFactory {
    getType() {
        return 'date_interval';
    }

    create({ filter, onChange, value }) {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <DatePicker
                        filter={filter}
                        value={value === '' || value.start === undefined ? null : value.start}
                        onChange={(newDate) => updateValue(value, newDate, 'start', onChange)}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <DatePicker
                        filter={filter}
                        value={value === '' || value.end === undefined ? null : value.end}
                        onChange={(newDate) => updateValue(value, newDate, 'end', onChange)}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default DateIntervalFactory;
