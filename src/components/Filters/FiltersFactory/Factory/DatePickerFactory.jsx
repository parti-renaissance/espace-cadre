/* eslint-disable class-methods-use-this */
import React, { useState, useEffect } from 'react';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { Paper, makeStyles, createStyles } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';

const useStyles = makeStyles(() => createStyles({
    root: {
        background: 'white',
        width: '230px',
        padding: '0 8px 8px 11px',
    },
}));

class DatePickerFactory {
    getType() {
        return 'date_interval';
    }

    create(props) {
        const { column, onChange } = props;
        const classes = useStyles();
        const [selectedDate, setSelectedDate] = useState(new Date());

        const handleChange = (date) => {
            setSelectedDate(format(date, 'yyyy-MM-dd'));
        };

        useEffect(() => {
            onChange(selectedDate);
        }, [selectedDate]);

        return (
            <Paper classes={{ root: classes.root }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        label={column.label}
                        format="dd/MM/yyyy"
                        value={selectedDate}
                        onChange={handleChange}
                    />
                </MuiPickersUtilsProvider>
            </Paper>
        );
    }
}

export default DatePickerFactory;
