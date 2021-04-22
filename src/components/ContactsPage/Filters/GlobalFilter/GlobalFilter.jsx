/* eslint-disable no-shadow,react/require-default-props */
import React, { useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import PropTypes from 'prop-types';
import './GlobalFilter.scss';

// Allow to search in every column of the table
const GlobalFilter = ({ filter, setFilter }) => {
    const [value, setValue] = useState(filter);

    // Wait 1/2 second before updating the table datas with the search term
    const onChangeDelay = useAsyncDebounce((value) => {
        setFilter(value || undefined);
    }, 500);

    return (
        <input
            id="globalFilter"
            type="text"
            placeholder="Recherche"
            value={value || ''}
            onChange={(e) => {
                setValue(e.target.value);
                onChangeDelay(e.target.value);
            }}
        />
    );
};

export default GlobalFilter;

GlobalFilter.propTypes = {
    filter: PropTypes.string,
    setFilter: PropTypes.func.isRequired,
};
