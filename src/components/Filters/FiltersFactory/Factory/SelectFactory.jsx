import {
    Checkbox, ListItemText, MenuItem, Select, InputLabel, FormControl, makeStyles, createStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => createStyles({
    formControl: {
        width: '100%',
        "& .MuiOutlinedInput-notchedOutline": {
            border: "none"
        }
    },
    select: {
        background: theme.palette.whiteCorner,
        borderRadius: '8.35px',

        '&:focus': {
            background: theme.palette.whiteCorner,
            borderRadius: '8.35px',
        },
    },
}));

class SelectFactory {
    getType() {
        return 'select';
    }

    create({ filter, onChange, value }) {
        const multiple = filter.options && !!filter.options.multiple;
        const selectValue = multiple && !Array.isArray(value) ? [value].filter((element) => element !== '') : value;
        const classes = useStyles();

        return (
            <FormControl
                variant="outlined"
                size="small"
                className={ classes.formControl }
            >
                <InputLabel id="simple-select">{filter.label}</InputLabel>
                <Select
                    labelId="simple-select"
                    native
                    inputProps={{
                        toto: "Xavier"
                    }}
                    onChange={(e) => onChange(e.target.value)}
                    classes={{ root: classes.select }}
                    value={selectValue}
                    multiple={multiple}
                    renderValue={(selected) => {
                        if (Array.isArray(selected)) {
                            return `${filter.options.choices[selected[0]]}${selected.length > 1 ? ` +${selected.length - 1}` : ''}`;
                        }

                        return filter.options.choices[selected];
                    }}
                >
                    {!multiple && (
                        <MenuItem value={null}>
                            <ListItemText primary="Tous" />
                        </MenuItem>
                    )}
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
