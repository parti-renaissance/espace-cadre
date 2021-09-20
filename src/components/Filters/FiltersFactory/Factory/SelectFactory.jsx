/* eslint-disable class-methods-use-this */
import React from 'react';
import {
    Checkbox, ListItemText, MenuItem, Select, InputLabel, FormControl, makeStyles, createStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        fontFamily: 'Poppins',
        width: '100%',
    },
    filterBasicStyle: {
        height: '40px',
        background: theme.palette.whiteCorner,
        borderRadius: '8px',
    },
    select: {
        '&:focus': {
            background: theme.palette.whiteCorner,
            borderRadius: '8px',
        },
    },
    label: {
        marginTop: '1px',
        fontSize: '14px',
    },
}));

class SelectFactory {
    getType() {
        return 'select';
    }

    create(props) {
        const { filter, onChange, value } = props;
        const multiple = filter.options && !!filter.options.multiple;
        const selectValue = multiple && !Array.isArray(value) ? [value].filter((element) => element !== '') : value;
        const classes = useStyles();

        return (
            <FormControl
                variant="outlined"
                size="small"
                classes={{ root: classes.root }}
            >
                <InputLabel id="simple-select" className={classes.label}>{filter.label}</InputLabel>
                <Select
                    labelId="simple-select"
                    onChange={(e) => onChange(e.target.value)}
                    className={classes.filterBasicStyle}
                    classes={{ root: classes.select }}
                    value={selectValue}
                    size="small"
                    multiple={multiple}
                    renderValue={(selected) => {
                        if (Array.isArray(selected)) {
                            return `${filter.options.choices[selected[0]]}${selected.length > 1 ? ` +${selected.length - 1}` : ''}`;
                        }

                        return filter.options.choices[selected];
                    }}
                >
                    {/* {!multiple && (
                        <MenuItem value="">
                            <ListItemText primary="Aucun" />
                        </MenuItem>
                    )} */}
                    {Object.entries(filter.options.choices).map((option) => (
                        <MenuItem key={option[0]} value={option[0]}>
                            {multiple && <Checkbox checked={value !== null && value.indexOf(option[0]) > -1} color="primary" />}
                            <ListItemText primary={option[1]} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
}

export default SelectFactory;
