import { useEffect, useState } from 'react';
import { Autocomplete as MuiAutocomplete } from '@material-ui/lab';
import { TextField, Typography, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { throttle, unionBy } from 'lodash';
import { apiClient } from '../../../services/networking/client';

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.whiteCorner,
        borderRadius: '8.35px',
    },
}));

const fetch = throttle((uri, queryParam, query, callback) => {
    apiClient.get(`${uri}?${queryParam}=${query}`).then(callback);
}, 500);

const Autocomplete = ({
    uri, placeholder, queryParam, valueParam, multiple, onChange, value, required, autoCompleteStyle, getOptionLabel,
}) => {
    const [inputValue, setInputValue] = useState(null);
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        if (value === '' && selectedItems.length) {
            setSelectedItems([]);
            return;
        }

        if (!inputValue) {
            return;
        }

        setLoading(true);

        fetch(uri, queryParam, inputValue, (data) => {
            setOptions(unionBy(selectedItems, data, 'uuid'));
            setLoading(false);
        });
    }, [value, inputValue, selectedItems, uri, queryParam]);

    return (
        <MuiAutocomplete
            options={options}
            open={open}
            value={multiple ? selectedItems : (selectedItems[0] || null)}
            size="small"
            className={`${classes.root} ${autoCompleteStyle}`}
            loading={loading}
            multiple={multiple}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            onChange={(data, selectedValues) => {
                const selectItems = [].concat(selectedValues).filter((selection) => !!selection);

                setSelectedItems(selectItems);

                if (multiple) {
                    return onChange(selectItems.map((item) => item[valueParam]));
                }
                return onChange(selectItems.map((item) => item[valueParam]).shift());
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            filterOptions={(x) => x}
            loadingText="Chargement…"
            noOptionsText="Aucun élément"
            renderInput={(params) => (
                <TextField
                    variant="outlined"
                    size="small"
                    {...params}
                    label={placeholder}
                    fullWidth
                    required={required}
                />
            )}
            autoComplete
            getOptionLabel={getOptionLabel}
            getOptionSelected={(option, selectedValue) => option[valueParam] === selectedValue[valueParam]}
            renderOption={(option) => (
                <Typography size="small">
                    {getOptionLabel(option)}
                </Typography>
            )}
        />
    );
};

Autocomplete.defaultProps = {
    placeholder: '',
    multiple: false,
    value: null,
    required: false,
    autoCompleteStyle: {},
};

Autocomplete.propTypes = {
    uri: PropTypes.string.isRequired,
    queryParam: PropTypes.string.isRequired,
    valueParam: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    getOptionLabel: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    multiple: PropTypes.bool,
    value: PropTypes.any,
    required: PropTypes.bool,
    autoCompleteStyle: PropTypes.string,
};

export default Autocomplete;
