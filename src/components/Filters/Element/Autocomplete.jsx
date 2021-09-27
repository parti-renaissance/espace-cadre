/* eslint-disable react/forbid-prop-types,react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { Autocomplete as MuiAutocomplete } from '@material-ui/lab';
import { TextField, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { throttle, union } from 'lodash';
import { apiClient } from '../../../services/networking/client';

const fetch = throttle((uri, queryParam, query, callback) => {
    apiClient.get(`${uri}?${queryParam}=${query}`).then(callback);
}, 500);

const Autocomplete = ({
    uri, placeholder, queryParam, valueParam, labelParam, multiple, onChange, value,
}) => {
    const [inputValue, setInputValue] = useState(null);
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (value === '' && selectedItems.length) {
            setSelectedItems([]);
        }

        if (!inputValue) {
            return;
        }

        setLoading(true);

        fetch(uri, queryParam, inputValue, (data) => {
            setOptions(union(selectedItems, data));
            setLoading(false);
        });
    }, [value, inputValue]);

    return (
        <MuiAutocomplete
            options={options}
            open={open}
            value={selectedItems}
            size="small"
            loading={loading}
            multiple={multiple}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            onChange={(data, selectedValues) => {
                setSelectedItems(selectedValues);

                if (multiple) {
                    onChange(selectedValues.map((item) => item[valueParam]));
                } else {
                    onChange(selectedValues[valueParam]);
                }
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            filterOptions={(x) => x}
            autoComplete
            loadingText="Chargement…"
            noOptionsText="Aucun élément"
            renderInput={(params) => (
                <TextField {...params} size="small" label={placeholder} fullWidth />
            )}
            getOptionSelected={(option, selectedValue) => option[valueParam] === selectedValue[valueParam]}
            getOptionLabel={(option) => option[labelParam]}
            renderOption={(option) => (
                <Typography size="small">
                    {option[labelParam]}
                </Typography>
            )}
        />
    );
};

Autocomplete.defaultProps = {
    placeholder: '',
    multiple: false,
    value: null,
};

Autocomplete.propTypes = {
    uri: PropTypes.string.isRequired,
    queryParam: PropTypes.string.isRequired,
    valueParam: PropTypes.string.isRequired,
    labelParam: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    multiple: PropTypes.bool,
    value: PropTypes.any,
};

export default Autocomplete;
