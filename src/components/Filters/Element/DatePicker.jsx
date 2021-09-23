import React from 'react';
import { format } from 'date-fns';
import { IconButton, makeStyles } from '@material-ui/core';
import { Clear as ClearIcon, Event as EventIcon } from '@material-ui/icons';
import { DatePicker as MuiDatePicker } from '@material-ui/pickers';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    datePicker: {
        background: theme.palette.whiteCorner,
        width: '100%',
        borderRadius: '8px',
    },
}));

const DatePicker = ({ filter, value, onChange }) => {
    const classes = useStyles();

    return (
        <MuiDatePicker
            openTo="year"
            disableToolbar
            inputVariant="outlined"
            variant="inline"
            size="small"
            label={`${filter.label} du`}
            format="dd/MM/yyyy"
            value={value}
            onChange={(e) => {
                onChange(format(e, 'yyyy-MM-dd'));
            }}
            className={classes.datePicker}
            InputProps={{
                endAdornment: (() => {
                    if (!value) {
                        return (
                            <IconButton
                                size="small"
                            ><EventIcon />
                            </IconButton>
                        );
                    }

                    return (
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(null);
                            }}
                        >
                            <ClearIcon />
                        </IconButton>
                    );
                })(),
            }}
        />
    );
};

DatePicker.defaultProps = {
    value: null,
};

DatePicker.propTypes = {
    filter: PropTypes.instanceOf(Object).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default DatePicker;
