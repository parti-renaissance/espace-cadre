/* eslint-disable react/forbid-prop-types,react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { Autocomplete as MuiAutocomplete } from '@material-ui/lab';
import { TextField, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { throttle, unionBy } from 'lodash';
import { apiClient } from '../../../services/networking/client';

const fetch = throttle((uri, queryParam, query, callback) => {
    apiClient.get(`${uri}?${queryParam}=${query}`).then(callback);
}, 500);

const Autocomplete = ({
    uri, placeholder, queryParam, valueParam, labelParam, multiple, onChange, value, required,
}) => {
    const [inputValue, setInputValue] = useState(null);
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(false);

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
    }, [value, inputValue]);

    return (
        <MuiAutocomplete
            options={options}
            open={open}
            value={multiple ? selectedItems : (selectedItems[0] || null)}
            size="small"
            loading={loading}
            multiple={multiple}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            onChange={(data, selectedValues) => {
                let selectItems = selectedValues;

                if (!Array.isArray(selectItems)) {
                    if (selectItems) {
                        selectItems = [selectItems];
                    } else {
                        selectItems = [];
                    }
                }

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
            autoComplete
            loadingText="Chargement…"
            noOptionsText="Aucun élément"
            renderInput={(params) => (
                <TextField {...params} size="small" label={placeholder} fullWidth required={required} />
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
    required: false,
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
    required: PropTypes.bool,
};

export default Autocomplete;
